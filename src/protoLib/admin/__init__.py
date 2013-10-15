# -*- coding: utf-8 -*-

from protoLib.models import ProtoDefinition, UserProfile, TeamHierarchy, UserShare
from protoLib.models import CustomDefinition, PtFunction
from protoLib.models import EntityMap, FieldMap
from django.contrib import admin


import django.contrib.admin

<<<<<<< HEAD
from adminProtoDef import protoDefinitionAdmin
admin.site.register(ProtoDefinition, protoDefinitionAdmin)

from adminOrgTree import orgTreeAdmin
admin.site.register(TeamHierarchy)

# from adminUserProf import usrProfileAdmin
=======
from protoLib.admin.adminProtoDef import protoDefinitionAdmin
admin.site.register(ProtoDefinition, protoDefinitionAdmin)

from protoLib.admin.adminOrgTree import orgTreeAdmin
admin.site.register(TeamHierarchy)

#from adminUserProf import usrProfileAdmin
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
admin.site.register(UserProfile)

admin.site.register(UserShare)

admin.site.register(CustomDefinition)
admin.site.register(PtFunction)


from django.contrib.auth.models import User
<<<<<<< HEAD
from adminUsr import AdminUser
=======
from protoLib.admin.adminUsr import AdminUser
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
User.protoExt = AdminUser


# de aut
<<<<<<< HEAD
# from django.contrib.auth.models import Permission, Message
# admin.site.register( Permission )
# admin.site.register( Message )
=======
#from django.contrib.auth.models import Permission, Message
#admin.site.register( Permission )
#admin.site.register( Message )
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e


from django.contrib.contenttypes.models import ContentType
admin.site.register(ContentType)

admin.site.register(EntityMap)
admin.site.register(FieldMap)
