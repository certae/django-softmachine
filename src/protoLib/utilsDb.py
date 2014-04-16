# -*- coding: utf-8 -*-

def setDefaults2Obj( pObj, defaults, exclude = []):
    """ Asignas las props q vienen en un dict a un objeto
    """ 
    for key in defaults:
        if key in exclude:
            continue 
        try:
            setattr(pObj, key, defaults[key])    
        except:
            #TODO: Log 
            pass 