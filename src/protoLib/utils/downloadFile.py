# -*- coding: utf-8 -*-

import mimetypes
import os

from django.http import  HttpResponse
from django.utils.http import http_date

from protoLib.utilsWeb import JsonError


"""
Views and functions for serving downloads files

url 
        url(r'^(?P<path>.*)$', 'getFile', {'document_root' : '/path/to/my/files/'})
"""


def getFile(request, path ):
    
    if not request.user.is_authenticated(): 
        return JsonError('readOnly User')

    fullpath = getFullPath( request, path )
    if not os.path.exists(fullpath):
        return JsonError('"%s" does not exist' % path)

    # Respect the If-Modified-Since header.
    statobj = os.stat(fullpath)
    mimetype, encoding = mimetypes.guess_type(fullpath)
    mimetype = mimetype or 'application/octet-stream'

    response = HttpResponse(open(fullpath, 'rb').read(), content_type=mimetype)
    response["Last-Modified"] = http_date(statobj.st_mtime)
    response["Content-Length"] = statobj.st_size
    if encoding: 
        response["Content-Encoding"] = encoding
    
    return response


def getFullPath( request, filename ):
    BASE_DIR = os.path.dirname(os.path.dirname(__file__))
    project_dir = os.path.normpath(os.path.join(BASE_DIR, '..'))
    if ('/src' in project_dir):
        project_dir = os.path.normpath(os.path.join(project_dir, '..'))
    return os.path.join( project_dir , 'output', request.user.username + '.' + filename )