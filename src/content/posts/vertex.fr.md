---
title: Empêcher les ingénieurs de casser les API
date: 2026-09-21
order: 90
---

![](/assets/images/vertex.png "medium")

Quand j'ai commencé chez Vertex, deux choses étaient des premières pour moi :
c'était ma première fois dans une entreprise entièrement à distance, et ma
première fois dans la fintech. J'arrivais avec beaucoup d'idées préconçues sur
le télétravail. J'aime aller au bureau et rencontrer les gens en personne, ce
lien humain compte pour moi, et je me suis toujours senti plus productif dans un
espace vraiment pensé pour travailler. Je ne savais donc pas trop comment ça
allait se passer.

Ça s'est vraiment bien passé. J'ai rejoint l'équipe d'architecture, et tout le
monde y était redoutablement fort. On m'a confié un projet tout en haut de la
pile, à la fois intimidant et exactement le genre de chose que je voulais : une
plateforme de gouvernance OpenAPI pour imposer la compatibilité des API à toutes
les équipes d'ingénierie de Vertex. À mesure que l'entreprise se tourne vers
l'IA, et que ses propres systèmes d'IA dépendent de plus en plus d'API stables
et prévisibles, il faut une source de vérité unique pour chaque contrat interne,
et un moyen d'empêcher quiconque d'en casser un sans que personne ne s'en rende
compte.

J'ai donc conçu et construit une plateforme de gouvernance répartie sur quatre
dépôts :

- Un moteur central, un service REST en Go sur PostgreSQL, qui intègre le
  linting (vacuum) et la détection de changements incompatibles (oasdiff). Il
  rejette toute spécification qui contient des erreurs ou qui modifie un contrat
  sans le versionner.
- L'infrastructure Terraform pour déployer le tout.
- Un portail développeur interne (React, TypeScript, Swagger UI) qui offre aux
  ingénieurs un catalogue navigable de chaque service, spécification et version
  de Vertex.
- Un agent d'audit pour repasser sur les API existantes.

![](/assets/images/arch1.png)

Je l'ai déployé à travers des vérifications GitHub Actions définies comme
contrôles de statut obligatoires, si bien que la vérification de compatibilité
devient un mur que chaque changement doit franchir. J'ai aussi ajouté un serveur
MCP qui expose les outils du moteur aux agents de code, pour que les systèmes
d'IA sur lesquels l'entreprise s'appuie puissent comparer des spécifications et
vérifier la rétrocompatibilité eux-mêmes.

Ce dont je suis le plus fier, c'est ce qui s'est passé quand j'ai lancé l'agent
d'audit sur l'historique réel. En suivant un playbook qui appelle les outils du
serveur MCP, il a audité cinq API phares sur 1 562 commits et 118
spécifications, et a relevé 1 244 changements incompatibles sur 253 endpoints,
dans des versions censées être figées. C'est le genre de chiffre qui justifie à
lui seul toute la plateforme.

C'était aussi le premier stage où j'utilisais des agents IA de façon intensive,
et je me suis senti sincèrement, presque déraisonnablement productif. J'avais un
MVP dès les premières semaines. Je me suis aussi retrouvé dans plusieurs
réunions où les architectes cherchaient comment intégrer l'IA dans leurs propres
façons de travailler. Ils ont retenu une approche qu'ils ont appelée RPI, pour
research, plan, implement (rechercher, planifier, implémenter), et ont bâti
l'accès de l'entreprise à Claude Code autour d'elle, ce que j'ai pu contribuer à
façonner. Être présent dans ces discussions, en tant que stagiaire, a été l'un
des moments forts.

À mi-parcours, on m'a fait venir au siège de Vertex à Philadelphie pour
quelques jours. J'ai rencontré énormément de monde, des architectes de mon
équipe, des stagiaires d'autres secteurs, des gens des RH, et j'ai enfin pu
mettre des visages sur des noms que je n'avais vus qu'à l'écran. La ville est
magnifique, et oui, j'ai goûté au fameux Philly cheesesteak. Bref, un 10/10.

![](/assets/images/philly1.jpeg)

![](/assets/images/philly2.jpeg)

![](/assets/images/philly3.jpeg)

![](/assets/images/philly4.jpeg)

Pendant que j'y étais, j'ai aussi participé à un hackathon interne face à une
trentaine d'ingénieurs. Mon équipe a construit SnapTax, une application mobile
qui scanne le code-barres d'un produit et renvoie son prix complet taxes
comprises, ainsi que l'endroit à proximité où il est le moins cher. On a utilisé
l'API de l'entreprise pour le détail des taxes et ajouté quelques touches
sympas, comme un bot qui explique et décompose les taxes pour le client. On a
gagné, et je suis reparti avec une carte Amazon de 50 $, qui m'a rendu bien trop
content.

![](/assets/images/launchpadvx2.jpeg)

![](/assets/images/launchpadvx3.jpeg)

À mon retour, il était temps de finaliser le projet et de le présenter devant
des parties prenantes de différentes équipes, plus tous les autres stagiaires,
donc une grande salle pleine. Ça s'est vraiment bien passé. Les dernières
semaines ont surtout servi à convaincre d'autres équipes d'intégrer la
plateforme dans leurs pipelines, ce qui voulait dire beaucoup de réunions, et
beaucoup à apprendre sur la façon de communiquer la valeur de quelque chose à
des gens qui ne l'ont pas construit. Ça s'est révélé aussi précieux que toute la
partie ingénierie.

J'ai adoré ce stage pour l'étendue de ce qu'il couvrait. J'ai touché à une
énorme variété de technologies, à du vrai travail de conception et
d'architecture, et à l'expérience de construire un produit de bout en bout, du
développement jusqu'au déploiement, en passant par l'interface,
l'infrastructure et les agents IA. Et rencontrer toutes ces équipes pour faire
intégrer la plateforme a vraiment aiguisé mes compétences en communication.

Sur le télétravail, il m'a fait changer d'avis plus que je ne l'aurais cru.
Même entièrement à distance, je me suis fait des amis et j'ai vraiment apprécié
l'expérience, en bonne partie grâce à un mentor incroyablement bienveillant qui
cherchait toujours à me mettre en avant. Et les avantages sont réels : pas de
trajet où perdre son temps, beaucoup de liberté, et la possibilité de travailler
où je veux. Dans mon cas, ça voulait dire faire le tour de ce qui m'a semblé
être tous les cafés de la région d'Ottawa, au point d'être maintenant un peu
accro au bon café…
