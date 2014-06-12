
def doModelGraph(modeladmin, request, queryset, parameters):
    """
    funcion para crear el modelo grafico
    a partir de Model ( doModel )
    el proyecto enviara la el QSet de todos los modelos
    """

#   El QSet viene con la lista de Ids
    if queryset.count() != 1:
        return  {'success':False, 'message' : 'No record selected' }

    try:

        from graphModel import GraphModel
        gModel = GraphModel()

        gModel.getDiagramDefinition( queryset  )
        dotData = gModel.generateDotModel( )

#   Recorre los registros selccionados
    except Exception as e:
        traceback.print_exc()
        return  {'success':False, 'message' : 'Load error' }
        pass


#   Genera el archvivo dot
    fileName = 'gm_' + slugify( queryset[0].code ) + '.dot'
    fullPath = getFullPath( request, fileName )

    fo = open( fullPath , "wb")
    fo.write( dotData.encode('utf-8'))
    fo.close()

    try:
        import pygraphviz
        fileNamePdf = fileName.replace( '.dot', '.pdf')
        fullPathPdf = getFullPath( request, fileNamePdf )

        graph = pygraphviz.AGraph( fullPath )
        graph.layout( prog= 'dot' )
        graph.draw( fullPathPdf, format ='pdf')

        fileName = fileNamePdf
    except ImportError:
        pass

    return  {'success':True , 'message' : fileName,  'fileName' : fileName }
