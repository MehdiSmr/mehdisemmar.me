---
title: Building a leaf-pile volume estimator, until Meta shipped a better one
date: 2026-01-14
order: 60
---

![](/assets/images/raven-connected.png "medium")

When I started my internship at Raven, I honestly didn't know what to expect. It
was a small but experienced startup, over ten years in the market, and in my
head they were a hardware company: they build connected dashcams, and that's
mostly what I knew about them. But I joined their AI team, and it turned into
one of the best learning experiences I've had.

I walked in knowing almost nothing about AI, ML, or embedded development. I
walked out with research-level experience in ML and AI engineering, plus a bit
of embedded work from tweaking their accident-detection algorithm. From the
first day to the last, I was building and reiterating, reading paper after
paper: VGGT, structure from motion, DINOv3, SAM3, SAM3D, and a lot more. The
whole thing was special partly because there were very few interns around, and I
was the only one on the AI side. My mentor was the lead and only engineer on the
team, a genuinely cracked guy who studied mechanical engineering and did a
master's in fluid mechanics (which I'm convinced is a crackness metric just by
the name). He gave me almost no guidance, which was exhausting and a little
terrifying at first, but the sense of ownership it forced on me became
addictive.

![](/assets/images/ravenphoto1.jpeg)

![](/assets/images/ravenphoto2.jpeg)

## The problem

The project was called LeafDet. The goal sounds simple until you try it: from a
single dashcam frame of a street, detect a pile of leaves on the road and
estimate its physical volume in cubic metres, presumably so a city could route
its leaf-collection crews to the piles that actually need pickup.

Nothing off-the-shelf did this at the time. There's no leaf-pile dataset.
There's no monocular metric volume estimator you can just grab. And whatever I
built had to run on ordinary road imagery the fleet was already collecting, not
some clean lab setup. So I set out to build the entire vertical stack myself:
dataset creation, the model, the training infrastructure, the 3D reconstruction,
the volume math, and a viewer to inspect it all. It came out to roughly 8,000
lines of my own Python across around 29 files, sitting on top of four vendored
foundation models (DINOv3, VGGT, SAM3, and SAM 3D Objects, all unmodified Meta
code).

The pipeline I built, end to end, takes a dashcam image, resizes it once to
518×518, runs my segmentation model to get a binary leaf-pile mask, early-exits
to a volume of zero if the mask covers almost nothing, runs VGGT to get
per-pixel world points and camera geometry, intersects the mask with those world
points to isolate a 3D point cloud of just the pile, fits geometry to it to
estimate volume, and writes out a JSON prediction plus the point cloud and a
fitted mesh. There's a design decision that runs through the whole thing: resize
once at the very front, so the segmentation mask and the VGGT point map are
always the same resolution and stay pixel-aligned. That lets me mask the point
cloud directly with zero resampling error, and I actually assert that invariant
in code so it can never silently break.

## The dataset problem, and getting labels for free

This was my favourite part. Since no leaf-pile dataset existed, I generated one.

I started by pulling frames from raw dashcam footage. Then, to create piles that
weren't there, I used Gemini's image model to paint a leaf pile into a clean
road frame. The prompt itself was part of the engineering: it insists the model
copy the original image exactly as-is and change nothing but the added pile,
which is described as a randomly coloured, very low, flat-against-the-road pile,
more like a carpet than a mound, placed on the curb or the lower half of the
frame. That "change nothing else" constraint is what makes the next trick work.

Because the "before" and "after" frames are pixel-identical except for the pile
I added, I could get ground-truth masks with no human labelling at all. I run
DINOv3 on both frames, take the patch-wise cosine similarity between the two
feature maps, turn that into a distance map, and threshold it. Wherever the
features changed, there are leaves. A round of morphological cleanup sharpens
the result, and a second refinement pass crops to the pile's bounding box and
re-runs the same differencing at much higher patch density before projecting the
sharper mask back into full-frame coordinates. No one ever labels a single
pixel.

I also built in hard negatives and a third class. "No leaf" pairs a clean frame
with itself for a guaranteed-empty mask, which is essential so the model learns
to output nothing on a clean road. "Scattered" overlays loose individual leaves
onto a frame that already has a pile, teaching the model to tell a collectible
pile apart from ordinary leaf litter.

![](/assets/images/leafdet_synthetic_dataset_free_masks.png "wide")

Eventually I closed the loop back onto real data with an active-learning miner.
It does a breadth-first crawl over the fleet's image bucket, splits the work
across four parallel model instances, keeps any frame whose predicted mask
covers enough of the image, and deletes the rest. That's how I moved the model
from purely synthetic training toward real, model-in-the-loop labelling of a
corpus far too large to review by hand.

## The model

LeafDet is a frozen DINOv3 ViT-L/16 backbone with a small trainable head on top.
The image goes through DINOv3 to get 1024-dimensional patch features, then
through a CBAM attention block that learns which of those channels matter for
"leaf texture" and where in the frame to look, then through a lightweight
segmentation head that produces the mask.

The trick to keeping it cheap is that the backbone is frozen and only the
attention and head train. The optimizer is built over just those parameters, so
checkpoints are 12.3 MB instead of 1.2 GB, because I only serialize the two
small state dicts and never duplicate the DINOv3 weights. The loss is a
combination of BCE and Dice, which matters a lot here: a leaf pile is a tiny
fraction of a road frame, and pure BCE just collapses to "predict background
everywhere."

The evolution of the model is really the story of the project. My first version
was a from-scratch CNN classifier that only answered "is there a pile in this
image?" Within about a week I realised classification could never give me
volume, threw it out, and pivoted to per-pixel segmentation on a frozen
foundation backbone. That pivot is what made everything downstream possible.

## Volume estimation, and the part I'm proudest of

For volume I built a from-scratch geometric-primitives library: 23 shape fitters
(polyhedra, prisms, pyramids, quadrics like hemispheres and ellipsoids and
paraboloids), each taking the point cloud and returning a full triangulated mesh
plus a volume and an error estimate. It fits every shape, sorts by RMSE, and
returns the best one, and it reports that error alongside the volume so
downstream users get a confidence signal instead of a bare number. The fitters
are ordered by domain knowledge, hemisphere and ellipsoid and paraboloid first,
because that's genuinely what a raked leaf pile looks like.

But there's a fundamental flaw in that approach, and chasing it led to the most
ambitious thing I built. A single camera only ever sees the front half of a
pile. Fit a primitive to that half-shell and you systematically misjudge the
volume. So I built an eleven-stage Poisson surface reconstruction pipeline to
reconstruct the occluded back of the pile. It fits the ground plane with RANSAC,
finds the contact curve where the pile meets the road, identifies the crest line
(the silhouette horizon beyond which nothing is observed), computes geodesic
distances over the visible surface, then makes a symmetry assumption, that
surface steepness is a function of distance from the crest regardless of
direction, fits a Gaussian profile to the observed surface, and uses it to
predict the gradients of the surface it never saw. From there it assembles a
sparse Laplacian, applies boundary conditions from the observed depth and the
ground contact, and solves a Poisson equation for a complete depth map of the
whole pile, front and back.

That piece is research-grade and fully documented. It's the work I learned the
most from, and, as it turned out, the last big thing I built before the ground
shifted under me.

## The plot twist: SAM3 and SAM3D

About three weeks before the end of my internship, Meta published SAM3 and
SAM3D. I remember reading the papers and feeling my stomach drop, because it was
instantly obvious they were a real leap, and that a lot of what I'd spent months
building could suddenly be done zero-shot, and done better. SAM3 could segment
the leaf pile straight from the text prompt "leaf pile", no trained model, no
synthetic dataset, no feature-differencing trick. SAM3D could take that mask and
generate a full 3D reconstruction, which is exactly the occluded-geometry
problem my Poisson pipeline had been fighting from the other direction.

So I made the call that stung but was obviously the right one: I swapped the
final pipeline over to SAM3 for segmentation and SAM3D for the 3D generation,
and estimated volume from the reconstructed mesh. The version that actually
shipped and got demoed runs on Meta's models, not mine.

Watching a single foundation-model release wipe out months of custom work in an
afternoon was a strange, slightly brutal feeling. But it became one of the most
valuable lessons of the whole internship: in ML right now the ground moves under
you constantly, and knowing when to throw out your own work and adopt the better
tool is its own skill. And everything I'd built to get there is exactly what let
me recognise, immediately, why SAM3 and SAM3D were the right answer, and wire
them in fast.

![](/assets/images/ravenscreenshot2.jpeg)

![](/assets/images/ravenscreenshot1.png)

![](/assets/images/leafdet_final_pipeline_sam3_sam3d.png "wide")

## Infrastructure

None of this would have run without the plumbing. I wrote a ~350-line storage
manager for uploads, downloads, recursive listing, and syncing results, and
then, mid-project, the whole thing migrated from AWS SageMaker to GCP Vertex AI.
I ported the entire class API from S3 to Google Cloud Storage while keeping the
exact same method surface, so the rest of the codebase only had to change its
import lines. Training data streamed straight from cloud storage into memory
rather than touching disk, which meant handling fiddly real-world problems like
per-worker client isolation (the GCS client isn't fork-safe and deadlocks under
multiple workers) and exponential-backoff retries for flaky network-mounted
data. I also built a Viser-based 3D viewer served to my laptop browser so I
could actually inspect results that were computed on a remote GPU box.

## What it taught me

I did also get to touch the embedded side, tweaking Raven's accident-detection
algorithm, which was a nice contrast to all the research.

The work paid off in a concrete way, too: the MVP and its results were
convincing enough to help sign a five-figure contract with a street-cleaning
company.

But the real takeaway is bigger than any one piece of code. I manufactured a
labelled dataset out of nothing. I specialised a 300M-parameter foundation model
with a 12 MB head instead of fine-tuning the whole thing. I migrated an entire
stack between clouds without breaking the training loop. I pushed well past the
obvious volume method once I understood why it was biased. And when a better
tool showed up overnight, I knew enough to recognise it and pivot without ego.
Having a mentor who refused to hand me answers was brutal at first, but it's
exactly what forced all of that out of me, and it's what made me fall in love
with research and ML.
