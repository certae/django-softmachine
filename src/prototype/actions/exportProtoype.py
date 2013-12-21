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
#   return file_str.getvalue()
  
  
# from prototype.models import Model, Entity, Prototype
from protoLib.utilsBase import slugify, repStr
from protoLib.downloadFile import getFullPath 

from cStringIO import StringIO


def exportPrototypeModel(request, queryset):

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


    def getClassName( cName ):
        return ''.join( slugify( cName , ' ').title().split() )


    strModel = StringIO()        


    for pModel in queryset:

        modelCode = slugify(pModel.code, '_')

        strModel.write("# -*- coding: utf-8 -*-\n\n")
        strModel.write('# This is an auto-generated model module by CeRTAE SoftMachine v13.12dgt\n' )  
        strModel.write("# for model : \"{0}\"\n".format( modelCode ) )  
        strModel.write("# You'll have to do the following manually to clean this up:\n")
        strModel.write("#     * Add specific procedures  (WFlow)\n\n")
        strModel.write("from django.db import models\n")
        strModel.write("from protoLib.models import ProtoModel\n")    
        strModel.write("from protoLib.utilsBase import slugify\n")

        for pEntity in pModel.entity_set.all():

            strModel.write( "\n" ) 
            strModel.write( "class {0}(ProtoModel):\n".format( getClassName( pEntity.code )  )) 
                             
            arrKeys  = []
                                                         
            for pProperty in pEntity.property_set.all():
                
                pCode = slugify(pProperty.code, '_')
                
                if pProperty.isForeign:
                    pType  = getClassName( pProperty.relationship.refEntity.code ) 
                    strAux = "{0} = models.ForeignKey('{1}', blank= {2}, null= {2}, related_name='+')\n"
#                   on_delete={5} : CASCADE, PROTECT, SET_NULL 
                    
                else: 
                    pType  = TypeEquivalence.get( pProperty.baseType , 'CharField')
#                   prpDefault

                    intLength = pProperty.prpLength 
                    intScale  = pProperty.prpScale  

                    if pType == 'CharField':
                        strAux = "{0} = models.{1}(blank= {2}, null= {2}, max_length= {3})\n"
                        if intLength == 0: intLength = 200 
                        
                    elif pType == 'DecimalField':
                        strAux = "{0} = models.{1}(blank= {2}, null= {2}, max_digits={3}, decimal_places= {4})\n"

                        if intLength == 0 or intLength > 24  : intLength = 48 
                        if intScale  <  0 or intScale  > intLength : intScale = 2 

                    elif pType == 'BooleanField':
                        strAux = "{0} = models.{1}()\n"
                        
                    else: 
                        strAux = "{0} = models.{1}(blank = {2}, null = {2})\n"

#               isRequired isNullable: 
                if pProperty.isRequired: strNull = 'False'
                else: strNull = 'True'

                if pProperty.isPrimary: 
                    arrKeys.append( pCode ) 

                strModel.write( repStr(' ',4) + strAux.format( 
                              pCode,
                              pType, 
                              strNull,
                              str( intLength ), 
                              str( intScale ) 
                              ))  
                

            strModel.write("\n")
            strModel.write(repStr(' ',4)+ "def __unicode__(self):\n")

            if arrKeys.__len__() > 0:

                # Unicode 
                strOptions = ''
                for pProperty in pEntity.property_set.all():
                    if not pProperty.isPrimary : continue
                    if strOptions.__len__() > 0:  strOptions += " +  '.' + " 

                    if pProperty.isForeign or not ( pProperty.baseType in  [ 'string', 'text' ] ):
                        strAux = 'str( self.{0})'.format( slugify(pProperty.code, '_'))
                    else :  strAux = 'self.{0}'.format( slugify(pProperty.code, '_'))  
                    strOptions += strAux  

                strModel.write( repStr(' ',8) + "return slugify({0})\n".format( strOptions ))

    
                #meta 
                strModel.write("\n")
                strModel.write(repStr(' ',4)+ "class Meta:\n")
                
                strOptions = ''
                for pCode in arrKeys:
                    strOptions +=  "'{0}',".format( pCode ) 
     
                strModel.write( repStr(' ',8) + "unique_together = ({0})\n".format( strOptions ))

            else: 

                strModel.write( repStr(' ',8) + "return 'NoKey'")
                
            
    strAux = strModel.getvalue()
    strModel.close()

    return strAux  
