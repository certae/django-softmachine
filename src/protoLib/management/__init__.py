from django.db.models.signals import post_syncdb
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission

def addProtoPermissions(sender, **kwargs):
    """
    This syncdb hooks takes care of adding a proto permission too all content types.
    """

    # for each of our content types "Adding  permissions" 
    for content_type in ContentType.objects.all():
        # build our permission slug

        codename = "menu_%s" % content_type.model
        name = name="Can see on menu %s" % content_type.name
        if not Permission.objects.filter(content_type=content_type, codename=codename):
            Permission.objects.create(content_type=content_type, codename=codename, name = name )
            print "Added permission %s" % codename 

        codename = "list_%s" % content_type.model
        name = name="Can list %s" % content_type.name
        if not Permission.objects.filter(content_type=content_type, codename=codename):
            Permission.objects.create(content_type=content_type, codename=codename, name = name )

        codename = "config_%s" % content_type.model
        name = name="Can config %s" % content_type.name
        if not Permission.objects.filter(content_type=content_type, codename=codename):
            Permission.objects.create(content_type=content_type, codename=codename, name = name )
            print "Added permission %s" % codename 

        codename = "custom_%s" % content_type.model
        name = name="Can customize %s" % content_type.name
        if not Permission.objects.filter(content_type=content_type, codename=codename):
            Permission.objects.create(content_type=content_type, codename=codename, name = name )


# check for all proto permissions after a syncdb
post_syncdb.connect(addProtoPermissions)