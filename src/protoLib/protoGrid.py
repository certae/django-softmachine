import sys 
import utilsBase, utilsWeb
from django.db import models
from django.contrib.admin.sites import  site

from django.conf import settings

def verifyList( obj ):
#   DGT:  Los objetos del admin son en su mayoria del tipo tuple,
#   Es necesario convertirlos a listas por facilidad de trabajo 
    if obj is None:  obj = []
    if type( obj ) != type([]):  [obj]
    return obj 


def verifyStr( vrBase , vrDefault ):
    sAux = vrBase or vrDefault
    return  u'%s' % sAux 


class ProtoGridFactory(object):

    def __init__(self, model):
            
        self.model = model          # the model to use as reference
        self.fields = []            # holds the extjs fields
        self.base_fields = []       # holds the base model fields

        # Obtiene el nombre de la entidad 
        self.nomConcept = self.model._meta.object_name 
        self.title = self.model._meta.verbose_name.title()
        
        self.model_fields = self.model._meta._fields()

        #DGT Siempre existe, la creacion del site la asigna por defecto 
        self.model_admin = site._registry.get( model )

        self.protoModel = getattr(model, 'protoExt', {})
        self.protoAdmin = getattr(self.model_admin, 'protoExt', {})

        excludes =  verifyList( getattr(self.model_admin , 'exclude', [])) 
        list_display = verifyList( getattr(self.model_admin , 'list_display', []))
        
#       REORDER  (include )  cols if defined  
        if len( list_display ) > 2 :   # Por defecto solo vienen  Chk, _str_
            
            for field in list_display:
                added = False
                for f in self.model_fields:
                    if f.name == field:
                        added = True
                        self.base_fields.append(f)
#                if not added:
#                    self.base_fields.append(VirtualField(field))
        else:
            self.base_fields = self.model_fields

        
        for field in self.base_fields:
            if field.name in excludes: continue

            #----------------            
            #field.default, field.editable, field.error_message, field.help_text, fiedl.verbose_name_plural
            #field.blank, field.null, field.choises 

            protoField = getattr(field , 'protoExt', {})
            
            # Field Attrs   ------------------------------------------------------------------
            fdict = { 
                     'name':field.name, 
                     'header': verifyStr( field.verbose_name,  field.name ) 
                     }

#           Col visualisation 
            self.getUdp( fdict, protoField, 'hidden', 'Boolean', False)

#           Columns in Query Combo 
            self.getUdp( fdict, protoField, 'allow_filter', 'Boolean', True )
            
#           The column is sortable  
            self.getUdp( fdict, protoField, 'sortable', 'Boolean', True )

#           Permite la sintaxis objeto del QRM  [foreing]__[campo] 
            self.getUdp( fdict, protoField, 'query_code', 'String', '' )

            self.getUdp( fdict, protoField, 'width', 'Numeric', 0 )
            self.getUdp( fdict, protoField, 'align', 'String', '' )
            self.getUdp( fdict, protoField, 'tooltip', 'String', '' )
            self.getUdp( fdict, protoField, 'flex', 'Numeric', 0 )

            if field.name == 'id':
                fdict['hidden']= True
                
            if  field.__class__.__name__ == 'DateTimeField':
                fdict['type'] = 'datetime'
                fdict['xtype'] = 'datecolumn' 
                fdict['dateFormat'] = 'Y-m-d H:i:s'
                fdict['format'] = 'Y-m-d H:i:s'

                #fdict['editor'] = "new Ext.ux.form.DateTime({hiddenFormat:'Y-m-d H:i', dateFormat:'Y-m-D', timeFormat:'H:i'})"
            if  field.__class__.__name__ == 'DateField':
                fdict['type'] = 'date'
                fdict['xtype'] = 'datecolumn' 
                fdict['dateFormat'] = 'Y-m-d'
                fdict['format'] = 'Y-m-d'
                #fdict['renderer'] = 'Ext.util.' 
                #fdict['editor'] = "new Ext.form.DateField({format:'Y-m-d'})"
                
            elif field.__class__.__name__ == 'IntegerField':
                fdict['xtype'] = 'numbercolumn'
                #fdict['editor'] = 'new Ext.form.NumberField()'
                
            elif field.__class__.__name__ == 'BooleanField':
                fdict['xtype'] = 'booleancolumn'
                #fdict['editor'] = 'new Ext.form.Checkbox()'
                
            elif field.__class__.__name__ == 'DecimalField':
                fdict['xtype'] = 'numbercolumn '
                fdict['renderer'] = 'function(v) {return (v.toFixed && v.toFixed(2) || 0);}'
                #fdict['editor'] = 'new Ext.form.NumberField()'
                
            elif  field.__class__.__name__ == 'ForeignKey':
                # TODO: Zoom,  Convertir ID en __unicode__ 
                # TODO: Agregar columna __unicode__ de la tabla padre, con el header definido 
                #y ocultar la columna de la llave 
                fdict['xtype'] = 'numbercolumn '
#                self.fields.append(fdict)

                pass
                
#            elif field.choices:
#                #print 'FIELD CHOICES', field.choices
#                a = {}
#                for c in field.choices:
#                    a[c[0]] = c[1]
#                fdict['renderer'] = 'function(v) {a = %s; return a[v] || "";}' % utils.JSONserialise(a)
                
#            if getattr(self.Meta, 'fields_conf', {}).has_key(field.name):
#                fdict.update(self.Meta.fields_conf[field.name])
                
            self.fields.append(fdict)
         
           
        #TODO: Agregar el PK Siempre ( Verificar si esta u agregarlo ) 

    
    def get_field(self, name):  
        for f in self.fields:
            if f.get('name') == name:
                return f
        return None
    
    
    def get_base_field(self, name):  
        for f in self.base_fields:
            if f.name == name:
                return f
        return None
    
    
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


    def getUdp( self, fdict, protoField, udpCode , udpType, udpDefault ):
        
        udpReturn = udpDefault
         
        try:
            udpReturn = protoField.get( udpCode , udpDefault )
            
            if ( udpType == 'Boolean' ):
                if (udpReturn[0].lower() in ( 't','y','o', '1')): 
                    udpReturn = True
                else: udpReturn = False 

            if ( udpType == 'Numeric' ):
                try:
                    udpReturn = int( udpReturn  )
                except: udpReturn = udpDefault

            if (udpReturn != udpDefault ): 
                fdict[udpCode] = udpReturn   
             
        except: 
            pass
        
        return 


    def get_rows(self, fields, queryset, start, limit):
        """ 
            return the row list from given queryset 
            order the data based on given field list
            paging from start,limit
        """
        rows = []
        if queryset:
            if limit > 0:
                queryset = queryset[int(start):int(start) + int(limit)]
            fields_items = []
            for item in queryset:
                field_items = []
                rowdict = {}
                for field in fields:
                    val = getattr(item, field['name'], '')
                    if val:
                        if field.get('type', '') == 'date':
                            val = val.strftime(utilsBase.DateFormatConverter(to_python = field['format'] ) )
                        elif field.get('type', '') == 'datetime':
                            val = val.strftime(utilsBase.DateFormatConverter(to_python = field['format'] ) )
                        else:
                            val = utilsWeb.JsonCleanstr(val)
                    else:
                        if field.get('type', '') == 'float':
                            val = 0.0
                        elif field.get('type', '') == 'int':
                            val = 0
                        else:
                            val = ''
                    #astr = utils.JSONserialise_dict_item(field['name'], val)
                    rowdict[field['name']] = val
                    #field_items.append(astr)
                #fields_items.append('{%s}' % ','.join(field_items))
                rows.append(rowdict)
            #json += ','.join(fields_items)
            #json += ']\n'

        return rows
         
#    class Meta:
#        exclude = []
#        viewPosition = []
#        fields_conf = {}
