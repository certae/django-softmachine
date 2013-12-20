# -*- coding: utf-8 -*-

# Efficient String Concatenation in Python ( http://www.skymind.com/~ocrow/python_string/ )

# def method1():    ( Little string ) 
#   out_str = ''
#   for num in xrange(loop_count):
#     out_str += `num`
#   return out_str
  
# def method5():  ( BigString )
#   from cStringIO import StringIO
#   file_str = StringIO()
#   for num in xrange(loop_count):
#     file_str.write(`num`)
# 
#   return file_str.getvalue()
  
  
# from prototype.models import Model, Entity, Prototype
from protoLib.utilsBase import slugify, repStr
from cStringIO import StringIO


PROTO_PREFIX = "prototype.ProtoTable."


def exportPrototypeModel(queryset):

    TypeEquivalence = { 
            'bool'      :   'BooleanField',
            'string'    :   'CharField', 
            'date'      :   'DateField', 
            'datetime'  :   'DateTimeField', 
            'decimal'   :   'DecimalField',
            'float'     :   'FloatField',
            'int'       :   'IntegerField',
            'text'      :   'TextField',
            'time'      :   'TimeField',
            'jsonfield' :   'JSONField'       ,
        }


    for pModel in queryset:

        strModel = StringIO()        
        modelCode = slugify(pModel.code, '_')

        strModel.write('# This is an auto-generated model module by CeRTAE SoftMachine v13.dgt12001' )  
        strModel.write("# for model : \"{0}\" >".format( modelCode ) )  
        strModel.write("# You'll have to do the following manually to clean this up:")
        strModel.write("#     * Rearrange models' order")
        strModel.write("#     * Add specific procedures  (WFlow)")
        strModel.write("")
        strModel.write("from protoLib.models import ProtoModel")    
        strModel.write("from django.utils.encoding import force_unicode")


        for pEntity in pModel.entity_set.all():
            enttCode = slugify(pEntity.code , '_').title()

            strModel.write( '' ) 
            strModel.write( '# This is an auto-generated model module by CeRTAE SoftMachine v13.dgt12001' )  
            strModel.write( "# Concept name : \"{0}\" >".format( pEntity.code  ) )  
            strModel.write( "class {0}(ProtoModel):".format( enttCode )) 
                             
            for pProperty in pEntity.property_set.all():
                
                if pProperty.isForeign:
                    pType = slugify( pProperty.relationship.refEntity.code , '_').title() 
                    strAux = "{0} = models.ForeignKey(''{1}'', null= {2}, related_name='+')"
#                   on_delete={5} : CASCADE, PROTECT, SET_NULL 
                    
                else: 
                    pType  = TypeEquivalence.get( pProperty.baseType , 'CharField')
#                   prpDefault

                    if pType == 'CharField':
                        strAux = "{0} = models.{1}(blank= {2}, null= {2}, max_length= {3})"
                        
                    elif pType == 'DecimalField':
                        strAux = "{0} = models.{1}(blank= {2}, null= {2}, max_digits={3}, decimal_places= {4})"
                        
                    else: 
                        strAux = "{0} = models.{1}(blank = {2}, null = {2})"

#               if not pProperty.isRequired: 
                if pProperty.isNullable: strNull = 'TRUE'
                else: strNull = 'FALSE'

                strModel.write( repStr(' ',4) + strAux.format( 
                              slugify(pProperty.code, '_'),
                              pType, 
                              strNull,
                              pProperty.prpLength, 
                              pProperty.prpScale 
                              ))  
                
            #Unicode 
            strModel.write(repStr(' ',4)+ "def __unicode__(self):")
            strAux = ''

            for pProperty in pEntity.property_set.all():
                if strAux.len() > 0: 
                    strAux += " +  '.' + " 
                if pProperty.isPrimary :
                    strAux =  'self.{0} + ' + slugify(pProperty.code, '_')

            strModel.write( repStr(' ',8) + "return slugify({0})".format( strAux ))
            
        print strModel.getvalue()
        strModel.close()
        