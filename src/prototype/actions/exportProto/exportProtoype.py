# -*- coding: utf-8 -*-

# Efficient String Concatenation in Python ( http://www.skymind.com/~ocrow/python_string/ )

# def method1():    ( Little string ) 
#     out_str += `num`
  
# def method5():  ( BigString )
#   from cStringIO import StringIO
#   file_str = StringIO()
#   file_str.write(`num`)
#   return file_str.getvalue()
  
  
from prototype.actions.pttActionTools import TypeEquivalence  
from protoLib.utilsBase import slugify, repStr, getClassName
from cStringIO import StringIO


def exportPrototypeModel(request, pModel):

    strModel = StringIO()        
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

        #  Field Str Formating                                                      
        #     0. pCode,
        #     1. pType, 
        #     2. strNull,
        #     3. str( intLength ), 
        #     4. str( intScale ) 
        #     5. slugify(pEntity.code, '_') 

                                                     
        for pProperty in pEntity.property_set.all():
            
            pCode = slugify(pProperty.code, '_')
            
            if pProperty.isForeign:
                pType  = getClassName( pProperty.relationship.refEntity.code ) 
                strAux = "{0} = models.ForeignKey('{1}', blank= {2}, null= {2}, related_name='{5}_{0}')\n"
                # RelatedName Entity_Field? 
#               on_delete={5} : CASCADE, PROTECT, SET_NULL 
                
            else: 
                pType  = TypeEquivalence.get( pProperty.baseType , 'CharField')
#               prpDefault

                intLength = pProperty.prpLength 
                intScale  = pProperty.prpScale  

                if pType == 'CharField':
                    strAux = "{0} = models.{1}(blank= {2}, null= {2}, max_length= {3})\n"
                    if intLength == 0: 
                        intLength = 200 
                    
                elif pType == 'DecimalField':
                    strAux = "{0} = models.{1}(blank= {2}, null= {2}, max_digits={3}, decimal_places= {4})\n"

                    if intLength == 0 or intLength > 24  : 
                        intLength = 48 
                    if intScale  <  0 or intScale  > intLength : 
                        intScale = 2 

                elif pType == 'BooleanField':
                    strAux = "{0} = models.{1}()\n"
                    
                else: 
                    strAux = "{0} = models.{1}(blank = {2}, null = {2})\n"

#               isRequired isNullable: 
            if pProperty.isRequired: 
                strNull = 'False'
            else: 
                strNull = 'True'

            if pProperty.isPrimary: 
                arrKeys.append( pCode ) 

            strModel.write( repStr(' ',4) + strAux.format( 
                          pCode,
                          pType, 
                          strNull,
                          str( intLength ), 
                          str( intScale ), 
                          slugify(pEntity.code, '_') 
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