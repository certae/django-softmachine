Formulaire
==========

À partir de cette option, vous pouvez personnaliser le formulaire qui s'affiche pour le menu d'édition.

	.. image:: ./images/formulaire.png

	*Figure 24 : Option formulaire du menu configuration.*

La fenêtre du formulaire est organisée en trois grandes sections :

1. **Les éléments du formulaire :**

	.. image:: ./images/eleformulaire.png

	*Figure 25 : la fenêtre des éléments du formulaire.*

Les éléments du formulaire (côté haut-gauche de la fenêtre) affichent dans une arborescence les champs actifs sur les formulaires d'édition.

À partir de cette fenêtre, il est possible de personnaliser l'affichage et l'ordre d'apparition de champs sur le formulaire. 
L'ordre d'apparition de champs est défini selon la position de l'objet dans 
l'arborescence. Il est possible aussi de regrouper les champs à l'intérieur des contenants de type « Fieldset » ou « HTMLset ».

les icônes de cette fenêtre sont :

- |img1| : pour enregistrer les modifications du formulaire.
- |img2| : pour rafraîchir l'aperçu du formulaire (côté droit de la fenêtre)
- |img3| : pour supprimer un objet dans l'arborescence.
- |img4| : pour cacher la fenêtre des éléments du formulaire de l'interface.
- |img5| : icône attribuée aux champs.
- |img6| : icône attribuée aux contenants de type fieldset et HTMLset. 

.. |img1| image:: ./images/saveform.png
.. |img2| image:: ./images/refreshform.png
.. |img3| image:: ./images/erasenode.png
.. |img4| image:: ./images/icon_gauche.png
.. |img5| image:: ./images/champ.png
.. |img6| image:: ./images/fieldset.png 


2. **Les outils du formulaire :**

	.. image:: ./images/outilsform.png
	
	*Figure 26 : les outils du formulaire.*

La fenêtre des outils (Tools) du formulaire (côté bas-gauche de la fenêtre, donne accès aux outils permettant de créer et de personnaliser un formulaire. Les outils sont 
organisés dans une arborescence où ils se retrouvent les champs, les contenants et les détails pour une vue. 

L'onglet des propriétés (Properties) donne accès aux propriétés de personnalisation de l'objet sélectionné dans la fenêtre des éléments.

Pour l'onglet Outils :

- **Fields ( Champs ) :**

Le dossier Fields contient la liste complète des champs pour l'objet sélectionné ( un projet, un modèle, une entité, une 
propriété, une relation ou une vue). Dans le cas d'une vue, les champs correspondent aux propriétés ou attributs des entités 
crées par l'utilisateur. On y retrouve aussi des champs crées par l'application du prototypeur comme la date de la dernière 
modification, le nombre de l'équipe ou groupe à qui appartient le projet, etc.

- **Containers ( Contenants ):**

Le dossier Containers est composé de deux types de contenants qui servent à regrouper plusieurs champs dans le formulaire. 

1. Un contenant de type Fieldset crée un contour autour des champs. 
2. Un contenant de type HTMLset c'est un éditeur de texte HTML. Le contenant HTMLset s'utilise pour les champs de type de base « texte » que stockent des chaînes de 65, 535 caractères maximum.

- **Details ( Détails ) :**

Le dossier Détails contient les détails configurés pour les projets, les modèles, les entités, les propriétés et les relations. 
Quand un détail est ajouté au formulaire, ce détail s'affiche dans la forme d'une grille.

.. note:: voir :doc:`annexe <annexe>` pour la signification des champs de l'onglet Propriétés.
	
3. **L'aperçu du formulaire :**

L'espace réservé à l'aperçu du formulaire (côté droit de la fenêtre) permet de prévisualiser les modifications appliquées au formulaire. Les modifications 
sont affichées en temps réel, cela veut dire que si vous changez l'ordre des champs ou que vous regroupez plusieurs champs dans 
un fieldset, vous verrez dans l'espace de l'aperçu le résultat final quasi instantanément.


Personnaliser les formulaires
"""""""""""""""""""""""""""""

- **Personnaliser un contenant de type Fieldset :**

	.. image:: ./images/formperso1.png
	
	*Figure 27 : Personnaliser un contenant de type Fieldset.*

1. Sélectionnez le fieldset à personnaliser de l'arborescence.
2. Cliquez sur l'onglet « Properties » de la fenêtre Outils du formulaire.
3. Éditez les valeurs des propriétés en double-cliquant sur les champs pour les modifier. Enregistrez les changements au formulaire en cliquant sur le bouton |img| 
   Enregistrer formulaire.

- **Ajouter des éléments au formulaire :**

	.. image:: ./images/formperso2.png
	
	*Figure 28 : Ajouter des éléments au formulaire.*

a. Ajouter un champ dans un fieldset :

 1. Cliquez sur l'onglet Tools de la fenêtre Outils du formulaire.
 2. Cliquez sur le plus « + » situé du côté gauche du dossier « Fields » pour visualiser la liste de champs disponibles.
 3. Sélectionnez de la liste le champ à ajouter au fieldset.
 4. Glissez et déposez le champ à l'intérieur du fieldset.
 5. Enregistrez les changements au formulaire en cliquant sur le bouton |img|.

b. Ajouter un contenant fieldset ou HTMLset :

 1. Cliquez sur l'onglet Tools de la fenêtre Outils du formulaire.
 2. Cliquez sur le plus « + » situé du côté gauche du dossier « Containers » pour visualiser la liste de contenants disponibles.
 3. Sélectionnez de la liste le type de contenant à ajouter à l'arborescence.
 4. Glissez et déposez le contenant à l'endroit désiré de l'arborescence. Notez qu'il est possible d'insérer un contenant à l'intérieur d'un autre contenant.
 5. Enregistrez les changements au formulaire en cliquant sur le bouton |img|.

c. Ajouter un détail à l'arborescence :

 Les détails prennent automatiquement la forme d'une grille (comme la grille principale de l'application). La grille n'est pas personnalisable à partir de la fenêtre formulaire.

 1. Cliquez sur l'onglet Tools de la fenêtre Outils du formulaire.
 2. Cliquez sur le plus « + » situé du côté gauche du dossier « Details » pour visualiser la liste de détails disponibles.
 3. Sélectionnez de la liste le détail à ajouter à l'arborescence.
 4. Glissez et déposez le contenant à l'endroit désiré de l'arborescence.
 5. Enregistrez les changements au formulaire en cliquant sur le bouton |img|.

- **Personnaliser les champs du formulaire :**

	.. image:: ./images/formperso3.png
	
	*Figure 29 : personnaliser les champs.*

 1. Sélectionnez le champ à personnaliser.
 2. Cliquez sur l'onglet Properties de la fenêtre Outils du formulaire.
 3. Éditez les valeurs des propriétés et enregistrez les changements au formulaire en cliquant sur le bouton |img|.

.. note:: voir :doc:`annexe <annexe>` pour la signification des champs de l'onglet Propriétés.

- **Changer l'ordre d'apparition des champs du formulaire :**

 1. sélectionnez le champ;
 2. glissez-le jusqu'au l'emplacement désiré dans le même contenant;
 3. vous pouvez déplacer un champ d'un contenant à l'autre de la même façon.

.. |img| image:: ./images/saveform.png

