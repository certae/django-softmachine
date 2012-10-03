# -*- coding: utf-8 -*-
from models import *  
from django.contrib  import admin           

class ClientAdmin(admin.ModelAdmin):
    protoExt =  { 'protoViews' : {        
        'compte - client': {
            'protoMenuOpt' : 'ShinyProto',  
            'title' : 'Compte - client',  
            'protoMenuIx' : 1
            }, 
        'fiche - client': {
            'protoMenuOpt' : 'ShinyProto',  
            'title' : 'fiche - client', 
            'protoMenuIx' : 4
            }, 
        'vue client': {
            'protoMenuOpt' : 'ShinyComposants',  
            'title' : 'vue client', 
            'protoMenuIx' : 4
            }
        } 
     }

admin.site.register( Client, ClientAdmin )


class ProduitAdmin(admin.ModelAdmin):
    protoExt =  { 'protoViews' : {        
        'Produit': {
            'protoMenuOpt' : 'ShinyComposants',  
            'title' : 'Produit',  
            'protoMenuIx' : 1
            }, 
        'Vue Produit': {
            'protoMenuOpt' : 'ShinyComposants',  
            'title' : 'Vue Produit',  
            'protoMenuIx' : 5
            }, 
        'Controle d''inventaire': {
            'protoMenuOpt' : 'ShinyProto',  
            'title' : 'Controle d''inventaire', 
            'protoMenuIx' : 2
            }
        } 
     }

admin.site.register( Produit, ProduitAdmin )

admin.site.register( EntreeStock )


class FactureAdmin(admin.ModelAdmin):
    protoExt =  { 'protoViews' : {        
        'Entête facture': {
            'protoMenuOpt' : 'ShinyComposants',  
            'title' : 'Entête facture', 
            'protoMenuIx' : 6
            }, 
        'Liste des factures': {
            'protoMenuOpt' : 'ShinyProto',  
            'title' : 'Liste des factures', 
            'protoMenuIx' : 6
            }
        }}


admin.site.register( Facture, FactureAdmin )
admin.site.register( Famille )
admin.site.register( OrdreProduction )


class CommandeAdmin(admin.ModelAdmin):
    protoExt =  { 'protoViews' : {        
        'Expédition': {
            'protoMenuOpt' : 'ShinyProto',  
            'title' : 'Expédition', 
            'protoMenuIx' : 3
            }, 
        'Entête expédition': {
            'protoMenuOpt' : 'ShinyComposants',  
            'title' : 'Entête expédition', 
            'protoMenuIx' : 7
            }, 
        'Entête commande': {
            'protoMenuOpt' : 'ShinyComposants',  
            'title' : 'Entête commande', 
            'protoMenuIx' : 3
            }, 
        'Saisie commande': {
            'protoMenuOpt' : 'ShinyProto',  
            'title' : 'Saisie commande', 
            'protoMenuIx' : 7
            }, 
        'Liste des commandes': {
            'protoMenuOpt' : 'ShinyProto',  
            'title' : 'Liste des commandes', 
            'protoMenuIx' : 5
            }
        }}


admin.site.register(Commande, CommandeAdmin)


class LigneCommandeAdmin(admin.ModelAdmin):
    protoExt =  { 'protoViews' : {        
        'Ligne Commande': {
            'protoMenuOpt' : 'ShinyComposants',  
            'title' : 'Line Commande', 
            'protoMenuIx' : 2
            }
     }}

admin.site.register( LigneCommande, LigneCommandeAdmin )
