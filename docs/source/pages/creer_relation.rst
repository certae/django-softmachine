Créer une relation
==================

La cinquième étape pour construire un prototype consiste à créer les relations entre les entités du modèle. 
Les relations peuvent être créées à partir de l'entité enfant vers l'entité parente ou vice-versa. Les clés étrangères sont générées 
automatiquement par l'application du prototypeur au moment de créer la relation entre deux entités.

De la même manière que dans les étapes précédentes, il y a deux façons de créer les relations entre les entités.

Créer une nouvelle relation à partir du menu principal
""""""""""""""""""""""""""""""""""""""""""""""""""""""

	.. image:: ./images/proto1.png
	
	*Figure 50 : créer une relation.*

1. À partir du menu principal, cliquez deux fois sur Relation du dossier Prototype pour ouvrir l'onglet Relation.

2. Cliquez sur le bouton Ajouter, un formulaire sera affiché sur l'écran.

3. Dans le formulaire, remplissez (voir figure 51) :

 - le nom de la relation (information obligatoire). Comme bonne pratique, composez les noms de vos relations en commençant par le nom de l'entité enfant suivi du nom de l'entité parent. 
   Les deux noms séparés par un trait d'union, exemple séjour-chalet.

 - le nom de l'entité parent (information obligatoire). Cliquez sur le bouton |img| pour sélectionner l'entité de la liste.

 - le nom de l'entité enfant (information obligatoire). Cliquez sur le bouton |img| pour sélectionner l'entité de la liste.

 - cochez la case de la dépendance de clé si la connectivité du côté enfant est dépendante : 1,1. Si votre connectivité est 1,1 ne cochez pas cette caisse.

 - la description de la relation (information optionnelle).
 
4. Cliquez sur le bouton **Enregistrer** de la fenêtre.


Créer une nouvelle relation à partir du formulaire de l'entité
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

	.. image:: ./images/relation1.png
	
	*Figure 51 : créer une relation.*

1. À partir du formulaire de l'entité, cliquez sur le bouton Ajouter de la grille « relations filtrées par " " ».

2. Un nouveau formulaire (comme celui de la figure à gauche) s'affichera dans l'interface.

3. Dans le formulaire, remplissez les informations comme dans la partie précédente. 
 
4. Cliquez sur le bouton Enregistrer de la fenêtre.

.. |img| image:: ./images/lupa.png

Maintenant que votre modèle est complet, nous allons voir comment générer le prototype et alimenter le modèle.