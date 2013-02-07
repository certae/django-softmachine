# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Domain'
        db.create_table('prototype_domain', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('owningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('owningHierachy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.OrganisationTree'])),
            ('createdBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('modifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('wflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('regStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('createdOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('modifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('code', self.gf('django.db.models.fields.CharField')(unique=True, max_length=200)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Domain'])

        # Adding model 'Model'
        db.create_table('prototype_model', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('owningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('owningHierachy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.OrganisationTree'])),
            ('createdBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('modifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('wflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('regStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('createdOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('modifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('domain', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Domain'])),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('category', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('modelPrefix', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Model'])

        # Adding unique constraint on 'Model', fields ['domain', 'code']
        db.create_unique('prototype_model', ['domain_id', 'code'])

        # Adding model 'Entity'
        db.create_table('prototype_entity', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('owningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('owningHierachy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.OrganisationTree'])),
            ('createdBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('modifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('wflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('regStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('createdOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('modifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('model', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Model'])),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Entity'])

        # Adding unique constraint on 'Entity', fields ['model', 'code']
        db.create_unique('prototype_entity', ['model_id', 'code'])

        # Adding model 'Property'
        db.create_table('prototype_property', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('owningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('owningHierachy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.OrganisationTree'])),
            ('createdBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('modifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('wflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('regStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('createdOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('modifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('baseType', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('prpLength', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True)),
            ('defaultValue', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('propertyChoices', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('isSensitive', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(related_name='propertySet', to=orm['prototype.Entity'])),
            ('propertyModel', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.PropertyModel'], null=True, blank=True)),
            ('isPrimary', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isUnique', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isNullable', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isRequired', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isReadOnly', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isEssential', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('isForeign', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('fromModel', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('cpFromModel', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('cpFromField', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Property'])

        # Adding unique constraint on 'Property', fields ['entity', 'code']
        db.create_unique('prototype_property', ['entity_id', 'code'])

        # Adding model 'Relationship'
        db.create_table('prototype_relationship', (
            ('property_ptr', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['prototype.Property'], unique=True, primary_key=True)),
            ('refEntity', self.gf('django.db.models.fields.related.ForeignKey')(related_name='fKeysRefSet', to=orm['prototype.Entity'])),
            ('relatedName', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('baseMin', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('baseMax', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('refMin', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('refMax', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['Relationship'])

        # Adding model 'PropertyDom'
        db.create_table('prototype_propertydom', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('owningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('owningHierachy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.OrganisationTree'])),
            ('createdBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('modifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('wflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('regStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('createdOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('modifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('baseType', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('prpLength', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True)),
            ('defaultValue', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('propertyChoices', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('isSensitive', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('domain', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Domain'])),
        ))
        db.send_create_signal('prototype', ['PropertyDom'])

        # Adding unique constraint on 'PropertyDom', fields ['domain', 'code']
        db.create_unique('prototype_propertydom', ['domain_id', 'code'])

        # Adding model 'PropertyModel'
        db.create_table('prototype_propertymodel', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('owningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('owningHierachy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.OrganisationTree'])),
            ('createdBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('modifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('wflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('regStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('createdOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('modifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('baseType', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('prpLength', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2, blank=True)),
            ('defaultValue', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('propertyChoices', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('isSensitive', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('model', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Model'])),
            ('propertyDom', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.PropertyDom'])),
        ))
        db.send_create_signal('prototype', ['PropertyModel'])

        # Adding unique constraint on 'PropertyModel', fields ['model', 'code']
        db.create_unique('prototype_propertymodel', ['model_id', 'code'])

        # Adding model 'ProtoViews'
        db.create_table('prototype_protoviews', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('owningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('owningHierachy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.OrganisationTree'])),
            ('createdBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('modifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('wflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('regStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('createdOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('modifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Entity'])),
            ('view', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['ProtoViews'])

        # Adding model 'ProtoTable'
        db.create_table('prototype_prototable', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('owningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('owningHierachy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.OrganisationTree'])),
            ('createdBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('modifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('wflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('regStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('createdOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('modifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('entity', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('info', self.gf('protoLib.fields.JSONField')(default={})),
        ))
        db.send_create_signal('prototype', ['ProtoTable'])


    def backwards(self, orm):
        # Removing unique constraint on 'PropertyModel', fields ['model', 'code']
        db.delete_unique('prototype_propertymodel', ['model_id', 'code'])

        # Removing unique constraint on 'PropertyDom', fields ['domain', 'code']
        db.delete_unique('prototype_propertydom', ['domain_id', 'code'])

        # Removing unique constraint on 'Property', fields ['entity', 'code']
        db.delete_unique('prototype_property', ['entity_id', 'code'])

        # Removing unique constraint on 'Entity', fields ['model', 'code']
        db.delete_unique('prototype_entity', ['model_id', 'code'])

        # Removing unique constraint on 'Model', fields ['domain', 'code']
        db.delete_unique('prototype_model', ['domain_id', 'code'])

        # Deleting model 'Domain'
        db.delete_table('prototype_domain')

        # Deleting model 'Model'
        db.delete_table('prototype_model')

        # Deleting model 'Entity'
        db.delete_table('prototype_entity')

        # Deleting model 'Property'
        db.delete_table('prototype_property')

        # Deleting model 'Relationship'
        db.delete_table('prototype_relationship')

        # Deleting model 'PropertyDom'
        db.delete_table('prototype_propertydom')

        # Deleting model 'PropertyModel'
        db.delete_table('prototype_propertymodel')

        # Deleting model 'ProtoViews'
        db.delete_table('prototype_protoviews')

        # Deleting model 'ProtoTable'
        db.delete_table('prototype_prototable')


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
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': "orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
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
        'protoLib.organisationtree': {
            'Meta': {'object_name': 'OrganisationTree'},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'parentNode': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'downHierachy'", 'null': 'True', 'to': "orm['protoLib.OrganisationTree']"}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['sites.Site']", 'null': 'True', 'blank': 'True'})
        },
        'prototype.domain': {
            'Meta': {'object_name': 'Domain'},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'}),
            'createdBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'createdOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'modifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'owningHierachy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.OrganisationTree']"}),
            'owningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'regStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'wflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.entity': {
            'Meta': {'unique_together': "(('model', 'code'),)", 'object_name': 'Entity'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'createdBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'createdOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Model']"}),
            'modifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'modifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'owningHierachy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.OrganisationTree']"}),
            'owningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'regStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'wflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.model': {
            'Meta': {'unique_together': "(('domain', 'code'),)", 'object_name': 'Model'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'createdBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'createdOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'domain': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Domain']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modelPrefix': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'modifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'modifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'owningHierachy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.OrganisationTree']"}),
            'owningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'regStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'wflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.property': {
            'Meta': {'unique_together': "(('entity', 'code'),)", 'object_name': 'Property'},
            'baseType': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'cpFromField': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'cpFromModel': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'createdBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'createdOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'defaultValue': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'propertySet'", 'to': "orm['prototype.Entity']"}),
            'fromModel': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isEssential': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isForeign': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isNullable': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isPrimary': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isReadOnly': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isRequired': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isSensitive': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isUnique': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'modifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'owningHierachy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.OrganisationTree']"}),
            'owningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'propertyChoices': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'propertyModel': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.PropertyModel']", 'null': 'True', 'blank': 'True'}),
            'prpLength': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'regStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'wflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.propertydom': {
            'Meta': {'unique_together': "(('domain', 'code'),)", 'object_name': 'PropertyDom'},
            'baseType': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'createdBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'createdOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'defaultValue': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'domain': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Domain']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isSensitive': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'modifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'owningHierachy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.OrganisationTree']"}),
            'owningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'propertyChoices': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'prpLength': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'regStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'wflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.propertymodel': {
            'Meta': {'unique_together': "(('model', 'code'),)", 'object_name': 'PropertyModel'},
            'baseType': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'createdBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'createdOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'defaultValue': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isSensitive': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Model']"}),
            'modifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'modifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'owningHierachy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.OrganisationTree']"}),
            'owningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'propertyChoices': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'propertyDom': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.PropertyDom']"}),
            'prpLength': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '6', 'decimal_places': '2', 'blank': 'True'}),
            'regStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'wflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.prototable': {
            'Meta': {'object_name': 'ProtoTable'},
            'createdBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'createdOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'entity': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'info': ('protoLib.fields.JSONField', [], {'default': '{}'}),
            'modifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'modifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'owningHierachy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.OrganisationTree']"}),
            'owningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'regStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'wflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.protoviews': {
            'Meta': {'object_name': 'ProtoViews'},
            'createdBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'createdOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Entity']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'modifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'owningHierachy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.OrganisationTree']"}),
            'owningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'regStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'view': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'wflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.relationship': {
            'Meta': {'object_name': 'Relationship', '_ormbases': ['prototype.Property']},
            'baseMax': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'baseMin': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'property_ptr': ('django.db.models.fields.related.OneToOneField', [], {'to': "orm['prototype.Property']", 'unique': 'True', 'primary_key': 'True'}),
            'refEntity': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'fKeysRefSet'", 'to': "orm['prototype.Entity']"}),
            'refMax': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'refMin': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'relatedName': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'sites.site': {
            'Meta': {'ordering': "('domain',)", 'object_name': 'Site', 'db_table': "'django_site'"},
            'domain': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        }
    }

    complete_apps = ['prototype']