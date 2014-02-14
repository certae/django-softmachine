# -*- coding: utf-8 -*-

def setDefaults2Obj(pObj, defaults, exclude=[]):
    """ Asignas las props q vienen en un dict a un objeto
    """
    for key in defaults:
        if key in exclude: continue
        try:
            setattr(pObj, key, defaults[key])
        except:
            # TODO: Log
            pass


def update_or_create(myModel , **kwargs):
    """
    Use the snippet like this:
    
    from django.db import models
    class PersonManager(models.Manager):
        update_or_create = _update_or_create
    
    class Person(models.Model):
        first_name = models.CharField()
        last_name = models.CharField()
        city = models.CharField()
        objects = PersonManager()
    
    person, created, updated = Person.objects.update_or_create(first_name="John",
    last_name="Smith", defaults=dict(city="London"))
    
    The method returns a tuple of (object, created, updated), where created and updated are booleans specifying 
    whether an object was created or updated respectively. Both created and updated are false if object is neither 
    created nor updated (that is object has just been fetched "as is" from db). This happens if the update fails.
    
    basado en : http://djangosnippets.org/snippets/1114/
    
    TODO: implementar transaction
    """

    # create
    try:
        obj, created = myModel.objects.get_or_create(**kwargs)
    except Exception as  e:
        # print getReadableError( e )
#        traceback.print_exc()
        raise e

    if created:
        return obj, True, False

    else:
        # update
        defaults = kwargs.pop('defaults', {})
        try:
            params = dict([(k, v) for k, v in kwargs.items() if '__' not in k])
            params.update(defaults)
            for attr, val in params.items():
                if hasattr(obj, attr):
                    setattr(obj, attr, val)
            obj.save(force_update=True)
            return obj, False, True

        except Exception:
            raise Exception

