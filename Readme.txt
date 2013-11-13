
How to begin 

Aptana Stuio 

File - Import - Git Repository 
	URI	 :  https://github.com/certae/ProtoExt
	HOME : 
	

Python Config > 2.6 


Set ExtJS  ( ver 4.13   )

settings.py 

STATICFILES_DIRS = (
    PPATH + '/static',
    '/u/data/ExtJs/ext-4.13-gpl',		#  Linux 
    'D:/data/ExtJs/ext-4.13-gpl',		#  Windows 
)
	 

Debug Configuration / Run Configuration 

Python Run ( Icon New )

       Name :  ProtoExt
       Project : protoExt
       Main:  manage.py 

       Arguments 
       Prog Arguments :  runserver --noreload 
       

Open chrome or firefox 
http://127.0.0.1:8000/protoExt
