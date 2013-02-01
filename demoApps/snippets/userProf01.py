#This is an alternative to User.get_profile.
#Rather than having you call User.get_profile directly, this retrieves the profile instance for a User and attaches the fields from the profile to the User object when instantiated. The special methods for DateField, FileField, ImageField and fields with choices are also created.
#Since the profile object still has to be retrieved from the database before its fields can be added to the User, the costs for using this might outweigh the rewards unless you are heavily using profiles.
#To install, place it in a module on your PYTHONPATH and add it to INSTALLED_APPS.

from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist
from django.db import models
from django.db.models.signals import post_init
from django.dispatch import dispatcher
from django.utils.functional import curry


try:
    getattr(settings, 'AUTH_PROFILE_MODULE')
except AttributeError:
    raise ImproperlyConfigured(
        "The 'AUTH_PROFILE_MODULE' setting isn't defined."
    )


def _get_next_or_previous_by_profile_FIELD(self, field, is_next):
    profile = self.get_profile()
    next_or_previous = profile._get_next_or_previous_by_FIELD(field, is_next)
    return next_or_previous.user


def inject_profile(sender, instance):
    """Attach fields from a ``Profile`` to a ``User`` instance.

    Provide an alternative to ``User.get_profile`` by automatically attaching
    the profile's fields to the ``User`` when it is instantiated.  The special
    methods for ``DateField``, ``FileField``, ``ImageField`` and fields with
    choices are also created.  ``_get_next_or_previous_by_profile_FIELD`` is
    used instead of ``Model._get_next_or_previous_by_FIELD`` when currying the
    ``get_next_by_FIELD`` and ``get_previous_by_FIELD`` methods.

    If the profile doesn't exist -- ``AUTH_PROFILE_MODULE`` isn't set or a
    profile instance hasn't been created for the ``User`` -- nothing happens.

    """
    try:
        profile = instance.get_profile()
    except ObjectDoesNotExist:
        return None

    # Don't overwrite existing fields on User model.
    blacklist = [f.name for f in instance._meta.fields] + ['id', 'user']

    for field in [f for f in profile._meta.fields if f.name not in blacklist]:
        value = getattr(profile, field.name)
        setattr(instance, field.name, value)

        if field.choices:
            setattr(
                sender,
                'get_%s_display' % field.name,
                curry(sender._get_FIELD_display, field=field)
            )

        if isinstance(field, models.DateField) and not field.null:
            setattr(
                sender,
                'get_next_by_%s' % field.name,
                curry(
                    _get_next_or_previous_by_profile_FIELD,
                    field=field,
                    is_next=True
                )
            )
            setattr(
                sender,
                'get_previous_by_%s' % field.name,
                curry(
                    _get_next_or_previous_by_profile_FIELD,
                    field=field,
                    is_next=False
                )
            )

        if isinstance(field, models.FileField):
            setattr(
                sender,
                'get_%s_filename' % field.name,
                curry(sender._get_FIELD_filename, field=field)
            )
            setattr(
                sender,
                'get_%s_url' % field.name,
                curry(sender._get_FIELD_url, field=field)
            )
            setattr(
                sender,
                'get_%s_size' % field.name,
                curry(sender._get_FIELD_size, field=field)
            )

        if isinstance(field, models.ImageField):
            setattr(
                sender,
                'get_%s_height' % field.name,
                curry(sender._get_FIELD_height, field=field)
            )
            setattr(
                sender,
                'get_%s_width' % field.name,
                curry(sender._get_FIELD_width, field=field)
            )


#?? dispatcher.connect(inject_profile, sender=User, signal=post_init)

