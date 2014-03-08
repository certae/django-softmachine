
# from datetime import datetime
# from time import strftime
# from protoAuth import getUserProfile



#     def doWfAction(model, selectedKeys, parameters, actionDef, viewEntity, pUser):
# 
#         userProfile = getUserProfile(pUser, 'wflow', viewEntity)
#         try:
# 
#             changeSt = actionDef.get('change', [])
#             stInitial = changeSt[0]                  
#             stFinal = changeSt[1]
#                               
#             Qs = model.objects.filter(pk__in=selectedKeys)
#             Qs = Qs.filter(smWflowStatus=stInitial)
# 
#             # TODO transaction??? 
#             if actionDef.get('notifyOwner', False) : 
#                 for wfRow in Qs :
# 
#                     if len (parameters) > 0: 
#                         strMsg = parameters[0].get('value')
#                     else : strMsg = actionDef.get('message', '') 
# 
#                     UserReponse = WflowUserReponse()
#                     UserReponse.viewEntity = viewEntity
#                     UserReponse.strKey = wfRow.__str__()
#                     UserReponse.wfAction = actionDef.get('name')
#                     UserReponse.adminMsg = strMsg
# 
#                     try:
#                         setattr(UserReponse, 'smOwningUser', wfRow.smOwningUser)
#                         setattr(UserReponse, 'smOwningTeam', wfRow.smOwningTeam)
#                         setattr(UserReponse, 'smCreatedBy', userProfile.user)
#                         setattr(UserReponse, 'smRegStatus', '0')
#                         setattr(UserReponse, 'smCreatedOn', datetime.now())
#                     except :
#                         pass 
# 
#                     UserReponse.save()            
#                     if actionDef.get('emailNotification', False):
# 
#                         user = User.objects.get(username=wfRow.smOwningUser.username)
#                         if user.email :
#                             try:
#                                 subject = actionDef.get('emailSubject', '')
#                                 message = actionDef.get('emailTemplate', '')
#                                 variableFormat = {
#                                                   'sk' : wfRow.__str__(),
#                                                   'concept' : viewEntity,
#                                                   'admmessage': strMsg ,
#                                                   'admin' : userProfile.user.username.title(),
#                                                   'date' : strftime('%d/%m/%Y', wfRow.smCreatedOn.timetuple()),
#                                                   'User' : wfRow.smOwningUser.username.title()
#                                                   }
#                                 message = message.format(**variableFormat)
#                                 user.email_user(subject, message)
#                             except :
#                                 pass 
# 
#             if actionDef.get('setOwner', False)  : 
#                 Qs.update(smWflowStatus=stFinal, smOwningTeam=userProfile.userTeam)
#             else : 
#                 Qs.update(smWflowStatus=stFinal)
#                 
# 
#             return doReturn ({'success':True, 'message' : 'WfAction Ok'})
#          
#         except Exception as e:
#             return doReturn ({'success':False, 'message' : str(e) })
#     
    
#   ----------------------------------------
