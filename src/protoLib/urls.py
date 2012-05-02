from django.conf.urls.defaults import patterns, url

from protoLib.protoMenu import protoGetMenuData
from protoLib.protoGetPci import protoGetPCI

from protoLib.protoActionList import protoList
from protoLib.protoActionEdit  import protoCreate, protoUpdate, protoDelete 


urlpatterns = patterns('', 
    url('protoList/$', protoList ),
    
    url('protoAdd/$', protoCreate ),
    url('protoUpd/$', protoUpdate),
    url('protoDel/$', protoDelete),

    url('protoGetMenuData/$', protoGetMenuData ), 
    url('protoGetPCI/$', protoGetPCI ),

)
