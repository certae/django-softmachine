from django.conf.urls.defaults import patterns, url

from protoLib.protoMenu import protoGetMenuData
from protoLib.protoGetPci import protoGetPCI, protoSavePCI, protoGetFieldTree
from protoLib.protoGetDetails import protoGetDetailsTree
from protoLib.protoLogin import protoGetUserRights

from protoLib.protoActionList import protoList
from protoLib.protoActionEdit  import protoCreate, protoUpdate, protoDelete 


urlpatterns = patterns('', 
    url('protoList/$', protoList ),
    
    url('protoAdd/$', protoCreate ),
    url('protoUpd/$', protoUpdate),
    url('protoDel/$', protoDelete),

    url('protoGetMenuData/$', protoGetMenuData ), 
    url('protoGetPCI/$', protoGetPCI ),
    url('protoSavePCI/$', protoSavePCI ),
    url('protoGetFieldTree/$', protoGetFieldTree ),
    url('protoGetDetailsTree/$', protoGetDetailsTree ),

    url('protoGetUserRights/$', protoGetUserRights ), 

)
