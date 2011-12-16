import sys 
from django.db import models
from django.contrib.admin.sites import  site
from django.forms.models import model_to_dict

from django.conf import settings

from utilsBase import _PROTOFN_ , verifyStr, verifyList
from protoField import  setFieldDict

class ProtoGridFactory(object):

    def __init__(self, model):
            
        self.model = model          # the model to use as reference
        self.fields = []            # holds the extjs fields
        


        self.storeFields = ''           # holds the Query Fields 

        # Obtiene el nombre de la entidad 
        self.title = self.model._meta.verbose_name.title()

        #DGT Siempre existe, la creacion del site la asigna por defecto 
        self.model_admin = site._registry.get( model )

        self.protoModel = getattr(model, 'protoExt', {})
        self.protoAdmin = getattr(self.model_admin, 'protoExt', {})
        self.protoFields = self.protoAdmin.get( 'protoFields', {}) 
        
        protoExclude = self.protoAdmin.get( 'protoExclude', ())
         
        excludes =  verifyList( getattr(self.model_admin , 'exclude', [])) 
        list_display = verifyList( getattr(self.model_admin , 'list_display', []))[:]

        # Por defecto solo vienen  Chk, _str_
        try: list_display.remove('action_checkbox')
        except ValueError:  pass

        try: list_display.remove('__str__')
        except ValueError:  pass
        

#       WHY: Por alguna Ext no retiene el IdProperty ( idInternal al hacer click en las filas )     
#       idName = model._meta.pk.name   
        
        
        # La lista de campos del admin sirve de base 
        if len( list_display ) > 0 :   
            for fName in list_display:
                if fName in protoExclude: continue
                try: field = self.model._meta.get_field(fName )
                except: continue
                setFieldDict (  self.protoFields , field )
                
        # Se crean los campos con base al modelo 
        else:

            for field in self.model._meta._fields():
                if field.name in protoExclude: continue
                if field.name in excludes: continue
                setFieldDict (  self.protoFields , field )


        # Genera la lista de campos y agrega el nombre al diccionario 
        for key in self.protoFields:        

            fdict = self.protoFields[ key ]
            if (fdict.get( 'name', '') == '') : fdict[ 'name' ] = key  
#           if (fdict.get( 'header', '') == '') : fdict[ 'header' ] = key  

            self.fields.append(fdict)
            self.storeFields +=  ',' + fdict['name'] 
            
        #Recorta la primera ','       
        self.storeFields = self.storeFields[1:]
        
    
    def get_fields(self, colModel):  
        """ return this grid field list
            . can include hidden fields
            . A given colModel can order the fields and override width/hidden properties
        """
        # standard fields
        fields = self.fields
        # use the given colModel to order the fields
        if colModel and colModel.get('fields'):
            fields = []
            for f in colModel['fields']:    
                for cf in self.fields:
                    if cf['name'] == f['name']:
                        config_field = cf
                        if f.get('width'):
                            config_field['width'] = f.get('width')
                        # force hidden=False if field present in given colModel
                        if f.get('hidden') == True:                        
                            config_field['hidden'] = True
                        else:
                            config_field['hidden'] = False
                        fields.append(config_field)
        return fields
                        

    def get_details(self):  

        # TODO: Agregar y probar m2m
        # TODO: Configuar el master, cuando es una tabla heredada, hay q buscar el parent oMeta.get_parent_list()  ( y si hay multi herencia ) 
        
        # Inicializa con los valores definidos,   
        details = self.protoAdmin.get( 'protoDetails', []) 

        # Si no han sido definido genera por defecto  
        if (len( details )  == 0 ):        
            opts = self.model._meta

            for rel in opts.get_all_related_objects(): # + opts.get_all_related_many_to_many_objects():
                oMeta = rel.model._meta         
                details.append({
                    "menuText"      : oMeta.verbose_name.title(), 
                    "conceptDetail" : oMeta.app_label + '.' + oMeta.object_name, 
                    "detailField"   : opts.module_name + '__pk',                    # rel.field.attname,
                    "masterField"   : 'pk',                                         #  oMeta.pk.name ,
                    })
    
            # Lo imprime en el debuger para poder copiarlo a la definicion 
            if settings.DEBUG: 
                print opts.object_name, details 
            
        return details 



# Obtiene el diccionario basado en el Query Set 
def Q2Dict (  storeFields, pRows , protoAdmin ):
    """ 
        return the row list from given queryset  
    """

    rows = []
    storeFields =  tuple(storeFields[:].split(','))


    pUDP = protoAdmin.get( 'protoUdp', {}) 
    if pUDP:
        udpTable = pUDP['udpTable'] 
        prpName = pUDP['propertyName'] 
        prpValue = pUDP['propertyValue'] 
        prpPrefix = pUDP['propertyPrefix']
        lsProperties =  []
        for fName in storeFields:
            if fName.startswith( prpPrefix + '__'): lsProperties.append(fName)
                

#   Esta forma permite agregar las funciones entre ellas el __unicode__
    for item in pRows:
        rowdict = {}
        for fName in storeFields:
            # UDP Se evaluan despues 
            if pUDP and fName.startswith( prpPrefix + '__'): 
                continue  
            
            #Es una funcion 
            if ( _PROTOFN_ in fName ):
                try: 
                    val = eval( 'item.' + fName.replace( _PROTOFN_,'.') + '()'  )
                    val = verifyStr(val , '' )
                except: val = 'fn?'
                
            # Campo Absorbido
            elif ( '__' in fName ):
                try: 
                    val = eval( 'item.' + fName.replace( '__', '.'))
                    val = verifyStr(val , '' )
                except: val = 'fn?'

            # Campo del modelo                 
            else:
                try:
                    val = getattr( item, fName  )
                    if isinstance( val,models.Model): 
                        val = verifyStr(val , '' )
                except: val = 'vr?'
            
            rowdict[ fName ] = val
            
        
        if pUDP:
            try: 
                bAux = eval ( 'item.' + udpTable + '_set.exists()' ) 
            except: bAux = False 
            if bAux: 
                cllUpd = eval ( 'item.' + udpTable + '_set.all()' ) 
                
                for lUpd in cllUpd:
                    prpGridName = prpPrefix + '__' + getattr( lUpd, prpName , '') 
                    if prpGridName in lsProperties:
                        sAux = getattr( lUpd, prpValue, '' ).replace( '\n', '<br>').replace( '\r', '<br>')
                        sAux = sAux.replace( '<br><br>', '<br>')
                        sAux = sAux.replace( '<td><br>', '<td>').replace( '<td><br>', '</td>')
                        sAux = sAux.replace( '<th><br>', '<th>').replace( '<th><br>', '</th>')
                        sAux = sAux.replace( '<tr><br>', '<tr>').replace( '<tr><br>', '</tr>')

                        sAux = sAux.replace( '<br><td>', '<td>').replace( '<br><td>', '</td>')
                        sAux = sAux.replace( '<br><th>', '<th>').replace( '<br><th>', '</th>')
                        sAux = sAux.replace( '<br><tr>', '<tr>').replace( '<br><tr>', '</tr>')
                        rowdict[ prpGridName ] =  sAux 
                

        # Agrega la fila al diccionario
        #Agrega el Id Siempre como idInterno ( no representa una col, idProperty ) 
        rowdict[ 'id'] = item.pk 
        rows.append(rowdict)


    return rows


# Obtiene los campos visibles del modelo base, se usa como valor por defecto para los searchFields 
def getVisibleFields(  storeFields, model ):

    lFields = ''
    for fName in storeFields.split(','):
        try: field = model._meta.get_field(fName )
        except: continue
        
        if field.__class__.__name__ in ( 'CharField', 'TextField', 'IntegerField', ):
            lFields = ',' + fName  

    #Recorta la primera ','       
    return lFields[1:].split(',')

    