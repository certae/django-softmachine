#from cuteModels https://raw.github.com/foxx/django-cutemodel/master/cutemodel/models.py

from django.db import models

class Manager(models.Manager):
    """Provides the ability to access events that don't reference
    any specific pk"""

    _modelmap = None

    def get_events(self):
        return Event.objects.filter(
            model = self._get_modelmap()
        )

    def _get_modelmap(self):
        m = self.model()

        if not self._modelmap:
            obj  = ModelMap.objects.get_or_create(**{
                'app_name' : m._meta.app_label,
                'model_name' : m.__class__.__name__,
                #'table_name' : m._meta.db_table
            })[0]

            self._modelmap = obj

        return self._modelmap

class ModelMap(models.Model):
    """
    Mapping de los modelos 
    To avoid collisions, we store the map against the model name and app name.
    """

    class Meta:
        unique_together = ("app_name", "model_name" )

    app_name = models.CharField(max_length=128, blank=False, null=False)
    model_name = models.CharField(max_length=128, blank=False, null=False)
    
    # No es necesario 
    #table_name = models.CharField(max_length=128, blank=False, null=False)

class FieldMap(models.Model):
    """Same as ModelMap, but for field names"""

    class Meta:
        unique_together = ("model", "field_name")

    model = models.ForeignKey(ModelMap)
    field_name = models.CharField(max_length=128, blank=False, null=False)

class Event(models.Model):
    """Stores events against models"""

    model = models.ForeignKey(ModelMap)
    model_pk = models.IntegerField(max_length=128, blank=True, null=True)

    LOGLEVEL_DEBUG = 1
    LOGLEVEL_NOTICE = 2
    LOGLEVEL_WARN = 3
    LOGLEVEL_ERROR = 4

    LOGLEVEL_CHOICES = (
        (1, 'DEBUG'),
        (2, 'NOTICE'),
        (3, 'WARN'),
        (4, 'ERROR'),
    )
    log_level = models.IntegerField(max_length=128, blank=False, null=False, choices=LOGLEVEL_CHOICES)

    desc = models.TextField(max_length=128, blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    modified = models.DateTimeField(auto_now=True, blank=False, null=False)

    def get_log_level_desc(self):
        return self.get_log_level_display()

    def __str__(self):
        return "<%sEvent object>" % ( self.model.model_name )

    def dump(self):
        print """<%sEvent object:
 level = %s,
 pk =  %s,
 created = %s,
 desc = "%s">""" % ( self.model.model_name, self.get_log_level_desc(), self.model_pk, self.created, self.desc, )

class FieldChange(models.Model):
    """Stores field changes"""

    field = models.ForeignKey(FieldMap)
    model_pk = models.IntegerField(max_length=128, blank=True, null=True)

    old_value = models.TextField(max_length=128, blank=True, null=True)
    new_value = models.TextField(max_length=128, blank=True, null=True)

    created = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    modified = models.DateTimeField(auto_now=True, blank=False, null=False)

    def __str__(self):
        return "<%sFieldChange object>" % ( self.field.model.model_name, )

    def get_field_name(self):
        return self.field.field_name

    def dump(self):
        print """<%sFieldChange object:
 field = %s,
 pk =  %s,
 old_value =  %s,
 new_value =  %s,
 created = %s>""" % ( self.field.model.model_name, self.get_field_name(), self.model_pk, self.old_value, self.new_value, self.created, )

class Model(models.Model):
    class Meta:
        abstract = True

    LOGLEVEL_DEBUG = Event.LOGLEVEL_DEBUG
    LOGLEVEL_NOTICE = Event.LOGLEVEL_NOTICE
    LOGLEVEL_WARN = Event.LOGLEVEL_WARN
    LOGLEVEL_ERROR = Event.LOGLEVEL_ERROR
    LOG_FIELD_CHANGES = True
    STDOUT_VERBOSE = True

    FIELDCHANGE_IGNORE = ('id', 'created', 'modified')

    objects = Manager()

    def __init__(self, *args, **kwargs):
        super(Model, self).__init__(*args, **kwargs)

        # copy for later so we can see what has changed
        self._initial_data = self.__dict__.copy()
        self._current_pk = self.pk

        # temp assign
        self._modelmap = None
        self._fieldmap = {}

    """def __setattr__(self, name, value):
        print value
        if name == self._meta.pk.name:
            raise AttributeError("CuteModel does not support changing the PK (Primary Key / ID) of a row")

        return super(Model, self).__setattr__(name, value)"""

    def get_events(self):
        return Event.objects.filter(
            model = self._get_modelmap()
        )

    def get_field_changes(self):
        return FieldChange.objects.filter(
            field__model = self._get_modelmap()
        )

    def _get_modelmap(self):
        if not self._modelmap:
            obj, created = ModelMap.objects.get_or_create(**{
                'app_name' : self._meta.app_label,
                'model_name' : self.__class__.__name__,
                #'table_name' : self._meta.db_table
            })

            self._modelmap = obj

        return self._modelmap

    def _get_fieldmap(self, field_name):
        if not self._fieldmap.has_key(field_name):
            obj, created = FieldMap.objects.get_or_create(**{
                'model' : self._get_modelmap(),
                'field_name' : field_name
            })

            self._fieldmap[field_name] = obj

        return self._fieldmap[field_name]

    def _log_changes(self):
        """Logs our field changes to the event model"""

        if not self.LOG_FIELD_CHANGES:
            return False

        for x in self._get_dirty_fields():
            f = FieldChange(
                field = self._get_fieldmap(x['field_name']),
                model_pk = self.pk,
                old_value = x['old_value'],
                new_value = x['new_value'],
            )
            f.save()

        self._initial_data = self.__dict__.copy()
        self._current_pk = self.pk

    def _get_dirty_fields(self):
        """Tells us which fields have been changed"""

        _a = []

        for f in self._meta.local_fields:
            if f.name in self.FIELDCHANGE_IGNORE:
                continue

            o_val = self._initial_data.get(f.column)
            n_val = self.__dict__.get(f.column)

            if not o_val == n_val:
                _a.append({
                    'old_value' : o_val,
                    'new_value' : n_val,
                    'field_name' : f.name
                })

        return _a

    def save(self, *args, **kwargs):
        """Triggers method to store any field changes to db"""

        # Ensure the ID isn't being changed
        if self.pk and self._current_pk and (not self._current_pk == self.pk):
            raise Exception, "CuteModel does not support changing the PK (Primary Key / ID) of a row"

        if self.id:
            super(Model, self).save(*args, **kwargs)
            self._log_changes()
        else:
            super(Model, self).save(*args, **kwargs)

        self._current_pk = self.id

    def log(self, desc, log_level = LOGLEVEL_NOTICE):
        """Log an event to the db"""
        e = Event(
            model = self._get_modelmap(),
            model_pk = self._current_pk,
            log_level = log_level,
            desc = desc
        )

        e.save()

