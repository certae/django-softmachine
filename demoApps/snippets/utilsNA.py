
#############################"" XML STUFF 
 
#def xsl_transormation(xslfile, xmlfile = None, xmlstring = None, params={}):
#    from lxml import etree
#    import StringIO
#    xslt_tree = etree.XML(open(xslfile, 'r').read())
#    xml_contents = xmlstring
#    if not xml_contents:
#        if xmlfile:
#            xml_contents = open(xmlfile, 'r').read()
#        else:
#            xml_contents = '<?xml version="1.0"?>\n<foo>A</foo>\n'
#    f = StringIO.StringIO(xml_contents)
#    #print xml_contents
#    doc = etree.parse(f)
#    f.close()
#    transform = etree.XSLT(xslt_tree)
#    #print params
#    result = transform(doc, **params)
#    return result
# 



#def count_files_in_dir(inDir, recursive=True):
#    import os
#    file_count = 0
#    if recursive:
#        for root, dirs, files in os.walk(inDir):
#            file_count += len(files)
#    else:
#        file_count = len(os.walk(path)[2])
#    return file_count
    

from django.contrib.admin.util import  get_fields_from_path

def getTextSearchFields( pSearchFields, model  ) :
#   TODO:  Esto deberia ser un parametro configurable en la pci 
    textSearchFlds = []
    textFilterTypes  = [ 'CharField', 'TextField', 'IntegerField', 'DecimalField', 'FloatField',  ]
    for fName  in pSearchFields:
        try: 
            # Busca el campo en el modelo y joins 
            field = get_fields_from_path( model, fName)[-1]
    
            #field = model._meta.get_field( fName )
            #model = field.rel.to
            #model.famille.field.related.parent_model
        except: continue  
    
        if field.__class__.__name__ in textFilterTypes:
            textSearchFlds.append( fName )   

    return textSearchFlds


#def set_pickle_cookie(response, key, value, days_expire = 7):
#    if days_expire is None:
#        max_age = 365*24*60*60  #one year
#    else:
#        max_age = days_expire*24*60*60 
#    value = pickle.dumps(value)
#    expires = datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
#    response.set_cookie(key, value, max_age=max_age, expires=expires)
#    return response  
#    
#    return pickle.loads(value) 
#    
#def get_pickle_cookie(request, key):
#    value = request.COOKIES.get(key)
#    if value:
#        try:
#            value = pickle.loads(value) 
#        except:
#            print ' * ERROR unpickling cookie %s' % key
#            value = None
#    return value
