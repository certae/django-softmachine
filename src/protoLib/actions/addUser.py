#  Dgt 1303  Creacion automatica de usuarios, team, grupo 

# -*- coding: utf-8 -*-


from django.contrib.auth.models import User, Group
from protoLib.models import  TeamHierarchy, UserProfile


def actionAddUser( request,  queryset , parameters ):
    """
    Permite crear el usuario y asociarlo a un grupo y un team 
    """ 

    sUser   = parameters[0]['value'] 
    sPwd    = parameters[1]['value'] 
    sMail   = parameters[2]['value'] or ''
    sTeam   = parameters[3]['value'] or ''
    sGroups = parameters[4]['value'] or 'users'

            
#   User   ------------ 
    try:
        user = User.objects.get(username=sUser)
    except User.DoesNotExist:
        user = User(username= sUser)
        # User.objects.create_user( )

    user.is_staff = True
    user.is_active = True

    if len( sMail ) > 0:  user.email = sMail 
    if len( sPwd ) > 0:  user.set_password( sPwd ) 
    user.save()


#   User Profile   ------------
    if len( sTeam ) > 0: 
        uProfile = UserProfile.objects.get_or_create(user=user)[0]
        uProfile.userTeam = TeamHierarchy.objects.get_or_create(code= sTeam )[0]
        uProfile.save()


#   Groups    ------------ 
    groups = [ gr.strip() for gr in sGroups.split(',') ]
    for gr in groups: 
        group = Group.objects.get_or_create(name = gr )[0]
        user.groups.add( group )

    return  {'success':True , 'message' :  'Ok' }


# def actionSetGroups()
#     g = Group.objects.get(name='My Group Name')
#     users = User.objects.all()
#     for u in users:
#         g.user_set.add(u)