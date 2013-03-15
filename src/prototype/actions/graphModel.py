#!/usr/bin/env python
"""
Prototype to DOT (Graphviz) converter
by dariogomez
Adapted from  django-extensions ( by  Antonio Cavedoni ) 
"""

from django.template import Context, loader
from protoLib.utilsBase import slugify

def generateDotModels( queryset ):
    
    disable_fields = False  
    use_subgraph =  False  

    # Abre el template 
    t = loader.get_template('graph_models/head.html')
    c = Context({})
    dot = t.render(c)

    gModels = []
    for pModel in queryset:
        
        modelCode = slugify( pModel.code, '_' )
        
        gModel = Context({
            'name': '"%s"' % modelCode ,
            'app_name': "%s" % modelCode ,
            'cluster_app_name': modelCode,
            'disable_fields': disable_fields,
            'use_subgraph': use_subgraph,
            'models': []
        })

        for pEntity in pModel.entitySet.all():
            enttCode = slugify( pEntity.code , '_')
            gEntity = {
                'app_name': modelCode,
                'name': enttCode,
                'label': enttCode,
                'abstracts': [],
                'fields': [],
                'relations': []
            }

            for pProperty in pEntity.propertySet.all():

                pptCode =  slugify( pProperty.code, '_' ) 
                if pProperty.isForeign:
                    pType = slugify( pProperty.relationship.refEntity.code , '_') 
                else: pType = slugify( pProperty.baseType , '_')

                gEntity['fields'].append({
                    'name': pptCode,
                    'label': pptCode,
                    'type': pType or 'string',
                    'blank': not pProperty.isPrimary,
                    'abstract': not pProperty.isRequired,
                })

                # relations
                if pProperty.isForeign:
                    if not pProperty.isRequired: 
                        extras = '[arrowhead=empty, arrowtail=dot]'
                    else: extras  = ''  # [arrowhead=none, arrowtail=none]
    
                    label = pptCode + ' (%s)' % pType
    
                    # handle self-relationships
                    _rel = {
                        'target_app': modelCode ,
                        'target': pType ,
                        'type': pType,
                        'name': pptCode + '_' + pType,
                        'label': label,
                        'arrows': extras,
                        'needs_node': True
                    }

                    gEntity['relations'].append(_rel)

            gModel['models'].append(gEntity)

        gModels.append(gModel)

    # ------------------------------------------------------------------------------------
    nodes = []
    for gModel in gModels:
        nodes.extend([e['name'] for e in gModel['models']])

    for gModel in gModels:
        # don't draw duplication nodes because of relations
        for gEntity in gModel['models']:
            for relation in gEntity['relations']:
                if relation['target'] in nodes:
                    relation['needs_node'] = False
        # render templates
        t = loader.get_template('graph_models/body.html')
        dot += '\n' + t.render(gModel)

    for gModel in gModels:
        t = loader.get_template('graph_models/rel.html')
        dot += '\n' + t.render(gModel)

    t = loader.get_template('graph_models/tail.html')
    c = Context({})
    dot += '\n' + t.render(c)
    return dot
