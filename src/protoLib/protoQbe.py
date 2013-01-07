# -*- encoding: utf-8 -*-

from django.db.models import Q
from django.contrib.admin.util import  get_fields_from_path



def addFilter( Qs, sFilter ):
#   Agrega un filtro q viene en modo texto a un Qset 
    if (len (sFilter) == 0 ):
        return Qs 

    protoStmt = ''

    # Tipo array
    if type( sFilter ) == type([]):
        protoStmt = ''
        

    # Tipo dictionario viene conformado @property[_contain],  ..... 
    elif type( sFilter ) == type({}):
        protoStmt = sFilter
    
    # Filtro String 
    else: 
        try: protoStmt = eval( sFilter )
        except: return Qs 

    # en caso de q halla un stmt lo evalua 
    if (len (protoStmt) == 0 ):
        Qs = Qs.filter(**protoStmt )
        
    return Qs 


def construct_search(field_name):
    if field_name.startswith('^'):
        return "%s__istartswith" % field_name[1:]
    
    elif field_name.startswith('='):
        return "%s__iexact" % field_name[1:]
    
    elif field_name.startswith('@'):
        return "%s__search" % field_name[1:]
    
    else:
        return "%s__icontains" % field_name

def getSearcheableFields(  model  ):
# Obtiene los campos visibles del modelo base, se usa como valor por defecto para los searchFields 

    lFields = []
    
    filterableTypes = [ 'CharField', 'TextField', 'IntegerField', 'DecimalField', 'FloatField',  ]
    filterableTypes.extend( [ 'DateField', 'TimeField', 'DateTimeField', 'BooleanField' ])
        
    for field in model._meta._fields():
        if field.__class__.__name__ in filterableTypes:
            lFields.append( field.name )   

    return lFields 


def getTextSearchFields( pSearchFields, model  ) :
#   TODO:  Esto deberia ser un parametro configurable en la pci 
    textSearchFlds = []
    textFilterTypes  = [ 'CharField', 'TextField', 'IntegerField', 'DecimalField', 'FloatField',  ]
    for fName  in pSearchFields:
        try: 
            # Busca el campo en el modelo y joins 
            field = get_fields_from_path( model, fName)[-1]
    
            #field = model._meta.get_field( fName )
            #model = field.rel.to
            #model.famille.field.related.parent_model
        except: continue  
    
        if field.__class__.__name__ in textFilterTypes:
            textSearchFlds.append( fName )   

    return textSearchFlds


def getQbeStmt( fieldName ,  sQBE, sType   ):  

#-- Valida y copia el criterio 
    sQBE = sQBE.strip()
    if sQBE == '' : return
    QResult = Q()

    #  Negacion del criterio
    bNot = False 
    if sQBE.startswith('!')  :
        sQBE = sQBE[1:]
        bNot = True
    
    
    #-- Para hacerlo recursivo lo que dbde controlar incialemente es el or
    if sQBE.find(";") > 0 :
    
        lCondicion = sQBE.split( ";")
        for sCondicion in lCondicion: 
            if len ( sCondicion ) == 0: continue 

            bAndConector = False
            if sCondicion.startswith('!') : 
                bAndConector = True 
                sCondicion = sCondicion[1:]
            
            Qtmp = getQbeStmt(fieldName, sType, sCondicion)
            if bAndConector: 
                QResult = QResult & Qtmp 
            else: 
                QResult = QResult | Qtmp 

        if bNot : QResult = ~ QResult 
        return QResult

    # 
    sType = sType | 'string'

    # String:  \iexact, \icontains, \istartswith, isnull, search, TODO: \iendswith, \iregex 
    if sType in ([ 'string', 'text']) : 
        if sQBE.startswith('^'):
            QResult =  Q( "{1}__istartswith = '{2}'".format( fieldName, sQBE[1:] ) )  
        
        elif sQBE == '=' :
            QResult =  Q( "{1}__isnnull = True'".format( fieldName ) )  
    
        elif sQBE.startswith('='):
            QResult =  Q( "{1}__iexact = '{2}'".format( fieldName, sQBE[1:] ) )  
        
        elif sQBE.startswith('@'):
            QResult =  Q( "{1}__search = '{2}'".format( fieldName, sQBE[1:] ) )  
        
        else:
            QResult =  Q( "{1}__icontains = '{2}'".format( fieldName, sQBE ) )  


    # Numericos : gt, gte, lt, lte,   TODO: in,   range, 
    elif sType in ( [ 'int', 'foreignid', 'decimal' ]): 
        if sQBE.startswith( ">=") :
            QResult =  Q( "{1}__gte = {2}".format( fieldName, sQBE[2:] ) )  
        elif sQBE.startswith( "<=") :
            QResult =  Q( "{1}__lte = {2}".format( fieldName, sQBE[2:] ) )  
            
        elif sQBE.startswith( "<>") | sQBE.startswith( "!=") :
            bNot = ~ bNot
            QResult =  Q( "{1} = {2}".format( fieldName, sQBE[2:] ) )
              
        elif sQBE.startswith( ">") :
            QResult =  Q( "{1}__gt = {2}".format( fieldName, sQBE[1:] ) )
        elif sQBE.startswith( "<") :
            QResult =  Q( "{1}__lt = {2}".format( fieldName, sQBE[1:] ) )
        elif sQBE.startswith( "=") :
            QResult =  Q( "{1} = {2}".format( fieldName, sQBE[1:] ) )
        else: 
            QResult =  Q( "{1} = {2}".format( fieldName, sQBE ) )
    
#    TODO: if sType == 'bool':
#    Fechas: year, month, day,   
#    TODO: if sType in ( [ 'date''datetime', 'time' ]) : 

    
    if bNot : QResult = ~ QResult
    return QResult


#    if InStr(sQBE, "*") | InStr(sQBE, "?") :
#        if sType = IssNormal Or sType = IssMemo Or sType = IssTime :
#            sQBE = MarcaTipoQbe(sQBE, sType)
#            if sQBE = vbNullString : Exit Function
#            sTmp = fieldName & " like " & sQBE
#        Else: Exit Function
#    
#    elif InStr(sQBE, "..")  :
#        sCondicion = MarcaTipoQbe(TomaParametro(sQBE, ":"), sType)
#        if sCondicion = vbNullString : Exit Function
#        sQBE = MarcaTipoQbe(sQBE, sType)
#        if sQBE = vbNullString : Exit Function
#        sTmp = fieldName & " Between " & sCondicion & " And " & sQBE
#        
#       
#    elif InStr(sQBE, "|") :
#        sCondicion = TomaParametro(sQBE, "|")
#        if sCondicion = vbNullString : Exit Function
#        sTmp = sTmp & fieldName & " in ("
#        Do While sCondicion <> vbNullString
#            sCondicion = MarcaTipoQbe(sCondicion, sType)
#            if sCondicion = vbNullString : Exit Function
#            sTmp = sTmp & sCondicion & ","
#            sCondicion = TomaParametro(sQBE, "|")
#        Loop
#        sTmp = Mid$(sTmp, 1, Len(sTmp) - 1) & ")"
#       
#    
#    elif Operadores(sQBE, FOpe, sCondicion, fieldName, sType) :
#        
#        sTmp = sTmp & fieldName & FOpe & sCondicion
#        
#    Else
#        if sQBE = vbNullString : Exit Function
#        
#        sQBE = MarcaTipoQbe(sQBE, sType)
#        if sQBE = vbNullString Or sQBE = "-0" :
#            ErrFlag = True
#            ErrMsgQbe = "Error en tipo de datos [" & fieldName & "] (" & sAux & ")"
#            Exit Function
#        End if
#        sTmp = sTmp & fieldName & " = " & sQBE
#        

