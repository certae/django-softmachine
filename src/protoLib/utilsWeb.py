# -*- encoding: utf-8 -*-

from datetime import datetime
from django.conf import settings

# some common Web routines
# Compiled by : Dgt 11/11

import os
import re

from django.http import Http404, HttpResponse, HttpResponseRedirect
def proxy_GetToPost(request):
    """ transfer the GET into a POST form then submit to $target url """
    data = request.GET.copy()
    uri = data.get('target')
    del data['target']
    html  = '<body><form name=form method=POST action="%s" >' % uri
    for item in data.keys():
        html += '<input type=hidden name="%s" value="%s">' % (item, data[item])
    html += '</form><script language="javascript">document.form.submit()</script></body>'
    return HttpResponse(html)
    

def set_cookie(response, key, value, days_expire = 7):
    if days_expire is None:
        max_age = 365*24*60*60  #one year
    else:
        max_age = days_expire*24*60*60 
        
    expires = datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
    response.set_cookie(key, value, max_age=max_age, expires=expires, domain=settings.SESSION_COOKIE_DOMAIN, secure=settings.SESSION_COOKIE_SECURE or None)
#   response.set_cookie(key, value, max_age=max_age, expires=expires)
    return response
    
def set_pickle_cookie(response, key, value, days_expire = 7):
    if days_expire is None:
        max_age = 365*24*60*60  #one year
    else:
        max_age = days_expire*24*60*60 
    value = pickle.dumps(value)
    expires = datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
    response.set_cookie(key, value, max_age=max_age, expires=expires)
    return response  
    
    return pickle.loads(value) 
    
def get_pickle_cookie(request, key):
    value = request.COOKIES.get(key)
    if value:
        try:
            value = pickle.loads(value) 
        except:
            print ' * ERROR unpickling cookie %s' % key
            value = None
    return value
    
def get_cookie(request, key):
    return request.COOKIES.get(key)

             
def JsonResponse(contents, status=200):
    # http://tools.ietf.org/html/rfc4627  ( text/javascript  obsoleto ) 
    return HttpResponse(contents, mimetype='application/json', status=status)

def JsonSuccess(params = {}):
    d = {"success":True}
    d.update(params)
    return JsonResponse(JSONserialise(d))
   
def JsonError(error = ''):
    return JsonResponse('{"success":false, "msg":%s}' % JSONserialise(error))
    
def DownloadLocalFile(InFile):
    import mimetypes
    file_name = os.path.basename(InFile)
    hinfile = open(InFile,'rb')
    response = HttpResponse(hinfile.read())
    response['Content-Disposition'] = 'attachment; filename=%s' % file_name
    response['Content-Type'] = mimetypes.guess_type(file_name)[0]
    return response
   
    
def JSONserialise(obj, sep = '"', escapeStrings = True):
    import decimal
    from django.db import models
    
    if type(obj)==type({}):
        return JSONserialise_dict(obj)
    
    elif type(obj)==type(True):
        return obj and "true" or "false"
    elif type(obj) in [type([]), type((1,2))]:
        # if len(obj) > 50:
            # print '*********', 'list', len(obj), type(obj)
        return "[%s]" % ','.join(map(JSONserialise, obj))
        # data = []
        # for item in obj:
            # data.append(JSONserialise(item))
        # return "[%s]" % ",".join(data)
    elif type(obj) in [type(0), type(0.0), long, decimal.Decimal]:
        return '%s' % obj
    elif type(obj) in [datetime.datetime , datetime.date]:
         return u'%s%s%s' % (sep, obj, sep)
         
    elif type(obj) in [type(''), type(u'')] or isinstance(obj, models.Model):
        #print obj, isinstance(obj, str), isinstance(obj, unicode)
        if obj == "False": 
           return "false"
        elif obj == "True":
            return "true"
        else:
            if escapeStrings:
                return u'%s%s%s' % (sep, JsonCleanstr(obj), sep)
            else:
                return u'%s%s%s' % (sep, obj, sep)
    elif not obj:   
        return u'%s%s' % (sep, sep)
    else:   
        
        print 'JSONserialise unknown type', obj, type(obj), obj.__class__.__name__, isinstance(obj, models.Model)
        return u'%s' % obj
    return None
    

def getUrl(url, data = None, method = 'GET', headers = {}):
    #print 'getUrl', url
    import urllib, urllib2
    if data:
        data = urllib.urlencode(data)
        if method == 'GET':
            url += '?%s' % data
            data = None
    #print 'getUrl', url , data
    req = urllib2.Request(url, data, headers)
    #try:
    response = urllib2.urlopen(req)
    #except urllib2.HTTPError, _code:
    #    return _code
    
    return response.read()

def JSONserialise_dict_item(key, value, sep = '"'):
    # quote the value except for ExtJs keywords
    
    if key in ['renderer', 'editor', 'hidden', 'sortable', 'sortInfo', 'listeners', 'view', 'failure', 'success','scope', 'fn','store','handler','callback']:
        if u'%s' % value in ['True', 'False']:
            value = str(value).lower()
        else:
            # dont escape strings inside these special values (eg; store data)
            value = JSONserialise(value, sep='', escapeStrings = False)
        return '"%s":%s' % (key, value)
    else:
        value = JSONserialise(value, sep)
        return '"%s":%s' % (key, value)
     
def JSONserialise_dict(inDict):
    data=[]
    for key in inDict.keys():
        data.append(JSONserialise_dict_item(key, inDict[key]))
    data = ",".join(data)
    return "{%s}" % data
    
def JsonCleanstr(inval):
    try:
        inval = u'%s' % inval
    except:
        print "ERROR nunicoding %s" % inval
        pass
    inval = inval.replace('"',r'\"')
    inval = inval.replace('\n','\\n').replace('\r','')
    return inval


def my_send_mail(subject, txt, sender, to=[], files=[], charset='UTF-8'):
    import os
    from django.core.mail import send_mail
    from email import Encoders
    from email.MIMEMultipart import MIMEMultipart
    from email.MIMEBase import MIMEBase
    from email.MIMEText import MIMEText
    from django.conf import settings
    from django.core.mail import EmailMultiAlternatives
    
    for dest in to:
        dest = dest.strip()
        msg = MIMEMultipart('related')
        msg['Subject'] = subject
        msg['From'] = sender
        msg['To'] =  dest
        msg.preamble = 'This is a multi-part message in MIME format.'
        msgAlternative = MIMEMultipart('alternative')
        msg.attach(msgAlternative)
        msgAlternative.attach(MIMEText(txt, _charset=charset))
        msgAlternative.attach(MIMEText(txt, 'html', _charset=charset))
        #msg.attach_alternative(txt, "text/html")
        
        for f in files:
            part = MIMEBase('application', "octet-stream")
            part.set_payload( open(f,"rb").read() )
            Encoders.encode_base64(part)
            part.add_header('Content-Disposition', 'attachment; filename="%s"' % os.path.basename(f))
            msg.attach(part)
        
        from smtplib import SMTP
        smtp = SMTP()
        smtp.connect(host=settings.EMAIL_HOST)
        smtp.sendmail(sender,dest, msg.as_string())
        smtp.quit()
 
 
 





