# -*- encoding: utf-8 -*-


import datetime 
from decimal import * 


def toInteger(s , iDefault = None):
    """
    Conversion a entero,  utilizada antes de cargar la Db 
    """
    try:
        iResult = int(s)
        return iResult 
    except ValueError:
        return iDefault


def toFloat(s , iDefault = None):
    """
    Conversion a float,  utilizada antes de cargar la Db 
    """
    try:
        iResult = float(s)
        return iResult 
    except ValueError:
        return iDefault


def toDecimal(s , iDefault = None):
    """
    Conversion a decimal,  utilizada antes de cargar la Db 
    """
    try:
        iResult = Decimal( s)
        return iResult 
    except ValueError:
        return iDefault



def toBoolean(s):
    """
    Conversion a boolean,  utilizada antes de cargar la Db 
    """
    return ( s.lower()[0] in ("y", "t", "o", "s", "1") ) 


def toDate(indatestr):

    if indatestr.count("T")>0:
        (date, time) = indatestr.split("T")
        (an, mois, jour) = date.split('-')
        (h, m, s) = time.split(':')
        return datetime.datetime(int(an), int(mois), int(jour), int(h), int(m), int(s))
    
    elif indatestr.count("/") == '2':
        if indatestr.count(' ')>0:
            (date, time) = indatestr.split(" ")
            (jour, mois, an) = date.split('/')
            (h, m, s) = time.split(':')
            return datetime.datetime(int(an), int(mois), int(jour), int(h), int(m), int(s))
        else:
            (jour, mois, an) = date.split('/')
            return datetime.date(int(an), int(mois), int(jour))

    return None




def isinteger(astring):
    if not astring:
        return False
    import string   
    for char in str(astring):
        if not char in string.digits:
            return False
    return True



#For DateField() :
#'%Y-%m-%d', '%m/%d/%Y', '%m/%d/%y', # '2006-10-25', '10/25/2006', '10/25/06'
#'%b %d %Y', '%b %d, %Y',            # 'Oct 25 2006', 'Oct 25, 2006'
#'%d %b %Y', '%d %b, %Y',            # '25 Oct 2006', '25 Oct, 2006'
#'%B %d %Y', '%B %d, %Y',            # 'October 25 2006', 'October 25, 2006'
#'%d %B %Y', '%d %B, %Y',            # '25 October 2006', '25 October, 2006'
#
#For DateTimeField():
#'%Y-%m-%d %H:%M:%S',     # '2006-10-25 14:30:59'
#'%Y-%m-%d %H:%M',        # '2006-10-25 14:30'
#'%Y-%m-%d',              # '2006-10-25'
#'%m/%d/%Y %H:%M:%S',     # '10/25/2006 14:30:59'
#'%m/%d/%Y %H:%M',        # '10/25/2006 14:30'
#'%m/%d/%Y',              # '10/25/2006'
#'%m/%d/%y %H:%M:%S',     # '10/25/06 14:30:59'
#'%m/%d/%y %H:%M',        # '10/25/06 14:30'
#'%m/%d/%y',              # '10/25/06'

#import time
#from datetime import datetime
#
#time_string = "01/21/2012 14:30:59"
#strp_time = time.strptime(time_string, "%m/%d/%Y %H:%M:%S")
#date_django = datetime.fromtimestamp(time.mktime(strp_time))
