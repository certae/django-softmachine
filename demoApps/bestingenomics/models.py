# -*- coding: utf-8 -*-

from django.db import models

class Users(models.Model):
    id = models.IntegerField(primary_key=True)
    username = models.CharField(unique=True, max_length=93)
    password = models.CharField(max_length=192, blank=True)
    name = models.CharField(max_length=189, blank=True)
    email = models.CharField(max_length=381, blank=True)
    website = models.CharField(max_length=765, blank=True)
    time_zone = models.CharField(max_length=90, blank=True)
    ip = models.CharField(max_length=90, blank=True)
    account_type = models.CharField(max_length=36)
    status = models.CharField(max_length=39)
    saved_emails = models.TextField(blank=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(null=True, blank=True)
    last_seen_at = models.DateTimeField(null=True, blank=True)
    folder_config = models.TextField()
    last_migration = models.DateTimeField()
    submission_last_migration = models.DateTimeField()
    referer = models.CharField(max_length=1500)
    ldap = models.IntegerField(db_column='LDAP') # Field name made lowercase.
    class Meta:
        db_table = u'users'


class Forms(models.Model):
    id = models.BigIntegerField(primary_key=True)
    username = models.ForeignKey(Users, null=True, db_column='username', blank=True)
    title = models.CharField(max_length=765, blank=True)
    height = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=39, blank=True)
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(null=True, blank=True)
    new = models.IntegerField(null=True, blank=True)
    count = models.IntegerField(null=True, blank=True)
    source = models.TextField()
    slug = models.CharField(max_length=105)
    class Meta:
        db_table = u'forms'


class Submissions(models.Model):
    id = models.BigIntegerField(primary_key=True)
    form = models.ForeignKey(Forms)
    ip = models.CharField(max_length=63)
    created_at = models.DateTimeField()
    status = models.CharField(max_length=27, blank=True)
    new = models.IntegerField(null=True, blank=True)
    flag = models.IntegerField()
    notes = models.TextField()
    updated_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        db_table = u'submissions'

class Answers(models.Model):
    _fakeId = True

    form = models.ForeignKey(Forms)
    submission = models.ForeignKey(Submissions)
    question_id = models.IntegerField( primary_key=True )
    item_name = models.CharField(max_length=300)
    value = models.TextField()
    class Meta:
        db_table = u'answers'


class FormProperties(models.Model):
    _fakeId = True

    form = models.ForeignKey(Forms)
    item_id = models.BigIntegerField(primary_key=True)
    type = models.CharField(max_length=150, primary_key=True)
    prop = models.CharField(max_length=300)
    value = models.TextField()
    class Meta:
        db_table = u'form_properties'


class Listings(models.Model):
    id = models.BigIntegerField(primary_key=True)
    form = models.ForeignKey(Forms)
    title = models.CharField(max_length=240)
    fields = models.TextField()
    list_type = models.CharField(max_length=30)
    status = models.CharField(max_length=39, blank=True)
    password = models.CharField(max_length=192)
    class Meta:
        db_table = u'listings'


class PendingRedirects(models.Model):
    _fakeId = True

    form_id = models.BigIntegerField(primary_key=True)
    submission_id = models.BigIntegerField(primary_key=True)
    created_at = models.DateTimeField()
    type = models.CharField(max_length=90)
    value = models.TextField()
    class Meta:
        db_table = u'pending_redirects'

class PendingSubmissions(models.Model):
    submission_id = models.BigIntegerField(primary_key=True)
    created_at = models.DateTimeField()
    type = models.CharField(max_length=150)
    form = models.ForeignKey(Forms)
    token = models.CharField(max_length=150)
    serialized_data = models.TextField()
    session_id = models.CharField(max_length=270)
    class Meta:
        db_table = u'pending_submissions'

class Products(models.Model):
    product_id = models.BigIntegerField(primary_key=True)
    form = models.ForeignKey(Forms)
    name = models.CharField(max_length=240, blank=True)
    price = models.FloatField(null=True, blank=True)
    subs_type = models.CharField(max_length=30, blank=True)
    subs_duration = models.IntegerField(null=True, blank=True)
    setup_fee = models.IntegerField(null=True, blank=True)
    currency = models.CharField(max_length=30, blank=True)
    trial_type = models.CharField(max_length=30, blank=True)
    trial_duration = models.IntegerField(null=True, blank=True)
    type = models.CharField(max_length=60, blank=True)
    class Meta:
        db_table = u'products'

class QuestionProperties(models.Model):
    question_id = models.IntegerField(primary_key=True)
    form = models.ForeignKey(Forms)
    prop = models.CharField(max_length=765)
    value = models.TextField(blank=True)
    class Meta:
        db_table = u'question_properties'

class Reports(models.Model):
    id = models.BigIntegerField(primary_key=True)
    form = models.ForeignKey(Forms)
    title = models.CharField(max_length=765, blank=True)
    configuration = models.TextField()
    created_at = models.DateTimeField()
    updated_at = models.DateTimeField(null=True, blank=True)
    password = models.CharField(max_length=192)
    class Meta:
        db_table = u'reports'


class UploadFiles(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=250)
    type = models.CharField(max_length=93)
    size = models.IntegerField()
    username = models.ForeignKey(Users, db_column='username')
    form = models.ForeignKey(Forms)
    submission_id = models.BigIntegerField()
    uploaded = models.IntegerField()
    date = models.DateTimeField()
    class Meta:
        db_table = u'upload_files'

