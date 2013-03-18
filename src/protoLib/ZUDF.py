from models import getDjangoModel 

model = getDjangoModel( 'prototype.entity')
entityId = 20 
 
 
pEntity = model.objects.get( pk =  entityId )
ret = pEntity.model.project_id
ret =  projectId
