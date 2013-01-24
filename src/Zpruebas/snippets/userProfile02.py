#This is just a reusable convenience parent class to allow you to create and administer an automatic user profile class using the following code:
#
#class UserProfile(UserProfileModel):
#    likes_kittens = models.BooleanField(default=True)
#Whenever a User object is created, a corresponding UserProfile will also be created. That's it.
#
#NB: You will still need to set AUTH_PROFILE_MODULE in your settings :-)
#
#(PS: It would also be nice to have the resulting class proxy the User object's attributes like django's model inheritance does, while still automatically creating a UserProfile object when a User object is created :-)

from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.db.models.base import ModelBase
from django.db import models

class _UserProfileModelBase(ModelBase):
    # _prepare is not part of the public API and may change
    def _prepare(self, cls):
        super(_UserProfileModelBase, cls)._prepare()

        def add_profile(sender, instance, created, **kwargs):
            if created:
                cls.objects.create(user=instance)

        # Automatically link profile when a new user is created
        post_save.connect(add_profile, sender=User, weak=False)

class UserProfileModel(models.Model):
    __metaclass__ = _UserProfileModelBase
    user = models.OneToOneField(User, primary_key=True, parent_link=True)

    class Meta:
        abstract = True
