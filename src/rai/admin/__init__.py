# -*- coding: utf-8 -*-

from django.contrib import admin

from rai.actions import  doImportOMS
from rai.models import DomaineAffaires


class AdmDomaineAffaires( admin.ModelAdmin ):
    actions = [ doImportOMS  ]

admin.site.register( DomaineAffaires, AdmDomaineAffaires )

