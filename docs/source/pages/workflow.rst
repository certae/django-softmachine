Le Workflow
===========

De façon pratique, le workflow sert à décrire le circuit de validation, les tâches à répartir entre les différents acteurs d'un processus, les délais, les modes 
de validation, et à fournir à chacun des acteurs les informations nécessaires à l'exécution de sa tâche. [#]_

Dans notre application, un workflow permet aux administrateurs la validation des ajouts et modifications faits par les utilisateurs.

Activer le Workflow 
-------------------

Pour activer le Workflow sur une entité, il faut que la classe dans le modèle ait un attribut _workflow (non configurable à partir de l'application) ;

Vérifier les Workflows en attente
---------------------------------

Deux façons pour vérifier et accepter les workflows en attente de validation :

- La fonction **Filtres** : disponible à partir du :doc:`menu des fonctions <menu_fonctions>` pour les vues qui ont un attribut workflow.

  Vous pouvez accepter ou refuser la modification par le biais des boutons **Accepter** ou **Refuser** de la fonction **Actions** sur le même menu.
 
- L'action **doWFlowResume** : disponible à partir du :doc:`menu des fonctions <menu_fonctions>` pour les vues Wflow Admin Resume de l'application protoLib.

  Pour cette dernière, vous devez avoir les droits pour l'application :doc:`protoLib <protoLib>` et ajouter un nouvel enregistrement dans la table ParametersBase, avec les paramètres suivants :

  * parameterKey : wflow; 
  * parameterTag : I;
  * parameterValue : nom_du_modèle.nom_de_l_entité.

L'action doWflowResume permet de voir tous les workflows sur toutes les entités/vues tandis que la fonction Filtres permet de voir seulement les workflow sur la vue ouverte.

.. [#] `wikipedia <http://fr.wikipedia.org/wiki/Workflow>`_