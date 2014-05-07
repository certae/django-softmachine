La grille principale
====================

La grille principale, au centre de l'interface, sert à afficher le contenu des objets sélectionnés dans le menu principal.

	.. image:: ./images/grille_p.png
	
	*Figure 4 : grille principale de l'application.*


Les onglets
-----------

	.. image:: ./images/onglets.png
	
	*Figure 5 : exemple d'onglets.*
	
Les onglets correspondent à la liste des objets ouverts à partir du menu principal. Chaque fois qu'un objet est ouvert, un nouvel onglet apparaîtra. 
Vous pouvez vous déplacer d'un contenu à l'autre en cliquant sur son onglet. La grille principale affichera le contenu de l'onglet sélectionné. 

Plusieurs onglets peuvent être ouverts en même temps, mais il est déconseillé d'ouvrir plus de six à la fois, car cela pourrait avoir un effet sur 
la mémoire et ralentir l'application.

Le menu des fonctions
---------------------

	.. image:: ./images/menu_fonctions.png
	
	*Figure 6 : menu des fonctions*
	
Le menu des fonctions regroupe les fonctions disponibles pour la grille principale. 
Ces fonctions sont explorées :doc:`un peu plus tard <menu_fonctions>` dans cette documentation.


Le menu d'édition
-----------------

	.. image:: ./images/menu_edition.png
	
	*Figure 7 : menu d'édition*
	
Le menu d’édition permet l’ajout, la modification, la suppression ou la consultation des enregistrements à partir de la grille principale ou la grille de navigation.

|img1| Ajouter : permet d’ouvrir un formulaire pour ajouter un nouvel enregistrement dans l’objet ouvert. Remplir les champs requis dans le formulaire et cliquer sur le bouton **Enregistrer**. Le nouvel enregistrement sera ajouté en dernière position sur la grille.

|img2| Editer : sélectionner un enregistrement pour faire apparaitre ce bouton. Cliquez sur ce dernier pour ouvrir le formulaire de modification. Modifier les champs voulus et cliquer sur le bouton **Enregistrer**. 

|img3| Consulter : sélectionner un enregistrement pour faire apparaitre ce bouton. Cliquez sur ce dernier pour ouvrir le formulaire de consultation.

|img4| Copier : sélectionner un enregistrement et cliquer sur ce bouton pour dupliquer celui-ci. La ligne copiée apparaitra dans la première ligne de la grille principale.

|img5| Supprimer : sélectionner un enregistrement pour faire apparaitre ce bouton. Cliquez sur ce dernier pour supprimer celui-ci, une confirmation est requise. Une fois l’objet supprimé, il n’est plus possible de le récupérer.

.. note::
 La suppression d’un objet entraine la suppression de ses détails. Si un projet est supprimé, la suppression est propagée vers les modèles, les entités, les attributs, les associations et les vues pour ce projet. Idem pour les modèles, les entités, etc.

.. |img1| image:: ./images/ajouter.png
.. |img2| image:: ./images/editline.png
.. |img3| image:: ./images/afficher.png
.. |img4| image:: ./images/copyline.png
.. |img5| image:: ./images/eraseline.png


La grille
----------

	.. image:: ./images/grille_p1.png
	
	*Figure 8 : contenu de la grille*

Le centre de la grille principale sert à afficher le contenu de l'objet de l'onglet actif.

Vous pouvez naviguer entre les pages et personnaliser le nombre de résultats par page à partir de la barre en dessous de la grille.


La barre de navigation
-----------------------

	.. image:: ./images/menu_navigation.png
	
	*Figure 9 : menu de navigation*

Si l’objet sélectionné dans la grille principale a des détails (relations avec d’autres objets), ces détails s’affichent automatiquement sur cette barre.

- Pour afficher un détail, cliquez sur son nom dans la barre de navigation (exemple : Entités dans la *Figure 9*).
- Pour cacher :doc:`la grille de navigation <grille_navigation>`, cliquez sur l’icône Navigation de la barre de navigation.

