# -*- encoding: utf-8 -*-

# some common Web routines
# Compiled by : Dgt 11/11


from datetime import datetime, timedelta
from django.conf import settings
from django.http import HttpResponse 

from utilsBase import JSONEncoder

import json
import os


def doReturn( jsonDict ):
    # Codifica el mssage json 
    context = json.dumps( jsonDict, cls=JSONEncoder )
    return HttpResponse(context, content_type="application/json")

def JsonResponse(contents, status=200):
    return HttpResponse(contents, content_type='application/json', status=status)

def JsonSuccess(params = {}):
    d = {"success":True}
    d.update(params)
    return JsonResponse(JSONserialise(d))
   
def JsonError(error = ''):
    return JsonResponse('{"success":false, "message":"%s"}' % JSONserialise(error))


def set_cookie(response, key, value, days_expire = 7):
    if days_expire is None:
        max_age = 365*24*60*60  #one year
    else:
        max_age = days_expire*24*60*60 
        
    expires = datetime.datetime.strftime(datetime.datetime.utcnow() + timedelta(seconds=max_age), "%a, %d-%b-%Y %H:%M:%S GMT")
    response.set_cookie(key, value, max_age=max_age, expires=expires, domain=settings.SESSION_COOKIE_DOMAIN, secure=settings.SESSION_COOKIE_SECURE or None)
#   response.set_cookie(key, value, max_age=max_age, expires=expires)
    return response
    
    
def get_cookie(request, key):
    return request.COOKIES.get(key)

             
    
def DownloadLocalFile(InFile):
    import mimetypes
    file_name = os.path.basename(InFile)
    hinfile = open(InFile,'rb')
    response = HttpResponse(hinfile.read())
    response['Content-Disposition'] = 'attachment; filename=%s' % file_name
    response['Content-Type'] = mimetypes.guess_type(file_name)[0]
    return response
   
    
def JSONserialise( obj ):
    if not isinstance( obj , basestring ):
        try: 
            obj = json.dumps( obj )  
        except: 
            obj = 'error JSONSerialise'
    return obj 
    

def my_send_mail(subject, txt, sender, to=[], files=[], charset='UTF-8'):
    from email import Encoders
    from email.MIMEMultipart import MIMEMultipart
    from email.MIMEBase import MIMEBase
    from email.MIMEText import MIMEText
    
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
 
 
 



