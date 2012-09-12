import datetime

from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import ugettext_lazy as _


def _user_get_all_permissions(user, obj): pass
def _user_has_perm(user, perm, obj): pass
def _user_has_module_perms(user, app_label): pass

class PermissionManager(models.Manager):
    def get_by_natural_key(self, codename, app_label, model): pass

class UserManager(models.Manager):
    def create_user(self, username, email, password=None): pass 
    def create_superuser(self, username, email, password): pass
    def make_random_password(self, length=10): pass 


class Permission(models.Model):
    """
    The Django admin site uses permissions as follows:

        - The "add" permission limits the user's ability to view the "add" form and add an object.
        - The "change" permission limits a user's ability to view the change list, view the "change" form and change an object.
        - The "delete" permission limits the ability to delete an object.

    Permissions are set globally per type of object, ***********  not per specific object instance. 
    It is possible to say "Mary may change news stories," 
    but it's not currently possible to say "Mary may change news stories, but only the ones she created herself" 

    Three basic permissions -- add, change and delete -- are automatically created for each Django model.
    """

    name = models.CharField(_('name'), max_length=50)
    content_type = models.ForeignKey(ContentType)
    codename = models.CharField(_('codename'), max_length=100)
    objects = PermissionManager()

    class Meta:
        unique_together = (('content_type', 'codename'),)


class Group(models.Model):
    """
    Groups are a generic way of categorizing users to apply permissions, or some other label, to those users. 

    A user can belong to any number of groups.
    A user in a group automatically has all the permissions granted to that group. 

    Beyond permissions, groups are a convenient way to categorize users to apply some label, or extended functionality, to them. 
    For example, you could create a group 'Special users', and you could write code that would do special things to those users 
    -- such as giving them access to a members-only portion of your site, or sending them members-only e-mail messages.
    """
    name = models.CharField(_('name'), max_length=80, unique=True)
    permissions = models.ManyToManyField(Permission, verbose_name=_('permissions'), blank=True)

    class Meta:
        verbose_name = _('group')
        verbose_name_plural = _('groups')

    def __unicode__(self):
        return self.name



class User(models.Model):
    """
    Users within the Django authentication system are represented by this model.
    """
    username = models.CharField(_('username'), max_length=30, unique=True, help_text=_("Required. 30 characters or fewer. Letters, numbers and @/./+/-/_ characters"))
    first_name = models.CharField(_('first name'), max_length=30, blank=True)
    last_name = models.CharField(_('last name'), max_length=30, blank=True)
    email = models.EmailField(_('e-mail address'), blank=True)
    password = models.CharField(_('password'), max_length=128, help_text=_("Use '[algo]$[salt]$[hexdigest]' or use the <a href=\"password/\">change password form</a>."))
    is_staff = models.BooleanField(_('staff status'), default=False, help_text=_("Designates whether the user can log into this admin site."))
    is_active = models.BooleanField(_('active'), default=True, help_text=_("Designates whether this user should be treated as active. Unselect this instead of deleting accounts."))
    is_superuser = models.BooleanField(_('superuser status'), default=False, help_text=_("Designates that this user has all permissions without explicitly assigning them."))
    last_login = models.DateTimeField(_('last login'), default=datetime.datetime.now)
    date_joined = models.DateTimeField(_('date joined'), default=datetime.datetime.now)
    groups = models.ManyToManyField(Group, verbose_name=_('groups'), blank=True)
    user_permissions = models.ManyToManyField(Permission, verbose_name=_('user permissions'), blank=True)
    objects = UserManager()

    def __unicode__(self):
        return self.username

    def is_anonymous(self):
        return False

    def is_authenticated(self):
        return True

    def get_full_name(self):
        full_name = u'%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def set_password(self, raw_password):  pass
    def check_password(self, raw_password): pass

    def set_unusable_password(self): pass
    def has_usable_password(self): pass
    def get_group_permissions(self, obj=None): pass

    def get_all_permissions(self, obj=None): pass
    def has_perm(self, perm, obj=None): pass
    def has_perms(self, perm_list, obj=None): pass
    def has_module_perms(self, app_label): pass

    def get_and_delete_messages(self): pass 

    def email_user(self, subject, message, from_email=None): pass
    "Sends an e-mail to this User."

    def get_profile(self): pass
    "Requiere definir el profile para el usuario" 



class Message(models.Model):
    """
    The message system is a lightweight way to queue messages for given
    users. A message is associated with a User instance (so it is only
    applicable for registered users). There's no concept of expiration or
    timestamps. Messages are created by the Django admin after successful
    actions. For example, "The poll Foo was created successfully." is a
    message.
    """
    user = models.ForeignKey(User, related_name='_message_set')
    message = models.TextField(_('message'))

    def __unicode__(self):
        return self.message


class AnonymousUser(object): pass 

