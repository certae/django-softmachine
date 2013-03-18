# -*- coding: utf-8 -*-

from django.db import models

class Questionnaire(models.Model):
    ID_Questionnaire = models.CharField(blank = False, null = False, max_length=50 )
    Libelle_Questionnaire = models.CharField(blank = True, null = True, max_length=200 )
    
    def __unicode__(self):
        return self.ID_Questionnaire

class Question(models.Model):
    ID_Question = models.CharField(blank = False, null = False, max_length=20 )
    Libelle_Question = models.TextField(blank = True, null = True, max_length=200 )
    Invertion = models.BooleanField()
    QUESTION_ID_Question = models.ForeignKey( 'Question', blank = True, null = True )
    ID_Questionnaire = models.ForeignKey( Questionnaire, blank = True, null = True)
        
    def __unicode__(self):
        return self.ID_Question

class Repondant(models.Model):
    ID_Repondant = models.IntegerField(blank = False, null = False )
    IDUL_Repondant = models.CharField(blank = True, null = True, max_length=20 )
    
    def __unicode__(self):
        return self.ID_Repondant.__str__()

class Reponse(models.Model):
    ID_Repondant = models.ForeignKey( Repondant, blank = True, null = True )
    ID_Questionnaire = models.ForeignKey( Questionnaire, blank = True, null = True)
    Date_soumission = models.DateField(blank = True, null = True, max_length=20 )
        
    def __unicode__(self):
        return self.ID_Repondant + self.ID_Questionnaire
    
class Reponseligne(models.Model):
    ID_Reponseligne = models.IntegerField(blank = False, null = False )
    Texte_Reponselgine = models.TextField(blank = True, null = True, max_length=200 )
    Valeurnumerique = models.IntegerField(blank = True, null = True)
    ID_Repondant = models.ForeignKey( Repondant, blank = True, null = True )
    ID_Question = models.ForeignKey( Question, blank = True, null = True )
    ID_Questionnaire = models.ForeignKey( Questionnaire, blank = True, null = True)
        
    def __unicode__(self):
        return self.ID_Reponseligne.__str__()