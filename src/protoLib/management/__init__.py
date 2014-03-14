from django.db.models.signals import post_syncdb
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Permission

def addProtoPermissions(sender, **kwargs):
    """
    This syncdb hooks takes care of adding a proto permission too all content types.
    """

    def addEntityPermission(label, title):
        if not Permission.objects.filter(content_type=content_type, codename=label):
            Permission.objects.create(content_type=content_type, codename=label, name=title)
            print ("Added permission %s" % label)

    # for each of our content types "Adding  permissions"
    for content_type in ContentType.objects.all():
        # build our permission slug

        label = "menu_%s" % content_type.model
        title = "Can see on menu %s" % content_type.name
        addEntityPermission(label, title)

        label = "list_%s" % content_type.model
        title = "Can list %s" % content_type.name
        addEntityPermission(label, title)

        label = "config_%s" % content_type.model
        title = "Can config %s" % content_type.name
        addEntityPermission(label, title)

        label = "custom_%s" % content_type.model
        title = "Can customize %s" % content_type.name
        addEntityPermission(label, title)

        label = "wfadmin_%s" % content_type.model
        title = "Workflow admin for %s" % content_type.name
        addEntityPermission(label, title)

        label = "refallow_%s" % content_type.model
        title = "Can reference %s" % content_type.name
        addEntityPermission(label, title)


# check for all proto permissions after a syncdb
post_syncdb.connect(addProtoPermissions)
