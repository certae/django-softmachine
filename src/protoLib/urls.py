from django.conf.urls import patterns, url

from protoLib.protoMenu import protoGetMenuData
from protoLib.protoGetPci import protoGetPCI, protoSaveProtoObj, protoGetFieldTree
from protoLib.protoGetDetails import protoGetDetailsTree
from protoLib.protoLogin import protoGetUserRights

from protoLib.protoActionList import protoList
from protoLib.protoActionRep import sheetConfigRep, protoCsv
from protoLib.protoActionEdit import protoCreate, protoUpdate, protoDelete
from protoLib.protoActions import protoExecuteAction


urlpatterns = patterns(
    '',
    url('protoList/$', protoList),
    url('sheetConfigRep/$', sheetConfigRep),
    url('protoCsv/$', protoCsv),

    url('protoDoActions/$', protoExecuteAction),

    url('protoAdd/$', protoCreate),
    url('protoUpd/$', protoUpdate),
    url('protoDel/$', protoDelete),

    url('protoGetMenuData/$', protoGetMenuData),
    url('protoGetPCI/$', protoGetPCI),
    url('protoSaveProtoObj/$', protoSaveProtoObj),
    url('protoGetFieldTree/$', protoGetFieldTree),
    url('protoGetDetailsTree/$', protoGetDetailsTree),

    url('protoGetUserRights/$', protoGetUserRights),
)
