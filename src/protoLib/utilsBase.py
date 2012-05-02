# -*- encoding: utf-8 -*-

# some common routines
# Compiled by : Dgt 11/11


import os
import re

import datetime, operator, decimal
import django.utils.simplejson as json


# Prefijo de las funciones ORM invocadas como campos, __unicode__ para las FK  
_PROTOFN_ = '_protoFn_'


class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ( datetime.date, datetime.time, datetime.datetime)):
            return obj.isoformat()
        elif isinstance(obj,  decimal.Decimal ):
            return str( obj )
        else:
            return json.JSONEncoder.default(self, obj)    


def addFilter( Qs, sFilter ):
#   Agrega un filtro q viene en modo texto a un Qset 
    if (len (sFilter) == 0 ):
        return Qs 

    # Tipo dictionario
    if type( sFilter ) == type({}):
        protoStmt = sFilter
    
    # Filtro String 
    else: 
        try: protoStmt = eval( sFilter )
        except: return Qs 

    Qs = Qs.filter(**protoStmt )
    return Qs 


def verifyList( obj ):
#   DGT:  Los objetos del admin son en su mayoria del tipo tuple,
#   Es necesario convertirlos a listas por facilidad de trabajo 
    if obj is None:  obj = []
    if type( obj ).__name__ != type([]).__name__ :  
        obj = list( obj )
    return obj 


def verifyStr( vrBase , vrDefault ):
    sAux = vrBase or vrDefault
    return  u'%s' % sAux 



def construct_search(field_name):
    if field_name.startswith('^'):
        return "%s__istartswith" % field_name[1:]
    elif field_name.startswith('='):
        return "%s__iexact" % field_name[1:]
    elif field_name.startswith('@'):
        return "%s__search" % field_name[1:]
    else:
        return "%s__icontains" % field_name


    
             
def parseEmailAddress(fullemail, delimitorLeft = '<', delimitorRight = '>'):
    """ 
        split a full name/email pair to name/email tuple 
        matches :
        # julien@bouquillon.com
        # Julien Bouquillon <julien@bouquillon.com>
    """
    
    import re
    if delimitorLeft == '(':
        delimitorLeft = '\\('
    if delimitorRight == ')':
        delimitorRight = '\\)'
        
    reg = re.compile('([^%s\n]+) ?%s?([^%s\r\n]+)?%s?' % (delimitorLeft, delimitorLeft, delimitorRight, delimitorRight) )
    
    matches = reg.findall(fullemail)

    if matches:
        (name, email) = matches[0]
        if email == '': 
            email = name
        return (name, email)
    
    return None
    
def guessNextPath(dst, slugify = True, idx = 0, checkExists = True):
    """ return a renamed path if provided one already exists 
        if slugify, file name is slugified first (fs encodings problems quick & dirty workaround)
    """
    from django.template.defaultfilters import slugify as slugifyer
    newpath = dst
    if idx == 0:
        (path, file) = os.path.split(newpath)
        (file, ext) =  os.path.splitext(file)
        slug = slugifyer(file)

        newpath = os.path.join(path, '%s%s' % (slug, ext))

    if checkExists and os.path.isfile(newpath):
        idx += 1
        name, ext = os.path.splitext(newpath)
        newpath = '%s-copy%s' % (name, ext)
        return guessNextPath(newpath, slugify, idx, checkExists)
        
    return newpath
    
    
def unique_id(more = ''):
    import time
    a = str(time.time())
    import random
    a += '-%s' % str(random.randint(2000, 10000))
    a += '-%s' % str(random.randint(0, 2000))
    a += more
    return a
    
    
    
def reduceDict(inDict, keep_keys):
    """ keep only keep_keys in the dict (return a new one) """
    dict2 = inDict.copy()
    for k in dict2.keys():
        if k not in keep_keys:
            del dict2[k]
    return dict2

def dict_to_dbltuple(indict):
    atuple = tuple()
    for item in indict:
        atuple += ((item, indict[item]),)
    #print atuple
    return atuple
     
def CleanFilePath(inFileName):
    """ assure qu'un nom de fichier n'est bien qu'un nom de fichier (remove slashes) """
    inFileName = os.path.basename(inFileName)
    inFileName = inFileName.replace('/', '')
    inFileName = inFileName.replace('\\', '')
    return inFileName
    
        
def CheckPathSecurity(testPath, rootPath):
    if not os.path.realpath(testPath).startswith(rootPath):
        raise Exception("forbidden path %s !" % os.path.realpath(testPath))
    
def ReadFile(inFile, mode='r'):
    contents = ""
    try:
        f=open(inFile, mode)
        contents = f.read()
        f.close()
    except:
        pass
    return contents
    
def WriteFile(inFile, contents):
    f=open(inFile,'wb')
    f.write(contents)
    f.close()
    
def PathToList(inPath, template_type="", showExt = True):
    import os
    mylist = []
    for file in os.listdir(inPath):
        if file in ['.', '..', '']: continue
        if not os.path.isfile(os.path.join(inPath, file)): continue
        if not showExt: file = os.path.splitext(file)[0]
        mydict = {"name": file, "type": template_type}
        mylist.append(mydict)
    return mylist
      
        
def strip_html(inHtml):
    import re
    inHtml = re.sub(r'<br>', '\n', inHtml)
    inHtml = re.sub(r'</td><td>', ' - ', inHtml)
    inHtml = re.sub(r'</tr>', '\n\n', inHtml)
    inHtml = re.sub(r'</table>', '\n\n', inHtml)
    inHtml = re.sub(r'</p>', '\n\n', inHtml)
    inHtml = re.sub(r'<[^>]*?>', '', inHtml)
    inHtml = re.sub(r'<style>[^>]*</style>', '', inHtml)

    return inHtml
 
def strip_accents(inStr):
    inStr = u'%s' % inStr
    drep = {}
    drep["e"] = u'éêèë'
    drep["a"] = u'àâä'
    drep["i"] = u'îï'
    drep["c"] = u'ç'
    drep["u"] = u'ùû'
    drep["o"] = u'ôòö'
 
    for k in drep.keys():
        for ch in drep[k]:
            inStr = inStr.replace(ch, k)
    return inStr
    
def strip_euro(inStr):
    inStr = u'%s' % inStr
    inStr = inStr.replace(u'€', u'euro(s)')
    return inStr
    



def DateFormatConverter(to_extjs = None, to_python = None):

    """ convert date formats between ext and python """
    f = {}
    f['a'] = 'D'
    f['A'] = 'l'
    f['b'] = 'M'
    f['B'] = 'F'
    #f['c'] = 
    f['d'] = 'd'
    f['H'] = 'H'
    f['I'] = 'h'
    f['j'] = 'z'
    f['m'] = 'm'
    f['M'] = 'i'
    f['p'] = 'A'
    f['S'] = 's'
    f['U'] = 'W'
    #f['w'] = 
    f['W'] = 'W'
    #f['x'] = 
    #f['X'] =
    f['y'] = 'y'
    f['Y'] = 'Y'
    f['Z'] = 'T'
    out = ''
    if to_extjs:
        for char in to_extjs.replace('%',''):
            out += f.get(char, char)

    elif to_python:
        for char in to_python:
            if char in f.values():
                key = [key for key, val in f.items() if f[key] == char][0]
                out += '%%%s' % key
            else:
                out += char
            
    return out
    


#DGT:  Utilizado para campos q no tienen relacion en el modelo,
class VirtualField(object):
    def __init__(self, name):
        self.name = name


