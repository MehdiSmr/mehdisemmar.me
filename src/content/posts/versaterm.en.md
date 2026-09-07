---
title: Multitasking and working with old, niche technology
date: 2025-09-03
order: 50
---

![](/assets/images/versaterm.png "medium")

When I joined Versaterm, I didn't know anything about 4GL, the main technology
they build on. They hadn't pivoted to Claude, or even GitHub Copilot yet, so
every line of code I wrote there was by hand. Looking back, that was a good
thing. I'd been leaning on AI a lot lately and my brain wasn't struggling the
way it used to, so writing everything myself gave me a real sense of
accomplishment.

I had two main projects. The first was in Genero 4GL. The team needed a GUI that
let developers write parser config rules, which are CSV files that tell their
parser how to read the NCIC database responses coming from every state in the
US. The catch is that each of the 50 states formats its response differently, so
a response from state A to state B doesn't look like the one from state A to
state C. That's a lot of config files to write.

I actually started the internship by writing those files by hand, and the
process was painful. I'd connect to their server through mPuTTY, pull some
example database responses for a specific county down locally, write the CSV
rule file, move it back to the server, then run a bunch of commands to test
whether the parser handled the response correctly. If it didn't, I'd start the
whole loop over again.

So my manager and mentor and I designed a GUI to replace all of that, built
right into one of their flagship products. It laid out the different counties in
a set of tables, and for each county you could edit its config files directly.
On top of that it had:

- import/export
- a backup system
- dynamic rule-file writing using a temporary file under the hood
- toggling between a tabular and a raw CSV view of a rule file
- a handful of other UX touches

I also wrote a small bash script to deploy the app to one of Versaterm's
servers.

The hardest part was building a UI in a technology that was never meant for UIs.
Genero 4GL is made for database applications, there was basically nothing on
Stack Overflow to lean on, and the only AI help I had was Copilot, which was
rough at writing code in general and even rougher at writing Genero. Still, I
ended up with a decent GUI that shipped to production and is still in use today.
The team was even looking at eventually handing the rule-writing over from
developers to clients.

I worked on plenty of other things too. I did bug fixes across some of their
products, including some C# work in VCAD. In my last month I got a second
project: an Electron app that let the customer success team edit the JSON files
behind the forms every police officer uses to file reports in VCAD. By then
Versaterm had started adopting GitHub Copilot, which made it easier to
trial-and-error my way to a solid result and move quickly.

One of the smaller challenges was getting used to Vim. It was part of the
culture, and setting up VS Code to edit code on their servers was a hassle, so I
was more or less forced into it. I'm not mad about it, I still use Neovim to
this day.

Overall, I loved it. I think I had the best team I could have asked for. We
played ping pong every lunch break and I made a lot of friends. Being the only
intern on my team, I got close with the employees fast, and they connected me
with people on other teams, to the point where a lot of people assumed I was an
employee.

A few things stuck with me from that term. First, learning from your mistakes
and not repeating them is everything. Early on my mentor kept rejecting my PRs
because I wasn't following their code practices, which was frustrating for both
of us. Instead of getting defensive, I slowed down, read my code line by line,
followed his feedback, and kept notes on the mistakes I'd made so I wouldn't
repeat them. Once I did that, we moved a lot faster.

Second, being extroverted and actually talking to your colleagues makes
everything easier. Befriending the people I worked with turned my 45-minute
commute from something I dreaded into something I looked forward to. I was
excited to see my projects move forward and to play ping pong at lunch.

Finally, that's the term I became a multitasking monster. I was taking four
full-time classes while doing a full-time on-site internship, and I had to learn
when to give my energy to what and really optimize my time to pull it off. Every
term after that I took on multiple things at once, and it's helped me get to
places I don't think I would have otherwise.
