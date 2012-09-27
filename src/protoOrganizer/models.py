# -*- coding: utf-8 -*-

from django.db import models


class Config(models.Model):
    key  = models.CharField( max_length = 200, unique = True ) 
    value = models.CharField( max_length =200 )

    def __unicode__(self):
        return self.key + '.' + self.value  


class List(models.Model):
    name  = models.CharField( max_length = 200  ) 
    leaf = models.BooleanField()
    parentList = models.ForeignKey( 'List' )

    def __unicode__(self):
        return self.name  


class Task(models.Model):
    title  = models.CharField( max_length = 200, unique = True ) 
    activityList = models.ForeignKey( 'List' )
    due = models.DateField(blank = True, null = True) 
    reminder = models.DateField(blank = True, null = True) 
    done = models.BooleanField() 
    note = models.TextField(blank = True, null = True)

    def __unicode__(self):
        return self.title   
