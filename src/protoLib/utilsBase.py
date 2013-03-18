# -*- encoding: utf-8 -*-

# some common routines
# Compiled by : Dgt 11/11


import os
import re

import datetime, operator, decimal
import django.utils.simplejson as json
from django.utils.encoding import smart_str

# Prefijo de las funciones ORM invocadas como campos, __unicode__ para las FK  
#_PROTOFN_ = '_protoFn_'



class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ( datetime.date, datetime.time, datetime.datetime)):
            return obj.isoformat()
        elif isinstance(obj,  decimal.Decimal ):
            return str( obj )
        else:
            return json.JSONEncoder.default(self, obj)    



def verifyList( obj ):
#   Los objetos del admin son en su mayoria del tipo tuple,
#   Es necesario convertirlos a listas por facilidad de trabajo
    if isinstance( obj , basestring ):
        try: obj = json.loads( obj )  
        except : obj = []
    elif isinstance( obj, tuple  ):  
        obj = list( obj )

    if isinstance( obj, list ):
        return obj    
    else: return [] 

def verifyStr( vrBase , vrDefault ):
    sAux = vrBase or vrDefault
    return  u'%s' % sAux 

             
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


def dict2tuple(indict):
    atuple = tuple()
    for item in indict:
        atuple += ((item, indict[item]),)
    #print atuple
    return atuple


def list2dict(alist , key ):
    # Convierte una lista de objetos en dict usando key como llave del dict. 
    aDict = {}
    for item in alist:
        
        #Verifica si es un dict  
        if isinstance( item, dict ):   
            aDict[ item[key] ]  = item 

        # si es un string lo crea con el key por defecto 
        elif isinstance( item, str ):  
            aDict[ item  ]  = { key : { key : item }}
            
    return aDict

     
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
    # regularExp
    #    import re
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
    


# Utilizado para campos q no tienen relacion en el modelo,
class VirtualField(object):
    def __init__(self, name):
        self.name = name


def getReadableError( e ):
    sAux = '<b>ErrType:</b> ' + type( e ).__name__ + '<br>'
    sAux +=  smart_str( e )
    
#    if len( e.args ) > 1: sAux += '<br>' +  str( '; '.join( e.args ))
    return sAux + '<br>'


def strNotNull(  sValue, sDefault ):
    if (sValue is None):
        if (sDefault is None):  
            return "_"
        else: return sDefault 
    else: return sValue 


def copyProps ( objBase, objNew ):
    "Adiciona las propiedades a un objeto base igual q Ext.apply "
    "Todo: xxx.update : un metodo directo para hacerlo "
    for mProp in objNew:
        objBase[ mProp ] = objNew[ mProp ] 

    return objBase 

import unicodedata
def stripAccents(s):
    return ''.join((c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn'))


        
        
def explode(s):
    ''' Uso:   
    explode( 'fName(p1,p2)' ) 
    ['fName', 'p1,p2']
    
    alternativas mas poderosas 
        http://docs.python.org/2/library/ast.html#ast.parse

    import re
    '''
    
    pattern = r'(\w[\w\d_]*)\((.*)\)$'
    match = re.match(pattern, s)
    if match:
        return list(match.groups())
    else:
        return []    

def findBrackets( aString ):
    # busca el primer paraentesis 
    if '(' in aString:
        match = aString.split('(',1)[1]
        openB = 1
        for index in xrange(len(match)):
            if match[index] in '()':
                openB = (openB + 1) if match[index] == '(' else (openB - 1)
            if not openB:
                return match[:index]    


# ------------  Alternativas para la evaluacion de parametros en ud funciones
#
#        
#def balanced_braces(args):
#    #t1 = balanced_braces(["{{ a } { b } { { { c } } } }"]);
#    parts = []
#    for arg in args:
#        if '{' not in arg:
#            continue
#        chars = []
#        n = 0
#        for c in arg:
#            if c == '{':
#                if n > 0:
#                    chars.append(c)
#                n += 1
#            elif c == '}':
#                n -= 1
#                if n > 0:
#                    chars.append(c)
#                elif n == 0:
#                    parts.append(''.join(chars).lstrip().rstrip())
#                    chars = []
#            elif n > 0:
#                chars.append(c)
#    return parts
#        
#
#_mbrack_rb = re.compile("([^{}]*)}") # re.match doesn't have a pos parameter
#def mbrack(s):
#  """Parse matching brackets.
#
#  >>> mbrack("{a}")
#  'a'
#  >>> mbrack("{{a}{b}}")
#  ['a', 'b']
#  >>> mbrack("{{a}{b}{{{c}}}}")
#  ['a', 'b', [['c']]]
#
#  >>> mbrack("a")
#  Traceback (most recent call last):
#  ValueError: expected left bracket
#  >>> mbrack("{a}{b}")
#  Traceback (most recent call last):
#  ValueError: more than one root
#  >>> mbrack("{a")
#  Traceback (most recent call last):
#  ValueError: expected value then right bracket
#  >>> mbrack("{a{}}")
#  Traceback (most recent call last):
#  ValueError: expected value then right bracket
#  >>> mbrack("{a}}")
#  Traceback (most recent call last):
#  ValueError: unbalanced brackets (found right bracket)
#  >>> mbrack("{{a}")
#  Traceback (most recent call last):
#  ValueError: unbalanced brackets (not enough right brackets)
#  """
#  stack = [[]]
#  i, end = 0, len(s)
#  while i < end:
#    if s[i] != "{":
#      raise ValueError("expected left bracket")
#    elif i != 0 and len(stack) == 1:
#      raise ValueError("more than one root")
#    while i < end and s[i] == "{":
#      L = []
#      stack[-1].append(L)
#      stack.append(L)
#      i += 1
#    stack.pop()
#    stack[-1].pop()
#    m = _mbrack_rb.match(s, i)
#    if m is None:
#      raise ValueError("expected value then right bracket")
#    stack[-1].append(m.group(1))
#    i = m.end(0)
#    while i < end and s[i] == "}":
#      if len(stack) == 1:
#        raise ValueError("unbalanced brackets (found right bracket)")
#      stack.pop()
#      i += 1
#  if len(stack) != 1:
#    raise ValueError("unbalanced brackets (not enough right brackets)")
#  return stack[0][0]
#
#
#def main(args):
#  if args:
#    print >>sys.stderr, "unexpected arguments: %r" % args
#  import doctest
#  r = doctest.testmod()
#  print r
#  return r[0]
#
#if __name__ == "__main__":
#  sys.exit(main(sys.argv[1:]))



#import re
from unicodedata import normalize

_punct_re = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^_`{|},.:]+')
#_punct_re = re.compile(r'[\t !"#$%&\'()*\-/<=>?@\[\\\]^`{|},.:]+')

def slugify(text, delim=u'-'):
    """Generates an slightly worse ASCII-only slug.
       Normaliza los nombres para usarlos como codigos
       uso:  slugify(u'My International Text: åäö', delim='_')
    """
    result = []
    for word in _punct_re.split(text.lower()):
        word = normalize('NFKD', word).encode('ascii', 'ignore')
        if word:
            result.append(word)
    
    rText = unicode(delim.join(result)).replace( '--', '-')
     
    return rText 

# #  Alternativa ----------------------------------
#    # encoding: utf-8
#    from unicodedata import normalize
#    import re
#    
#    original = u'ľ š č ť ž ý á í é'
#    decomposed = normalize("NFKD", original)
#    no_accent = ''.join(c for c in decomposed if ord(c)<0x7f)
#    no_spaces = re.sub(r'\s', '_', no_accent)
#    
#    print no_spaces
#    # output: l_s_c_t_z_y_a_i_e

