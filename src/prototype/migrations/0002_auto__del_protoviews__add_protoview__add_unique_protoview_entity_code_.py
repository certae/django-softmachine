# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Removing unique constraint on 'Property', fields ['code', 'entity']
        db.delete_unique('prototype_property', ['code', 'entity_id'])

        # Removing unique constraint on 'PropertyDom', fields ['domain', 'code']
        db.delete_unique('prototype_propertydom', ['domain_id', 'code'])

        # Removing unique constraint on 'Model', fields ['domain', 'code']
        db.delete_unique('prototype_model', ['domain_id', 'code'])

        # Removing unique constraint on 'Domain', fields ['code']
        db.delete_unique('prototype_domain', ['code'])

        # Removing unique constraint on 'PropertyModel', fields ['model', 'code']
        db.delete_unique('prototype_propertymodel', ['model_id', 'code'])

        # Removing unique constraint on 'Entity', fields ['model', 'code']
        db.delete_unique('prototype_entity', ['model_id', 'code'])

        # Deleting model 'ProtoViews'
        db.delete_table('prototype_protoviews')

        # Adding model 'ProtoView'
        db.create_table('prototype_protoview', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('smOwningUser', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smOwningTeam', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy'])),
            ('smCreatedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smCreatedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smModifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User'])),
            ('smModifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('smRegStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('smWflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Entity'])),
            ('code', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
        ))
        db.send_create_signal('prototype', ['ProtoView'])

        # Adding unique constraint on 'ProtoView', fields ['entity', 'code', 'smOwningTeam']
        db.create_unique('prototype_protoview', ['entity_id', 'code', 'smOwningTeam_id'])

        # Deleting field 'Entity.modifiedOn'
        db.delete_column('prototype_entity', 'modifiedOn')

        # Deleting field 'Entity.owningHierachy'
        db.delete_column('prototype_entity', 'owningHierachy_id')

        # Deleting field 'Entity.createdBy'
        db.delete_column('prototype_entity', 'createdBy_id')

        # Deleting field 'Entity.wflowStatus'
        db.delete_column('prototype_entity', 'wflowStatus')

        # Deleting field 'Entity.owningUser'
        db.delete_column('prototype_entity', 'owningUser_id')

        # Deleting field 'Entity.createdOn'
        db.delete_column('prototype_entity', 'createdOn')

        # Deleting field 'Entity.modifiedBy'
        db.delete_column('prototype_entity', 'modifiedBy_id')

        # Deleting field 'Entity.regStatus'
        db.delete_column('prototype_entity', 'regStatus')

        # Adding field 'Entity.smOwningUser'
        db.add_column('prototype_entity', 'smOwningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Entity.smOwningTeam'
        db.add_column('prototype_entity', 'smOwningTeam',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy']),
                      keep_default=False)

        # Adding field 'Entity.smCreatedBy'
        db.add_column('prototype_entity', 'smCreatedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Entity.smCreatedOn'
        db.add_column('prototype_entity', 'smCreatedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Entity.smModifiedBy'
        db.add_column('prototype_entity', 'smModifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Entity.smModifiedOn'
        db.add_column('prototype_entity', 'smModifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Entity.smRegStatus'
        db.add_column('prototype_entity', 'smRegStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Entity.smWflowStatus'
        db.add_column('prototype_entity', 'smWflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding unique constraint on 'Entity', fields ['model', 'code', 'smOwningTeam']
        db.create_unique('prototype_entity', ['model_id', 'code', 'smOwningTeam_id'])

        # Deleting field 'ProtoTable.modifiedOn'
        db.delete_column('prototype_prototable', 'modifiedOn')

        # Deleting field 'ProtoTable.owningHierachy'
        db.delete_column('prototype_prototable', 'owningHierachy_id')

        # Deleting field 'ProtoTable.createdBy'
        db.delete_column('prototype_prototable', 'createdBy_id')

        # Deleting field 'ProtoTable.wflowStatus'
        db.delete_column('prototype_prototable', 'wflowStatus')

        # Deleting field 'ProtoTable.owningUser'
        db.delete_column('prototype_prototable', 'owningUser_id')

        # Deleting field 'ProtoTable.createdOn'
        db.delete_column('prototype_prototable', 'createdOn')

        # Deleting field 'ProtoTable.modifiedBy'
        db.delete_column('prototype_prototable', 'modifiedBy_id')

        # Deleting field 'ProtoTable.regStatus'
        db.delete_column('prototype_prototable', 'regStatus')

        # Adding field 'ProtoTable.smOwningUser'
        db.add_column('prototype_prototable', 'smOwningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'ProtoTable.smOwningTeam'
        db.add_column('prototype_prototable', 'smOwningTeam',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy']),
                      keep_default=False)

        # Adding field 'ProtoTable.smCreatedBy'
        db.add_column('prototype_prototable', 'smCreatedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'ProtoTable.smCreatedOn'
        db.add_column('prototype_prototable', 'smCreatedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'ProtoTable.smModifiedBy'
        db.add_column('prototype_prototable', 'smModifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'ProtoTable.smModifiedOn'
        db.add_column('prototype_prototable', 'smModifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'ProtoTable.smRegStatus'
        db.add_column('prototype_prototable', 'smRegStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'ProtoTable.smWflowStatus'
        db.add_column('prototype_prototable', 'smWflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'PropertyModel.owningUser'
        db.delete_column('prototype_propertymodel', 'owningUser_id')

        # Deleting field 'PropertyModel.modifiedOn'
        db.delete_column('prototype_propertymodel', 'modifiedOn')

        # Deleting field 'PropertyModel.owningHierachy'
        db.delete_column('prototype_propertymodel', 'owningHierachy_id')

        # Deleting field 'PropertyModel.createdOn'
        db.delete_column('prototype_propertymodel', 'createdOn')

        # Deleting field 'PropertyModel.modifiedBy'
        db.delete_column('prototype_propertymodel', 'modifiedBy_id')

        # Deleting field 'PropertyModel.regStatus'
        db.delete_column('prototype_propertymodel', 'regStatus')

        # Deleting field 'PropertyModel.createdBy'
        db.delete_column('prototype_propertymodel', 'createdBy_id')

        # Deleting field 'PropertyModel.wflowStatus'
        db.delete_column('prototype_propertymodel', 'wflowStatus')

        # Adding field 'PropertyModel.smOwningUser'
        db.add_column('prototype_propertymodel', 'smOwningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'PropertyModel.smOwningTeam'
        db.add_column('prototype_propertymodel', 'smOwningTeam',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy']),
                      keep_default=False)

        # Adding field 'PropertyModel.smCreatedBy'
        db.add_column('prototype_propertymodel', 'smCreatedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'PropertyModel.smCreatedOn'
        db.add_column('prototype_propertymodel', 'smCreatedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyModel.smModifiedBy'
        db.add_column('prototype_propertymodel', 'smModifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'PropertyModel.smModifiedOn'
        db.add_column('prototype_propertymodel', 'smModifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyModel.smRegStatus'
        db.add_column('prototype_propertymodel', 'smRegStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyModel.smWflowStatus'
        db.add_column('prototype_propertymodel', 'smWflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)


        # Changing field 'PropertyModel.prpLength'
        db.alter_column('prototype_propertymodel', 'prpLength', self.gf('django.db.models.fields.IntegerField')(null=True))
        # Adding unique constraint on 'PropertyModel', fields ['model', 'code', 'smOwningTeam']
        db.create_unique('prototype_propertymodel', ['model_id', 'code', 'smOwningTeam_id'])

        # Deleting field 'Domain.modifiedOn'
        db.delete_column('prototype_domain', 'modifiedOn')

        # Deleting field 'Domain.owningHierachy'
        db.delete_column('prototype_domain', 'owningHierachy_id')

        # Deleting field 'Domain.createdBy'
        db.delete_column('prototype_domain', 'createdBy_id')

        # Deleting field 'Domain.wflowStatus'
        db.delete_column('prototype_domain', 'wflowStatus')

        # Deleting field 'Domain.owningUser'
        db.delete_column('prototype_domain', 'owningUser_id')

        # Deleting field 'Domain.createdOn'
        db.delete_column('prototype_domain', 'createdOn')

        # Deleting field 'Domain.modifiedBy'
        db.delete_column('prototype_domain', 'modifiedBy_id')

        # Deleting field 'Domain.regStatus'
        db.delete_column('prototype_domain', 'regStatus')

        # Adding field 'Domain.smOwningUser'
        db.add_column('prototype_domain', 'smOwningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Domain.smOwningTeam'
        db.add_column('prototype_domain', 'smOwningTeam',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy']),
                      keep_default=False)

        # Adding field 'Domain.smCreatedBy'
        db.add_column('prototype_domain', 'smCreatedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Domain.smCreatedOn'
        db.add_column('prototype_domain', 'smCreatedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Domain.smModifiedBy'
        db.add_column('prototype_domain', 'smModifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Domain.smModifiedOn'
        db.add_column('prototype_domain', 'smModifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Domain.smRegStatus'
        db.add_column('prototype_domain', 'smRegStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Domain.smWflowStatus'
        db.add_column('prototype_domain', 'smWflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding unique constraint on 'Domain', fields ['code', 'smOwningTeam']
        db.create_unique('prototype_domain', ['code', 'smOwningTeam_id'])

        # Deleting field 'Model.modifiedOn'
        db.delete_column('prototype_model', 'modifiedOn')

        # Deleting field 'Model.owningHierachy'
        db.delete_column('prototype_model', 'owningHierachy_id')

        # Deleting field 'Model.createdBy'
        db.delete_column('prototype_model', 'createdBy_id')

        # Deleting field 'Model.wflowStatus'
        db.delete_column('prototype_model', 'wflowStatus')

        # Deleting field 'Model.owningUser'
        db.delete_column('prototype_model', 'owningUser_id')

        # Deleting field 'Model.createdOn'
        db.delete_column('prototype_model', 'createdOn')

        # Deleting field 'Model.modifiedBy'
        db.delete_column('prototype_model', 'modifiedBy_id')

        # Deleting field 'Model.regStatus'
        db.delete_column('prototype_model', 'regStatus')

        # Adding field 'Model.smOwningUser'
        db.add_column('prototype_model', 'smOwningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Model.smOwningTeam'
        db.add_column('prototype_model', 'smOwningTeam',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy']),
                      keep_default=False)

        # Adding field 'Model.smCreatedBy'
        db.add_column('prototype_model', 'smCreatedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Model.smCreatedOn'
        db.add_column('prototype_model', 'smCreatedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Model.smModifiedBy'
        db.add_column('prototype_model', 'smModifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Model.smModifiedOn'
        db.add_column('prototype_model', 'smModifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Model.smRegStatus'
        db.add_column('prototype_model', 'smRegStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Model.smWflowStatus'
        db.add_column('prototype_model', 'smWflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding unique constraint on 'Model', fields ['domain', 'code', 'smOwningTeam']
        db.create_unique('prototype_model', ['domain_id', 'code', 'smOwningTeam_id'])

        # Deleting field 'PropertyDom.owningUser'
        db.delete_column('prototype_propertydom', 'owningUser_id')

        # Deleting field 'PropertyDom.modifiedOn'
        db.delete_column('prototype_propertydom', 'modifiedOn')

        # Deleting field 'PropertyDom.owningHierachy'
        db.delete_column('prototype_propertydom', 'owningHierachy_id')

        # Deleting field 'PropertyDom.createdOn'
        db.delete_column('prototype_propertydom', 'createdOn')

        # Deleting field 'PropertyDom.modifiedBy'
        db.delete_column('prototype_propertydom', 'modifiedBy_id')

        # Deleting field 'PropertyDom.regStatus'
        db.delete_column('prototype_propertydom', 'regStatus')

        # Deleting field 'PropertyDom.createdBy'
        db.delete_column('prototype_propertydom', 'createdBy_id')

        # Deleting field 'PropertyDom.wflowStatus'
        db.delete_column('prototype_propertydom', 'wflowStatus')

        # Adding field 'PropertyDom.smOwningUser'
        db.add_column('prototype_propertydom', 'smOwningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'PropertyDom.smOwningTeam'
        db.add_column('prototype_propertydom', 'smOwningTeam',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy']),
                      keep_default=False)

        # Adding field 'PropertyDom.smCreatedBy'
        db.add_column('prototype_propertydom', 'smCreatedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'PropertyDom.smCreatedOn'
        db.add_column('prototype_propertydom', 'smCreatedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyDom.smModifiedBy'
        db.add_column('prototype_propertydom', 'smModifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'PropertyDom.smModifiedOn'
        db.add_column('prototype_propertydom', 'smModifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyDom.smRegStatus'
        db.add_column('prototype_propertydom', 'smRegStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyDom.smWflowStatus'
        db.add_column('prototype_propertydom', 'smWflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)


        # Changing field 'PropertyDom.prpLength'
        db.alter_column('prototype_propertydom', 'prpLength', self.gf('django.db.models.fields.IntegerField')(null=True))
        # Adding unique constraint on 'PropertyDom', fields ['domain', 'code', 'smOwningTeam']
        db.create_unique('prototype_propertydom', ['domain_id', 'code', 'smOwningTeam_id'])

        # Deleting field 'Property.modifiedOn'
        db.delete_column('prototype_property', 'modifiedOn')

        # Deleting field 'Property.owningHierachy'
        db.delete_column('prototype_property', 'owningHierachy_id')

        # Deleting field 'Property.wflowStatus'
        db.delete_column('prototype_property', 'wflowStatus')

        # Deleting field 'Property.modifiedBy'
        db.delete_column('prototype_property', 'modifiedBy_id')

        # Deleting field 'Property.regStatus'
        db.delete_column('prototype_property', 'regStatus')

        # Deleting field 'Property.cpFromZoom'
        db.delete_column('prototype_property', 'cpFromZoom')

        # Deleting field 'Property.createdBy'
        db.delete_column('prototype_property', 'createdBy_id')

        # Deleting field 'Property.owningUser'
        db.delete_column('prototype_property', 'owningUser_id')

        # Deleting field 'Property.cpFromField'
        db.delete_column('prototype_property', 'cpFromField')

        # Deleting field 'Property.createdOn'
        db.delete_column('prototype_property', 'createdOn')

        # Adding field 'Property.smOwningUser'
        db.add_column('prototype_property', 'smOwningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Property.smOwningTeam'
        db.add_column('prototype_property', 'smOwningTeam',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['protoLib.TeamHierarchy']),
                      keep_default=False)

        # Adding field 'Property.smCreatedBy'
        db.add_column('prototype_property', 'smCreatedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Property.smCreatedOn'
        db.add_column('prototype_property', 'smCreatedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Property.smModifiedBy'
        db.add_column('prototype_property', 'smModifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(blank=True, related_name='+', null=True, to=orm['auth.User']),
                      keep_default=False)

        # Adding field 'Property.smModifiedOn'
        db.add_column('prototype_property', 'smModifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Property.smRegStatus'
        db.add_column('prototype_property', 'smRegStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Property.smWflowStatus'
        db.add_column('prototype_property', 'smWflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Property.crudType'
        db.add_column('prototype_property', 'crudType',
                      self.gf('django.db.models.fields.CharField')(max_length=20, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Property.secuence'
        db.add_column('prototype_property', 'secuence',
                      self.gf('django.db.models.fields.IntegerField')(null=True, blank=True),
                      keep_default=False)


        # Changing field 'Property.prpLength'
        db.alter_column('prototype_property', 'prpLength', self.gf('django.db.models.fields.IntegerField')(null=True))
        # Adding unique constraint on 'Property', fields ['code', 'smOwningTeam', 'entity']
        db.create_unique('prototype_property', ['code', 'smOwningTeam_id', 'entity_id'])


    def backwards(self, orm):
        # Removing unique constraint on 'Property', fields ['code', 'smOwningTeam', 'entity']
        db.delete_unique('prototype_property', ['code', 'smOwningTeam_id', 'entity_id'])

        # Removing unique constraint on 'PropertyDom', fields ['domain', 'code', 'smOwningTeam']
        db.delete_unique('prototype_propertydom', ['domain_id', 'code', 'smOwningTeam_id'])

        # Removing unique constraint on 'Model', fields ['domain', 'code', 'smOwningTeam']
        db.delete_unique('prototype_model', ['domain_id', 'code', 'smOwningTeam_id'])

        # Removing unique constraint on 'Domain', fields ['code', 'smOwningTeam']
        db.delete_unique('prototype_domain', ['code', 'smOwningTeam_id'])

        # Removing unique constraint on 'PropertyModel', fields ['model', 'code', 'smOwningTeam']
        db.delete_unique('prototype_propertymodel', ['model_id', 'code', 'smOwningTeam_id'])

        # Removing unique constraint on 'Entity', fields ['model', 'code', 'smOwningTeam']
        db.delete_unique('prototype_entity', ['model_id', 'code', 'smOwningTeam_id'])

        # Removing unique constraint on 'ProtoView', fields ['entity', 'code', 'smOwningTeam']
        db.delete_unique('prototype_protoview', ['entity_id', 'code', 'smOwningTeam_id'])

        # Adding model 'ProtoViews'
        db.create_table('prototype_protoviews', (
            ('modifiedOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('owningHierachy', self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['protoLib.OrganisationTree'], blank=True)),
            ('entity', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['prototype.Entity'])),
            ('createdBy', self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True)),
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('wflowStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('owningUser', self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True)),
            ('createdOn', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True)),
            ('modifiedBy', self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True)),
            ('regStatus', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('view', self.gf('django.db.models.fields.CharField')(max_length=200)),
        ))
        db.send_create_signal('prototype', ['ProtoViews'])

        # Deleting model 'ProtoView'
        db.delete_table('prototype_protoview')

        # Adding field 'Entity.modifiedOn'
        db.add_column('prototype_entity', 'modifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Entity.owningHierachy'
        db.add_column('prototype_entity', 'owningHierachy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['protoLib.OrganisationTree'], blank=True),
                      keep_default=False)

        # Adding field 'Entity.createdBy'
        db.add_column('prototype_entity', 'createdBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Entity.wflowStatus'
        db.add_column('prototype_entity', 'wflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Entity.owningUser'
        db.add_column('prototype_entity', 'owningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Entity.createdOn'
        db.add_column('prototype_entity', 'createdOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Entity.modifiedBy'
        db.add_column('prototype_entity', 'modifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Entity.regStatus'
        db.add_column('prototype_entity', 'regStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'Entity.smOwningUser'
        db.delete_column('prototype_entity', 'smOwningUser_id')

        # Deleting field 'Entity.smOwningTeam'
        db.delete_column('prototype_entity', 'smOwningTeam_id')

        # Deleting field 'Entity.smCreatedBy'
        db.delete_column('prototype_entity', 'smCreatedBy_id')

        # Deleting field 'Entity.smCreatedOn'
        db.delete_column('prototype_entity', 'smCreatedOn')

        # Deleting field 'Entity.smModifiedBy'
        db.delete_column('prototype_entity', 'smModifiedBy_id')

        # Deleting field 'Entity.smModifiedOn'
        db.delete_column('prototype_entity', 'smModifiedOn')

        # Deleting field 'Entity.smRegStatus'
        db.delete_column('prototype_entity', 'smRegStatus')

        # Deleting field 'Entity.smWflowStatus'
        db.delete_column('prototype_entity', 'smWflowStatus')

        # Adding unique constraint on 'Entity', fields ['model', 'code']
        db.create_unique('prototype_entity', ['model_id', 'code'])

        # Adding field 'ProtoTable.modifiedOn'
        db.add_column('prototype_prototable', 'modifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'ProtoTable.owningHierachy'
        db.add_column('prototype_prototable', 'owningHierachy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['protoLib.OrganisationTree'], blank=True),
                      keep_default=False)

        # Adding field 'ProtoTable.createdBy'
        db.add_column('prototype_prototable', 'createdBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'ProtoTable.wflowStatus'
        db.add_column('prototype_prototable', 'wflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'ProtoTable.owningUser'
        db.add_column('prototype_prototable', 'owningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'ProtoTable.createdOn'
        db.add_column('prototype_prototable', 'createdOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'ProtoTable.modifiedBy'
        db.add_column('prototype_prototable', 'modifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'ProtoTable.regStatus'
        db.add_column('prototype_prototable', 'regStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'ProtoTable.smOwningUser'
        db.delete_column('prototype_prototable', 'smOwningUser_id')

        # Deleting field 'ProtoTable.smOwningTeam'
        db.delete_column('prototype_prototable', 'smOwningTeam_id')

        # Deleting field 'ProtoTable.smCreatedBy'
        db.delete_column('prototype_prototable', 'smCreatedBy_id')

        # Deleting field 'ProtoTable.smCreatedOn'
        db.delete_column('prototype_prototable', 'smCreatedOn')

        # Deleting field 'ProtoTable.smModifiedBy'
        db.delete_column('prototype_prototable', 'smModifiedBy_id')

        # Deleting field 'ProtoTable.smModifiedOn'
        db.delete_column('prototype_prototable', 'smModifiedOn')

        # Deleting field 'ProtoTable.smRegStatus'
        db.delete_column('prototype_prototable', 'smRegStatus')

        # Deleting field 'ProtoTable.smWflowStatus'
        db.delete_column('prototype_prototable', 'smWflowStatus')

        # Adding field 'PropertyModel.owningUser'
        db.add_column('prototype_propertymodel', 'owningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'PropertyModel.modifiedOn'
        db.add_column('prototype_propertymodel', 'modifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyModel.owningHierachy'
        db.add_column('prototype_propertymodel', 'owningHierachy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['protoLib.OrganisationTree'], blank=True),
                      keep_default=False)

        # Adding field 'PropertyModel.createdOn'
        db.add_column('prototype_propertymodel', 'createdOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyModel.modifiedBy'
        db.add_column('prototype_propertymodel', 'modifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'PropertyModel.regStatus'
        db.add_column('prototype_propertymodel', 'regStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyModel.createdBy'
        db.add_column('prototype_propertymodel', 'createdBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'PropertyModel.wflowStatus'
        db.add_column('prototype_propertymodel', 'wflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'PropertyModel.smOwningUser'
        db.delete_column('prototype_propertymodel', 'smOwningUser_id')

        # Deleting field 'PropertyModel.smOwningTeam'
        db.delete_column('prototype_propertymodel', 'smOwningTeam_id')

        # Deleting field 'PropertyModel.smCreatedBy'
        db.delete_column('prototype_propertymodel', 'smCreatedBy_id')

        # Deleting field 'PropertyModel.smCreatedOn'
        db.delete_column('prototype_propertymodel', 'smCreatedOn')

        # Deleting field 'PropertyModel.smModifiedBy'
        db.delete_column('prototype_propertymodel', 'smModifiedBy_id')

        # Deleting field 'PropertyModel.smModifiedOn'
        db.delete_column('prototype_propertymodel', 'smModifiedOn')

        # Deleting field 'PropertyModel.smRegStatus'
        db.delete_column('prototype_propertymodel', 'smRegStatus')

        # Deleting field 'PropertyModel.smWflowStatus'
        db.delete_column('prototype_propertymodel', 'smWflowStatus')


        # Changing field 'PropertyModel.prpLength'
        db.alter_column('prototype_propertymodel', 'prpLength', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2))
        # Adding unique constraint on 'PropertyModel', fields ['model', 'code']
        db.create_unique('prototype_propertymodel', ['model_id', 'code'])

        # Adding field 'Domain.modifiedOn'
        db.add_column('prototype_domain', 'modifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Domain.owningHierachy'
        db.add_column('prototype_domain', 'owningHierachy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['protoLib.OrganisationTree'], blank=True),
                      keep_default=False)

        # Adding field 'Domain.createdBy'
        db.add_column('prototype_domain', 'createdBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Domain.wflowStatus'
        db.add_column('prototype_domain', 'wflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Domain.owningUser'
        db.add_column('prototype_domain', 'owningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Domain.createdOn'
        db.add_column('prototype_domain', 'createdOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Domain.modifiedBy'
        db.add_column('prototype_domain', 'modifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Domain.regStatus'
        db.add_column('prototype_domain', 'regStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'Domain.smOwningUser'
        db.delete_column('prototype_domain', 'smOwningUser_id')

        # Deleting field 'Domain.smOwningTeam'
        db.delete_column('prototype_domain', 'smOwningTeam_id')

        # Deleting field 'Domain.smCreatedBy'
        db.delete_column('prototype_domain', 'smCreatedBy_id')

        # Deleting field 'Domain.smCreatedOn'
        db.delete_column('prototype_domain', 'smCreatedOn')

        # Deleting field 'Domain.smModifiedBy'
        db.delete_column('prototype_domain', 'smModifiedBy_id')

        # Deleting field 'Domain.smModifiedOn'
        db.delete_column('prototype_domain', 'smModifiedOn')

        # Deleting field 'Domain.smRegStatus'
        db.delete_column('prototype_domain', 'smRegStatus')

        # Deleting field 'Domain.smWflowStatus'
        db.delete_column('prototype_domain', 'smWflowStatus')

        # Adding unique constraint on 'Domain', fields ['code']
        db.create_unique('prototype_domain', ['code'])

        # Adding field 'Model.modifiedOn'
        db.add_column('prototype_model', 'modifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Model.owningHierachy'
        db.add_column('prototype_model', 'owningHierachy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['protoLib.OrganisationTree'], blank=True),
                      keep_default=False)

        # Adding field 'Model.createdBy'
        db.add_column('prototype_model', 'createdBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Model.wflowStatus'
        db.add_column('prototype_model', 'wflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Model.owningUser'
        db.add_column('prototype_model', 'owningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Model.createdOn'
        db.add_column('prototype_model', 'createdOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Model.modifiedBy'
        db.add_column('prototype_model', 'modifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Model.regStatus'
        db.add_column('prototype_model', 'regStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'Model.smOwningUser'
        db.delete_column('prototype_model', 'smOwningUser_id')

        # Deleting field 'Model.smOwningTeam'
        db.delete_column('prototype_model', 'smOwningTeam_id')

        # Deleting field 'Model.smCreatedBy'
        db.delete_column('prototype_model', 'smCreatedBy_id')

        # Deleting field 'Model.smCreatedOn'
        db.delete_column('prototype_model', 'smCreatedOn')

        # Deleting field 'Model.smModifiedBy'
        db.delete_column('prototype_model', 'smModifiedBy_id')

        # Deleting field 'Model.smModifiedOn'
        db.delete_column('prototype_model', 'smModifiedOn')

        # Deleting field 'Model.smRegStatus'
        db.delete_column('prototype_model', 'smRegStatus')

        # Deleting field 'Model.smWflowStatus'
        db.delete_column('prototype_model', 'smWflowStatus')

        # Adding unique constraint on 'Model', fields ['domain', 'code']
        db.create_unique('prototype_model', ['domain_id', 'code'])

        # Adding field 'PropertyDom.owningUser'
        db.add_column('prototype_propertydom', 'owningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'PropertyDom.modifiedOn'
        db.add_column('prototype_propertydom', 'modifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyDom.owningHierachy'
        db.add_column('prototype_propertydom', 'owningHierachy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['protoLib.OrganisationTree'], blank=True),
                      keep_default=False)

        # Adding field 'PropertyDom.createdOn'
        db.add_column('prototype_propertydom', 'createdOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyDom.modifiedBy'
        db.add_column('prototype_propertydom', 'modifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'PropertyDom.regStatus'
        db.add_column('prototype_propertydom', 'regStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'PropertyDom.createdBy'
        db.add_column('prototype_propertydom', 'createdBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'PropertyDom.wflowStatus'
        db.add_column('prototype_propertydom', 'wflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'PropertyDom.smOwningUser'
        db.delete_column('prototype_propertydom', 'smOwningUser_id')

        # Deleting field 'PropertyDom.smOwningTeam'
        db.delete_column('prototype_propertydom', 'smOwningTeam_id')

        # Deleting field 'PropertyDom.smCreatedBy'
        db.delete_column('prototype_propertydom', 'smCreatedBy_id')

        # Deleting field 'PropertyDom.smCreatedOn'
        db.delete_column('prototype_propertydom', 'smCreatedOn')

        # Deleting field 'PropertyDom.smModifiedBy'
        db.delete_column('prototype_propertydom', 'smModifiedBy_id')

        # Deleting field 'PropertyDom.smModifiedOn'
        db.delete_column('prototype_propertydom', 'smModifiedOn')

        # Deleting field 'PropertyDom.smRegStatus'
        db.delete_column('prototype_propertydom', 'smRegStatus')

        # Deleting field 'PropertyDom.smWflowStatus'
        db.delete_column('prototype_propertydom', 'smWflowStatus')


        # Changing field 'PropertyDom.prpLength'
        db.alter_column('prototype_propertydom', 'prpLength', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2))
        # Adding unique constraint on 'PropertyDom', fields ['domain', 'code']
        db.create_unique('prototype_propertydom', ['domain_id', 'code'])

        # Adding field 'Property.modifiedOn'
        db.add_column('prototype_property', 'modifiedOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Property.owningHierachy'
        db.add_column('prototype_property', 'owningHierachy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['protoLib.OrganisationTree'], blank=True),
                      keep_default=False)

        # Adding field 'Property.wflowStatus'
        db.add_column('prototype_property', 'wflowStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Property.modifiedBy'
        db.add_column('prototype_property', 'modifiedBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Property.regStatus'
        db.add_column('prototype_property', 'regStatus',
                      self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Property.cpFromZoom'
        db.add_column('prototype_property', 'cpFromZoom',
                      self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Property.createdBy'
        db.add_column('prototype_property', 'createdBy',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Property.owningUser'
        db.add_column('prototype_property', 'owningUser',
                      self.gf('django.db.models.fields.related.ForeignKey')(related_name='+', null=True, to=orm['auth.User'], blank=True),
                      keep_default=False)

        # Adding field 'Property.cpFromField'
        db.add_column('prototype_property', 'cpFromField',
                      self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True),
                      keep_default=False)

        # Adding field 'Property.createdOn'
        db.add_column('prototype_property', 'createdOn',
                      self.gf('django.db.models.fields.DateTimeField')(auto_now=True, null=True, blank=True),
                      keep_default=False)

        # Deleting field 'Property.smOwningUser'
        db.delete_column('prototype_property', 'smOwningUser_id')

        # Deleting field 'Property.smOwningTeam'
        db.delete_column('prototype_property', 'smOwningTeam_id')

        # Deleting field 'Property.smCreatedBy'
        db.delete_column('prototype_property', 'smCreatedBy_id')

        # Deleting field 'Property.smCreatedOn'
        db.delete_column('prototype_property', 'smCreatedOn')

        # Deleting field 'Property.smModifiedBy'
        db.delete_column('prototype_property', 'smModifiedBy_id')

        # Deleting field 'Property.smModifiedOn'
        db.delete_column('prototype_property', 'smModifiedOn')

        # Deleting field 'Property.smRegStatus'
        db.delete_column('prototype_property', 'smRegStatus')

        # Deleting field 'Property.smWflowStatus'
        db.delete_column('prototype_property', 'smWflowStatus')

        # Deleting field 'Property.crudType'
        db.delete_column('prototype_property', 'crudType')

        # Deleting field 'Property.secuence'
        db.delete_column('prototype_property', 'secuence')


        # Changing field 'Property.prpLength'
        db.alter_column('prototype_property', 'prpLength', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=6, decimal_places=2))
        # Adding unique constraint on 'Property', fields ['code', 'entity']
        db.create_unique('prototype_property', ['code', 'entity_id'])


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
        'protoLib.teamhierarchy': {
            'Meta': {'object_name': 'TeamHierarchy'},
            'code': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'parentNode': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'downHierachy'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'site': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['sites.Site']", 'null': 'True', 'blank': 'True'})
        },
        'prototype.domain': {
            'Meta': {'unique_together': "(('code', 'smOwningTeam'),)", 'object_name': 'Domain'},
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
            'Meta': {'unique_together': "(('domain', 'code', 'smOwningTeam'),)", 'object_name': 'Model'},
            'category': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'domain': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Domain']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modelPrefix': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
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
            'baseType': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'crudType': ('django.db.models.fields.CharField', [], {'max_length': '20', 'null': 'True', 'blank': 'True'}),
            'defaultValue': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "'propertySet'", 'to': "orm['prototype.Entity']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isEssential': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isForeign': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isNullable': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isPrimary': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isReadOnly': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isRequired': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isSensitive': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'isUnique': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'propertyChoices': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'propertyModel': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.PropertyModel']", 'null': 'True', 'blank': 'True'}),
            'prpLength': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'secuence': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.propertydom': {
            'Meta': {'unique_together': "(('domain', 'code', 'smOwningTeam'),)", 'object_name': 'PropertyDom'},
            'baseType': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'defaultValue': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'domain': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Domain']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isSensitive': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'propertyChoices': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'prpLength': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.propertymodel': {
            'Meta': {'unique_together': "(('model', 'code', 'smOwningTeam'),)", 'object_name': 'PropertyModel'},
            'baseType': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'defaultValue': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'isSensitive': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'model': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Model']"}),
            'propertyChoices': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'propertyDom': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.PropertyDom']"}),
            'prpLength': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'smCreatedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smCreatedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smModifiedBy': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smModifiedOn': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'null': 'True', 'blank': 'True'}),
            'smOwningTeam': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['protoLib.TeamHierarchy']"}),
            'smOwningUser': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'related_name': "'+'", 'null': 'True', 'to': "orm['auth.User']"}),
            'smRegStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'smWflowStatus': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        'prototype.prototable': {
            'Meta': {'object_name': 'ProtoTable'},
            'entity': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
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
        'prototype.protoview': {
            'Meta': {'unique_together': "(('entity', 'code', 'smOwningTeam'),)", 'object_name': 'ProtoView'},
            'code': ('django.db.models.fields.CharField', [], {'max_length': '200'}),
            'description': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'entity': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['prototype.Entity']"}),
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