#!/usr/bin/env python
"""
Prototype to DOT (Graphviz) converter by Dario Gomez
Table format from  django-extensions 
"""

from protoLib.utilsBase import slugify, getClassName  
from protoLib.utilsBase import Enum 

class GraphModel():

    def __init__(self):

        self.tblStyle = False         
        self.dotSource = 'digraph Sm {'
        self.dotSource += 'fontname="Helvetica";fontsize = 8;'

        self.GRAPH_LEVEL = Enum(['all', 'essential', 'required' , 'primary', 'title']) 
        self.GRAPH_FORM = Enum(['orf', 'erf', 'drn']) 

        if self.tblStyle:
            self.dotSource += 'node [shape="plaintext"];\n'
            self.tblTitle = '\n{0} [label=<<TABLE BGCOLOR="palegoldenrod" BORDER="0" CELLBORDER="0" CELLSPACING="0" style="width:100px"><TR><TD COLSPAN="2" CELLPADDING="4" ALIGN="CENTER" BGCOLOR="olivedrab4"> <FONT FACE="Helvetica Bold" COLOR="white">{1}</FONT> </TD></TR>'
            self.tblField = '\n<TR><TD ALIGN="LEFT" BORDER="0"><FONT FACE="Helvetica {2}">{0}</FONT></TD><TD ALIGN="LEFT"><FONT FACE="Helvetica {2}">{1}</FONT></TD></TR>'

        else:
    #       Animal [label = "{{{1}|+ name : string\l+ age : int\l|+ die() : void\l}"]
            self.dotSource += 'rankdir = BT;node [shape="record"];\n'
            self.tblRecord = '\n{0} [label = "{{{1}|'

        self.lnkComposition = '[dir=both,arrowhead=diamond,arrowtail=none]\n'
        self.lnkAgregation = '[dir=both,arrowhead=ediamond,arrowtail=none]\n'
        self.lnkNoCascade = '[dir=both,arrowhead=diamondtee,arrowtail=none]\n'
        self.lnkHeritage = '[dir=both,arrowhead=empty,arrowtail=none]\n'
        self.lnkER = '[dir=both,arrowhead=none,arrowtail=invempty]\n'


    def getDiagramDefinition(self, diagramSet):
        
        self.diagrams = []
        self.entities = []
        
        for pDiag in diagramSet:
            
            gDiagram = {
                'code': getClassName(pDiag.code) ,
                'label': pDiag.code ,
                'clusterName': getattr(pDiag, 'title', pDiag.code),
                'graphLevel' : getattr(pDiag, 'graphLevel' , self.GRAPH_LEVEL.all),
                'graphForm'  : getattr(pDiag, 'graphForm' , self.GRAPH_FORM.orf),
                'showPrpType': getattr(pDiag, 'showPrpType' , False),
                'showBorder' : getattr(pDiag, 'showBorder' , False),
                'prefix'     : getattr(pDiag, 'prefix' , ''),
                'entities': []
            }

            for pDiagEntity in pDiag.diagramentity_set.all():

                pEntity = pDiagEntity.entity 
                enttCode = self.getEntityCode(pEntity.code, gDiagram.get('prefix'))

                if enttCode in self.entities: 
                    continue 
                
                self.entities.append(enttCode)
                
                gEntity = {
                    'code': enttCode,
                    'fields': [],
                    'relations': []
                }
    
                for pProperty in pEntity.property_set.all():
    
                    pptCode = slugify(pProperty.code, '_')
                     
                    if pProperty.isForeign:
                        pType = self.getEntityCode(pProperty.relationship.refEntity.code, gDiagram.get('prefix'))

                        gEntity['relations'].append({
                            'code': pptCode,
                            'type': pType,
                            'primary': pProperty.isPrimary,
                            'required': pProperty.isRequired,
                            'essential': pProperty.isEssential,
                            'foreign': True

                        })
                    
                    else: 
                        pType = slugify(pProperty.baseType , '_')
    
                        gEntity['fields'].append({
                            'code': pptCode,
                            'type': pType or 'string',
                            'primary': pProperty.isPrimary,
                            'required': pProperty.isRequired,
                            'essential': pProperty.isEssential,
                            'foreign': False 
                        })
    
                gDiagram['entities'].append(gEntity)
    
            self.diagrams.append(gDiagram)



    def generateDotModel(self):

        # Dibuja las entidades  
        for gDiagram in self.diagrams:
            if gDiagram.get('graphLevel') < self.GRAPH_LEVEL.title :
                
                self.dotSource += '\nsubgraph {0} {{'.format(gDiagram.get('code'))
        
                if not gDiagram.get('showBorder', False) : 
                    self.dotSource += 'style=invis;'
                if len(gDiagram.get('label', '')) > 0: 
                    self.dotSource += 'label="{}";'.format(gDiagram.get('label', '')) 
    
                for gEntity in gDiagram['entities']:
                    self.entity2dot(gDiagram, gEntity)
    
                self.dotSource += '}\n'


        # Dibuja los vinculos ( tiene q ser otro recorrido )   
        for gDiagram in self.diagrams:
            for gEntity in gDiagram['entities']:
                self.link2dot(gEntity)

        self.dotSource += '}'

        # Dibuja las relaciones   
#         for gDiagram in self.diagrams:
#                 for relation in gEntity['relations']:
#                     if relation['target'] in nodes:
#                         relation['needs_node'] = False

    
        return self.dotSource
         

    def link2dot(self, gEntity):
        
        for gLink in gEntity['relations']:
            self.dotSource += '{0} -> {1} '.format(gEntity.get('code') , gLink.get('type')) + self.lnkComposition
        

    def entity2dot(self, gDiagram, gEntity):


        if self.tblStyle:
            enttTable = self.tblTitle.format(gEntity.get('code'), gEntity.get('label', gEntity.get('code')))
        else:
            enttRecord = self.tblRecord.format(gEntity.get('code'), gEntity.get('label', gEntity.get('code'))) 

        # 0 : colName; 1 : baseType; 2 : Bold / Italic 
        for gField in gEntity['fields'] + gEntity['relations'] :

            if gDiagram.get('showPrpType') :
                sPrpType = gField.get('type')
            else : sPrpType = ' '
                 
            sPk = ''
            fildLv = 0
            diagLv = gDiagram.get('graphLevel')

            if  gField.get('primary') :
                fildLv = self.GRAPH_LEVEL.primary
                sPk = 'Bold'

            elif gField.get('required'):
                fildLv = self.GRAPH_LEVEL.required  

            elif gField.get('essential'):
                fildLv = self.GRAPH_LEVEL.essential

            # Si no alcanza el nivel  
            if fildLv >= diagLv:
                
                sFk = ''
                if gField.get('foreign'): 
                    sFk = ' Italic'
                
                if self.tblStyle:
                    enttTable += self.tblField.format(gField.get('code'), sPrpType, sPk + sFk)
                
                else: 
                    if len(sPk) > 0: 
                        sPk = '*'

                    if len(sFk) > 0: 
                        sPk += '+'

                    if len(sPk) > 0: 
                        sPk += ' '

                    if len(sPrpType) > 1: 
                        sPrpType = ': ' + sPrpType
                          
                    enttRecord += '{2}{0}{1}\l'.format(gField.get('code'), sPrpType, sPk)

        if self.tblStyle:
            enttTable += '</TABLE>>]\n'
        else:
            enttRecord += '}"]\n' 
        
#       self.dotSource += enttTable 
        self.dotSource += enttRecord 


    def getEntityCode(self, code, prefix):
        # Formatea el nombre de la entidad 
        enttCode = code 
        if len(prefix) and enttCode.startswith(prefix):
            enttCode = enttCode[len(prefix):] 
            
        return getClassName(enttCode)
        
        
