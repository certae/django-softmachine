ProtoLib
********

Cette application définit les concepts additionnels pour compléter la structure de Django pour les besoins génériques de l'application, dont, la sécurité.
Elle permet de gérer les propriétés dynamiques du prototypage et offre les services de soutien à la gestion générique des vues. 


TeamHierarchy
"""""""""""""
La classe TeamHierachy définit la hiérarchie des groupes des utilisateurs.

Les attributs de cette classe sont :

- code : nom du groupe (clé primaire);
- description : une description du groupe (optionnelle);
- parentNode : clé étrangère vers le groupe parent du nouveau groupe (non obligatoire);
- site : site du groupe (optionnel).


UserProfile
"""""""""""
La classe UserProfile définit le profil des utilisateurs.

Les attributs de cette classe sont :

- user : clé étrangère obligatoire vers un utilisateur (user de django)
- userTeam : clé étrangère vers un groupe de TeamHierarchy (optionnelle);
- langage : par défaut la langue de l'application est le français. Les langues disponibles sont :français : fr, anglais : en, espagnol :es.
- userTree : les équipes auxquelles appartient l'utilisateur.
    

UserShare
"""""""""
La classe UserShare permet de partager les droits d'un utilisateur.

Les attributs de cette classe sont :

- user : clé étrangère obligatoire vers un utilisateur;
- userTeam : clé étrangère vers un groupe de TeamHierarchy.


ProtoModel
""""""""""
Cette classe est une classe abstraite, elle implantée par plusieurs autres classes. Ses attributs seront automatiquement mis à jour par l'application.

Les attributs de cette classe sont :

- smOwningUser : utilisateur propriétaire de l'objet;
- smOwningTeam : le groupe auquel appartient l'utilisateur;
- smCreatedBy : utilisateur qui a créé l'objet;
- smModifiedBy : le dernier utilisateur qui a modifié l'objet;
- smRegStatus : 
- smWflowStatus : statut de workflow (I : à verifier, OK : accepté, R : refusé);
- smCreatedOn : date de création de l'objet;
- smModifiedOn : date de la dernière modification de l'objet;
- _protoObj : 


ProtoDefinition
""""""""""""""""
Cette table stocke la définition des PCIs et des menus pour chaque vue :

Les attributs de cette classe sont :

- code : nom de l'objet (obligatoire);
- description : description (optionnel);
- metaDefinition : contient la définition de la Méta;
- active : booléen qui indique si l'objet est actif ou non;
- overWrite : booléen qui était utilisé pour des fins de tests (non utile actuellement). 
    

CustomDefinition
""""""""""""""""
Cette classe hérite de la classe ProtoModel. Elle contient la définition du menu pour chaque groupe.

Les attributs de cette classe sont :

- code : nom de l'objet (obligatoire);
- description : description (optionnel);
- metaDefinition : contient la définition de la Méta;
- active : booléen qui indique si l'objet est actif ou non;
- overWrite : booléen qui était utilisé pour des fins de tests (non utile actuellement). 


UserFiles
"""""""""
La classe UserFile sert à définir les documents des utilisateurs (fonctionnement pas encore testé).

Les attributs de cette classe sont :

- docfile : champs de type Field qui définit le fichier.
    

DiscreteValue
"""""""""""""
La classe DiscretValue permet de définir des valeurs discrètes où la définition d'une table n'est pas vraiment utile.

Les attributs de cette classe sont :

- code : la valeur de l'objet (obligatoire);
- value : la valeur de l'objet (obligatoire);
- description : description (optionnelle) 
- title : clé étrangère vers un autre objet DiscreteValue.
    

ParametersBase
"""""""""""""""
Cette classe hérite de la classe ProtoModel, elle sert à configurer des paramètres de Bases. Pour le moment, elle permet seulement l'activation de workflow pour les entités qui ont cet attribut.

Pour activer le workflow, initialiser les paramètres avec :

- parameterKey : wflow
- parameterTag : I
- parameterValue : nom_du_modèle.nom_de_l_entité


PtFunction
""""""""""
Cette classe sera utilisée pour créer des fonctions à partir de l'application. Ce qui permettra de définir les règles d'affaires à partir de l'application (pas encore fonctionnelle).

Les attributs de cette classe sont :

- code : nom de la fonction obligatoire;
- modelName : nom du modèle obligatoire;
- arguments : liste des paramètres séparés par des virgules;
- functionBody : corps de la fonction;
- tag : le tag de la fonction;
- description :  description de la fonction (optionnelle).


WflowAdminResume
""""""""""""""""
Cette classe hérite de la classe ProtoModel. Elle contient le dernier résumé des nouvelles qui requièrent une action de l'administrateur.

Les attributs de cette classe sont :

- viewEntity : nom de l'entité sur laquelle le workflow est activé;
- activityCount : nombre de workflows en attente sur l'entité (rempli automatiquement).


WflowUserReponse
""""""""""""""""
Cette classe hérite de la classe ProtoModel. Elle contient les résultats des actions de l'administrateur :

Les attributs de cette classe sont :

- viewEntity : nom de l'entité sur laquelle le workflow est activé;
- wfAction : action (accepter ou refuser);
- strKey : la raison de refus;
- adminMsg : message de l'administrateur qui sera envoyé à l'utilisateur.

