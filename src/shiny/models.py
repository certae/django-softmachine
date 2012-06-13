# -*- coding: utf-8 -*-

from django.db import models 
#import datetime 

class Client(models.Model):
    cod_client = models.CharField(max_length=200)
    nom_client = models.CharField(max_length=200)
    type_client = models.CharField(max_length=10)
    limite_credit = models.DecimalField(max_digits=20,decimal_places=2)
    solde = models.DecimalField(max_digits=20,decimal_places=2)
    rue = models.CharField(max_length=200)
    ville = models.CharField(max_length=200)
    province = models.CharField(max_length=200)
    code_postal = models.CharField(max_length=200)
    pays = models.CharField(max_length=200)
    telephone = models.CharField(max_length=200)
    fax = models.CharField(max_length=200)
    dte_creation = models.DateField( blank=True, null=True)
    active = models.BooleanField( )
    def __unicode__(self):
        return self.nom_client


class Facture(models.Model):
    nro_facture = models.IntegerField()
    dte_facture = models.DateField()
    total_facture = models.DecimalField(max_digits=20,decimal_places=2)
    cod_client = models.ForeignKey(Client)
    def __unicode__(self):
        return str( self.cod_client) + ' ' + format(self.nro_facture, '05d') 


class Famille(models.Model):
    cod_famille  = models.CharField(max_length=200)
    description = models.CharField(max_length=200, null = True)
    def __unicode__(self):
        return self.cod_famille


class Produit(models.Model):
    cod_produit = models.CharField(max_length=200)
    nom_produit = models.CharField(max_length=200)
    prix_produit = models.DecimalField('prix produit',max_digits=20,decimal_places=2)
    cout_production = models.DecimalField('cout production',max_digits=20,decimal_places=2,null = True, blank = True)
    qte_stock = models.DecimalField('quentite stock', max_digits=20,decimal_places=2, null = True, blank = True)
    notes = models.TextField('Notes')
    cod_famille = models.ForeignKey(Famille)
    def __unicode__(self):
        return self.nom_produit


class Commande(models.Model):
    nro_commande = models.IntegerField()
    dte_commande = models.DateField( blank=True, null=True)
    dte_expedition = models.DateField(blank=True, null=True)
    expedie  = models.BooleanField()
    total_commande = models.DecimalField(max_digits=20,decimal_places=2)
    cod_client = models.ForeignKey(Client)
    id_facture = models.ForeignKey(Facture, null=True, blank=True)
    def __unicode__(self):
        return str( self.cod_client) + ' ' + format(self.nro_commande, '05d') 
    

class Ligne_Commande(models.Model):
    nro_ligne = models.IntegerField()
    prix_vente = models.DecimalField(max_digits=20,decimal_places=2)
    qte_vendue = models.DecimalField(max_digits=20,decimal_places=2)
    cod_produit = models.ForeignKey(Produit)
    nro_commande = models.ForeignKey(Commande) 
    def __unicode__(self):
        return format( self.nro_ligne, '04d') + ' ' + str(self.cod_produit) 
    
    class Meta:
        verbose_name_plural = "Lignes de Commande"
    

class Ordre_Production(models.Model):
    nro_ordre = models.IntegerField()
    dte_ordre = models.DateField(blank=True, null=True)
    remarque = models.CharField(max_length=200)
    def __unicode__(self):
        return format( self.nro_ordre, '05d') + ' ' + self.remarque  

    class Meta:
        verbose_name_plural = "Ordres Production"


class Entree_stock(models.Model):
    nro_ligne_entree = models.IntegerField()
    qte_entree = models.DecimalField(max_digits=20,decimal_places=2)
    cod_produit = models.ForeignKey(Produit)
    nro_ordre = models.ForeignKey(Ordre_Production)
    def __unicode__(self):
        return format( self.nro_ordre, '05d') + ' ' + str(self.cod_produit) 


    class Meta:
        verbose_name_plural = "Entrees stock"
