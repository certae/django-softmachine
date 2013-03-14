python manage.py graph_models protoExt > proto.dot

dot -Tps input.dot -o output.eps
dot -Tpng input.dot > output.png
dot -Tpdf input.dot > output.pdf

Txdot ( canvis ) 

--  ejecutar un comando externo 
from subprocess import call
call(["ls", "-l"])


demo canvis 

http://hfopi.org/files/temp/hello_canviz/index.html


VISITEUR :
Prénom et nom complet du visiteur : prénom NOM

Date de naissance : AAAA-MM-JJ

Adresse du visiteur :            

Numéro de téléphone :        

Numéro de passeport :        

Lien de parenté avec le répondant :      

But de la visite :       

Lieu d’hébergement durant le séjour :   0 hébergé(e) chez le répondant
0 autre, précisez

Durée du séjour :         jours

Date de départ du Canada :  AAAA-MM-JJ


