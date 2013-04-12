# -*- coding: utf-8 -*-

import traceback



def doFindReplace( modeladmin, request, queryset, parameters):
    """ 
    find and replace sobre la tabla actual 
    parameters   campo,  findText, replaceText 
    """

#   El QSet viene con la lista de Ids  
    if queryset.count() < 1:
        return  {'success':False, 'message' : 'Multiple selection required'}

    if len( parameters ) != 3: 
        return  {'success':False, 'message' : 'required: fieldName, findText, replaceText' }

    from findReplace import actionFindReplace
    return actionFindReplace( request,  queryset, parameters )

