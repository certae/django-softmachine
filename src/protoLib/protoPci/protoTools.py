#/*global Ext, _SM, _MetaObjects  */
#/*global Meta2Tree, Tree2Meta */

import json
from pciObjects import _MetaObjects
from pciProperties import getSimpleProperties



#------------------------------------------Embeded functions------------------------------------------
def doFinalFormat(tData, oData, ptType) :
    if ('name' in oData.keys()) :
        tData['text'] = oData['name']
        return tData
    
    if ('menuText' in oData.keys()) :
        tData['text'] = oData['menuText']
        return tData
    
    if ('property' in oData.keys()) :
        tData['text'] = oData['property']
        return tData
    
    if ('viewEntity' in oData.keys()) :
        tData['text'] = oData['viewEntity']
        return tData
    
    tData['text'] = ptType
    return tData


def formContainer2Tree( items, ptType ) :
    # Aqui solo llegan los contenedores de la forma,  ( hideItems : true )
    
    tItems = []
    for sKey in items :
        
        oData = sKey
            
        __ptConfig = getSimpleProperties(oData , ptType)
        #if ('__ptType' in __ptConfig.keys()) :
        ptType = __ptConfig['__ptType']

        #  contenedores de la forma
        if ptType in ['htmlset','fieldset','tabpanel','accordeon','panel'] :

            cName = ptType
            if(ptType == 'fieldset'):

                if('title' in __ptConfig.keys()):
                    cName += ' - ' + __ptConfig['title']
                else :
                    cName += ' - ' + 'undefined'
            
            t2Data = getNodeBase( cName, ptType, __ptConfig )
            t2Data['children'] = formContainer2Tree( oData['items'], ptType )
            tItems.append(t2Data)

        elif ptType in ['formField','protoGrid', 'detailButton'] :

                if ptType == 'protoGrid':
                    t2Data = getNodeBase(__ptConfig['menuText'], ptType, __ptConfig)
                    
                elif ptType == 'detailButton':
                    t2Data = getNodeBase(__ptConfig['text'], ptType, __ptConfig)

                else :
                    t2Data = getNodeBase(__ptConfig['name'], ptType, __ptConfig)
                
                t2Data['leaf'] = True
                tItems.append(t2Data)

            #else :
                #print( "Error formContainer2Tree", oData )
        
    return tItems


def getSpecialNodes(nodeDef, treeData, objData, ptType) :
    # Recibe el treeData y lo configura en caso de nodos especiales
    # retorna true si fue configurado
    # Form ( debe manejar el raiz sin el marco de items )
    
    nDF= nodeDef
    if(type(nodeDef)== dict):
        nDF = nodeDef.keys()
        
    
    if ('hideItems' in nDF) :
        if('items' in objData.keys()):
            treeData['children'] = formContainer2Tree(objData['items'], ptType)
            return True
                
        else :
            treeData['children'] = formContainer2Tree(objData, ptType)
            return True
            
   
    if (('__ptStyle' in nDF ) and (nodeDef['__ptStyle'] == 'jsonText')) :
        if ('name' in objData.keys()):
            treeData['__ptConfig']['name'] = objData['name']

        treeData['__ptConfig']['__ptValue'] =  json.dumps(objData)
        return True
            

    if (('__ptStyle' in nDF) and (nodeDef['__ptStyle'] == 'colList')) :
        treeData['__ptConfig']['__ptList'] =  json.dumps(objData)
        return True
                
        

def Array2Tree(oList, ptType, tNode, pName) :
    # REcibe un array y genera los hijos,
    # @tNode   referencia al nodo base
    # @ptType  tipo de nodo hijo
    # @oList    objeto lista de la meta
    
    nodeDef = _MetaObjects[ptType]

    for sKey in oList :
        oData = sKey
        tChild = Meta2Tree(oData, pName, ptType)
        tNode['children'].append(tChild) 
            

def verifyNodeDef(nodeDef) :
    # Verifica las listas y objetos
    
    if ('lists' in nodeDef.keys()):
        if (type(nodeDef['lists']) != list) :
            nodeDef['lists'] = []

        else :
            for ix in nodeDef['lists'] :
                sKey = ix

                if (type(sKey) !=  str) :
                    nodeDef['lists'].remove(ix) 
                    continue
                    
                childConf = _MetaObjects[sKey]
                if (('__ptStyle' in childConf.keys()) and ((childConf['__ptStyle']== 'colList') or (childConf['__ptStyle']  == 'jsonText'))) :
                    continue
                   
                if (not 'listOf' in childConf.keys()) :
                    #print( 'pciObjects no se encontro listOf para ' + sKey  )
                    continue

    if ('objects' in nodeDef.keys()) :
        if (type( nodeDef['objects'] ) != list ) :
            #print('pciObjects definicion errada de objects para ' + ptType )
            nodeDef['lists'] = []
                
        else :
            for ix in nodeDef['objects'] :
                sKey = ix
                if (type(sKey)  !=  str) :
                    #print( 'pciObjects definicion errada en objects ' + ptType + ' key ' , sKey  )
                    continue





def getNodeBase( pName, ptType, __ptConfig  ) :
    # Obtiene un Id y genera  una referencia cruzada de la pcl con el arbol
    # El modelo debe crear la referencia a la data o se perdera en el treeStore

    return  {
        'id'            :  '?',
        'text'          :  pName,
        '__ptType'      :  ptType,
        '__ptConfig'    :  __ptConfig,
        'children'      :  []
    }                  
#------------------------------------------Meta2Tree------------------------------------------  

def Meta2Tree(oData, pName, ptType) :
    #Convierte la meta en treeStore ( Arbol )
    # Input    ---------------------------------
    # @oData     : Data a convertir
    # @pName     : property Name ( iteraction en el objeto padre, en el caso de las formas )
    # @ptType    : property Type ( Tipo del padre en caso de ser un array  )
    # Return   -------------------------------
    # @tData   treeData
    # Initial validation  --------------------------------------------

    if (not ptType in _MetaObjects.keys()) :
        return
    
    nodeDef = _MetaObjects[ptType]

    #   Function body  --------------------------------------------
    __ptConfig = getSimpleProperties(oData, ptType)
    tData = getNodeBase(ptType, ptType, __ptConfig)

    if(getSpecialNodes(nodeDef, tData, oData, ptType)):
        return doFinalFormat(tData, oData, ptType)


    # es una lista  lista, se hace el mismo recorrido ( solo en caso de una lista de listas )
    if ('listOf' in nodeDef.keys()) :
        Array2Tree(oData, ptType, tData)

    # Verifica q la definicion este bien hecha
    verifyNodeDef(nodeDef)

    # Recorre las listas

    if ('lists' in nodeDef.keys()) :
        for ix in nodeDef['lists'] :

            sKey = ix
            childConf = _MetaObjects[sKey],
            tChild = getNodeBase(sKey, sKey, {'__ptType' : sKey} )

            if (not getSpecialNodes(childConf[0], tChild, oData[sKey], ptType)) :
                if ('listOf' in childConf[0].keys()) :
                    Array2Tree(oData[sKey], childConf[0]['listOf'], tChild, pName)
                            
                else :
                    Array2Tree(oData[sKey], childConf['listOf'], tChild, pName)
                

            #agrega la base de la lista
            tData['children'].append(tChild)


    # Recorre los objetos
    if ('objects' in nodeDef.keys()) :
        for ix in nodeDef['objects'] :
            sKey = ix
            #Obtiene el objeto de la meta, lo convierte y lo genera
            tChild = Meta2Tree( oData[sKey], sKey, sKey)
            tData['children'].append(tChild)

    # Asigna el nombre al nodo en caso de objetos
    return doFinalFormat(tData, oData, ptType)



#------------------------------------------Embeded functions------------------------------------------

def getChilds( tChilds, mData , sType) :    
    # Recorre los hijos para crear los objetos segun su tipo
    for ix in tChilds :
        lNode = ix
        nChildData = Tree2Meta(lNode)

        if (sType == dict) : 
            mData[getPtType(lNode)] = nChildData
        else :
            mData.append(nChildData)

            
def getNodeInfo(tNode) :
    from protoLib.protoPci.pciObjects import clearPhantonProps
    tData = {}
    myObj  = {}
    if('data' in tNode.keys()) :
        tData = tNode['data']
        myObj['tChilds'] =  tNode['childNodes']
        
    else :
        tData = tNode
        myObj['tChilds'] =  tNode['children']
        
    myObj['__ptType'] = tData['__ptType']
    if (not('__ptConfig' in tData.keys())) :
        myObj['__ptConfig'] = {}
        return myObj

    myObj['__ptConfig'] = clearPhantonProps(tData['__ptConfig'], myObj['__ptType'])
    return myObj


def getPtType(lNode ) :
    if('__ptType' in lNode.keys()) :
        return lNode['__ptType']
        
    elif (('data' in lNode.keys()) and ('__ptType' in lNode['data'].keys())):
        return lNode['data']['__ptType']

    
        
#------------------------------------------Tree2Meta------------------------------------------  
def Tree2Meta(tNode) :
    #Dada la informacion del arbol genera la meta correspondiente 

    #Obtiene la info del nodo       
    myObj = getNodeInfo(tNode)

    if (not '__ptConfig' in myObj.keys()) :
        #print( 'Nodo sin configuracion ', tNode )
        return

    #Obtiene la informacion base del nodo
    nodeConf = _MetaObjects[myObj['__ptType']]
    mData = []
    if('listOf' in nodeConf.keys()):
        getChilds(myObj['tChilds'], mData , list)

    elif(('__ptStyle' in nodeConf.keys()) and (nodeConf['__ptStyle'] in ['colList','jsonText'])) :
        mData = getSimpleProperties(myObj['__ptConfig'] , myObj['__ptType'])
            
    elif(('properties' in nodeConf.keys()) or ('lists' in nodeConf.keys()) or ('objects' in nodeConf.keys())):
        mData = getSimpleProperties(myObj['__ptConfig'], myObj['__ptType'])
                       
        if(('tChilds' in myObj.keys()) and (len(myObj['tChilds'])> 0)) :
            if('hideItems' in nodeConf.keys()) :
                mData['items'] = []
                getChilds(myObj['tChilds'], mData['items'] , list)

            else :
                getChilds(myObj['tChilds'], mData , dict)
                    
 
    return mData