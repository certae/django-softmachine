# -*- coding: utf-8 -*-

from protoLib.utilsWeb import JsonError
from protoLib.protoActions import protoExecuteAction
from django.views.decorators.csrf import csrf_exempt    

@csrf_exempt
def loadFiles(request):

    if not request.user.is_authenticated(): 
        return JsonError('readOnly User')

    if request.method != 'POST':
        return JsonError( 'invalid message' ) 

    from django.conf import settings
    import os 

    
    for key, fileObj in request.FILES.items():
        path = os.path.join(settings.MEDIA_ROOT, fileObj.name ) 
        dest = open(path, 'w')
        if fileObj.multiple_chunks:
            for c in fileObj.chunks():
                dest.write(c)
        else:
            dest.write(fileObj.read())
        dest.close()

    return protoExecuteAction(request)