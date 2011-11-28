Como Comenzar 

Aptana Stuio 

File - Import - Git Repository 

	URI	 :  https://github.com/certae/ProtoExt
	HOME : 
	

Indicar donde queda la instalation  ExtJS  ( ver 4.07 min  )

settings.py 

STATICFILES_DIRS = (
    PPATH + '/static',
    '/u/data/ExtJs',		#  Linux 
    'D:/data/ExtJs',		#  Windows 
)
	 
Reemplazarlo por el directorio q corresponda segun el s.o. de trabajo 
	 
	 
protoExt.html 

	 href="{{ STATIC_URL }}ext-4.0.2a/resources/css/ext-all.css">
	 	 

	
