import json
from pciObjects import _METAOBJECTS
from pciProperties import getSimpleProperties
from __init__ import getNodeBase, clearPhantonProps

def doFinalFormat(tData, oData, ptType) :
    tData['text'] = oData.get('name') or oData.get('menuText') or oData.get('property') or oData.get('viewEntity')or ptType
    return tData


def formContainer2Tree( items, ptType ) :
    # Aqui solo llegan los contenedores de la forma,  ( hideItems : true )
    
    tItems = []
    for sKey in items :
        oData = sKey
            
        __ptConfig = getSimpleProperties(oData , ptType)
        ptType = __ptConfig.get('__ptType')

        #  contenedores de la forma
        if ptType in ['htmlset','fieldset','tabpanel','accordeon','panel'] :

            cName = ptType
            if(ptType == 'fieldset'):
                if __ptConfig.get('title') :
                    cName += ' - ' + __ptConfig.get('title')
            
            t2Data = getNodeBase(cName, ptType, __ptConfig)
            t2Data['children'] = formContainer2Tree( oData['items'], ptType )
            tItems.append(t2Data)

        elif ptType in ['formField','protoGrid', 'detailButton'] :

                if ptType == 'protoGrid':
                    t2Data = getNodeBase(__ptConfig.get('menuText'), ptType, __ptConfig)
                    
                elif ptType == 'detailButton':
                    t2Data = getNodeBase(__ptConfig.get('text'), ptType, __ptConfig)

                else :
                    t2Data = getNodeBase(__ptConfig.get('name'), ptType, __ptConfig)
                
                t2Data['leaf'] = True
                tItems.append(t2Data)
        
    return tItems


def getSpecialNodes(nodeDef, treeData, objData, ptType) :
    # Recibe el treeData y lo configura en caso de nodos especiales
    # retorna true si fue configurado
    # Form ( debe manejar el raiz sin el marco de items )
    
    if ('hideItems' in nodeDef):
        if(objData.get('items')):
            treeData['children'] = formContainer2Tree(objData.get('items'), ptType)
                
        else :
            treeData['children'] = formContainer2Tree(objData, ptType)
            
        return True
            
   
    if (('__ptStyle' in nodeDef ) and (nodeDef['__ptStyle'] == 'jsonText')):
        if (objData.get('name')):
            treeData['__ptConfig']['name'] = objData.get('name')

        treeData['__ptConfig']['__ptValue'] =  json.dumps(objData)
        return True
            

    if (('__ptStyle' in nodeDef) and (nodeDef['__ptStyle'] == 'colList')):
        treeData['__ptConfig']['__ptList'] =  json.dumps(objData)
        return True
      

def Array2Tree(oList, ptType, tNode, pName) :
    # REcibe un array y genera los hijos,
    # @tNode   referencia al nodo base
    # @ptType  tipo de nodo hijo
    # @oList    objeto lista de la meta

    if oList :
        for sKey in oList :
            oData = sKey
            tChild = Meta2Tree(oData, pName, ptType)
            tNode['children'].append(tChild) 
            

def verifyNodeDef(nodeDef) :
    # Verifica las listas y objetos
    
    if (nodeDef.get('lists')):
        if (type(nodeDef.get('lists')) != list) :
            nodeDef['lists'] = []

        else :
            for ix in nodeDef.get('lists') :
                sKey = ix

                if (type(sKey) !=  str) :
                    nodeDef['lists'].remove(ix) 
                    continue
                    
                childConf = _METAOBJECTS[sKey]
                if ((childConf.get('__ptStyle')== 'colList') or (childConf.get('__ptStyle') == 'jsonText')):
                    continue
                   
                if (not childConf.get('listOf')) :
                    #print( 'pciObjects no se encontro listOf para ' + sKey  )
                    continue

    if (nodeDef.get('objects')):
        if (type(nodeDef.get('objects')) != list ) :
            #print('pciObjects definicion errada de objects para ' + ptType )
            nodeDef['lists'] = []
                
        else :
            for ix in nodeDef.get('objects'):
                sKey = ix
                if (type(sKey) != str) :
                    #print( 'pciObjects definicion errada en objects ' + ptType + ' key ' , sKey  )
                    continue


def Meta2Tree(oData, pName, ptType) :
    #Convierte la meta en treeStore ( Arbol )
    # Input    ---------------------------------
    # @oData     : Data a convertir
    # @pName     : property Name ( iteraction en el objeto padre, en el caso de las formas )
    # @ptType    : property Type ( Tipo del padre en caso de ser un array  )
    # Return   -------------------------------
    # @tData   treeData
    # Initial validation  --------------------------------------------
    
    nodeDef = _METAOBJECTS.get(ptType)   
    if (not nodeDef) :
        return

    #   Function body  --------------------------------------------
    __ptConfig = getSimpleProperties(oData, ptType)
    tData = getNodeBase(ptType, ptType, __ptConfig)

    if(getSpecialNodes(nodeDef, tData, oData, ptType)):
        return doFinalFormat(tData, oData, ptType)

    # es una lista  lista, se hace el mismo recorrido ( solo en caso de una lista de listas )
    if (nodeDef.get('listOf' )) :
        Array2Tree(oData, ptType, tData)

    # Verifica q la definicion este bien hecha
    verifyNodeDef(nodeDef)
              
    # Recorre las listas
    if nodeDef.get('lists') :
        for ix in nodeDef.get('lists'):
            sKey = ix
            childConf = _METAOBJECTS.get(sKey),
            if((type(childConf)==tuple) and (len(childConf)==1)):
                childConf =  childConf[0]
               
            tChild = getNodeBase(sKey, sKey, {'__ptType' : sKey} )

            if (not getSpecialNodes(childConf, tChild, oData.get(sKey), ptType)) :
                Array2Tree(oData.get(sKey), childConf['listOf'], tChild, pName)

            #agrega la base de la lista
            tData['children'].append(tChild)

    # Recorre los objetos
    if nodeDef.get('objects') :
        for ix in nodeDef.get('objects'):
            sKey = ix
            #Obtiene el objeto de la meta, lo convierte y lo genera
            tChild = Meta2Tree(oData.get(sKey), sKey, sKey)
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
    tData = {}
    myObj  = {}
    if(tNode.get('data')) :
        tData = tNode.get('data')
        myObj['tChilds'] =  tNode.get('childNodes')
        
    else :
        tData = tNode
        myObj['tChilds'] = tNode.get('children')
        
    myObj['__ptType'] = tData.get('__ptType')
    
    if (not tData.get('__ptConfig')) :
        myObj['__ptConfig'] = {}
        return myObj

    myObj['__ptConfig'] = clearPhantonProps(tData.get('__ptConfig'), myObj.get('__ptType'))
    return myObj


def getPtType(lNode ) :
    if(lNode.get('__ptType')) :
        return lNode.get('__ptType')
        
    elif (lNode.get('data') and lNode['data'].get('__ptType')):
        return lNode['data'].get('__ptType')

        
#------------------------------------------Tree2Meta------------------------------------------  
def Tree2Meta(tNode) :
    #Dada la informacion del arbol genera la meta correspondiente 

    #Obtiene la info del nodo       
    myObj = getNodeInfo(tNode)

    if (not myObj.get('__ptConfig')) :
        #print( 'Nodo sin configuracion ', tNode )
        return

    #Obtiene la informacion base del nodo
    nodeConf = _METAOBJECTS.get(myObj['__ptType'])
    mData = []
    if(nodeConf.get('listOf')):
        getChilds(myObj.get('tChilds'), mData , list)

    elif(nodeConf.get('__ptStyle') in ['colList','jsonText']) :
        mData = getSimpleProperties(myObj['__ptConfig'] , myObj['__ptType'])
            
    elif(nodeConf.get('properties') or nodeConf.get('lists') or nodeConf.get('objects')):
        mData = getSimpleProperties(myObj.get('__ptConfig'), myObj.get('__ptType'))
                       
        if(myObj.get('tChilds') and (len(myObj.get('tChilds'))> 0)) :
            if(nodeConf.get('hideItems')) :
                mData['items'] = []
                getChilds(myObj.get('tChilds'), mData.get('items') , list)
                
            else :
                getChilds(myObj['tChilds'], mData , dict)
                    
    return mData
