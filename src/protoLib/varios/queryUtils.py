from django.db import models

def map_search_fields_to_query(model_class, search_fields):
    query_fields = {}
    for f in search_fields:
        fname, query_key = expand_search_field(model_class, f)
        query_fields[fname] = query_key
    return query_fields

def expand_search_field(model_class, f):
    if f[0:1] in ['*', '>', '<', '?']:
        fname = f[1:]
        fopt = f[0:1]
    else:
        fname = f
        fopt = None
        
    mf = model_class._meta.get_field_by_name(fname.split('__')[0])
    if mf is not None and isinstance(mf, models.ForeignKey):
        fname.append('_id')
        
    if fopt == '*':
        query_key = "%s__icontains" % fname
    elif fopt == '>':
        query_key = "%s__gte" % fname
    elif fopt == '<':
        query_key = "%s__lte" % fname
    elif fopt == '?':
        query_key = "%s__isnull" % fname
    else:
        query_key = fname
        
    return (fname, query_key)

def map_search_fields_to_form(search_fields):
    form_fields = {}
    for f in search_fields:
        if f[0:1] in ['*', '>', '<', '?']:
            form_fields[f] = f[1:]
        else:
            form_fields[f] = f
    return form_fields

YES=1
NO=0
ANY=''

def model_has_field(model, field_name):
    if isinstance(model, models.base.ModelBase):
        model = model()
    fields = field_name.split('__')
    while len(fields) > 0:
        name = fields[0]
        fields = fields[1:]
        try:
            mf = model._meta.get_field(name)
            if mf is not None and isinstance(mf, models.ForeignKey):
                model = mf.rel.to()
        except:
            return False
    return True

def get_model_value(model, field_name):
    #print "get_model_value(model=%s, field_name=%s)" % (model.__class__.__name__, field_name)
    value = None
    fields = field_name.split('__')
    while len(fields) > 0:
        name = fields[0]
        fields = fields[1:]
        if hasattr(model, name):
            value = getattr(model, name)
            if isinstance(value, models.Model):
                model = value
    return value

def get_model_value_display(model, field_name):
    #print "get_model_value(model=%s, field_name=%s)" % (model.__class__.__name__, field_name)
    value = None
    fields = field_name.split('__')
    while len(fields) > 0:
        name = fields[0]
        fields = fields[1:]
        if hasattr(model, name):
            value = getattr(model, name)
            if isinstance(value, models.Model):
                model = value
            elif hasattr(model, 'get_%s_display'%name):
                value = getattr(model, 'get_%s_display'%name)()
                
    return value

def get_model_field(model, field_name):
    #print "get_model_field(model=%s, field_name=%s)" % (model.__class__.__name__, field_name)
    if isinstance(model, models.base.ModelBase):
        model = model()
    fields = field_name.split('__')
    while len(fields) > 0:
        name = fields[0]
        fields = fields[1:]
        try:
            mf = model._meta.get_field(name)
            if mf is not None and isinstance(mf, models.ForeignKey):
                model = mf.rel.to()
        except:
            #print "ERROR: model: %s has not field %s" % (model.__class__.__name__, name)
            pass
    return mf

    
def corefilter_to_data(model):
    filters = model.core_filters
    data = {}
    #print "Getting data from %s core_filters" % model
    
    for (myFilter, value) in filters.items():
        #print "%s Filter: %s: %s" % (model, myFilter, value)
        fields = myFilter.split('__')
        field_name = fields[0]
        #print "Field_name: %s" % field_name
        while len(fields) > 0:
            name = fields[0]
            fields = fields[1:]
            #print "Name: %s" % name
            try:
                if model.__class__.__name__ == 'ManyRelatedManager' or model.__class__.__name__ == 'RelatedManager':
                    mf = model.model._meta.get_field(name)
                else:
                    mf = model._meta.get_field(name)
                    
                if mf is not None and isinstance(mf, models.ForeignKey):
                    #print "%s is a ForeignKey, traversing..." % name
                    model = mf.rel.to()
            except:
                #print "ERROR: model: %s has not field %s" % (model.__class__.__name__, name)
                pass
        
        #print "Model is %s" % model.__class__.__name__
        if model.__class__.__name__ == 'ManyRelatedManager' or model.__class__.__name__ == 'RelatedManager':
            #print "Model is a RelatedManager"
            for f in model.model._meta.fields:
                #print "Checking field %s" % f.name
                if f.column == name:
                    #print "Matched column %s" % f.column
                    data[field_name] = value
        elif isinstance(model, models.Model):
            #print "Model is a Model"
            for f in model._meta.fields:
                #print "Checking field %s" % f.name
                if f.column == name:
                    #print "Matched column %s" % f.column
                    data[field_name] = value
        else:
            data[field_name] = value
    return data
    