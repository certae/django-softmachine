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


----------------------------------

pygraphviz
Make sure that libgraphviz-dev is installed

sudo apt-get install python-dev
sudo apt-get install swig
sudo apt-get install libgraphviz-dev


python-dev and swig are also needed — see above for install information

This project does version control with svn
Move to directory where you want to download code. For example,

cd ~/svnLocal

Checkout the repository
svn checkout http://networkx.lanl.gov/svn/pygraphviz/trunk pygraphviz

Change to main directory
cd pygraphviz/

** I had to update setup.py file so that library_path and include_path were correct. 
Look for lines to uncomment (library_path and include_path are commented out by default):

# Linux, generic UNIX
library_path='/usr/lib/graphviz'
include_path='/usr/include/graphviz'

** You can check if these are the correct paths by looking at the output of the following command:

whereis graphviz
Finally, install:

sudo python setup.py install
