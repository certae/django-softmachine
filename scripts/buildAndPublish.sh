#!/bin/bash
#

echo "Compressing JS files"
cd ../src/protobase/static/
./buildSenchaJS.sh

echo ">>>"
echo ""
echo "Generating CHANGELOG"
cd ../../../scripts/
./changelog.sh

echo ">>>"
echo ""
echo "Publishing APP"
cd ../
python setup.py bdist_egg upload
python setup.py sdist upload