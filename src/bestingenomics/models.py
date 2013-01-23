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

class Announcement(models.Model):
    username = models.ForeignKey(Users, db_column='username')
    password = models.CharField(max_length=93, blank=True)
    email = models.CharField(max_length=381, blank=True)
    account_type = models.CharField(max_length=30, blank=True)
    status = models.CharField(max_length=93, blank=True)
    class Meta:
        db_table = u'announcement'


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
    form = models.ForeignKey(Forms)
    submission = models.ForeignKey(Submissions)
    question_id = models.IntegerField()
    item_name = models.CharField(max_length=300)
    value = models.TextField()
    class Meta:
        db_table = u'answers'

class ApiIphone(models.Model):
    username = models.CharField(max_length=93, primary_key=True)
    iphone_id = models.CharField(max_length=1536)
    class Meta:
        db_table = u'api_iphone'

class BlockEmailBanners(models.Model):
    username = models.CharField(max_length=93, primary_key=True)
    class Meta:
        db_table = u'block_email_banners'

class BlockList(models.Model):
    email = models.CharField(max_length=250, primary_key=True)
    class Meta:
        db_table = u'block_list'

class BouncedEmails(models.Model):
    email = models.CharField(max_length=250, primary_key=True)
    class Meta:
        db_table = u'bounced_emails'

class Cities(models.Model):
    id = models.BigIntegerField(primary_key=True)
    state_id = models.BigIntegerField()
    city = models.CharField(max_length=600)
    class Meta:
        db_table = u'cities'

class Countries(models.Model):
    id = models.BigIntegerField(primary_key=True)
    country = models.CharField(max_length=450)
    class Meta:
        db_table = u'countries'

class CustomSettings(models.Model):
    identifier = models.CharField(unique=True, max_length=150)
    key = models.CharField(unique=True, max_length=150)
    value = models.TextField()
    updated_at = models.DateTimeField()
    class Meta:
        db_table = u'custom_settings'

class DeletedForms(models.Model):
    id = models.BigIntegerField(primary_key=True)
    class Meta:
        db_table = u'deleted_forms'

class FormProperties(models.Model):
    form = models.ForeignKey(Forms)
    item_id = models.BigIntegerField(primary_key=True)
    type = models.CharField(max_length=150, primary_key=True)
    prop = models.CharField(max_length=300)
    value = models.TextField()
    class Meta:
        db_table = u'form_properties'


class Integrations(models.Model):
    partner = models.CharField(max_length=96, primary_key=True)
    username = models.CharField(max_length=96, primary_key=True)
    form_id = models.BigIntegerField(primary_key=True)
    key = models.CharField(max_length=150, primary_key=True)
    value = models.TextField()
    updated_at = models.DateTimeField()
    class Meta:
        db_table = u'integrations'

class JotformPayments(models.Model):
    id = models.BigIntegerField(primary_key=True)
    date_time = models.DateTimeField()
    operation_date = models.DateTimeField()
    action = models.CharField(max_length=93)
    gateway = models.CharField(max_length=93)
    username = models.CharField(max_length=93)
    total = models.FloatField()
    period = models.CharField(max_length=93)
    currency = models.CharField(max_length=93)
    payment_status = models.CharField(max_length=93)
    subscription_id = models.CharField(max_length=600)
    note = models.TextField()
    ip = models.CharField(max_length=600)
    class Meta:
        db_table = u'jotform_payments'

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

class MonthlyUsage(models.Model):
    username = models.ForeignKey(Users, db_column='username')
    submissions = models.IntegerField()
    ssl_submissions = models.IntegerField()
    payments = models.IntegerField()
    uploads = models.CharField(max_length=60)
    tickets = models.IntegerField()
    oversubmissions = models.IntegerField(null=True, db_column='overSubmissions', blank=True) # Field name made lowercase.
    class Meta:
        db_table = u'monthly_usage'

class PaymentDataLog(models.Model):
    form_id = models.BigIntegerField()
    created_at = models.DateTimeField()
    submission_id = models.BigIntegerField()
    gateway = models.CharField(unique=True, max_length=90)
    log_type = models.CharField(unique=True, max_length=90)
    log_name = models.CharField(unique=True, max_length=90)
    log_data = models.TextField()
    class Meta:
        db_table = u'payment_data_log'

class PaymentLog(models.Model):
    date_time = models.DateTimeField()
    activity = models.CharField(max_length=240, blank=True)
    submission_id = models.BigIntegerField()
    payment_id = models.BigIntegerField()
    total = models.FloatField()
    curr = models.CharField(max_length=30)
    note = models.CharField(max_length=6144, blank=True)
    ip = models.CharField(max_length=60)
    class Meta:
        db_table = u'payment_log'

class PaymentProducts(models.Model):
    payment_id = models.BigIntegerField()
    product_id = models.BigIntegerField()
    class Meta:
        db_table = u'payment_products'

class Payments(models.Model):
    id = models.BigIntegerField(primary_key=True)
    payer_name = models.CharField(max_length=240, blank=True)
    payer_email = models.CharField(max_length=240, blank=True)
    total = models.FloatField()
    curr = models.CharField(max_length=30)
    submission = models.ForeignKey(Submissions, null=True, blank=True)
    status = models.CharField(max_length=240, blank=True)
    date_time = models.DateTimeField()
    class Meta:
        db_table = u'payments'

class PendingEmails(models.Model):
    id = models.IntegerField(primary_key=True)
    created_at = models.DateTimeField()
    email_config = models.TextField()
    class Meta:
        db_table = u'pending_emails'

class PendingRedirects(models.Model):
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
    form = models.ForeignKey(Forms)
    product_id = models.BigIntegerField(primary_key=True)
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
    form = models.ForeignKey(Forms)
    question_id = models.IntegerField(primary_key=True)
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

class ScheduledDowngrades(models.Model):
    username = models.CharField(max_length=93, primary_key=True)
    eot_time = models.DateTimeField()
    gateway = models.CharField(max_length=93)
    reason = models.CharField(max_length=93)
    class Meta:
        db_table = u'scheduled_downgrades'

class SchemaInfo(models.Model):
    version = models.IntegerField()
    class Meta:
        db_table = u'schema_info'

class SpamFilter(models.Model):
    id = models.IntegerField(primary_key=True)
    word = models.CharField(unique=True, max_length=150, blank=True)
    occurance_count = models.IntegerField(null=True, blank=True)
    is_spam = models.IntegerField(unique=True, null=True, blank=True)
    class Meta:
        db_table = u'spam_filter'

class SpamProb(models.Model):
    id = models.IntegerField(primary_key=True)
    form = models.ForeignKey(Forms, null=True, blank=True)
    spam_prob = models.FloatField(null=True, blank=True)
    suspended = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=150)
    class Meta:
        db_table = u'spam_prob'

class States(models.Model):
    id = models.BigIntegerField(primary_key=True)
    country_id = models.BigIntegerField()
    state = models.CharField(max_length=450)
    class Meta:
        db_table = u'states'


class TempPaymentLog(models.Model):
    date_time = models.DateTimeField()
    activity = models.CharField(max_length=240, blank=True)
    submission_id = models.BigIntegerField()
    payment_id = models.BigIntegerField()
    total = models.FloatField()
    curr = models.CharField(max_length=30)
    note = models.TextField(blank=True)
    ip = models.CharField(max_length=60)
    id = models.IntegerField(primary_key=True)
    username = models.CharField(max_length=300)
    class Meta:
        db_table = u'temp_payment_log'

class TestGoals(models.Model):
    id = models.BigIntegerField(primary_key=True)
    username = models.CharField(max_length=300)
    goal_name = models.CharField(max_length=300)
    created_at = models.DateTimeField()
    class Meta:
        db_table = u'test_goals'

class TestParticipants(models.Model):
    id = models.BigIntegerField(primary_key=True)
    username = models.CharField(unique=True, max_length=250)
    test_name = models.CharField(unique=True, max_length=250)
    group_name = models.CharField(max_length=300)
    created_at = models.DateTimeField()
    class Meta:
        db_table = u'test_participants'

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


class Whitelist(models.Model):
    form_id = models.BigIntegerField(primary_key=True)
    class Meta:
        db_table = u'whitelist'
