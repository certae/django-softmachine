# -*- coding: utf-8 -*-

from django.contrib import admin

from rai.models import DomaineAffaires
from rai.actions import  doImportRAI, doMatchRAI

class AdmDomaineAffaires( admin.ModelAdmin ):
    actions = [ doImportRAI, doMatchRAI  ]

admin.site.register( DomaineAffaires, AdmDomaineAffaires )


# ------------------------------------------------

from rai.models import ModeleRaccordement
from rai.actions import  doFindReplace

class AdmModeleRaccordement( admin.ModelAdmin ):
    actions = [ doFindReplace ]

admin.site.register( ModeleRaccordement, AdmModeleRaccordement )


# ------------------------------------------------

from rai.models import Modele
from rai.actions import  doMatrixRacc

class AdmModele( admin.ModelAdmin ):
    actions = [ doMatrixRacc ]

admin.site.register( Modele, AdmModele )



# ------------------------------------------------

from rai.models import Entite 
from rai.actions import  doAddModel

class AdmEntite( admin.ModelAdmin ):
    actions = [ doAddModel ]

admin.site.register( Entite, AdmEntite )

