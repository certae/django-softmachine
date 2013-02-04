# This is an auto-generated model module by CeRTAE OMS PlugIn
# for project : "Modelibra.py" >


from models import Domain,  Model, PropertyDom, Concept, PropertyModel, PropertyConcept, PropertyEquivalence, Relationship 
from django.contrib import admin

from admin_Model import Model_Admin 
admin.site.register(Model, Model_Admin)

from admin_PropertyMod import PropertyAdmin
admin.site.register(PropertyModel, PropertyAdmin)

admin.site.register(Domain )
admin.site.register(Concept )
admin.site.register(Relationship )

admin.site.register(PropertyDom )
admin.site.register(PropertyConcept )
admin.site.register(PropertyEquivalence )

# drop table protoDict_Domain ; 
# drop table protoDict_Model ;
# drop table protoDict_Concept ;
# drop table protoDict_Relationship ;
# drop table protoDict_PropertyDom ;
# drop table protoDict_PropertyModel ;
# drop table protoDict_PropertyConcept ;
# drop table protoDict_PropertyEquivalence ;
# drop table protoDict_UdpModel ;
# drop table protoDict_UdpPropertyDom ;
