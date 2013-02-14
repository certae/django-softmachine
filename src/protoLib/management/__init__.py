from django.db.models.signals import post_syncdb
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission

def add_view_permissions(sender, **kwargs):
    """
    This syncdb hooks takes care of adding a view permission too all our 
    content types.
    """
    # for each of our content types
    # print "Adding view permission" 
    for content_type in ContentType.objects.all():
        # build our permission slug

        codename = "view_%s" % content_type.model
        name = name="Can view %s" % content_type.name
        if not Permission.objects.filter(content_type=content_type, codename=codename):
            Permission.objects.create(content_type=content_type, codename=codename, name = name )
            print "Added permission %s" % codename 

        codename = "config_%s" % content_type.model
        name = name="Can config %s" % content_type.name
        if not Permission.objects.filter(content_type=content_type, codename=codename):
            Permission.objects.create(content_type=content_type, codename=codename, name = name )
            print "Added permission %s" % codename 

        codename = "custom_%s" % content_type.model
        name = name="Can customize %s" % content_type.name
        if not Permission.objects.filter(content_type=content_type, codename=codename):
            Permission.objects.create(content_type=content_type, codename=codename, name = name )
            print "Added permission %s" % codename 


# check for all our view permissions after a syncdb
post_syncdb.connect(add_view_permissions)