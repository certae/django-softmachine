Prototype
*********

Cette application définit les concepts pour créer un prototype.

Project
"""""""
La classe qui représente un projet, elle hérite les propriétés de la classe ProtoModel dans le modèle ProtoLib. Ses attributs sont :

- code : nom du projet obligatoire;
- description : optionnelle.

Les attributs ci-dessous sont optionnels et définit les paramètres pour la base de données du projet :

- dbEngine : type de la base de données;
- dbName : nom de la base de données;
- dbUser : nom d'utilisateur de la BD;
- dbPassword : mot de passe pour la BD;
- dbHost : nom de l’hôte;
- dbPort : numéro de port. 

Model
"""""
La classe qui représente un modèle, elle hérite les propriétés de la classe ProtoModel dans le modèle ProtoLib. Ses attributs sont :

- project : nom du projet auquel appartient le modèle;
- code : nom du modèle (obligatoire);
- category : catégorie du modèle (optionnelle);
- modelPrefix : préfixe à ajouter au nom du modèle (optionnel);
- description : optionnelle.

Entity
""""""
La classe qui représente une entité (concept), elle hérite les propriétés de la classe ProtoModel dans le modèle ProtoLib. Ses attributs sont :

- model : nom du modèle auquel appartient l'entité
- code : nom de l'entité;
- dbName : nom de l'entité dans la BD;
- description : optionnelle.

Property
""""""""
La classe qui représente les propriétés d'une entité, elle hérite les propriétés de la classe ProtoModel dans le modèle ProtoLib. Ses attributs sont :

- entity : nom du modèle à laquelle appartient l'entité;
- code : nom de la propriété;
- baseType : type de base de la propriété. Par défaut c'est string;
- prpLength : pour définir une longueur pour le champ;
- prpScale : nombre de positions après la virgule pour un chiffre;
- vType : type de validation;
- prpDefault : valeur par défaut (peut varier selon les cas);
- prpChoices : liste de choix pour les propriétés dont le baseType est combo;
- isSensitive : booléen qui indique si oui ou non la propriété requiert un niveau de sécurité plus élevé;
- description : description optionnelle;
- notes :
- isPrimary : booléen qui indique si oui ou non la propriété est une clé primaire;
- isLookUpResult : booléen qui indique si oui ou non la propriété est visible dans les résultats de la fonction rechercher;
- isNullable : booléen qui indique que la propriété peut être nulle ou non;
- isRequired : booléen qui indique que la propriété est requise ou non;
- isReadOnly : booléen qui indique que la propriété est en lecture seule (non modifiable à partir de l'application);
- isEssential : booléen qui indique si la propriété doit sortir dans la vue;
- isForeign : booléen qui indique si oui ou non la propriété est une clé étrangère;
- crudType : liste de choix pour type d'édition (editable, screenOnly, storeOnly, etc...);
- dbName : nom de la propriété dans la BD.

Relationship
""""""""""""
Cette classe hérite les propriétés de la classe Property. Elle définit les relations entre les concepts (entités). Ses attributs sont :

- refEntity : nom de l'entité enfant;
- relatedName : nom de la relation ;
- baseMin : cardinalité (baseMin >= refMin);
- baseMax : cardinalité (baseMax <= refMax);
- refMin : référence minimale pour la relation (0 : pour une relation 0 N);
- refMax : référence maximale pour la relation (N : pour une relation 0 N);
- onRefDelete : 
- typeRelation :  

PropertyEquivalence
"""""""""""""""""""
Cette classe indique l'équivalence entre deux propriétés. Elle hérite les propriétés de la classe ProtoModel. Ses attributs sont :

- sourceProperty : la première propriété (obligatoire).
- targetProperty : la deuxième propriété (obligatoire).
- description : description (optionnelle). 

Prototype
"""""""""
Cette classe hérite les propriétés de la classe ProtoModel dans le modèle ProtoLib. Ses attributs sont :

- entity : nom de l'entité ;
- code : nom du prototype ;
- description : description optionnelle ;
- notes : 
- metaDefinition : la Méta.

ProtoTable
""""""""""
Cette classe hérite les propriétés de la classe ProtoModel dans le modèle ProtoLib. Ses attributs sont :

- entity : nom de l'entité ;
- info :
- objects :

Diagram
"""""""
Cette classe définit les diagrammes d'un projet, elle hérite les propriétés de la classe ProtoModel dans le modèle ProtoLib. Ses attributs sont :

- project : clé étrangère du projet représenté par le diagramme;
- code : nom du diagramme (obligatoire);
- description : description (optionnelle);
- notes : notes (optionnelle);
- title : titre du diagramme (optionnelle);
- prefix : 
- graphLevel : entier qui indique le niveau de représentation ( 'all', 'essential', 'required' , 'primary', 'title', etc. )
- grphMode : entier qui indique le mode de représentation ( record, htmlTable, graph );
- graphForm : entier qui indique le formalisme de représentation (ObjetRealational, ER, DataRun);
- showPrpType : si vrai, affiche le type de la propriété;
- showBorder : si vrai, affiche le borders;
- showFKey : affiche les clés étrangères. 
- info : 
- objects :  

DiagramEntity
"""""""""""""
Cette classe définit les diagrammes d'une entité, elle hérite les propriétés de la classe ProtoModel dans le modèle ProtoLib. Ses attributs sont :

- diagram : nom du diagramme auquel appartient le diagramme DigramEntity.
- entity : entité représentée par le diagramme;
- info : 
- objects :