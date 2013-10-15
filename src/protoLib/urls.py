from django.conf.urls import patterns, url

from protoLib.protoActionEdit import protoCreate, protoUpdate, protoDelete
from protoLib.protoActionList import protoList
from protoLib.protoActionRep import sheetConfigRep, protoCsv
from protoLib.protoActions import protoExecuteAction

from protoLib.protoGetDetails import protoGetDetailsTree
from protoLib.protoGetPci import protoGetPCI, protoSaveProtoObj, protoGetFieldTree
from protoLib.protoLogin import protoGetUserRights
from protoLib.protoMenu import protoGetMenuData

<<<<<<< HEAD
from protoLib.protoActionList import protoList
from protoLib.protoActionRep import sheetConfigRep, protoCsv
from protoLib.protoActionEdit import protoCreate, protoUpdate, protoDelete
from protoLib.protoActions import protoExecuteAction

urlpatterns = patterns('',
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
=======

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
>>>>>>> ddde2e02188f5f2479e408d6944f6e863db9832e
