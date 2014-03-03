import datetime

def SM_copyProps(oBase, oRef, overWrite, lstInclude, lstExclude):

    if (not overWrite) :
        overWrite = True;

    oResult = SM_clone(oBase, 0, lstExclude)
    
    for i in oRef :
        if(overWrite or not oBase[i]) :
            if (not lstInclude or  i in SM_objConv(lstInclude)) :
                oResult[i] = oRef[i]

    return oResult


def SM_getModelName(viewCode) :
    # En principio traia un modelo de base q servia para todas las vistas construidas
    # con el nuevo esquema de creacion dinamica, es mejor q el modelo corresponda a la
    # opcion, pues las definiciones pueden ser totalmente diferentes.

    return viewCode #_SM._PConfig.clsBaseModel + viewCode

def SM_typeOf(value):
    s = type(value)
    
    if (s == dict) :
        if (value) :
            for elem in value :
                s = list
                if (type(elem) != list and  type(elem) != tuple):
                    s = type(value)
                    break
                    #if(Object.prototype.toString.call(value) == '[object Array]'):
                    #    s = list
            
        else :
            s = None
    
    return s


def SM_objConv(a) :
    #Object converter: Para testear si un elto hace parte de un array se convierte el array en objeto
    o = {};
    if (not a) :
        # console.log( '_SM.objConv : no list!!! ')
        return o 

    for i in range(0, len(a), 1) :
        o[a[i]]=''
  
    return o

def SM_clone(obj, auxRec, exclude, include) :
    #
    # @obj     : obj to _SM.clone
    # @auxRec  : Control de recursividad  ( no debe pasar de un max de nivles ie 5 )
    # @exclude : permite excluir propiedades de un diccionario
    #

    # Verificacion de nivel de recursividad en la copia de objetos
    if auxRec  :
        auxRec = auxRec + 1
    else :
        auxRec = 1
        
    if (auxRec > 5) :
        return obj

    # si es un tipo simple,
    print('obj', obj)
    if (obj == None or type(obj)!= dict)  :
        print('0')
        print obj
        return obj

    if (isinstance(obj,datetime.date)) :
        print('3')
        # los objetos tipo date no son tipos de base
        copy = obj
        print copy
        return copy

    elif (isinstance(obj,list)) :
        print('5')
        # Los array son copiados elto by elto.
        copy = []
        len1 = len(obj)
        i = 0
        while i < len1 :
            copy[i] = SM_clone(obj[i], auxRec, exclude, include)
            i +=1
        print copy
        return copy

    elif (obj.get('$class')):
        print('10')
        # Si es una clase, solo copia el initialConfig y un nombre de clase
        copy = {}
        
        if (obj.get('hasOwnProperty') and obj['hasOwnProperty'].get('initialConfig')):
            copy['initialConfig'] = SM_clone(obj['initialConfig'], auxRec, exclude , include )
        
        # if (obj.__proto__.$className ) {copy.className = obj.__proto__.$className}
        print copy
        return copy

    elif (isinstance(obj,dict)) :
        print('L12')
        # Si es un objeto recorre las propiedades y las clona una a una
        print obj
        copy = {}
        for attr in obj : 
            if attr in SM_objConv( ['events', 'renderer'] ) :
                continue
            
            if ((exclude) and (attr in SM_objConv(exclude))) :
                continue
            
            if ((include) and not(attr in SM_objConv(include))) :
                continue

            if (obj.get('hasOwnProperty') and obj['hasOwnProperty'].get(attr)) :
                # console.log ( auxRec,  obj, attr, obj[attr] )
                copy[attr] = SM_clone(obj[attr], auxRec, exclude, include)
 
        return copy
    
