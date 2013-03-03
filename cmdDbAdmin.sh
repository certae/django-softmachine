python src/manage.py syncdb
python src/manage.py sqlclear <appname appname ...>     # genera los dropTable
python src/manage.py sqlflush


# SOUTH
python src/manage.py schemamigration protoLib --initial