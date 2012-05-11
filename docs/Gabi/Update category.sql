

Select id, code, objType, category from  ProtoExt_metaobj
Where objType = 'Model'

Select * from ProtoExt_udp
Where metaObj_id in ( Select id from  ProtoExt_metaobj Where objType = 'Model'  )

Delete from ProtoExt_udp
Where metaObj_id in ( Select id from  ProtoExt_metaobj Where objType = 'Model'  )
and code like 'udp_%'

Update ProtoExt_metaobj m set m.category = u.value
Where m.objType = 'Model'
and m.id in ( Select u.metaObj_id from ProtoExt_udp u  )


