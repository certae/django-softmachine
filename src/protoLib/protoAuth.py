# -*- encoding: UTF-8 -*-


from models import UserProfile, TeamHierarchy


def  getUserProfile( pUser, action, actionInfo  ):
    """ 
    Obtiene el profile de usuario, permitira retornar valores como el 
    idioma y otros eltos del entorno, 
    
    Permitira tambien el manejo de logs,  
    
    action :
    - login 
    - saveData 
    - loadData 
    - saveConfig
    
    actionInfo : 
    - Entidad, ids, fecha etc
    
    Se puede crear una sesion propia para manejar el log de autorizaciones 
    permitira cerrar una sesion cambiando el estado tal como se maneja en sm 
     
    """

    # User 
    if pUser is None: return None 

    # Profile 
    uProfile  = UserProfile.objects.get_or_create( user = pUser )[0]
        
    if uProfile.userTeam is None:         
        # verifica el grupo  ( proto por defecto ) 
        uProfile.userTeam = TeamHierarchy.objects.get_or_create(code='proto')[0]
        uProfile.save() 
         
    if action == 'login':
        uOrgTree = uProfile.userTeam.treeHierarchy
    
        # permisos adicionales 
        for item in pUser.usershare_set.all() :
            uOrgTree += ',' + item.userTeam.treeHierarchy
    
        # Organiza los ids 
        uProfile.userTree = ','.join( set( uOrgTree.split(',')))
        uProfile.save()

        usrLanguage = uProfile.language
        if usrLanguage not in ['es', 'en', 'fr' ] : usrLanguage = 'fr'
        usrLanguage = 'protoLib.localisation.' + usrLanguage 
        myModule = __import__( usrLanguage,  globals(), locals(), ['__language' ], -1 )         

        return myModule.__language 


    return uProfile 

# ------------------

"""

Existen diferentes esquemas de seguridad para las tablas : 

    Abierto a toda la jerarquia 
    Especifico por grupo 

Es posible que hubiera tablas q permitieran ver una parte de la jerarquia, 
un detalle del TeamHierachy podria contener las tablas y sus permisos 


has_perm(perm, obj=None)
has_perms(perm_list, obj=None)

Returns True if the user has the named permission. If obj is provided, the permission needs to be checked against a specific object instance.


has_module_perms(app_label):
Returns True if the user has ANY permission to access models in the given app.


class Task(models.Model):
    ...
    class Meta:
        permissions = (
            ("view_task", "Can see available tasks"),
            ("close_task", "Can remove a task by setting its status as closed"),
        )

The only thing this does is create those extra permissions when you run manage.py syncdb. 
Your code is in charge of checking the value of these permissions when an user is trying 
to access the functionality provided by the application (viewing tasks, ...) 

user.has_perm('app.view_task')

"""