#!/bin/bash

# si le dossier html  n'existe pas rien à modifier

if [ -e "build/html" ]; then

    # renommage des dossiers
	if [ -e "build/html/_images" ]; then
		mv build/html/_images build/html/images
	fi
	
	if [ -e "build/html/_static" ]; then
		mv build/html/_static build/html/static
	fi

	if [ -e "build/html/_templates" ]; then
		mv build/html/_templates build/html/templates
	fi
	
	if [ -e "build/html/_sources" ]; then
		mv build/html/_sources build/html/sources
	fi

	# dossier temporaire
	mkdir html

	# renommage des chemins pour les dossiers dans les fichiers du dossier html
	python remp.py -f "_images","_static","_templates","_sources" -g "images","static","templates","sources" -s build/html -c html

    # copie de nouveaux fichiers vers le répertoire build/html
	cp -rf html build
	rm -r html/
	
	# renommage des chemins pour les dossiers dans les fichiers du dossier pages
	# dossier temporaire
	mkdir pages
	
	python remp.py -f "_images","_static","_templates","_sources" -g "images","static","templates","sources" -s build/html/pages -c pages

    # copie de nouveaux fichiers vers le répertoire build/htm/pages
	cp -rf pages build/html
	rm -r pages/

	# copie du ficher index.html aux répertoire racine et renommage des liens
	
	mkdir html_copy
	cp -f build/html/index.html html_copy/index.html
	
    python remp.py -f "static/","images/","sources/","templates/","pages/","search.html","genindex.html" -g "docs/build/html/static/","docs/build/html/images/","docs/build/html/sources/","docs/build/html/templates/","docs/build/html/pages/","docs/build/html/search.html","docs/build/html/genindex.html" -s html_copy/ -c ../

	rm -r html_copy/
fi