# -*- coding: utf-8 -*-

# Conf Django 
import os, sys 
os.environ['DJANGO_SETTINGS_MODULE'] = 'proto.settings'

from django.core import management
import settings as settings 
management.setup_environ(settings)


# ----------
import django.utils.simplejson as json

from django.db.models.fields import DateField
#from datetime import datetime 
import datetime 

def handler(obj):
    if hasattr(obj, 'isoformat'):
        return obj.isoformat()
#    elif isinstance(obj, ...):
#        return ...
    else:
        raise TypeError, 'Object of type %s with value of %s is not JSON serializable' % (type(obj), repr(obj))
    
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
#        if isinstance(obj, datetime):
#            return obj.strftime('%Y-%m-%dT%H:%M:%S')
        if isinstance(obj, ( datetime.date, datetime.datetime)):
            return obj.isoformat()
        else:
            return json.JSONEncoder.default(self, obj)    


def main():

    dthandler = lambda obj: obj.isoformat() if isinstance(obj, datetime) else None

#    xx = json.dumps(datetime.now(), default=dthandler)

    dato = datetime.datetime.now()

    xx = json.dumps( dato, cls=JSONEncoder )

    
    # In order to see the application
    sys.exit(system.exec_())
    
if __name__ == "__main__":
    main()
