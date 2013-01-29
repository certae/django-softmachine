# -*- coding: UTF-8 -*-

""" 
Un modelo hereda del otro, el de base no se modifica nunca, el otro apunta al ultimo registro
es la misma tabla de base y un adicional con un solo registro q apunta a la ultima modificacion   

One model holds all the data, from every object version ever to exist. 
The other model simply points to the latest object from its gigantic brother. 
All fields can be accessed transparently from the little model version, so the user need not know what is going on. 
Coincidently, Django model inheritance does exactly the same thing, so to keep things insanely simple, that's what we'll use:

class EmployeeHistory(FullHistory):
    name = models.CharField(max_length=100)

class Employee(EmployeeHistory):
    pass
That's it! Django admin can be used to administer the Employee and every version will be kept as its own EmployeeHistory object, these can of course all be browsed using the admin :-)

This is early days and just a proof of concept. I'd like to see how far I can go with this, handling ForeignKeys, ManyToManyFields, using custom managers and so on. It should all be straightforward, especially as the primary keys should be pretty static in the history objects...
"""


from django.db import models
from datetime import datetime

class FullHistory(models.Model):
    """ 
    Issues: Unique fields don't work (multiple versions of the same row may need to have the same value)
    """
    date_created     = models.DateTimeField(default=datetime.now, editable=False)
    date_updated     = models.DateTimeField(default=datetime.now, editable=False)

    class Meta:
        abstract = True
        ordering = ('date_updated',)

    def __init__(self, *args, **kwargs):
        # History classes must end in 'History', others must not.
        if self.__class__.__name__.endswith('History'):
            self._history_class = True
        else:
            self._history_class = False
        super(FullHistory, self).__init__(*args, **kwargs)


    def save(self, *args, **kwargs):
        if self._history_class:
            self._save_history_instance()
        else:
            self._save_non_history_instance()

        super(FullHistory, self).save(*args, **kwargs)

    def _save_history_instance(self):
        """ Save method for a History object.
        """
        # This updated instance must become a new object, 
        # no updating is possible for history classes
        self.id = None

    def _save_non_history_instance(self):
        """ Save method for a non-History object.
        """
        # Duplicate and reassign parent.
        for model, field in self._meta.parents.items():
            if getattr(self, '%s_id' % field.name) is not None:
                rel_obj = getattr(self, field.name)
                rel_obj.id = None
                rel_obj.save()
                setattr(self, '%s_id' % field.name, rel_obj.id)

        # Set the new update time on the non-archived version
        self.date_updated = datetime.now()

    def delete(self):
        # Only delete if this is not a "history" version
        if not self._history_class:
            self.save()
            super(FullHistory, self).delete()
