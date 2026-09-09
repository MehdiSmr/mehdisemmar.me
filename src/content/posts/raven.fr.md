---
title: Construire un estimateur de volume de tas de feuilles, jusqu'à ce que Meta en publie un meilleur
date: 2026-01-14
order: 60
---

![](/assets/images/raven-connected.png "medium")

Quand j'ai commencé mon stage chez Raven, je ne savais honnêtement pas trop à
quoi m'attendre. C'était une petite startup, mais expérimentée, plus de dix ans
sur le marché, et dans ma tête c'était une entreprise de matériel : ils
fabriquent des dashcams connectées, et c'est à peu près tout ce que je savais
d'eux. Mais j'ai rejoint leur équipe d'IA, et c'est devenu une des meilleures
expériences d'apprentissage que j'ai vécues.

Je suis arrivé en ne connaissant presque rien à l'IA, au ML ou au développement
embarqué. Je suis reparti avec une expérience de niveau recherche en ML et en
ingénierie de l'IA, en plus d'un peu de travail embarqué en peaufinant leur
algorithme de détection d'accidents. Du premier au dernier jour, je n'ai fait que
construire et itérer, en lisant article après article : VGGT, structure from
motion, DINOv3, SAM3, SAM3D et bien d'autres. Ce qui rendait le tout spécial,
c'est qu'il y avait très peu de stagiaires, et j'étais le seul du côté de l'IA.
Mon mentor était l'ingénieur principal et le seul de l'équipe, un gars vraiment
brillant qui a étudié en génie mécanique et fait une maîtrise en mécanique des
fluides (ce qui est selon moi un indice de génie rien qu'au nom). Il ne me
donnait presque aucune direction, ce qui était épuisant et un peu terrifiant au
début, mais le sentiment d'appropriation que ça m'a forcé à développer est devenu
addictif.

![](/assets/images/ravenphoto1.jpeg)

![](/assets/images/ravenphoto2.jpeg)

## Le problème

Le projet s'appelait LeafDet. L'objectif a l'air simple jusqu'à ce qu'on essaie :
à partir d'une seule image de dashcam d'une rue, détecter un tas de feuilles sur
la route et estimer son volume physique en mètres cubes, sans doute pour qu'une
ville puisse diriger ses équipes de ramassage vers les tas qui ont vraiment
besoin d'être ramassés.

Rien sur le marché ne faisait ça à l'époque. Il n'existe pas de jeu de données de
tas de feuilles. Il n'existe pas d'estimateur de volume métrique monoculaire
qu'on peut simplement récupérer. Et ce que je construisais devait fonctionner sur
des images de route ordinaires que la flotte collectait déjà, pas sur un montage
propre de laboratoire. Je me suis donc lancé dans la construction de toute la
pile verticale moi-même : la création du jeu de données, le modèle,
l'infrastructure d'entraînement, la reconstruction 3D, les calculs de volume et
un visualiseur pour tout inspecter. Ça a représenté environ 8 000 lignes de mon
propre code Python réparties sur une trentaine de fichiers, par-dessus quatre
modèles de fondation intégrés (DINOv3, VGGT, SAM3 et SAM 3D Objects, tous du code
Meta non modifié).

Le pipeline que j'ai construit, de bout en bout, prend une image de dashcam, la
redimensionne une seule fois à 518×518, exécute mon modèle de segmentation pour
obtenir un masque binaire du tas de feuilles, sort tout de suite avec un volume
de zéro si le masque ne couvre presque rien, exécute VGGT pour obtenir les points
3D par pixel et la géométrie de la caméra, croise le masque avec ces points pour
isoler un nuage de points 3D du tas seulement, y ajuste une géométrie pour
estimer le volume, et écrit une prédiction JSON en plus du nuage de points et
d'un maillage ajusté. Il y a une décision de conception qui traverse tout le
système : redimensionner une seule fois tout au début, pour que le masque de
segmentation et la carte de points de VGGT aient toujours la même résolution et
restent alignés au pixel près. Ça me permet de masquer le nuage de points
directement, sans aucune erreur de rééchantillonnage, et je vérifie d'ailleurs
cet invariant dans le code pour qu'il ne puisse jamais se briser en silence.

## Le problème du jeu de données, et obtenir des étiquettes gratuitement

C'était ma partie préférée. Comme aucun jeu de données de tas de feuilles
n'existait, j'en ai généré un.

J'ai commencé par extraire des images de séquences brutes de dashcam. Ensuite,
pour créer des tas qui n'étaient pas là, j'ai utilisé le modèle d'image de Gemini
pour peindre un tas de feuilles dans une image de route propre. Le prompt
lui-même faisait partie du travail d'ingénierie : il insiste pour que le modèle
copie l'image originale exactement telle quelle et ne change rien d'autre que le
tas ajouté, décrit comme un tas de couleur aléatoire, très bas, plaqué au sol,
plus proche d'un tapis que d'un monticule, placé sur le trottoir ou dans la
moitié inférieure de l'image. Cette contrainte de « ne rien changer d'autre » est
ce qui fait fonctionner le tour suivant.

Comme les images « avant » et « après » sont identiques au pixel près, sauf pour
le tas que j'ai ajouté, je pouvais obtenir des masques de vérité terrain sans
aucune annotation humaine. J'exécute DINOv3 sur les deux images, je calcule la
similarité cosinus par patch entre les deux cartes de caractéristiques, je
transforme ça en carte de distance, et je la seuille. Là où les caractéristiques
ont changé, il y a des feuilles. Un passage de nettoyage morphologique affine le
résultat, et une deuxième passe de raffinement recadre sur la boîte englobante du
tas, réexécute le même différentiel à une densité de patch bien plus élevée, puis
reprojette le masque plus net dans les coordonnées de l'image complète. Personne
n'étiquette jamais un seul pixel.

J'ai aussi intégré des exemples négatifs difficiles et une troisième classe.
« Pas de feuille » associe une image propre à elle-même pour obtenir un masque
garanti vide, ce qui est essentiel pour que le modèle apprenne à ne rien produire
sur une route propre. « Éparpillé » superpose des feuilles isolées sur une image
qui contient déjà un tas, ce qui apprend au modèle à distinguer un tas ramassable
de simples feuilles éparses.

![](/assets/images/leafdet_synthetic_dataset_free_masks.png "wide")

J'ai fini par boucler la boucle en revenant sur des données réelles avec un
extracteur par apprentissage actif. Il fait un parcours en largeur du bucket
d'images de la flotte, répartit le travail sur quatre instances de modèle en
parallèle, garde toute image dont le masque prédit couvre une portion suffisante
de l'image, et supprime le reste. C'est comme ça que j'ai fait passer le modèle
d'un entraînement purement synthétique vers un étiquetage sur données réelles,
avec le modèle dans la boucle, sur un corpus bien trop grand pour être revu à la
main.

## Le modèle

LeafDet est un backbone DINOv3 ViT-L/16 gelé, avec une petite tête entraînable
par-dessus. L'image passe par DINOv3 pour obtenir des caractéristiques par patch
en 1024 dimensions, puis par un bloc d'attention CBAM qui apprend lesquels de ces
canaux comptent pour la « texture de feuille » et où regarder dans l'image, puis
par une tête de segmentation légère qui produit le masque.

L'astuce pour que ça reste peu coûteux, c'est que le backbone est gelé et que
seuls l'attention et la tête s'entraînent. L'optimiseur est construit uniquement
sur ces paramètres, donc les checkpoints font 12,3 Mo au lieu de 1,2 Go, parce
que je ne sérialise que les deux petits state dicts et que je ne duplique jamais
les poids de DINOv3. La fonction de perte est une combinaison de BCE et de Dice,
ce qui compte énormément ici : un tas de feuilles ne représente qu'une infime
fraction d'une image de route, et une BCE pure s'effondre vers « prédire
l'arrière-plan partout ».

L'évolution du modèle, c'est vraiment l'histoire du projet. Ma première version
était un classificateur CNN construit de zéro qui répondait seulement à « y a-t-il
un tas de feuilles dans cette image ? » En une semaine environ, j'ai réalisé que
la classification ne pourrait jamais me donner un volume, je l'ai jetée, et je
suis passé à une segmentation pixel par pixel sur un backbone de fondation gelé.
Ce virage est ce qui a rendu tout le reste possible.

## L'estimation du volume, et la partie dont je suis le plus fier

Pour le volume, j'ai construit de zéro une bibliothèque de primitives
géométriques : 23 ajusteurs de formes (polyèdres, prismes, pyramides, quadriques
comme les hémisphères, les ellipsoïdes et les paraboloïdes), chacun prenant le
nuage de points et renvoyant un maillage triangulé complet, un volume et une
estimation d'erreur. Elle ajuste chaque forme, trie par RMSE, et renvoie la
meilleure, en rapportant cette erreur à côté du volume pour que les utilisateurs
en aval aient un signal de confiance plutôt qu'un simple chiffre. Les ajusteurs
sont ordonnés selon des connaissances du domaine, hémisphère, ellipsoïde et
paraboloïde en premier, parce que c'est vraiment à ça que ressemble un tas de
feuilles ratissé.

Mais il y a une faille fondamentale dans cette approche, et c'est en la
poursuivant que j'ai construit la chose la plus ambitieuse du projet. Une seule
caméra ne voit jamais que la moitié avant d'un tas. Ajuste une primitive sur
cette demi-coquille et tu estimes systématiquement mal le volume. J'ai donc
construit un pipeline de reconstruction de surface de Poisson en onze étapes pour
reconstruire l'arrière occulté du tas. Il ajuste le plan du sol par RANSAC,
trouve la courbe de contact où le tas touche le sol, identifie la ligne de crête
(l'horizon de silhouette au-delà duquel rien n'est observé), calcule des
distances géodésiques sur la surface visible, puis pose une hypothèse de
symétrie, à savoir que la pente de la surface est fonction de la distance à la
crête, peu importe la direction, ajuste un profil gaussien à la surface observée,
et l'utilise pour prédire les gradients de la surface qu'il n'a jamais vue. À
partir de là, il assemble un Laplacien creux, applique des conditions aux limites
tirées de la profondeur observée et du contact avec le sol, et résout une
équation de Poisson pour obtenir une carte de profondeur complète du tas, avant
et arrière.

Cette partie est de niveau recherche et entièrement documentée. C'est ce qui m'a
le plus appris, et, comme les choses ont tourné, la dernière grosse chose que
j'ai construite avant que le sol ne se dérobe sous mes pieds.

## Le revirement : SAM3 et SAM3D

Environ trois semaines avant la fin de mon stage, Meta a publié SAM3 et SAM3D. Je
me souviens d'avoir lu les articles et d'avoir eu l'estomac noué, parce qu'il
était tout de suite évident que c'était un vrai bond en avant, et qu'une bonne
partie de ce que j'avais passé des mois à construire pouvait désormais se faire
en zero-shot, et mieux. SAM3 pouvait segmenter le tas de feuilles directement à
partir du prompt textuel « leaf pile », sans modèle entraîné, sans jeu de données
synthétique, sans l'astuce du différentiel de caractéristiques. SAM3D pouvait
prendre ce masque et générer une reconstruction 3D complète, soit exactement le
problème de géométrie occultée que mon pipeline de Poisson combattait par l'autre
bout.

J'ai donc pris la décision qui faisait mal mais qui était clairement la bonne :
j'ai basculé le pipeline final vers SAM3 pour la segmentation et SAM3D pour la
génération 3D, et j'ai estimé le volume à partir du maillage reconstruit. La
version qui a réellement été livrée et présentée tourne sur les modèles de Meta,
pas sur les miens.

Voir la sortie d'un seul modèle de fondation effacer des mois de travail sur
mesure en un après-midi était un sentiment étrange, un peu brutal. Mais c'est
devenu une des leçons les plus précieuses de tout le stage : en ML en ce moment,
le sol bouge constamment sous tes pieds, et savoir quand abandonner ton propre
travail pour adopter le meilleur outil est une compétence en soi. Et tout ce que
j'avais bâti pour en arriver là est justement ce qui m'a permis de reconnaître,
immédiatement, pourquoi SAM3 et SAM3D étaient la bonne réponse, et de les
intégrer rapidement.

![](/assets/images/ravenscreenshot2.jpeg)

![](/assets/images/ravenscreenshot1.png)

![](/assets/images/leafdet_final_pipeline_sam3_sam3d.png "wide")

## L'infrastructure

Rien de tout ça n'aurait fonctionné sans la plomberie. J'ai écrit un gestionnaire
de stockage d'environ 350 lignes pour les téléversements, les téléchargements, le
listage récursif et la synchronisation des résultats, puis, en cours de projet,
tout a migré d'AWS SageMaker vers GCP Vertex AI. J'ai porté toute l'API de la
classe de S3 vers Google Cloud Storage en gardant exactement la même surface de
méthodes, pour que le reste du code n'ait qu'à changer ses lignes d'import. Les
données d'entraînement se chargeaient en streaming directement du stockage
infonuagique vers la mémoire, sans jamais toucher le disque, ce qui voulait dire
gérer des problèmes concrets et pointilleux comme l'isolation du client par
worker (le client GCS n'est pas fork-safe et se bloque avec plusieurs workers) et
des réessais avec backoff exponentiel pour des données montées en réseau et
instables. J'ai aussi construit un visualiseur 3D basé sur Viser, servi vers le
navigateur de mon portable, pour pouvoir réellement inspecter des résultats
calculés sur une machine GPU distante.

## Ce que ça m'a appris

J'ai aussi eu la chance de toucher au côté embarqué, en peaufinant l'algorithme
de détection d'accidents de Raven, ce qui faisait un beau contraste avec toute la
recherche.

Le travail a aussi porté ses fruits de façon concrète : le MVP et ses résultats
ont été assez convaincants pour aider à signer un contrat avec une entreprise
spécialisée en nettoyage des rues.

Mais la vraie leçon dépasse n'importe quel bout de code. J'ai fabriqué un jeu de
données étiqueté à partir de rien. J'ai spécialisé un modèle de fondation de
300 M de paramètres avec une tête de 12 Mo au lieu de tout réentraîner. J'ai
migré une pile complète d'un nuage à l'autre sans casser la boucle
d'entraînement. J'ai poussé bien au-delà de la méthode de volume évidente une
fois que j'ai compris pourquoi elle était biaisée. Et quand un meilleur outil est
apparu du jour au lendemain, j'en savais assez pour le reconnaître et pivoter
sans ego. Avoir un mentor qui refusait de me donner les réponses était brutal au
début, mais c'est exactement ce qui a fait sortir tout ça de moi, et c'est ce qui
m'a fait tomber en amour avec la recherche et le ML.
