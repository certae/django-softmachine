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

    # User 
    if pUser is None: return None 

    # Profile 
    uProfile  = UserProfile.objects.get_or_create( user = pUser )[0]
        
    if uProfile.userGroup is None:         
        # verifica el grupo  ( proto por defecto ) 
        uProfile.userGroup = OrganisationTree.objects.get_or_create(code='proto')[0]
        uProfile.save() 
         
    if action == 'login':
        uOrgTree = uProfile.userGroup.treeHierarchy
    
        # permisos adicionales 
        for item in pUser.usershare_set.all() :
            uOrgTree += ',' + item.userGroup.treeHierarchy
    
        # Organiza los ids 
        uProfile.userTree = ','.join( set( uOrgTree.split(',')))
        uProfile.save()

        usrLanguage = uProfile.language
        if usrLanguage not in ['es', 'en', 'fr' ] : usrLanguage = 'fr'
        usrLanguage = 'protoLib.localisation.' + usrLanguage 
        myModule = __import__( usrLanguage,  globals(), locals(), ['__language' ], -1 )         

        return myModule.__language 


    return uProfile 