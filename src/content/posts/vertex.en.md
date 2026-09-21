---
title: Stopping engineers from breaking APIs
date: 2026-09-21
order: 90
---

![](/assets/images/vertex.png "medium")

When I started at Vertex, two things were firsts for me: it was my first time in
a fully remote company, and my first time in fintech. I walked in with a lot of
preconceptions about remote work. I like going to the office and meeting people
in person, that human link matters to me, and I've always felt more productive
in a space that's actually built for working. So I wasn't sure how this would
go.

It went really well. I joined the architecture team, and everyone on it was
cracked. I got handed a project right at the top of the stack, which was both
intimidating and exactly the kind of thing I wanted: an OpenAPI governance
platform to enforce API compatibility across every engineering team at Vertex.
As the company drifts more and more toward AI, and as its own AI systems
increasingly depend on stable, predictable APIs, you need a single source of
truth for every internal contract and a way to stop anyone from silently
breaking one.

So I designed and built a governance platform spread across four repositories:

- A core engine, written as a Go REST service on PostgreSQL, that embeds linting
  (vacuum) and breaking-change detection (oasdiff). It rejects any spec that has
  errors or that changes a contract without versioning it.
- Terraform infrastructure to stand the whole thing up.
- An internal developer portal (React, TypeScript, Swagger UI) that gives
  engineers a browsable catalog of every Vertex service, spec, and version.
- An audit agent for going back over existing APIs.

![](/assets/images/arch1.png)

I rolled it out through GitHub Actions gates set as required status checks, so
the compatibility check becomes a wall every change has to pass. I also added an
MCP server that exposes the engine's tools to coding agents, so the AI systems
the company is leaning on can diff specs and check backward compatibility
themselves.

The part I'm proudest of is what happened when I pointed the audit agent at real
history. Running from a playbook that calls the MCP server's tools, it audited
five flagship APIs across 1,562 commits and 118 specs, and surfaced 1,244
breaking changes across 253 endpoints on versions that were supposed to be
frozen. That's the kind of number that makes the case for the whole platform on
its own.

This was also the first internship where I was aggressively using AI agents, and
I felt genuinely, almost unreasonably productive. I had an MVP within the first
few weeks. I also ended up in a bunch of meetings where the architects were
working out how to integrate AI into their own workflows. They landed on an
approach they called RPI (research, plan, implement) and built out the
company's access to Claude Code around it, which I got to help shape. Being in
the room for those conversations, as an intern, was one of the highlights.

Halfway through, I got flown out to Vertex's HQ in Philadelphia for a couple of
days. I met a ton of people, architects from my team, interns from other
sectors, folks from HR, and got to put faces to the names I'd only seen on a
screen. The city itself is beautiful, and yes, I had the famous Philly
cheesesteak. Overall a 10/10.

![](/assets/images/philly1.jpeg)

![](/assets/images/philly2.jpeg)

![](/assets/images/philly3.jpeg)

![](/assets/images/philly4.jpeg)

While I was there, I also took part in an internal hackathon against about 30
engineers. My team built SnapTax, a mobile app that scans a product's barcode
and returns the full price including taxes, plus the nearby location where it's
cheapest. We used the company's API for the tax breakdown and added some nice
touches, like a bot that explains and breaks down the taxes for the customer. We
won, and I walked away with a $50 Amazon card, which I was way too happy about.

![](/assets/images/launchpadvx2.jpeg)

![](/assets/images/launchpadvx3.jpeg)

When I got back, it was time to finalize the project and pitch it in front of
stakeholders from different teams, plus all the other interns, so a big room of
people. It went really well. The last few weeks were mostly spent trying to
convince other teams to adopt the platform into their pipelines, which meant a
lot of meetings and a lot of learning how to actually communicate the value of
something to people who didn't build it. That turned out to be as valuable as
any of the engineering.

I loved this internship for how much surface area it covered. I got exposure to
a huge range of technologies, real design and architecture work, and the
experience of building a product end to end, from dev all the way to deploy,
touching UI, infrastructure, and AI agents along the way. And meeting with all
those teams to get the thing integrated genuinely sharpened my communication
skills.

On remote work, it changed my mind more than I expected. Even fully remote, I
made friends and really valued the experience, in no small part thanks to a
mentor who was incredibly supportive and always trying to put me in the
spotlight. And the perks are real, no commute to waste time on, a lot of
freedom, and the ability to work wherever I want. In my case that meant working
my way through what felt like every coffee shop in the Ottawa region, to the
point where I'm now a little addicted to good coffee…
