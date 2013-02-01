"""
This is a great way to pack extra data into a model object, where the structure is dynamic, and not relational. 

For instance, if you wanted to store a list of dictionaries. 
The data won't be classically searchable, but you can define pretty much any data construct you'd like, as long as it is JSON-serializable. 
It's especially useful in a JSON heavy application or one that deals with a lot of javascript.

Example (models.py):

from django.db import models
from jsonfield import JSONField

class Sequence(models.Model):
    name = models.CharField(maxlength=25)
    list = JSONField()
Example (shell):

fib = Sequence(name='Fibonacci')
fib.list = [0, 1, 1, 2, 3, 5, 8]
fib.save()

fib = Sequence.objects.get(name='Fibonacci')
fib.list.append(13)
print fib.list
[0, 1, 1, 2, 3, 5, 8, 13]
fib.get_list_json()
"[0, 1, 1, 2, 3, 5, 8, 13]"
Note: You can only save JSON-serializable data. Also, dates will be converted to string-timestamps, because I don't really know what better to do with them. Finally, I'm not sure how to interact with forms yet, so that realm is a bit murky.

""" 
import datetime
from django.db import models
from django.db.models import signals
from django.conf import settings
from django.utils import simplejson as json
from django.dispatch import dispatcher

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, datetime.date):
            return obj.strftime('%Y-%m-%d')
        elif isinstance(obj, datetime.time):
            return obj.strftime('%H:%M:%S')
        return json.JSONEncoder.default(self, obj)
        
def dumps(data):
    return JSONEncoder().encode(data)
    
def loads(str):
    return json.loads(str, encoding=settings.DEFAULT_CHARSET)
    
class JSONField(models.TextField):
    def db_type(self):
        return 'text'
        
    def pre_save(self, model_instance, add):
        value = getattr(model_instance, self.attname, None)
        return dumps(value)
    
    def contribute_to_class(self, cls, name):
        super(JSONField, self).contribute_to_class(cls, name)
        dispatcher.connect(self.post_init, signal=signals.post_init, sender=cls)
        
        def get_json(model_instance):
            return dumps(getattr(model_instance, self.attname, None))
        setattr(cls, 'get_%s_json' % self.name, get_json)
    
        def set_json(model_instance, json):
            return setattr(model_instance, self.attname, loads(json))
        setattr(cls, 'set_%s_json' % self.name, set_json)
    
    def post_init(self, instance=None):
        value = self.value_from_object(instance)
        if (value):
            setattr(instance, self.attname, loads(value))
        else:
            setattr(instance, self.attname, None)
