'''
Created on 2014-02-11

@author: dario
'''

from protoLib.protoPci.pciObjetcs import _METAOBJECTS, _METAVERSION 
from protoLib.utilsBase import verifyList

def verifyMeta( oMeta, ptType, tNode = None ) :
    '''
    oMeta     : Objeto a verificar; 
    ptType    : tipo de objeto raiz 
    tNode     : elemento del nodo a ser verificado recursivamente   
    '''

    ptConfig = _METAOBJECTS.get( ptType )


    if ptConfig.get( 'lists' ): 
        ptList = ptConfig.get( 'lists', []) 
        for sKey in ptList :  
            listOfConf = _METAOBJECTS.get( sKey, {}) 

            # Obtiene el valor de la lista del objeto, o asigna el default
            oMeta[sKey] = verifyList( oMeta.get( sKey ),  listOfConf.get( 'lstDefault', [] ) )

            # Si es una lista de objetos verifica cada objeto recursivamente 
            if tNode : 
                nBranch = getNodeBase(sKey, sKey )
                tNode.children.append( nBranch )

    # Verifica los Objetos ( no aplica los default, pues la config puede eliminarlos )
    if  ptConfig.get( 'objects' ) :
        for sKey in ptConfig.get( 'objects' ) :  
            myObj = oMeta.get( sKey, {});

            if tNode  :
                nBranch = getNodeBase(sKey, sKey )
                tNode.children.append(nBranch)
                oMeta[ sKey ] = verifyMeta( myObj, sKey, nBranch);

            else :
                oMeta[ sKey ] = verifyMeta( myObj, sKey );

    return oMeta;


def clearPhantonProps( ptConfig, ptType ):  
    # Borra las propieades q no hacen parte de la config de base
    objConfig = _METAOBJECTS.get( ptType  )
    if not  objConfig: 
        return ptConfig 
    
    for sKey in ptConfig :
        if not sKey in objConfig.get( 'properties', [] ).extend( ['name', '__ptValue', '__ptList', '__ptType']) :
            del ptConfig[ sKey ];

    return ptConfig;


def  getNodeBase( pName, ptType, ptConfig = None ) : 
    # Obtiene un Id y genera  una referencia cruzada de la pcl con el arbol
    # fix : id = Ext.id() El modelo debe crear la referencia a la data o se perdera en el treeStore

    if not ptConfig: 
        ptConfig = { '__ptType' : ptType }

    return  {
        'text'          :  pName,
        '__ptType'      :  ptType,
        '__ptConfig'    :  ptConfig,
        'children'      :  []
        }

