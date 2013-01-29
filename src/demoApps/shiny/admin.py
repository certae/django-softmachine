# -*- coding: utf-8 -*-
from models import *  
from django.contrib  import admin           


admin.site.register( Client )
admin.site.register( Produit )
admin.site.register( EntreeStock )

admin.site.register( Facture)
admin.site.register( Famille )
admin.site.register( OrdreProduction )

admin.site.register(Commande )
admin.site.register( LigneCommande )
