# -*- coding: utf-8 -*-

from protoLib.models import ProtoDefinition, UserProfile, TeamHierarchy, UserShare
from protoLib.models import CustomDefinition, PtFunction
from protoLib.models import EntityMap, FieldMap
from django.contrib import admin


import django.contrib.admin

from protoLib.admin.adminProtoDef import protoDefinitionAdmin
admin.site.register(ProtoDefinition, protoDefinitionAdmin)

from protoLib.admin.adminOrgTree import orgTreeAdmin
admin.site.register(TeamHierarchy)

#from adminUserProf import usrProfileAdmin
admin.site.register(UserProfile)

admin.site.register(UserShare)

admin.site.register(CustomDefinition)
admin.site.register(PtFunction)


from django.contrib.auth.models import User
from protoLib.admin.adminUsr import AdminUser
User.protoExt = AdminUser


# de aut
#from django.contrib.auth.models import Permission, Message
#admin.site.register( Permission )
#admin.site.register( Message )


from django.contrib.contenttypes.models import ContentType
admin.site.register(ContentType)

admin.site.register(EntityMap)
admin.site.register(FieldMap)
