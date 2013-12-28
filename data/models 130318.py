# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#     * Rearrange models' order
#     * Make sure each model has one field with primary_key=True
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [appname]'
# into your database.

from django.db import models

class AuthGroup(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=80, unique=True)
    class Meta:
        db_table = u'auth_group'

class AuthGroupPermissions(models.Model):
    id = models.IntegerField(primary_key=True)
    group_id = models.IntegerField()
    permission = models.ForeignKey(AuthPermission)
    class Meta:
        db_table = u'auth_group_permissions'

class AuthMessage(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(AuthUser)
    message = models.TextField()
    class Meta:
        db_table = u'auth_message'

class AuthPermission(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=50)
    content_type = models.ForeignKey(DjangoContentType)
    codename = models.CharField(max_length=100)
    class Meta:
        db_table = u'auth_permission'

class AuthUser(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=75)
    password = models.CharField(max_length=128)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    is_superuser = models.BooleanField()
    last_login = models.DateTimeField()
    date_joined = models.DateTimeField()
    class Meta:
        db_table = u'auth_user'

class AuthUserGroups(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField()
    group = models.ForeignKey(AuthGroup)
    class Meta:
        db_table = u'auth_user_groups'

class AuthUserUserPermissions(models.Model):
    id = models.IntegerField(primary_key=True)
    user_id = models.IntegerField()
    permission = models.ForeignKey(AuthPermission)
    class Meta:
        db_table = u'auth_user_user_permissions'




class DjangoAdminLog(models.Model):
    id = models.IntegerField(primary_key=True)
    action_time = models.DateTimeField()
    user = models.ForeignKey(AuthUser)
    content_type = models.ForeignKey(DjangoContentType, null=True, blank=True)
    object_id = models.TextField(blank=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    class Meta:
        db_table = u'django_admin_log'

class DjangoContentType(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    class Meta:
        db_table = u'django_content_type'

class DjangoSession(models.Model):
    session_key = models.CharField(max_length=40, primary_key=True)
    session_data = models.TextField()
    expire_date = models.DateTimeField()
    class Meta:
        db_table = u'django_session'

class DjangoSite(models.Model):
    id = models.IntegerField(primary_key=True)
    domain = models.CharField(max_length=100)
    name = models.CharField(max_length=50)
    class Meta:
        db_table = u'django_site'

class ProtolibCustomdefinition(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam = models.ForeignKey(ProtolibTeamhierarchy, null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    code = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    metadefinition = models.TextField(db_column=u'metaDefinition', blank=True) # Field name made lowercase.
    active = models.BooleanField()
    overwrite = models.BooleanField(db_column=u'overWrite') # Field name made lowercase.
    class Meta:
        db_table = u'protoLib_customdefinition'

class ProtolibDiscretevalue(models.Model):
    id = models.IntegerField(primary_key=True)
    code = models.CharField(max_length=200)
    value = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    title_id = models.IntegerField(null=True, blank=True)
    class Meta:
        db_table = u'protoLib_discretevalue'

class ProtolibEntitymap(models.Model):
    id = models.IntegerField(primary_key=True)
    appname = models.CharField(max_length=200, db_column=u'appName') # Field name made lowercase.
    modelname = models.CharField(max_length=200, db_column=u'modelName') # Field name made lowercase.
    fieldlevelsecurity = models.BooleanField(db_column=u'fieldLevelSecurity') # Field name made lowercase.
    class Meta:
        db_table = u'protoLib_entitymap'

class ProtolibFieldmap(models.Model):
    id = models.IntegerField(primary_key=True)
    entity_id = models.IntegerField()
    fieldname = models.CharField(max_length=200, db_column=u'fieldName') # Field name made lowercase.
    canread = models.IntegerField(db_column=u'canRead') # Field name made lowercase.
    canins = models.IntegerField(db_column=u'canIns') # Field name made lowercase.
    canupd = models.IntegerField(db_column=u'canUpd') # Field name made lowercase.
    class Meta:
        db_table = u'protoLib_fieldmap'

class ProtolibLanguaje(models.Model):
    id = models.IntegerField(primary_key=True)
    code = models.CharField(max_length=200, unique=True)
    alias = models.CharField(max_length=200)
    info = models.TextField()
    class Meta:
        db_table = u'protoLib_languaje'

class ProtolibProtodefinition(models.Model):
    id = models.IntegerField(primary_key=True)
    code = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    metadefinition = models.TextField(db_column=u'metaDefinition', blank=True) # Field name made lowercase.
    active = models.BooleanField()
    overwrite = models.BooleanField(db_column=u'overWrite') # Field name made lowercase.
    class Meta:
        db_table = u'protoLib_protodefinition'

class ProtolibPtfunction(models.Model):
    id = models.IntegerField(primary_key=True)
    code = models.CharField(max_length=200, unique=True)
    modelname = models.CharField(max_length=200, db_column=u'modelName') # Field name made lowercase.
    arguments = models.CharField(max_length=400)
    functionbody = models.TextField(db_column=u'functionBody', blank=True) # Field name made lowercase.
    tag = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    class Meta:
        db_table = u'protoLib_ptfunction'

class ProtolibTeamhierarchy(models.Model):
    id = models.IntegerField(primary_key=True)
    code = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    parentnode_id = models.IntegerField(null=True, db_column=u'parentNode_id', blank=True) # Field name made lowercase.
    site = models.ForeignKey(DjangoSite, null=True, blank=True)
    class Meta:
        db_table = u'protoLib_teamhierarchy'

class ProtolibUserprofile(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(AuthUser, unique=True)
    userteam = models.ForeignKey(ProtolibTeamhierarchy, null=True, db_column=u'userTeam_id', blank=True) # Field name made lowercase.
    usertree = models.CharField(max_length=500, db_column=u'userTree', blank=True) # Field name made lowercase.
    language = models.CharField(max_length=500, blank=True)
    class Meta:
        db_table = u'protoLib_userprofile'

class ProtolibUsershare(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(AuthUser)
    userteam = models.ForeignKey(ProtolibTeamhierarchy, db_column=u'userTeam_id') # Field name made lowercase.
    class Meta:
        db_table = u'protoLib_usershare'

class PrototypeDiagram(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    model = models.ForeignKey(PrototypeModel)
    code = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    info = models.TextField()
    class Meta:
        db_table = u'prototype_diagram'

class PrototypeDiagramentity(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    diagram = models.ForeignKey(PrototypeDiagram)
    entity = models.ForeignKey(PrototypeEntity)
    info = models.TextField()
    class Meta:
        db_table = u'prototype_diagramentity'

class PrototypeEntity(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    model = models.ForeignKey(PrototypeModel)
    code = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    class Meta:
        db_table = u'prototype_entity'

class PrototypeModel(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    project = models.ForeignKey(PrototypeProject)
    code = models.CharField(max_length=200)
    category = models.CharField(max_length=50, blank=True)
    modelprefix = models.CharField(max_length=50, db_column=u'modelPrefix', blank=True) # Field name made lowercase.
    description = models.TextField(blank=True)
    class Meta:
        db_table = u'prototype_model'

class PrototypeProject(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    code = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    class Meta:
        db_table = u'prototype_project'

class PrototypeProperty(models.Model):
    entity_id = models.IntegerField(null=True, blank=True)
    code = models.CharField(max_length=200, blank=True)
    propertymodel_id = models.IntegerField(null=True, db_column=u'propertyModel_id', blank=True) # Field name made lowercase.
    isprimary = models.BooleanField(null=True, db_column=u'isPrimary', blank=True) # Field name made lowercase.
    id = models.IntegerField(null=True, primary_key=True, blank=True)
    basetype = models.CharField(max_length=50, db_column=u'baseType', blank=True) # Field name made lowercase.
    isreadonly = models.BooleanField(null=True, db_column=u'isReadOnly', blank=True) # Field name made lowercase.
    issensitive = models.BooleanField(null=True, db_column=u'isSensitive', blank=True) # Field name made lowercase.
    prpscale = models.IntegerField(null=True, db_column=u'prpScale', blank=True) # Field name made lowercase.
    smcreatedby_id = models.IntegerField(null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    isforeign = models.BooleanField(null=True, db_column=u'isForeign', blank=True) # Field name made lowercase.
    vtype = models.CharField(max_length=50, db_column=u'vType', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    description = models.TextField(blank=True)
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    prpchoices = models.CharField(max_length=200, db_column=u'prpChoices', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smowninguser_id = models.IntegerField(null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    isrequired = models.BooleanField(null=True, db_column=u'isRequired', blank=True) # Field name made lowercase.
    crudtype = models.CharField(max_length=20, db_column=u'crudType', blank=True) # Field name made lowercase.
    prplength = models.IntegerField(null=True, db_column=u'prpLength', blank=True) # Field name made lowercase.
    isnullable = models.BooleanField(null=True, db_column=u'isNullable', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    prpdefault = models.CharField(max_length=50, db_column=u'prpDefault', blank=True) # Field name made lowercase.
    islookupresult = models.BooleanField(db_column=u'isLookUpResult') # Field name made lowercase.
    notes = models.TextField(blank=True)
    isessential = models.BooleanField(null=True, db_column=u'isEssential', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smmodifiedby_id = models.IntegerField(null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    class Meta:
        db_table = u'prototype_property'

class PrototypePropertyequivalence(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    sourceproperty = models.ForeignKey(PrototypePropertymodel, null=True, db_column=u'sourceProperty_id', blank=True) # Field name made lowercase.
    targetproperty = models.ForeignKey(PrototypePropertymodel, null=True, db_column=u'targetProperty_id', blank=True) # Field name made lowercase.
    description = models.TextField(blank=True)
    class Meta:
        db_table = u'prototype_propertyequivalence'

class PrototypePropertymodel(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    code = models.CharField(max_length=200)
    basetype = models.CharField(max_length=50, db_column=u'baseType', blank=True) # Field name made lowercase.
    prplength = models.IntegerField(null=True, db_column=u'prpLength', blank=True) # Field name made lowercase.
    prpscale = models.IntegerField(null=True, db_column=u'prpScale', blank=True) # Field name made lowercase.
    vtype = models.CharField(max_length=50, db_column=u'vType', blank=True) # Field name made lowercase.
    prpdefault = models.CharField(max_length=50, db_column=u'prpDefault', blank=True) # Field name made lowercase.
    prpchoices = models.CharField(max_length=200, db_column=u'prpChoices', blank=True) # Field name made lowercase.
    issensitive = models.BooleanField(db_column=u'isSensitive') # Field name made lowercase.
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    model = models.ForeignKey(PrototypeModel)
    inherit = models.BooleanField()
    concepttype = models.CharField(max_length=50, db_column=u'conceptType', blank=True) # Field name made lowercase.
    class Meta:
        db_table = u'prototype_propertymodel'

class PrototypePropertyproj(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser_id = models.IntegerField(null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby_id = models.IntegerField(null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby_id = models.IntegerField(null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    code = models.CharField(max_length=200)
    basetype = models.CharField(max_length=50, db_column=u'baseType', blank=True) # Field name made lowercase.
    prplength = models.IntegerField(null=True, db_column=u'prpLength', blank=True) # Field name made lowercase.
    prpscale = models.IntegerField(null=True, db_column=u'prpScale', blank=True) # Field name made lowercase.
    vtype = models.CharField(max_length=50, db_column=u'vType', blank=True) # Field name made lowercase.
    prpdefault = models.CharField(max_length=50, db_column=u'prpDefault', blank=True) # Field name made lowercase.
    prpchoices = models.CharField(max_length=200, db_column=u'prpChoices', blank=True) # Field name made lowercase.
    issensitive = models.BooleanField(db_column=u'isSensitive') # Field name made lowercase.
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    project_id = models.IntegerField()
    inherit = models.BooleanField()
    class Meta:
        db_table = u'prototype_propertyproj'

class PrototypePrototable(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam = models.ForeignKey(ProtolibTeamhierarchy, null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    entity = models.ForeignKey(PrototypeEntity)
    info = models.TextField()
    class Meta:
        db_table = u'prototype_prototable'

class PrototypePrototype(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam = models.ForeignKey(ProtolibTeamhierarchy, null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    entity = models.ForeignKey(PrototypeEntity)
    code = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    metadefinition = models.TextField(db_column=u'metaDefinition', blank=True) # Field name made lowercase.
    class Meta:
        db_table = u'prototype_prototype'

class PrototypeRelationship(models.Model):
    property_ptr = models.ForeignKey(PrototypeProperty, primary_key=True)
    refentity = models.ForeignKey(PrototypeEntity, db_column=u'refEntity_id') # Field name made lowercase.
    relatedname = models.CharField(max_length=50, db_column=u'relatedName', blank=True) # Field name made lowercase.
    basemin = models.CharField(max_length=50, db_column=u'baseMin', blank=True) # Field name made lowercase.
    basemax = models.CharField(max_length=50, db_column=u'baseMax', blank=True) # Field name made lowercase.
    refmin = models.CharField(max_length=50, db_column=u'refMin', blank=True) # Field name made lowercase.
    refmax = models.CharField(max_length=50, db_column=u'refMax', blank=True) # Field name made lowercase.
    onrefdelete = models.CharField(max_length=50, db_column=u'onRefDelete', blank=True) # Field name made lowercase.
    typerelation = models.CharField(max_length=50, db_column=u'typeRelation', blank=True) # Field name made lowercase.
    class Meta:
        db_table = u'prototype_relationship'

class PrototypeService(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    model = models.ForeignKey(PrototypeModel)
    code = models.CharField(max_length=200)
    binding = models.CharField(max_length=20, db_column=u'Binding', blank=True) # Field name made lowercase.
    typemessage = models.CharField(max_length=20, db_column=u'typeMessage', blank=True) # Field name made lowercase.
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    infomesage = models.TextField(db_column=u'infoMesage') # Field name made lowercase.
    inforequest = models.TextField(db_column=u'infoRequest') # Field name made lowercase.
    inforeponse = models.TextField(db_column=u'infoReponse') # Field name made lowercase.
    class Meta:
        db_table = u'prototype_service'

class PrototypeServiceref(models.Model):
    id = models.IntegerField(primary_key=True)
    smowninguser = models.ForeignKey(AuthUser, null=True, db_column=u'smOwningUser_id', blank=True) # Field name made lowercase.
    smowningteam_id = models.IntegerField(null=True, db_column=u'smOwningTeam_id', blank=True) # Field name made lowercase.
    smcreatedby = models.ForeignKey(AuthUser, null=True, db_column=u'smCreatedBy_id', blank=True) # Field name made lowercase.
    smmodifiedby = models.ForeignKey(AuthUser, null=True, db_column=u'smModifiedBy_id', blank=True) # Field name made lowercase.
    smregstatus = models.CharField(max_length=50, db_column=u'smRegStatus', blank=True) # Field name made lowercase.
    smwflowstatus = models.CharField(max_length=50, db_column=u'smWflowStatus', blank=True) # Field name made lowercase.
    smcreatedon = models.DateTimeField(null=True, db_column=u'smCreatedOn', blank=True) # Field name made lowercase.
    smmodifiedon = models.DateTimeField(null=True, db_column=u'smModifiedOn', blank=True) # Field name made lowercase.
    model = models.ForeignKey(PrototypeModel)
    service = models.ForeignKey(PrototypeService)
    endpoint = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    class Meta:
        db_table = u'prototype_serviceref'

class SouthMigrationhistory(models.Model):
    id = models.IntegerField(primary_key=True)
    app_name = models.CharField(max_length=255)
    migration = models.CharField(max_length=255)
    applied = models.DateTimeField()
    class Meta:
        db_table = u'south_migrationhistory'

