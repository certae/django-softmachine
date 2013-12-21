'''
Created on 2013-12-21

@author: dario
'''

from protoLib.utilsBase import slugify 

TypeEquivalence = { 
        'bool'      :   'BooleanField',
        'string'    :   'CharField', 
        'date'      :   'DateField', 
        'datetime'  :   'DateTimeField', 
        'decimal'   :   'DecimalField',
        'float'     :   'FloatField',
        'int'       :   'IntegerField',
        'text'      :   'TextField',
        'time'      :   'TimeField',
        'jsonfield' :   'JSONField'       ,
    }


def getClassName( cName ):
    return ''.join( slugify( cName , ' ').title().split() )
