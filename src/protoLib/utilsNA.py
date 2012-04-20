
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
    
