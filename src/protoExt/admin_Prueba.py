import django.contrib.admin          
 
class PruebaAdmin(django.contrib.admin.ModelAdmin):

    protoExt = {}
    protoExt[ 'hideRowNumbers' ] = True 
    protoExt[ 'protoMenuIx' ] = 0 
    protoExt[ 'description' ] = 'Esta es la description del concpeto concepto'
    protoExt[ 'readOnlyFields' ] = ( 'id', 'prChoice', 'prBoolean' )           
