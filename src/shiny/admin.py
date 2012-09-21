from models import *  
from django.contrib  import admin           

admin.site.register( Client )
#admin.site.register( Commande )
admin.site.register( EntreeStock )
admin.site.register( Facture )
admin.site.register( Famille )
#admin.site.register( LigneCommande )
admin.site.register( OrdreProduction )
admin.site.register( Produit )


class CommandeAdmin(admin.ModelAdmin):
#   protoExt = {'protoMenuIx': 3, 'protoMenuOpt' : 'ShinyProto'}
    protoExt = {}
    protoExt[ 'protoViews' ] =  {        
        'Commandex': {
            'protoMenuOpt' : 'ShinyProto',  
            'title' : 'Commande proto', 
            'description' : 'Cest le commande proto', 
            'protoMenuIx' : 1
            }
     }


admin.site.register(Commande, CommandeAdmin)

class LigneCommandeAdmin(admin.ModelAdmin):
    protoExt =  { 'protoViews' : {        
        'LigneCommande2': {
            'protoMenuOpt' : 'ShinyComposants',  
            'title' : 'LineCommande Form Commande' 
            }
     }}

admin.site.register( LigneCommande, LigneCommandeAdmin )
