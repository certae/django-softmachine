# -*- coding: utf-8 -*-

import re 

def actionFindReplace( request,  queryset , parameters ):
    """
    find and replace permite expresiones regulares ^$ . etc
    inicialmente se preparo para instrospeccion 
    de una Db, y eliminar los prefijos 

    Para reemplazar culquier texto usar oltext = @all 
    """ 

    fName   = parameters[0]['value']
    oldText = parameters[1]['value'] 
    newText = parameters[2]['value'] or ''
        
    # Obtiene el proyecto y se asegura q sean todas de un mismo proyecto 
    for dEntity in queryset:
        if not hasattr(dEntity , fName ):
            return  {'success':False , 'message': 'fieldName {0} not found'.format(  fName ) }

        fValue = getattr(  dEntity, fName ) 
        if fValue is None:  continue 

        fNewValue =  newText
        if oldText != '@all': 
            fNewValue =  re.sub( oldText, newText ,  fValue )

        setattr( dEntity, fName, fNewValue )
        dEntity.save( force_update=True )

    return  {'success':True , 'message' :  'Ok' }
