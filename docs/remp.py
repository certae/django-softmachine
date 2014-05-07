#!/usr/bin/env python
#-*-coding: utf-8 -*-

'''Script de remplacement d une chaîne par une autre dans plusieurs fichiers.
Usage : python rempl.py [options] [paramètres]

Options :
-h --help aide.....
-s --source= suivi du nom de repertoire source .......
-c --cible= suivi du nom de repertoire cible
-f suivi de la chaine ou la liste des chaines a remplacer
-g suivi de la nouvelle chaine ou liste

Exemple :
python rempl.py -f "toto" -g "titi" -s data/source -c data/cible
python rempl.py -f "toto1", "toto2" -g "titi1","titi1" -s data/source -c data/cible
'''

import getopt
import sys
import os
import os.path


def usage():
    print __doc__


def initialisation(argv):
    try:
        opts, args = getopt.getopt(argv, "h:s:c:f:g:", ["help", "source=","cible="])
    except getopt.GetoptError:
        usage()                      
        sys.exit(2)
        
    list1, list2 = [],[]
    source,cible = sys.path[0],sys.path[0]
    for opt, arg in opts:            
        if opt in ("-h", "--help"):  
            usage()                  
            sys.exit()               
        elif opt in ("-s", "--source"):
            source = arg
        elif opt in ("-c", "--cible"):
            cible = arg
        elif (opt == "-f"):
            list1 = arg.split(",") 
        elif (opt == "-g"):
            list2 = arg.split(",") 
    
    for elem in list1 :
        if elem == "":
            print "Le texte à remplacer ne peut etre vide...\n"
            usage()
            sys.exit()
            
    if len(list1) != len (list2) :
            print "Les listes originale et nouvelle doivent avoir le même nombre d'éléments ...\n"
            usage()
            sys.exit()
    
    if not os.path.isdir(source):
        source = os.path.join(os.getcwd(),source)
        if not os.path.isdir(source):
            print "Le repertoire source %s n'existe pas...\n"
            usage()
            sys.exit()
       
    if not os.path.isdir(cible):
        cible = os.path.join(os.getcwd(),cible)
        if not os.path.isdir(cible):
            print "Le repertoire cible n'existe pas...\n"
            usage()
            sys.exit()
    source = os.path.abspath(source)
    cible = os.path.abspath(cible)
    
    if source == cible:
        print "source : ",source
        print "cible : ",cible
        print "Le repertoire source et le repertoire cible ne peuvent pas etre identiques..."
        sys.exit()
    return [source,cible,list1,list2]


def remplace(source, cible, list1, list2):
    filelist = os.listdir(source)
    compteur = 0
    for myfile in filelist:
        soufile = os.path.join(source,myfile)

        if os.path.isfile(soufile):
            cifile = os.path.join(cible,myfile)          
            if not myfile[0] == "." :
                opsoufile = open(soufile,'r')
                opcifile = open(cifile,'w')
                while 1:
                    lig = opsoufile.readline()
                    if lig == '':
                        break
                    
                    for i  in range(len(list1)):
                          newlig = lig.replace(list1[i],list2[i])
                          lig = newlig
                    opcifile.write(newlig)
                    
                opsoufile.close()
                opcifile.close()
                compteur += 1
        
    print compteur, " fichiers traités"


def main(argv):
    params = initialisation(argv)
    remplace(params[0],params[1],params[2],params[3])

if __name__ == "__main__":
    main(sys.argv[1:])
