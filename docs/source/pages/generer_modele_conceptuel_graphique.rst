Génération du modèle conceptuel graphique
=========================================

L'application vous permet de visualiser le modèle entré sous forme graphique :

1. À partir de l'onglet **Modèle**, sélectionnez le modèle à générer.
2. Cliquez sur le bouton **Actions** du :doc:`menu des fonctions <menu_fonctions>`.
3. Cliquez sur l'option **doModelGraph** . Un message de confirmation de l'opération sera affiché sur :doc:`la barre de message <barre_etats>`.
4. Le modèle graphique généré est ouvert dans un nouvel onglet de votre fureteur sous forme d'un fichier PDF.

	.. image:: ./images/executermod.png

	*Figure 52 : fonction Exécuter et son sous-menu.*

L'action doModelGraph génère le modèle conceptuel graphique pour un modèle sélectionné.


Formalisme du modèle graphique
""""""""""""""""""""""""""""""

	.. image:: ./images/generermodele.png
	
	*Figure 53 : formalisme du modèle graphique.*

- **Clé primaire** : la police du texte est grasse et sa couleur est noire. Exemples dans la figure : numero_ligne, numero_produit et date_expedition.

- **Clé étrangère** : la police du texte est italique et sa couleur est gris pâle. Le nom de son entité enfant apparait du côté droit du nom de la clé (exemple : li_prt -> produit ou cde_fact -> facture).

- **Clé étrangère dépendante (obligatoire)** : la police du texte est grasse et sa couleur est noire. Le nom de son entité enfant apparait du côté droit du nom de la clé (exemple : li_cde -> commande).

- **Clé étrangère requise (obligatoire)** : la police du texte est grasse et sa couleur est gris pâle. Le nom de son entité enfant apparait du côté droit du nom de la clé (exemple : pdt_fam -> famille).

- **Propriété** : la police du texte est en italique et sa couleur est gris pâle (exemples dans la figure : prix_vente, qte_vendue et prix_production).

- **Propriété requise (obligatoire)** : la police du texte est grasse et sa couleur est gris pâle (exemples : nom_produit et numero_commande).

- **Relation dépendante (obligatoire)** : la flèche est pleine.

- **Entité parent** : la flèche pointe vers l'entité parent.
