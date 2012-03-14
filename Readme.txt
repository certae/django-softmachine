ERROR: 

Hay un error al cargar los tabs, el indice del tab corresponde al indice tab
buscar el tab segun el indice de los detalles o crear una estructura de equivalencia. 

Al momento de abreir el tab y luego selecionar no esta pasando por el seteo del titulo, revizar si el setActiveTab esta pasando 
  
=------------------------------------------------------------------------

Como Comenzar

Aptana Stuio 

File - Import - Git Repository 

	URI	 :  https://github.com/certae/ProtoExt
	HOME : 
	

Python Config  2.6 Minimo 	

** Snippets.git

Indicar donde queda la instalation  ExtJS  ( ver 4.07 min  )

settings.py 

STATICFILES_DIRS = (
    PPATH + '/static',
    '/u/data/ExtJs/ext-4.0.7-gpl',		#  Linux 
    'D:/data/ExtJs/ext-4.0.7-gpl',		#  Windows 
)
	 
Reemplazarlo por el directorio q corresponda segun el s.o. de trabajo 


Configurar ejecucion

Run 
Debug Configuratio / Run Configuration 

Python Run ( Icon New )

       Name :  ProtoExt
       Project : protoExt
       Main:  manage.py 

       Arguments 
       Prog Arguments :  runserver --noreload 
       

Abrir explorador 
http://127.0.0.1:8000/protoExt
