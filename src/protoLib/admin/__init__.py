# -*- coding: utf-8 -*-

from protoLib.models import ProtoDefinition, UserProfile, OrganisationTree, UserShare, CustomDefinition 
from django.contrib  import admin

           
import django.contrib.admin

from adminProtoDef import protoDefinitionAdmin 
admin.site.register(ProtoDefinition, protoDefinitionAdmin)

from adminOrgTree import orgTreeAdmin
admin.site.register( OrganisationTree )

#from adminUserProf import usrProfileAdmin
admin.site.register(UserProfile )

admin.site.register( UserShare )
admin.site.register( CustomDefinition )


from django.contrib.auth.models import User 
from adminUsr import AdminUser 
User.protoExt = AdminUser
