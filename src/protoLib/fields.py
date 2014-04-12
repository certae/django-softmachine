
"""
Example:
#   based on : http://natebeacham.com/blog/nate-beacham/31/
#   DGT 13/01

from protoLib.fields import JSONField,  JSONAwareManager

    class Person(models.Model):
        info = JSONField(default = {})
        objects = JSONAwareManager(json_fields = ['info'])

    ...
    obj = Person.objects.create(name = "Bill")
    obj.info = {
        'sex': 'male',
        'address': {
            'country', 'Canada',
        }
    }
    obj.save()
    Person.objects.filter(info__address__country = 'Canada')
    >>> [Person: "Bill"]

"""
import itertools

from django.db import models

import json
from protoLib.utilsBase import JSONEncoder


class JSONDict(dict):

    def __repr__(self):
        return unicode(json.dumps(self, cls=JSONEncoder, indent=4))


class JSONAwareQuerySet(models.query.QuerySet):
    def __init__(self, json_fields=[], *args, **kwargs):
        self.json_fields = json_fields
        super(JSONAwareQuerySet, self).__init__(*args, **kwargs)

    def _filter_or_exclude(self, negate, *args, **kwargs):
        extra_lookups = {}

        for lookup in kwargs:
            if lookup.split('__')[0] in self.json_fields:
                extra_lookups[lookup] = kwargs[lookup]

        for key in extra_lookups:
            kwargs.pop(key)

        clone = super(JSONAwareQuerySet, self)._filter_or_exclude(negate, *args, **kwargs)

        result = []

        if extra_lookups.keys():
            len(clone)# Fill the cache

            for item, lookup in itertools.product(self, extra_lookups.keys()):
                if not negate and self._evaluate_json_lookup(item, lookup, extra_lookups[lookup]):
                    result.append(item)
                elif negate and not self._evaluate_json_lookup(item, lookup, extra_lookups[lookup]):
                    result.append(item)

            clone._result_cache = result

        return clone

    def _evaluate_json_lookup(self, item, lookup, value):
        oper = 'exact'

        evaluators = {
            'icontains': lambda item, value: item.lower() in value.lower(),
            'contains': lambda item, value: item in value,
            'in': lambda item, value: item in value,
            'iexact': lambda item, value: item.lower() == value.lower(),
            'exact': lambda item, value: item == value,
            'lt': lambda item, value: item < value,
            'lte': lambda item, value: item <= value,
            'gt': lambda item, value: item > value,
            'gte': lambda item, value: item >= value,
            'range': lambda item, value: item >= value[0] and item <= value[1],
        }

        def _getattr(obj, key):
            if isinstance(obj, dict):
                return obj[key]
            return getattr(obj, key)

        if lookup.split('__')[-1] in evaluators.keys():
            oper = lookup.split('__')[-1]
            lookup = '__'.join(lookup.split('__')[:-1])

        field = item

        for key in lookup.split('__'):
            try:
                field = _getattr(field, key)
            except (AttributeError, KeyError):
                return False

        return evaluators[oper](field, value)

    def count(self):
        return super(JSONAwareQuerySet, self).count()

    def all(self):
        return self

    def order_by(self, *args, **kwargs):
        return self

    def _clone(self, *args, **kwargs):
        clone = super(JSONAwareQuerySet, self)._clone(*args, **kwargs)
        clone.json_fields = self.json_fields
        return clone


class JSONAwareManager(models.Manager):
    def __init__(self, json_fields=[], *args, **kwargs):
        self.json_fields = json_fields
        super(JSONAwareManager, self).__init__(*args, **kwargs)

    def get_query_set(self):
        return JSONAwareQuerySet(self.json_fields, self.model)



class JSONField(models.TextField):
    __metaclass__ = models.SubfieldBase

    def to_python(self, value):
        if value:
            if isinstance(value, dict):
                value = JSONDict(value)
            elif isinstance(value, (unicode, str)):
                value = JSONDict(json.loads(value))
        else:
            value = JSONDict()
        return value

    def get_db_prep_save(self, value, *args, **kwargs):
        value = json.dumps(value, cls=JSONEncoder)
        return super(JSONField, self).get_db_prep_save(value, *args, **kwargs)


from south.modelsinspector import add_introspection_rules
add_introspection_rules([], ["^protoLib\.fields\.JSONField"])

