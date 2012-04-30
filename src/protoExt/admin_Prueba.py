import django.contrib.admin          
 
class PruebaAdmin(django.contrib.admin.ModelAdmin):

    protoExt = {}
    protoExt[ 'hideRowNumbers' ] = True 
    protoExt[ 'protoMenuIx' ] = 0 
    protoExt[ 'description' ] = 'Esta es la description del concpeto concepto'
    protoExt[ 'readOnlyFields' ] = ( 'id', )           


#TODO:  Definir Validations por campo 
#    validations: [{
#        type: 'length',
#        field: 'name',
#        min: 1
#    }]
