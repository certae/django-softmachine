#python src/manage.py sqlflush > data/dbflush.sql

#python src/manage.py loaddata data/contenttypes.json
#python src/manage.py loaddata data/auth.json

#python src/manage.py loaddata data/protoLib-teamhierarchy.json
#python src/manage.py loaddata data/protoLib-userprofile.json

#python src/manage.py loaddata data/protoLib.json

python src/manage.py loaddata data/prototype.json

pause
