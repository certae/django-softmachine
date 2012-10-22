# -*- coding: utf-8 -*-

from django.db import models 
#from protoLib.models import ProtoModel

#import datetime 


class Client(models.Model):
    code = models.CharField(max_length=200)
    nom  = models.CharField(max_length=200)
    typeClient  = models.CharField(max_length=10)
    limiteCredit = models.DecimalField(max_digits=20,decimal_places=2)
    solde = models.DecimalField(max_digits=20,decimal_places=2)
    address = models.CharField(max_length=200)
    ville = models.CharField(max_length=200)
    province = models.CharField(max_length=200)
    codePostal = models.CharField(max_length=200)
    pays = models.CharField(max_length=200)
    telephone = models.CharField(max_length=200)
    fax = models.CharField(max_length=200)
    dateCreation = models.DateField( blank=True, null=True) 
    active = models.BooleanField( )
    
    def __unicode__(self):
        return self.nom


# La familia puede ser recursiva TODO: el manejo de consulta seria un arbol 
class Famille(models.Model):
    code  = models.CharField(max_length=200)
    description = models.TextField(max_length=200, null = True)
    parentfamille = models.ForeignKey('Famille', null = True, blank = True)
    
    def __unicode__(self):
        return self.code + ' ' + self.description


class Produit(models.Model):
    code = models.CharField(max_length=200)
    nom  = models.CharField(max_length=200)
    prix  = models.DecimalField('prix produit',max_digits=20,decimal_places=2)
    coutProduction = models.DecimalField('cout production',max_digits=20,decimal_places=2,null = True, blank = True)
    qteStock = models.DecimalField('quentite stock', max_digits=20,decimal_places=2, null = True, blank = True)
    notes = models.TextField('Notes')
    famille = models.ForeignKey(Famille)
    def __unicode__(self):
        return self.code + ' ' + self.nom 


# El sistema funciona con base en comandas q luego se reunen en una factura 
class Facture(models.Model):
    numero = models.IntegerField()
    dateFacture = models.DateField()
    totalFacture = models.DecimalField(max_digits=20,decimal_places=2)
    client = models.ForeignKey(Client)
    def __unicode__(self):
        return str( self.client) + ' ' + format(self.numero, '05d') 


class Commande(models.Model):
    numero = models.IntegerField()
    dateCommande = models.DateField( blank=True, null=True)
    dateExpedition = models.DateField(blank=True, null=True)
    expedie  = models.BooleanField()
    total  = models.DecimalField(max_digits=20,decimal_places=2)
    client = models.ForeignKey(Client)
    facture = models.ForeignKey(Facture, null=True, blank=True)
    def __unicode__(self):
        return str( self.client) + ' ' + format(self.numero, '05d') 
    

class LigneCommande(models.Model):
    ligne = models.IntegerField()
    prixVente = models.DecimalField(max_digits=20,decimal_places=2)
    qteVendue = models.DecimalField(max_digits=20,decimal_places=2)
    produit = models.ForeignKey(Produit)
    commande = models.ForeignKey(Commande) 
    def __unicode__(self):
        return str( self.commande ) + ' ' + format( self.ligne, '04d') + ' ' + str(self.produit) 
    
    class Meta:
        verbose_name_plural = "Lignes de Commande"
    

# Es una fabrica y las entradas van siempre en una Orden de produccion   
class OrdreProduction(models.Model):
    numero = models.IntegerField()
    dateOrdre = models.DateField(blank=True, null=True)
    remarque = models.TextField(max_length=200)
    def __unicode__(self):
        return format( self.numero, '05d') + ' ' + self.remarque  

    class Meta:
        verbose_name_plural = "Ordres Production"


class EntreeStock(models.Model):
    ligne  = models.IntegerField()
    qteEntree = models.DecimalField(max_digits=20,decimal_places=2)
    produit = models.ForeignKey(Produit)
    ordreProduction = models.ForeignKey(OrdreProduction)
    def __unicode__(self):
        return format( self.ligne, '05d') + ' ' + str(self.produit) 

    class Meta:
        verbose_name_plural = "Entrees stock"
