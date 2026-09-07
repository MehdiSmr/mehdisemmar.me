---
title: Le multitâche et le travail avec des technologies anciennes et de niche
date: 2025-09-03
order: 50
---

![](/assets/images/versaterm.png "medium")

Quand j'ai rejoint Versaterm, je ne connaissais rien au 4GL, la principale
technologie sur laquelle ils bâtissent. Ils n'avaient pas encore fait le virage
vers Claude, ni même GitHub Copilot, alors chaque ligne de code que j'ai écrite
là-bas, je l'ai écrite à la main. Avec le recul, c'était une bonne chose. Je
m'appuyais beaucoup sur l'IA ces derniers temps et mon cerveau ne forçait plus
comme avant, donc tout écrire moi-même m'a donné un vrai sentiment
d'accomplissement.

J'avais deux projets principaux. Le premier était en Genero 4GL. L'équipe avait
besoin d'une interface graphique qui permettrait aux développeurs d'écrire des
règles de configuration de parseur, soit des fichiers CSV qui indiquent au
parseur comment lire les réponses de la base de données NCIC provenant de chaque
État américain. Le hic, c'est que chacun des 50 États formate sa réponse
différemment, donc une réponse de l'État A vers l'État B ne ressemble pas à
celle de l'État A vers l'État C. Ça fait beaucoup de fichiers de configuration à
écrire.

J'ai d'ailleurs commencé le stage en écrivant ces fichiers à la main, et le
processus était pénible. Je me connectais à leur serveur via mPuTTY, je
téléchargeais localement des exemples de réponses de la base de données pour un
État précis, j'écrivais le fichier de règles CSV, je le remettais sur le
serveur, puis je lançais une série de commandes pour tester si le parseur
traitait la réponse correctement. Si ce n'était pas le cas, je recommençais
toute la boucle.

Alors mon gestionnaire, mon mentor et moi avons conçu une interface graphique
pour remplacer tout ça, intégrée directement dans un de leurs produits phares.
Elle présentait les différents États dans une série de tableaux, et pour chaque
État on pouvait modifier ses fichiers de configuration directement. En plus de
ça, elle offrait :

- l'import/export
- un système de sauvegarde
- l'écriture dynamique des fichiers de règles à l'aide d'un fichier temporaire
  en arrière-plan
- le basculement entre une vue tabulaire et une vue CSV brute d'un fichier de
  règles
- une poignée d'autres améliorations UX

J'ai aussi écrit un petit script bash pour déployer l'application sur un des
serveurs de Versaterm.

La partie la plus difficile a été de construire une interface dans une
technologie qui n'a jamais été conçue pour ça. Le Genero 4GL est fait pour les
applications de base de données, il n'y avait pratiquement rien sur Stack
Overflow sur quoi m'appuyer, et la seule aide de l'IA que j'avais était Copilot,
qui était mauvais pour écrire du code en général et encore pire pour écrire du
Genero. Malgré tout, j'ai fini avec une interface graphique correcte qui a été
déployée en production et qui est encore utilisée aujourd'hui. L'équipe
envisageait même de finir par confier l'écriture des règles aux clients plutôt
qu'aux développeurs.

J'ai aussi travaillé sur bien d'autres choses. J'ai corrigé des bogues dans
plusieurs de leurs produits, dont du C# dans VCAD. Mon dernier mois, j'ai eu un
deuxième projet : une application Electron qui permettait à l'équipe de la
réussite client de modifier les fichiers JSON derrière les formulaires que
chaque policier utilise pour rédiger ses rapports dans VCAD. À ce moment-là,
Versaterm avait commencé à adopter GitHub Copilot, ce qui rendait plus facile
d'avancer par essais et erreurs jusqu'à un résultat solide et d'aller vite.

Un des défis plus modestes a été de m'habituer à Vim. Ça faisait partie de la
culture, et configurer VS Code pour modifier du code sur leurs serveurs était
compliqué, alors j'ai plus ou moins été forcé de m'y mettre. Je ne m'en plains
pas, j'utilise encore Neovim aujourd'hui.

Dans l'ensemble, j'ai adoré. Je pense que j'ai eu la meilleure équipe que
j'aurais pu espérer. On jouait au ping-pong à chaque pause dîner et je me suis
fait beaucoup d'amis. Comme j'étais le seul stagiaire de mon équipe, je me suis
rapproché des employés rapidement, et ils m'ont mis en contact avec des gens
d'autres équipes, au point où bien des gens pensaient que j'étais un employé.

Quelques leçons de ce stage me sont restées. D'abord, apprendre de ses erreurs
et ne pas les répéter, c'est primordial. Au début, mon mentor rejetait
constamment mes PR parce que je ne suivais pas leurs pratiques de code, ce qui
était frustrant pour nous deux. Au lieu de me braquer, j'ai ralenti, j'ai lu mon
code ligne par ligne, j'ai suivi ses commentaires et j'ai pris des notes sur les
erreurs que j'avais faites pour ne pas les répéter. Une fois que j'ai fait ça,
on avançait beaucoup plus vite.

Ensuite, être extraverti et parler réellement à ses collègues rend tout plus
facile. Me lier d'amitié avec les gens avec qui je travaillais a transformé mon
trajet de 45 minutes, qui me pesait, en quelque chose que j'attendais avec
hâte. J'étais content de voir mes projets avancer et de jouer au ping-pong le
midi.

Enfin, c'est le trimestre où je suis devenu une machine à multitâche. Je suivais
quatre cours à temps plein tout en faisant un stage à temps plein sur place, et
j'ai dû apprendre quand donner mon énergie à quoi et vraiment optimiser mon
temps pour y arriver. À chaque trimestre suivant, j'ai pris plusieurs choses de
front, et ça m'a aidé à atteindre des endroits où je ne pense pas que je serais
arrivé autrement.
