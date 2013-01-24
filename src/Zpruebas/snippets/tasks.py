# FILE: models.py
#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
      Title: Scheduler models
     Author: Will Hardy (http://willhardy.com.au)
       Date: December 2007
 Test suite: manage.py test scheduler
  $Revision: $

Description: Integrates Python and the native crontab.
             A more beginner-friendly interface is offered, and entries are stored in a database.
             The database is used to update the local crontab.


Inspired by snippet 1126, I thought I would post a module that stores crontab entries in a database, with a less powerful, but more end-user friendly API. ("twice a week starting on Sat 1 Dec 2007, 6:23am", instead of "23 6,18 * ").
The crontab is synchronised when an entry is changed, and relevant environment variables, function name and arguments are provided. You might want to store this as an app called "scheduler" to match the imports.


"""

__all__ = ('Task', 'update_crontab')

import os
import tempfile
from django.db import models
from datetime import datetime, timedelta
import calendar
from django.utils.translation import ugettext as _

TIME_SCALES = (
            ("hour", _("hour")),
            ("day", _("day")),
            ("week", _("week")),
            ("month", _("month")),
            ("year", _("year")),
            )

class Task(models.Model):
    """
        Add a task to be entered into this user's crontab.
        When the time comes, a simple python function is called with a single text
        argument. This interface is not intended to be comprehensive, rather, it is
        intended to be pointed to a python function that is specially prepared to
        carry out the intended function and only needs to be told when.

        name:       A name is good for the user to remember this, but is not necessary.
        active:     Allows the task to be temporarily switched off.
        start:      A date and time when this task should be run.
        stop:       A date and time after which repetitions should not take place.
        time_scale: The type of repetition that will take place.
        period:     How often the repetitions will take place. (zero is for no repetitions)
        times_run:  How many times this has already been executed
        function:   The full path to the python function to be executed (with periods).
        argument:   A single string argument to be given to the function.
        expert:     Allows direct manipulation of the crontab entry (only the time/date part please!)
    """
    name = models.CharField(_("name"), max_length=200, default="", blank=True)
    active = models.BooleanField(_("active"), default=True)
    start = models.DateTimeField(_("start"), default=datetime.now(), null=True, blank=True)
    stop = models.DateTimeField(_("stop"), null=True, blank=True)
    time_scale = models.CharField(max_length=5, choices=TIME_SCALES, null=True, blank=True)
    period = models.PositiveSmallIntegerField(default=0, null=True)
    times_run = models.PositiveSmallIntegerField(default=0, editable=False)
    function = models.CharField(max_length=200)
    arguments = models.CharField(max_length=200, default="", blank=True)
    #expert = models.CharField(max_length=100, default="", blank=True)

    class Meta:
        verbose_name = _("task")
        verbose_name_plural = _("tasks")

    class Admin:
        list_display = ('__unicode__', 'start', 'time_scale', 'times_run')

    def __unicode__(self):
        " A useful textual description of this task. "
        if self.name:
            return self.name
        elif self.arguments:
            # TODO: A better automatic description i.e. "Automatic task every tuesday."
            return u"%s %s" % (self.get_function_name(), self.arguments)
        else:
            return u"Task %d" % self.id

    def save(self):
        """ Updates the crontab when a task is saved. 
        """
        super(Task, self).save()
        update_crontab()
    
    def get_module_path(self):
        """ Get the module path, without the function name. 
            >>> start = datetime(2007, 12, 1, 6, 23)
            >>> task = Task(function="path.to.test", start=start)

            >>> task.get_module_path()
            'path.to'
            >>> task.function = "test"
            >>> task.get_module_path()
            ''
            >>> task.function = ""
            >>> task.get_module_path()
            ''
        """
        return ".".join(self.function.split(".")[:-1])

    def get_function_name(self):
        """ Get the function name, without the module path. 
            >>> start = datetime(2007, 12, 1, 6, 23)
            >>> task = Task(function="path.to.test", start=start)

            >>> task.get_function_name()
            'test'
            >>> task.function = "test"
            >>> task.get_function_name()
            'test'
            >>> task.function = ""
            >>> task.get_function_name()
            ''
        """
        return self.function.split(".")[-1]


    def get_crontab_entry(self):
        """ Gets the entire contrab line, including time specification and command. 
            >>> start = datetime(2007, 12, 1, 6, 23)
            >>> task = Task(function="test", start=start)

            >>> task.get_crontab_entry() is None
            True
            >>> task.id = 5
            >>> len(task.get_crontab_entry().split())
            9
        """
        crontab_time = self.get_crontab_time()
        crontab_command = self.get_crontab_command()
        crontab_argument = self.get_crontab_argument()
        if crontab_time and crontab_command and crontab_argument:
            return ' '.join([crontab_time, crontab_command, crontab_argument])

    def get_crontab_argument(self):
        """ Forms the argument to be used for the crontab command. 
            >>> start = datetime(2007, 12, 1, 6, 23)
            >>> task = Task(function="test", start=start)

            >>> task.get_crontab_argument() is None
            True
            >>> task.id = 5
            >>> task.get_crontab_argument()
            'task_005'
        """
        if self.id:
            return 'task_%03d' % self.id

    def get_crontab_command(self):
        """ Forms the command to be used for the crontab command. 
            >>> start = datetime(2007, 12, 1, 6, 23)
            >>> task = Task(function="test", start=start)
            >>> task.get_crontab_command().rstrip("c").endswith("py") or task.get_crontab_command()
            True

            TODO: Prevent issues with spaces in filename
        """
        path = get_command_path()
        return "%s %s" % ("/usr/bin/env python", path)

    def get_crontab_time(self):
        """ Get the time part of a crontab line for this task.
            This is a space separated list of 5 entries:
                 "2 * * * *"
            Multiple values are also possible, if self.period is set:
                 "2,32 * * * *"

            >>> the_time = datetime(2007, 12, 1, 6, 23) # Sat 1 Dec 2007, 6:23am
            >>> task = Task(function="test", start=the_time)
            >>> task.period = 1

            >>> task.time_scale = "hour"
            >>> task.get_crontab_time()
            '23 * * * *'

            >>> task.time_scale = "day"
            >>> task.get_crontab_time()
            '23 6 * * *'

            >>> task.time_scale = "week"
            >>> task.get_crontab_time()
            '23 6 * * 6'

            >>> task.time_scale = "month"
            >>> task.get_crontab_time()
            '23 6 1 * *'

            >>> task.period = 2
            >>> task.time_scale = "day"
            >>> task.get_crontab_time()
            '23 6,18 * * *'

            >>> task.time_scale = "year"
            >>> task.get_crontab_time()
            '23 6 1 6,12 *'

            >>> task.period = 6
            >>> task.time_scale = "month"
            >>> task.get_crontab_time()
            '23 6 1,6,11,16,21,26 * *'

            >>> task.period = 0
            >>> task.get_crontab_time()
            '23 6 1 12 *'

            >>> task.period = 5
            >>> task.time_scale = None
            >>> task.get_crontab_time()
            '23 6 1 12 *'
        """
        def with_repeats(start, max):
            """ Get a sequence of repeated values in CSV form.
                e.g. with_repeats(14, 31) with a period of 3 will give: "4,14,24"
            """
            values = get_stepped_sequence(start, max, self.period)

            # Convert to string and join using commas
            return ",".join([ str(v) for v in values ])

        # Synchronise our period and timescale if repetition is turned off
        if self.period == 0:
            self.time_scale = None
        if self.time_scale is None:
            self.period = 0

        # Default all values to stars
        minute = hour = day = month = weekday = "*"

        if self.time_scale == "hour":
            minute = with_repeats(self.start.minute, 60)

        elif self.time_scale == "day":
            minute = str(self.start.minute)
            hour = with_repeats(self.start.hour, 24)

        elif self.time_scale == "week":
            minute = str(self.start.minute)
            hour = str(self.start.hour)
            weekday = with_repeats((self.start.weekday() + 1) % 7, 7)

        elif self.time_scale == "month":
            minute = str(self.start.minute)
            hour = str(self.start.hour)
            day = with_repeats(self.start.day, 31)

        else: # catch both "year" and None
            minute = str(self.start.minute)
            hour = str(self.start.hour)
            day = str(self.start.day)
            month = with_repeats(self.start.month, 12)

        return " ".join([minute, hour, day, month, weekday])

    def next_occurrence(self, reference=None):
        """ The time and date of the next occurace to take place. 
            >>> reference = datetime(2007, 12, 12, 17, 51) # Wed 12 Dec 2007, 5:51pm
            >>> start = datetime(2007, 11, 3, 6, 23) # Sat 3 Nov 2007, 6:23am
            >>> task = Task(function="test", start=start)

            >>> task.period = 2
            >>> task.time_scale = "hour"
            >>> task.next_occurrence(reference=reference)
            datetime.datetime(2007, 12, 12, 17, 53)

            >>> task.time_scale = "day"
            >>> task.next_occurrence(reference=reference)
            datetime.datetime(2007, 12, 12, 18, 23)

            >>> task.time_scale = "week"
            >>> task.period = 1
            >>> task.next_occurrence(reference=reference)
            datetime.datetime(2007, 12, 15, 6, 23)

            >>> task.time_scale = "month"
            >>> task.next_occurrence(reference=reference)
            datetime.datetime(2008, 1, 3, 6, 23)
        """
        #def get_next_step(start, ref, max):
            #" A convenience function that provides the next step "
            #steps = get_stepped_sequence(start, max, self.period)
            #steps = [ (i > ref and i) or i+max for i in steps ]
            #value = min(steps)
            #return value


        if not reference:
            reference = datetime.now()

        attempt = None
        period_delta = None

        if self.start > reference:
            return self.start

        minute, hour, day, month, year = reference.minute, reference.hour, reference.day, reference.month, reference.year

        # For each possible time scale, work out a naive start time and a period delta.
        # If the start time is behind the reference time, increment until we have a time in the future.

        if self.time_scale == "hour":
            period_delta = timedelta(minutes=60/self.period)
            minute = self.start.minute

        if self.time_scale == "day":
            period_delta = timedelta(hours=24/self.period)
            minute = self.start.minute
            hour = self.start.hour

        if self.time_scale == "week":
            period_delta = timedelta(hours=7*24/self.period)
            minute = self.start.minute
            hour = self.start.hour

            # Move backwards in time to the correct day of the week
            day_correction = self.start.weekday() - reference.weekday()
            if day_correction > 0:
                day_correction - 7
            correction_delta = timedelta(days=day_correction)
            attempt = datetime(year, month, day, hour, minute) + correction_delta

        if self.time_scale == "month":
            minute = self.start.minute
            hour = self.start.hour
            day = self.start.day

            # Days in current month needs to be accurate, to avoid landing on
            # another day of the month
            days_in_month = reference.month in (1,3,5,7,8,10,12) and 31 or \
                             reference.month in (4,6,9,11) and 30 or \
                             calendar.isleap(reference.year) and 29 or 28
            period_delta = timedelta(days=days_in_month/self.period)

        if self.time_scale == "year":
            days_in_year = calendar.isleap(reference.year) and reference.month <= 2 and 366 or \
                           calendar.isleap(reference.year+1) and reference.month > 2 and 366 or 365
            period_delta = timedelta(days=days_in_year/self.period)
            minute = self.start.minute
            hour = self.start.hour
            day = self.start.day
            month = self.start.month

        # If nothing was matched either, given up
        if not period_delta:
            return self.start > reference and self.start or None

        # If not done already, make an attempt
        if not attempt:
            attempt = datetime(year, month, day, hour, minute)

        # Keep incrementing the attempt until it is in the future
        while attempt < reference:
            attempt += period_delta

        return attempt
            

    def upcoming(self, reference=None):
        """ If the task has started or is due to start in the next 24 hours. 

            >>> reference_01 = datetime(2007, 11, 11, 17, 51)
            >>> reference_02 = datetime(2007, 11, 12, 17, 51)
            >>> start = datetime(2007, 11, 13, 6, 23)
            >>> task = Task(function="test", start=start)
            >>> task.upcoming(reference=reference_01)
            False
            >>> task.upcoming(reference=reference_02)
            True
            >>> task.upcoming()
            True
        """
        if not reference:
            reference = datetime.now()
        return self.start - reference < timedelta(hours=24)

    def imminent(self, reference=None):
        """ If this task needs to be executed very soon 
            (and thus should be done immediately). 

            >>> reference_01 = datetime(2007, 11, 11, 17, 51)
            >>> reference_02 = datetime(2007, 11, 12, 17, 51)
            >>> start        = datetime(2007, 11, 12, 17, 52)
            >>> task = Task(function="test", start=start)
            >>> task.imminent(reference=reference_01)
            False
            >>> task.imminent(reference=reference_02)
            True
            >>> task.imminent()
            False
        """
        if not reference:
            reference = datetime.now()
        next = self.next_occurrence(reference=reference)
        if next:
            return next - reference < timedelta(minutes=5)

        return False

def get_stepped_sequence(start, max, period):
    """ Get a stepped sequence, wrapping around a max value.
        period is the number of values involved.
        >>> get_stepped_sequence(3, 56, 4)
        [3, 17, 31, 45]
        >>> get_stepped_sequence(45, 46, 2)
        [22, 45]
        >>> get_stepped_sequence(45, 46, 1)
        [45]
        >>> get_stepped_sequence(45, 46, 0)
        [45]
        >>> get_stepped_sequence(47, 46, 0)
        []
        >>> get_stepped_sequence(5, 11, 12)
        []
    """

    # Some exceptional cases
    if start > max:
        return []
    if period > max:
        return []
    if not period:
        return [ start ]

    step = max / period 

    values = []
    while len(values) < period:
        offset = len(values) * step
        value = ((offset + start - 1) % max) + 1
        values.append(value)

    values.sort()

    return values

def get_command_path():
    """ Returns the path to the command to be run through cron. """
    return '%s/%s' % (os.path.dirname(__file__), 'run_task.py')

def update_crontab():
    """ Synchronises the database and the crontab. 
        Issue: any jobs that are imminent may not be run.
    """
    tasks = Task.objects.all()
    # Create a series of entries from each of the tasks
    lines = [ task.get_crontab_entry() for task in tasks ]
    # Add an extra line for maintenance
    #lines.append(Task.get_maintenance_entry())
    # Join the lines into a single file
    crontab = "\n".join(lines)

    # Get the preexisting crontab and remove old lines
    old_crontab = tempfile.NamedTemporaryFile()
    filename = old_crontab.name
    os.system('crontab -l > %s' % filename)

    # Remove old lines
    crontab_lines = []
    for line in old_crontab.readlines():
        if get_command_path() not in line:
            crontab_lines.append(line)
    old_crontab.close()

    # Append environment lines to the crontab
    # Whatever environment is being used to update the crontab
    # will be set in the crontab so that the script that is 
    # eventually run, will run with the same environment variables..

    # 1. name of the settings module for django
    settings_key = 'DJANGO_SETTINGS_MODULE'
    if settings_key in os.environ:
        settings_module = os.environ[settings_key]
    else:
        settings_module = 'settings'
    if settings_module.split('.')[-1] == '__init__':
        settings_module = ".".join(settings_module.split(".")[:-1] + ['settings'])
    environment_line = '%s=%s\n' % (settings_key, settings_module)
    if environment_line not in crontab_lines:
        crontab_lines.append(environment_line)
    
    # 2. python path
    pythonpath_key = 'PYTHONPATH'
    environment_line = '%s=%s\n' % (pythonpath_key, os.environ[pythonpath_key])
    if pythonpath_key in os.environ and environment_line not in crontab_lines:
        crontab_lines.append(environment_line)

    # Append new lines
    for task in Task.objects.filter(active=True):
        entry = task.get_crontab_entry() + '\n'
        if entry:
            crontab_lines.append(entry)

    # Set the new crontab
    new_crontab = tempfile.NamedTemporaryFile()
    new_crontab.writelines(crontab_lines)
    new_filename = new_crontab.name
    new_crontab.flush()
    os.system('crontab %s' % new_filename)
    new_crontab.close()

# FILE: views.py
#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
      Title: Scheduler views
     Author: Will Hardy (http://willhardy.com.au)
       Date: December 2007
 Test suite: ../models test scheduler
  $Revision: $

Description: Intergrates Python and the native crontab.
             A more beginner-friendly interface is offered, and entries are stored in a database.
             The database is used to update the local crontab.

"""

from scheduler.models import Task

def run_task(task_id):
    """ Run the task with the given ID. 

        >>> task = Task(function="scheduler.tests.test_function")
        >>> task.save()
        >>> run_task(task.id)
        Success!
    """

    task = Task.objects.get(id=task_id)
    module = __import__(task.get_module_path(), [], [], task.get_function_name())
    function = getattr(module, task.get_function_name())
    if task.arguments:
        args = task.arguments.split(",")
        function(*args)
    else:
        function()

    # Do some accounting
    task.times_run += 1
    task.save()

# FILE: run_task.py
#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
      Title: Scheduler crontab entry point
     Author: Will Hardy (http://willhardy.com.au)
       Date: December 2007
  $Revision: $

Description: This script is to be called directly.

"""
import os
import sys
from scheduler.models import Task, update_crontab
from scheduler.views import run_task

if __name__ == "__main__":

    # If this module is called directly, run the given task
    usage = 'USAGE: %s task_id' % sys.argv[0]
    if len(sys.argv) == 2:
        command = sys.argv[1]
        if command == "update":
            update_crontab()
            exit()
        # Try to parse the task id from the command
        if command.startswith('task_'):
            command = command[5:]
        try:
            task_id = int(command)
        except ValueError:
            sys.exit(usage)

        # Run the task matching the given task_id
        try:
            run_task(task_id)
        except Task.DoesNotExist:
            sys.exit("Task with this ID (%s) does not exist." % task_id)
    else:
        sys.exit(usage)


