# -*- encoding: UTF-8 -*-


from models import UserProfile, OrganisationTree


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

    # Profile 
    try: 
        uProfile  = UserProfile.objects.get( user = pUser )
    except UserProfile.DoesNotExist:
        
        # verifica el grupo  ( proto por defecto ) 
        pGroup = OrganisationTree.objects.get_or_create(code='proto')[0]
        uProfile = UserProfile( user = pUser, userGroup = pGroup )
        uProfile.save() 
         
    if action == 'login':
        uOrgTree = uProfile.userGroup.treeHierarchy
    
        # permisos adicionales 
        for item in pUser.usershare_set.all() :
            uOrgTree += ',' + item.userGroup.treeHierarchy
    
        # Organiza los ids 
        uProfile.userTree = ','.join( set( uOrgTree.split(',')))
        uProfile.save()

        if uProfile.languaje == 'es': 
            from protoLib.localisation.es import __language  
        elif uProfile.languaje == 'en': 
            from protoLib.localisation.en import __language  
        else :  
            from protoLib.localisation.fr import __language  

        return __language 


    return uProfile 