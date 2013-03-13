# encoding: utf-8
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models

class Migration(SchemaMigration):

    def forwards(self, orm):
        
        # Adding model 'Project'
        db.create_table('prototype_project', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Project'])

        # Adding unique constraint on 'Project', fields ['code', 'smOwningTeam']
        db.create_unique('prototype_project', ['code', 'smOwningTeam_id'])

        # Adding model 'Model'
        db.create_table('prototype_model', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('project', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Project'])),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('modelPrefix', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Model'])

        # Adding unique constraint on 'Model', fields ['project', 'code', 'smOwningTeam']
        db.create_unique('prototype_model', ['project_id', 'code', 'smOwningTeam_id'])

        # Adding model 'Entity'
        db.create_table('prototype_entity', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('model', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Model'])),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Entity'])

        # Adding unique constraint on 'Entity', fields ['model', 'code', 'smOwningTeam']
        db.create_unique('prototype_entity', ['model_id', 'code', 'smOwningTeam_id'])

        # Adding model 'Property'
        db.create_table('prototype_property', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('baseType', self.gf('django.db.models.fields.CharField')(default='string', max_length=50, null=True, blank=True)),
            ('prpLength', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('prpScale', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('vType', self.gf('django.db.models.fields.CharField')(default='string', max_length=50, null=True, blank=True)),
            ('prpDefault', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('prpChoices', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('isSensitive', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('notes', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(related_name='propertySet', to=orm['prototype.Entity'])),
            ('propertyModel', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.PropertyModel'], null=True, blank=True)),
            ('isPrimary', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isLookUpResult', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isNullable', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isRequired', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isReadOnly', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isEssential', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isForeign', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('crudType', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Property'])

        # Adding unique constraint on 'Property', fields ['entity', 'code', 'smOwningTeam']
        db.create_unique('prototype_property', ['entity_id', 'code', 'smOwningTeam_id'])

        # Adding model 'Relationship'
        db.create_table('prototype_relationship', (
            ('property_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['prototype.Property'], unique=True, primary_key=True)),
            ('refEntity', self.gf('django.db.models.fields.related.ForeignKey')(related_name='fKeysRefSet', to=orm['prototype.Entity'])),
            ('relatedName', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('baseMin', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('baseMax', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('refMin', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('refMax', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('onRefDelete', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('typeRelation', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Relationship'])

        # Adding model 'PropertyModel'
        db.create_table('prototype_propertymodel', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('baseType', self.gf('django.db.models.fields.CharField')(default='string', max_length=50, null=True, blank=True)),
            ('prpLength', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('prpScale', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('vType', self.gf('django.db.models.fields.CharField')(default='string', max_length=50, null=True, blank=True)),
            ('prpDefault', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('prpChoices', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('isSensitive', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('notes', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('model', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Model'])),
            ('inherit', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('conceptType', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['PropertyModel'])

        # Adding unique constraint on 'PropertyModel', fields ['model', 'code', 'smOwningTeam']
        db.create_unique('prototype_propertymodel', ['model_id', 'code', 'smOwningTeam_id'])

        # Adding model 'PropertyEquivalence'
        db.create_table('prototype_propertyequivalence', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('sourceProperty', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='sourcePrp', null=True, to=orm['prototype.PropertyModel'])),
            ('targetProperty', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='targetPrp', null=True, to=orm['prototype.PropertyModel'])),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['PropertyEquivalence'])

        # Adding unique constraint on 'PropertyEquivalence', fields ['sourceProperty', 'targetProperty', 'smOwningTeam']
        db.create_unique('prototype_propertyequivalence', ['sourceProperty_id', 'targetProperty_id', 'smOwningTeam_id'])

        # Adding model 'Prototype'
        db.create_table('prototype_prototype', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Entity'])),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('notes', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('metaDefinition', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Prototype'])

        # Adding unique constraint on 'Prototype', fields ['code', 'smOwningTeam']
        db.create_unique('prototype_prototype', ['code', 'smOwningTeam_id'])

        # Adding model 'ProtoTable'
        db.create_table('prototype_prototable', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Entity'])),
            ('info', self.gf('protoLib.fields.JSONField')(default={})),
        ))
        db.send_create_signal('prototype', ['ProtoTable'])

        # Adding model 'Diagram'
        db.create_table('prototype_diagram', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('model', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Model'])),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('notes', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('info', self.gf('protoLib.fields.JSONField')(default={})),
        ))
        db.send_create_signal('prototype', ['Diagram'])

        # Adding unique constraint on 'Diagram', fields ['model', 'code', 'smOwningTeam']
        db.create_unique('prototype_diagram', ['model_id', 'code', 'smOwningTeam_id'])

        # Adding model 'DiagramEntity'
        db.create_table('prototype_diagramentity', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('diagram', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Diagram'])),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Entity'])),
            ('info', self.gf('protoLib.fields.JSONField')(default={})),
        ))
        db.send_create_signal('prototype', ['DiagramEntity'])

        # Adding unique constraint on 'DiagramEntity', fields ['diagram', 'entity', 'smOwningTeam']
        db.create_unique('prototype_diagramentity', ['diagram_id', 'entity_id', 'smOwningTeam_id'])

        # Adding model 'Service'
        db.create_table('prototype_service', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('model', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Model'])),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('Binding', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('typeMessage', self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('notes', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('infoMesage', self.gf('protoLib.fields.JSONField')(default={})),
            ('infoRequest', self.gf('protoLib.fields.JSONField')(default={})),
            ('infoReponse', self.gf('protoLib.fields.JSONField')(default={})),
        ))
        db.send_create_signal('prototype', ['Service'])

        # Adding unique constraint on 'Service', fields ['model', 'code', 'smOwningTeam']
        db.create_unique('prototype_service', ['model_id', 'code', 'smOwningTeam_id'])

        # Adding model 'ServiceRef'
        db.create_table('prototype_serviceref', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('model', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Model'])),
            ('service', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Service'])),
            ('endpoint', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('notes', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['ServiceRef'])

        # Adding unique constraint on 'ServiceRef', fields ['model', 'service', 'smOwningTeam']
        db.create_unique('prototype_serviceref', ['model_id', 'service_id', 'smOwningTeam_id'])


    def backwards(self, orm):
        
        # Removing unique constraint on 'ServiceRef', fields ['model', 'service', 'smOwningTeam']
        db.delete_unique('prototype_serviceref', ['model_id', 'service_id', 'smOwningTeam_id'])

        # Removing unique constraint on 'Service', fields ['model', 'code', 'smOwningTeam']
        db.delete_unique('prototype_service', ['model_id', 'code', 'smOwningTeam_id'])

        # Removing unique constraint on 'DiagramEntity', fields ['diagram', 'entity', 'smOwningTeam']
        db.delete_unique('prototype_diagramentity', ['diagram_id', 'entity_id', 'smOwningTeam_id'])

        # Removing unique constraint on 'Diagram', fields ['model', 'code', 'smOwningTeam']
        db.delete_unique('prototype_diagram', ['model_id', 'code', 'smOwningTeam_id'])

        # Removing unique constraint on 'Prototype', fields ['code', 'smOwningTeam']
        db.delete_unique('prototype_prototype', ['code', 'smOwningTeam_id'])

        # Removing unique constraint on 'PropertyEquivalence', fields ['sourceProperty', 'targetProperty', 'smOwningTeam']
        db.delete_unique('prototype_propertyequivalence', ['sourceProperty_id', 'targetProperty_id', 'smOwningTeam_id'])

        # Removing unique constraint on 'PropertyModel', fields ['model', 'code', 'smOwningTeam']
        db.delete_unique('prototype_propertymodel', ['model_id', 'code', 'smOwningTeam_id'])

        # Removing unique constraint on 'Property', fields ['entity', 'code', 'smOwningTeam']
        db.delete_unique('prototype_property', ['entity_id', 'code', 'smOwningTeam_id'])

        # Removing unique constraint on 'Entity', fields ['model', 'code', 'smOwningTeam']
        db.delete_unique('prototype_entity', ['model_id', 'code', 'smOwningTeam_id'])

        # Removing unique constraint on 'Model', fields ['project', 'code', 'smOwningTeam']
        db.delete_unique('prototype_model', ['project_id', 'code', 'smOwningTeam_id'])

        # Removing unique constraint on 'Project', fields ['code', 'smOwningTeam']
        db.delete_unique('prototype_project', ['code', 'smOwningTeam_id'])

        # Deleting model 'Project'
        db.delete_table('prototype_project')

        # Deleting model 'Model'
        db.delete_table('prototype_model')

        # Deleting model 'Entity'
        db.delete_table('prototype_entity')

        # Deleting model 'Property'
        db.delete_table('prototype_property')

        # Deleting model 'Relationship'
        db.delete_table('prototype_relationship')

        # Deleting model 'PropertyModel'
        db.delete_table('prototype_propertymodel')

        # Deleting model 'PropertyEquivalence'
        db.delete_table('prototype_propertyequivalence')

        # Deleting model 'Prototype'
        db.delete_table('prototype_prototype')

        # Deleting model 'ProtoTable'
        db.delete_table('prototype_prototable')

        # Deleting model 'Diagram'
        db.delete_table('prototype_diagram')

        # Deleting model 'DiagramEntity'
        db.delete_table('prototype_diagramentity')

        # Deleting model 'Service'
        db.delete_table('prototype_service')

        # Deleting model 'ServiceRef'
        db.delete_table('prototype_serviceref')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2013, 3, 13, 14, 14, 30, 188000)'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime(2013, 3, 13, 14, 14, 30, 188000)'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'protoLib.teamhierarchy': {
            'Meta': {'object_name': 'TeamHierarchy'},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'parentNode': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'downHierachy'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['sites.Site']", 'null': 'True', 'blank': 'True'})
        },
        'prototype.diagram': {
            'Meta': {'unique_together': "(('model', 'code', 'smOwningTeam'),)", 'object_name': 'Diagram'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info': ('protoLib.fields.JSONField', [], {'default': '{}'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Model']"}),
            'notes': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.diagramentity': {
            'Meta': {'unique_together': "(('diagram', 'entity', 'smOwningTeam'),)", 'object_name': 'DiagramEntity'},
            'diagram': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Diagram']"}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Entity']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info': ('protoLib.fields.JSONField', [], {'default': '{}'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.entity': {
            'Meta': {'unique_together': "(('model', 'code', 'smOwningTeam'),)", 'object_name': 'Entity'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Model']"}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.model': {
            'Meta': {'unique_together': "(('project', 'code', 'smOwningTeam'),)", 'object_name': 'Model'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modelPrefix': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'project': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Project']"}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.project': {
            'Meta': {'unique_together': "(('code', 'smOwningTeam'),)", 'object_name': 'Project'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.property': {
            'Meta': {'unique_together': "(('entity', 'code', 'smOwningTeam'),)", 'object_name': 'Property'},
            'baseType': ('django.db.models.fields.CharField', [], {'default': "'string'", 'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'crudType': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'propertySet'", 'to': "orm['prototype.Entity']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isEssential': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isForeign': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isLookUpResult': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isNullable': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isPrimary': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isReadOnly': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isRequired': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isSensitive': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'notes': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'propertyModel': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.PropertyModel']", 'null': 'True', 'blank': 'True'}),
            'prpChoices': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'prpDefault': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'prpLength': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'prpScale': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'vType': ('django.db.models.fields.CharField', [], {'default': "'string'", 'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.propertyequivalence': {
            'Meta': {'unique_together': "(('sourceProperty', 'targetProperty', 'smOwningTeam'),)", 'object_name': 'PropertyEquivalence'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'sourceProperty': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'sourcePrp'", 'null': 'True', 'to': "orm['prototype.PropertyModel']"}),
            'targetProperty': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'targetPrp'", 'null': 'True', 'to': "orm['prototype.PropertyModel']"})
        },
        'prototype.propertymodel': {
            'Meta': {'unique_together': "(('model', 'code', 'smOwningTeam'),)", 'object_name': 'PropertyModel'},
            'baseType': ('django.db.models.fields.CharField', [], {'default': "'string'", 'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'conceptType': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'inherit': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isSensitive': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Model']"}),
            'notes': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'prpChoices': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'prpDefault': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'prpLength': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'prpScale': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'vType': ('django.db.models.fields.CharField', [], {'default': "'string'", 'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.prototable': {
            'Meta': {'object_name': 'ProtoTable'},
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Entity']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info': ('protoLib.fields.JSONField', [], {'default': '{}'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.prototype': {
            'Meta': {'unique_together': "(('code', 'smOwningTeam'),)", 'object_name': 'Prototype'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Entity']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'metaDefinition': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'notes': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.relationship': {
            'Meta': {'object_name': 'Relationship', '_ormbases': ['prototype.Property']},
            'baseMax': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'baseMin': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'onRefDelete': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'property_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['prototype.Property']", 'unique': 'True', 'primary_key': 'True'}),
            'refEntity': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'fKeysRefSet'", 'to': "orm['prototype.Entity']"}),
            'refMax': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'refMin': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'relatedName': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'typeRelation': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.service': {
            'Binding': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'Meta': {'unique_together': "(('model', 'code', 'smOwningTeam'),)", 'object_name': 'Service'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'infoMesage': ('protoLib.fields.JSONField', [], {'default': '{}'}),
            'infoReponse': ('protoLib.fields.JSONField', [], {'default': '{}'}),
            'infoRequest': ('protoLib.fields.JSONField', [], {'default': '{}'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Model']"}),
            'notes': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'typeMessage': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'})
        },
        'prototype.serviceref': {
            'Meta': {'unique_together': "(('model', 'service', 'smOwningTeam'),)", 'object_name': 'ServiceRef'},
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'endpoint': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Model']"}),
            'notes': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'service': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Service']"}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['prototype']
