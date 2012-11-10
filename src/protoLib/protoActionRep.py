# -*- coding: utf-8 -*-

"""
Manejo de reportes basdaos en plantillas ( sheets )
Dg 121105   --------------------------------------------------
"""

from django.http import HttpResponse
from models import getDjangoModel, ProtoDefinition
from protoActionList  import Q2Dict 
from protoGrid import  getProtoViewName 
from utilsBase import addFilter, getReadableError  

import django.utils.simplejson as json


def protoSheetRep(request):
    """ Reporte basado en la definicion de plantillas ( sheets ) 
    """
    
    if request.method != 'POST':
        return 
    
    """  1.  
    Recibe  opcion, plantilla base,  Qs ( lista de ids )
    La plantilla de base sera solicitada al usuario, si se deja en blanco usara el sheetSelector o el default 
    Los detalles no tienen selector, siempre se usara el template marcado en el detalle.
    """        
    
    protoOption  = request.POST.get('protoOption', '') 
    sheetName    = request.POST.get('sheetName', '') 
    selectedKeys = request.POST.get('selectedKeys', [])
     
    selectedKeys = json.loads( selectedKeys )

    protoMeta, Qs = getReportBase( protoOption )

    # Si no hay lista, los trae todos 
    if type( selectedKeys ).__name__ == type([]).__name__ and  selectedKeys.__len__() > 0:
        pFilter = { 'pk__in' : selectedKeys } 
        Qs = addFilter( Qs, pFilter   )

    #  template FirstPage
    pSheet = getSheetConf ( protoMeta, sheetName )
    sheetName = pSheet.get( 'name' , 'Auto')
    
    #  Obtiene el template FirstPage         
    templateFp = pSheet.get( 'templateFp' , '<span ' +  sheetName + '.firstPage></span>') 
    templateFp = templateFp + pSheet.get( 'templateBb' , '<span ' +  sheetName + '.BeforeBlock></span>')
     
    templateLp = pSheet.get( 'templateAb' , '<span ' +  sheetName + '.AfterBlock></span>') 
    templateLp = templateLp + pSheet.get( 'templateLp' , '<span ' +  sheetName + '.lastPage></span>') 

    templateEr = pSheet.get( 'templateEr' , pSheet.get( 'template', '' ) )

    # Crea la clase del reporte 
    MyReport = SheetReportFactory()

    # Envia al reporte la hoja para manejar los detalles, el QSet, y los templates
    MyReport.getReport(  Qs, templateFp, templateEr, templateLp, protoMeta, pSheet.get( 'sheetDetails' , [] ))
    
    # retorna el reporte 
    return HttpResponse(MyReport.myReport )



    #------------

def getSheetConf( protoMeta , sheetName ):
    """ Obtiene un protoSheet dado su nombre
        recibe  la definicion ( protoMeta ) y el nombre ( str )
        retorna protoSheet ( obj ) 
    """
        
    try:
        pSheets = protoMeta.get( 'protoSheets', [] )
    except Exception as e:
        return {} 

    # Los recorre todos pero se queda con el primero 
    # en caso de no encotrarl el nombre seleccionado     
    pSheet = None
    for item in pSheets:
        if pSheet == None: pSheet = item  
        if item.get( 'name', '') == sheetName :
            pSheet = item
            break  

    if pSheet == None: pSheet = {}  
    return pSheet 


#------------

def getReportBase( protoOption ):
    
    protoConcept  = getProtoViewName( protoOption )
    
    # Obtiene el modelo 
    try: 
        model = getDjangoModel(protoConcept)
    except Exception as e:
        pass 
    
    # Obtiene la definicion
    try:   
        protoDef  = ProtoDefinition.objects.get (code = protoOption )
        protoMeta = json.loads( protoDef.metaDefinition ) 
    except Exception as e:
        pass 

    # hace el QSet de los registros seleccionados
    Qs = model.objects.select_related(depth=1)

    return protoMeta, Qs 
    

class SheetReportFactory(object):
    """ Construye un reporte basado en templates ( sheets )  
    """ 

    def __init__(self ):
            
        self.myReport = ''              # Cuerpo del reporte   
        self.rowCount = 0               # Conteo general de filas 
         

    def getReport( self , Qs, templateBefore, templateERow, templateAfter, protoMeta, sheetDetails ):
        """ Construye el reporte en bloques recursivos ( basado en sheetDetails )  
        # recibe : 
        # myReport      : Reporte en curso
        # Qs            : QuerySet ya preparado 
        # Templates     : Los templates son diferentes dependiendo la definicion del modelo 
        # protoMeta     : Se requiere para llamar Q2Dict 
        # sheetDetails  : Detalles a iterar
        """
           
        # Inicializa el conteo de filas del Bloque                  
        blockRowCount = 0 

        # Envia el QSet  obtiene una lista 
        pList = Q2Dict(protoMeta , Qs  )

        # prepara las variables q participan en cada template 
        bfProps = getProperties( protoMeta['fields'], templateBefore )
        erProps = getProperties( protoMeta['fields'], templateERow )
        afProps = getProperties( protoMeta['fields'], templateAfter )

        #Al comenzar lee  template  beforeDetail  
        if  pList.__len__()  > 0:
            row = pList[0]
        else: row = {}  
        self.myReport += getReport( bfProps, templateBefore, row  )

        # Recorre los registros 
        for row in pList: 
            
            blockRowCount += 1
            self.rowCount += 1 

            # Lee registro a registro y  remplaza el template html con la info correspondiente 
            self.myReport += getReport( erProps, templateERow, row  )
            
            # Loop Se Procesan cada uno de los detalles( M-D segun la definciion del detalle de la opcion, segun el criterio de sortIndicado. campo1, campo2-
            for detail in sheetDetails: 

                detailName = detail.get('name' )
                detailName = detail.get('detailName', detailName  )

                templateBb = detail.get( 'templateBb' , '<span ' +  detailName + '.BeforeDet></span>') 
                templateAb = detail.get( 'templateAb' , '<span ' +  detailName + '.AfterDet></span>') 
                templateEr = detail.get( 'templateEr' , '<span ' +  detailName + '.EveryRow></span>') 


                # Obtiene la conf del detalle 
                detailConf = getDetailConf( protoMeta, detailName  )
                if detailConf == None: continue 

                # Obtiene la meta y el QSet 
                protoMetaDet, QsDet  = getReportBase( detailConf[ 'conceptDetail' ] )

                # filtra el QSet de acuardo a los criterios del detalle
                masterField = detailConf[ 'masterField' ]
                idMaster =  row[ masterField.replace( 'pk', 'id') ]
                pFilter = { detailConf['detailField']  : idMaster  } 
                QsDet = addFilter( QsDet, pFilter   )
                
                self.getReport(  QsDet, templateBb, templateEr, templateAb, protoMetaDet, detail[ 'sheetDetails' ] )

        # Al finalizar el template AfterDetail                     
        self.myReport += getReport( afProps, templateAfter, row  )
        

    
def getProperties( fields, template ):
    # Obtiene las propiedades de un template para no recorrer props inutiles 

    if not template.__contains__( '{{'): return  [] 

    properties = [ 'id' ]        
    for field in fields: 
        if  template.__contains__( '{{' + field[ 'name'] + '}}' ): 
            properties.append( field[ 'name']  )

    # Retorna y elimina los duplicados 
    return set( properties ) 


def getDetailConf( protoMeta, detailName ):
    
    try:
        pDetails = protoMeta.get( 'protoDetails', [])
    except Exception as e:
        return None 

    # Los recorre todos pero se queda con el primero 
    # en caso de no encotrarl el nombre seleccionado     
    for item in pDetails:
        itemName = item.get( 'detailName', '')
        if itemName == '': itemName = item.get( 'menuText ', '')
        if itemName == detailName :
            return item 

    return None
 



def getReport( props, template, row  ):
    # Remmplaza las propieades en el template  

    report = template.__str__()
    for prop  in props :
        rValue = str( row.get( prop , '') ) 
        report = report.replace( '{{' + prop + '}}' , rValue )
    
    return report  

