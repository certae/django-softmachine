# -*- coding: utf-8 -*-

from protoLib.models import ProtoDefinition, UserProfile, TeamHierarchy, UserShare
from protoLib.models import CustomDefinition
from protoLib.models import EntityMap, FieldMap
from django.contrib  import admin


from adminProtoDef import protoDefinitionAdmin
admin.site.register(ProtoDefinition, protoDefinitionAdmin)

from adminOrgTree import orgTreeAdmin
admin.site.register(TeamHierarchy)
admin.site.register(UserShare)
admin.site.register(CustomDefinition)
# from protoLib.models import  PtFunction
# admin.site.register(PtFunction)

from django.contrib.auth.models import User
from adminUsr import AdminUser
User.protoExt = AdminUser


# de aut
# from django.contrib.auth.models import Permission, Message
# admin.site.register( Permission )
# admin.site.register( Message )


from django.contrib.contenttypes.models import ContentType
admin.site.register(ContentType)

admin.site.register(EntityMap)
admin.site.register(FieldMap)


# -----------------------------------------   WflowAdminResume

from protoLib.actions import doWFlowResume
from protoLib.models import WflowAdminResume

class WflowAdminResumeAdmin(admin.ModelAdmin):
    actions = [ doWFlowResume, ]

admin.site.register(WflowAdminResume, WflowAdminResumeAdmin)

# -----------------------------------------   Log 

from protoLib.actions import doClearLog 
from protoLib.models import Logger

class LoggerAdmin( admin.ModelAdmin ):
    actions = [ doClearLog ]

admin.site.register(Logger, LoggerAdmin )


# -----------------------------------------   AddUser  
# from adminUserProf import usrProfileAdmin
# admin.site.register(UserProfile)

from protoLib.actions import doAddUser 
from protoLib.models import UserProfile

class UserProfileAdmin( admin.ModelAdmin ):
    actions = [ doAddUser ]

admin.site.register( UserProfile, UserProfileAdmin )

