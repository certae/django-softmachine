# -*- coding: utf-8 -*-

from django.db import models

class Questionnaire(models.Model):
    code_questionnaire = models.CharField(blank = False, null = False, max_length=50 )
    libelle_questionnaire = models.CharField(blank = True, null = True, max_length=100 )
    
    def __unicode__(self):
        return self.code_questionnaire

    unicode_sort = ( 'code_questionnaire', )


class Question(models.Model):
    code_question = models.CharField(blank = False, null = False, max_length=20 )
    libelle_question = models.TextField(blank = True, null = True, max_length=200 )
    invertion = models.BooleanField()
    question_parent = models.ForeignKey( 'Question', blank = True, null = True )
    questionnaire = models.ForeignKey( Questionnaire, blank = True, null = True)

    def __unicode__(self):
        return self.code_question

    unicode_sort = ( 'code_question', )


class Repondant(models.Model):
    idul_repondant = models.CharField(blank = True, null = True, max_length=20 )
    nom_repondant = models.CharField(blank = True, null = True, max_length=150 )
    prenom_repondant = models.CharField(blank = True, null = True, max_length=150 )

    def __unicode__(self):
        return self.idul_repondant

    unicode_sort = ( 'idul_repondant' )

class Reponse(models.Model):
    date_soumission = models.DateField(blank = True, null = True, max_length=20 )
    repondant = models.ForeignKey( Repondant, blank = True, null = True )
    questionnaire = models.ForeignKey( Questionnaire, blank = True, null = True)
            
    def __unicode__(self):
        return self.repondant + '.' + self.questionnaire

    unicode_sort = ( 'repondant', 'questionnaire' )
    
class Reponseligne(models.Model):
    texte_reponselgine = models.TextField(blank = True, null = True, max_length=200 )
    valeurnumerique = models.IntegerField(blank = True, null = True)
    repondant = models.ForeignKey( Repondant, blank = True, null = True )
    question = models.ForeignKey( Question, blank = True, null = True )
    questionnaire = models.ForeignKey( Questionnaire, blank = True, null = True)
        
    def __unicode__(self):
        return self.id.__str__()
        
    unicode_sort = ( 'id' )
        
class Concept(models.Model):
    nom_variableaditive = models.CharField(blank = True, null = True, max_length=20 )
    
    def __unicode__(self):
        return self.nom_variableaditive
        
    unicode_sort = ( 'nom_variableaditive' )
        
class Conceptquestion(models.Model):
    concept = models.ForeignKey( Concept, blank = True, null = True )
    question = models.ForeignKey( Question, blank = True, null = True)
        
    def __unicode__(self):
        return self.question + '.' + self.concept
    
    unicode_sort = ( 'question', 'concept' )
    