from django.conf.urls import patterns, url
from django.views.generic import TemplateView
from protoLib.utils.generic_views import DirectTemplateView

from protoLib.protoMenu import protoGetMenuData
from protoLib.protoGetPci import protoGetPCI, protoSaveProtoObj, protoGetFieldTree, getFieldIncrement
from protoLib.protoGetDetails import protoGetDetailsTree
from protoLib.protoLogin import protoGetUserRights, protoLogout, protoGetPasswordRecovery, resetpassword, changepassword

from protoLib.protoActionList import protoList
from protoLib.protoActionRep  import sheetConfigRep, protoCsv
from protoLib.protoActionEdit  import protoCreate, protoUpdate, protoDelete
from protoLib.protoActions  import protoExecuteAction

from protoLib.utils.loadFile import loadFiles

urlpatterns = patterns('',
    url(r'^protoExt$', TemplateView.as_view(template_name='protoExt.html')),
    url(r'^protoExtReset$', DirectTemplateView.as_view(template_name='protoExt.html',extra_context={ 'isPasswordReseted': True })),
    
    url('protoLib/protoList/$', protoList),
    url('protoLib/sheetConfigRep/$', sheetConfigRep),
    url('protoLib/protoCsv/$', protoCsv),

    url('protoLib/protoDoActions/$', protoExecuteAction),

    url('protoLib/protoAdd/$', protoCreate),
    url('protoLib/protoUpd/$', protoUpdate),
    url('protoLib/protoDel/$', protoDelete),

    url('protoLib/protoGetMenuData/$', protoGetMenuData),
    url('protoLib/protoGetPCI/$', protoGetPCI),
    url('protoLib/protoSaveProtoObj/$', protoSaveProtoObj),
    url('protoLib/protoGetFieldTree/$', protoGetFieldTree),
    url('protoLib/protoGetDetailsTree/$', protoGetDetailsTree),

    url('protoLib/protoGetUserRights/$', protoGetUserRights),
    url('protoLib/protoGetPasswordRecovery/$', protoGetPasswordRecovery),
    url('protoLib/resetpassword/$', resetpassword),
    url('protoLib/submitChangePassword/$', changepassword),
    url('protoLib/protoLogout/$', protoLogout),

    url('protoLib/getFieldIncrement/$', getFieldIncrement),
    
    url('protoLib/loadFile/$', loadFiles),
)