# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#     * Rearrange models' order
#     * Make sure each model has one field with primary_key=True
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [appname]'
# into your database.

from django.db import models

class DecimalPrecision(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    digits = models.IntegerField()
    name = models.CharField(max_length=50)
    class Meta:
        db_table = u'decimal_precision'

class BoardCreate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    menu_parent = models.ForeignKey(IrUiMenu)
    class Meta:
        db_table = u'board_create'

class IrActUrl(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=32)
    usage = models.CharField(max_length=32)
    url = models.TextField()
    target = models.CharField(max_length=64)
    create_uid = models.IntegerField()
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    help = models.TextField()
    class Meta:
        db_table = u'ir_act_url'

class IrActReportCustom(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=32)
    usage = models.CharField(max_length=32)
    report_id = models.IntegerField()
    create_uid = models.IntegerField()
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    help = models.TextField()
    class Meta:
        db_table = u'ir_act_report_custom'

class ProcessTransitionGroupRel(models.Model):
    tid = models.ForeignKey(ProcessTransition, db_column='tid')
    rid = models.ForeignKey(ResGroups, db_column='rid')
    class Meta:
        db_table = u'process_transition_group_rel'

class ResGroupsUsersRel(models.Model):
    uid = models.ForeignKey(ResUsers, db_column='uid')
    gid = models.ForeignKey(ResGroups, db_column='gid')
    class Meta:
        db_table = u'res_groups_users_rel'

class ProcessCondition(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    model = models.ForeignKey(IrModel)
    node = models.ForeignKey(ProcessNode)
    model_states = models.CharField(max_length=128)
    name = models.CharField(max_length=30)
    class Meta:
        db_table = u'process_condition'

class IrUiView(models.Model):
    id = models.IntegerField(primary_key=True)
    model = models.CharField(max_length=64)
    type = models.CharField(max_length=64)
    arch = models.TextField()
    field_parent = models.CharField(max_length=64)
    priority = models.IntegerField()
    create_uid = models.IntegerField()
    create_date = models.ForeignKey(ResUsers, db_column='create_date')
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    inherit = models.ForeignKey(ResUsers)
    name = models.ForeignKey('self', db_column='name')
    class Meta:
        db_table = u'ir_ui_view'

class Wkf(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    osv = models.CharField(max_length=64)
    on_create = models.BooleanField()
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'wkf'

class WkfWorkitem(models.Model):
    id = models.IntegerField(primary_key=True)
    act = models.ForeignKey(WkfActivity)
    inst = models.ForeignKey(WkfInstance)
    subflow = models.ForeignKey(WkfInstance)
    state = models.CharField(max_length=64)
    class Meta:
        db_table = u'wkf_workitem'

class SaleConfigSettings(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    module_sale = models.BooleanField()
    module_plugin_outlook = models.BooleanField()
    module_web_linkedin = models.BooleanField()
    module_plugin_thunderbird = models.BooleanField()
    module_crm = models.BooleanField()
    module_crm_helpdesk = models.BooleanField()
    group_fund_raising = models.BooleanField()
    fetchmail_lead = models.BooleanField()
    module_crm_claim = models.BooleanField()
    group_sale_pricelist = models.BooleanField()
    group_discount_per_so_line = models.BooleanField()
    timesheet = models.BooleanField()
    group_invoice_so_lines = models.BooleanField()
    module_sale_stock = models.BooleanField()
    time_unit = models.ForeignKey(ProductUom, db_column='time_unit')
    module_account_analytic_analysis = models.BooleanField()
    group_uom = models.BooleanField()
    module_project = models.BooleanField()
    module_analytic_user_function = models.BooleanField()
    module_sale_journal = models.BooleanField()
    module_warning = models.BooleanField()
    module_sale_margin = models.BooleanField()
    module_delivery = models.BooleanField()
    group_invoice_deli_orders = models.BooleanField()
    task_work = models.BooleanField()
    default_order_policy = models.CharField(max_length=-1)
    module_project_timesheet = models.BooleanField()
    default_picking_policy = models.BooleanField()
    group_sale_delivery_address = models.BooleanField()
    group_multiple_shops = models.BooleanField()
    group_mrp_properties = models.BooleanField()
    module_project_mrp = models.BooleanField()
    class Meta:
        db_table = u'sale_config_settings'

class WkfTransition(models.Model):
    id = models.IntegerField(primary_key=True)
    act_from = models.ForeignKey(WkfActivity, db_column='act_from')
    act_to = models.ForeignKey(WkfActivity, db_column='act_to')
    condition = models.CharField(max_length=128)
    trigger_type = models.CharField(max_length=128)
    trigger_expr_id = models.CharField(max_length=128)
    signal = models.CharField(max_length=64)
    group = models.ForeignKey(ResGroups)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    trigger_model = models.CharField(max_length=128)
    class Meta:
        db_table = u'wkf_transition'

class BaseConfigSettings(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    module_portal = models.BooleanField()
    module_base_import = models.BooleanField()
    module_share = models.BooleanField()
    module_auth_oauth = models.BooleanField()
    module_portal_anonymous = models.BooleanField()
    module_multi_company = models.BooleanField()
    alias_domain = models.CharField(max_length=-1)
    auth_signup_uninvited = models.BooleanField()
    auth_signup_reset_password = models.BooleanField()
    auth_signup_template_user = models.ForeignKey(ResUsers)
    group_note_fancy = models.BooleanField()
    module_note_pad = models.BooleanField()
    class Meta:
        db_table = u'base_config_settings'

class BaseSetupTerminology(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    partner = models.CharField(max_length=-1)
    class Meta:
        db_table = u'base_setup_terminology'

class ProcessNode(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    menu = models.ForeignKey(IrUiMenu)
    model = models.ForeignKey(IrModel)
    kind = models.CharField(max_length=-1)
    note = models.TextField()
    name = models.CharField(max_length=30)
    subflow = models.ForeignKey(ProcessProcess)
    process = models.ForeignKey(ProcessProcess)
    model_states = models.CharField(max_length=128)
    help_url = models.CharField(max_length=255)
    flow_start = models.BooleanField()
    class Meta:
        db_table = u'process_node'

class ProcessProcess(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    active = models.BooleanField()
    model = models.ForeignKey(IrModel)
    note = models.TextField()
    name = models.CharField(max_length=30)
    class Meta:
        db_table = u'process_process'

class ProcessTransitionIds(models.Model):
    ptr = models.ForeignKey(ProcessTransition)
    wtr = models.ForeignKey(WkfTransition)
    class Meta:
        db_table = u'process_transition_ids'

class ProcessTransition(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    note = models.TextField()
    name = models.CharField(max_length=32)
    source_node = models.ForeignKey(ProcessNode)
    target_node = models.ForeignKey(ProcessNode)
    class Meta:
        db_table = u'process_transition'

class ProcessTransitionAction(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    action = models.CharField(max_length=64)
    state = models.CharField(max_length=-1)
    name = models.CharField(max_length=32)
    transition = models.ForeignKey(ProcessTransition)
    class Meta:
        db_table = u'process_transition_action'

class ResourceCalendarAttendance(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    dayofweek = models.CharField(max_length=-1)
    hour_from = models.FloatField()
    name = models.CharField(max_length=64)
    calendar = models.ForeignKey(ResourceCalendar)
    date_from = models.DateField()
    hour_to = models.FloatField()
    class Meta:
        db_table = u'resource_calendar_attendance'

class WkfWitmTrans(models.Model):
    trans = models.ForeignKey(WkfTransition)
    inst = models.ForeignKey(WkfInstance)
    class Meta:
        db_table = u'wkf_witm_trans'

class WkfLogs(models.Model):
    id = models.IntegerField(primary_key=True)
    res_type = models.CharField(max_length=128)
    res_id = models.IntegerField()
    uid = models.ForeignKey(ResUsers, db_column='uid')
    act = models.ForeignKey(WkfActivity)
    time = models.TimeField()
    info = models.CharField(max_length=128)
    class Meta:
        db_table = u'wkf_logs'

class ResourceResource(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    time_efficiency = models.FloatField()
    code = models.CharField(max_length=16)
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=64)
    company = models.ForeignKey(ResCompany)
    active = models.BooleanField()
    calendar = models.ForeignKey(ResourceCalendar)
    resource_type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'resource_resource'

class WkfActivity(models.Model):
    id = models.IntegerField(primary_key=True)
    wkf = models.ForeignKey(Wkf)
    subflow = models.ForeignKey(Wkf)
    split_mode = models.CharField(max_length=3)
    join_mode = models.CharField(max_length=3)
    kind = models.CharField(max_length=16)
    name = models.CharField(max_length=64)
    signal_send = models.CharField(max_length=32)
    flow_start = models.BooleanField()
    flow_stop = models.BooleanField()
    action = models.TextField()
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    action = models.ForeignKey(IrActServer)
    class Meta:
        db_table = u'wkf_activity'

class WkfInstance(models.Model):
    id = models.IntegerField(primary_key=True)
    wkf = models.ForeignKey(Wkf)
    uid = models.IntegerField()
    res_id = models.IntegerField()
    res_type = models.CharField(max_length=64)
    state = models.CharField(max_length=32)
    class Meta:
        db_table = u'wkf_instance'

class IrModuleCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    parent = models.ForeignKey('self')
    name = models.CharField(max_length=128)
    sequence = models.IntegerField()
    visible = models.BooleanField()
    description = models.TextField()
    class Meta:
        db_table = u'ir_module_category'

class ResourceCalendar(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    manager = models.ForeignKey(ResUsers, db_column='manager')
    name = models.CharField(max_length=64)
    company = models.ForeignKey(ResCompany)
    class Meta:
        db_table = u'resource_calendar'

class ResourceCalendarLeaves(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    resource = models.ForeignKey(ResourceResource)
    calendar = models.ForeignKey(ResourceCalendar)
    date_from = models.DateTimeField()
    date_to = models.DateTimeField()
    company_id = models.IntegerField()
    holiday = models.ForeignKey(HrHolidays)
    class Meta:
        db_table = u'resource_calendar_leaves'

class MailNotification(models.Model):
    id = models.IntegerField(primary_key=True)
    read = models.BooleanField()
    starred = models.BooleanField()
    partner = models.ForeignKey(ResPartner)
    message = models.ForeignKey(MailMessage)
    class Meta:
        db_table = u'mail_notification'

class ResCompany(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=128)
    parent = models.ForeignKey('self')
    partner = models.ForeignKey(ResPartner)
    currency = models.ForeignKey(ResCurrency)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    rml_footer = models.TextField()
    rml_header = models.TextField()
    paper_format = models.CharField(max_length=-1)
    logo_web = models.TextField() # This field type is a guess.
    rml_header2 = models.TextField()
    rml_header3 = models.TextField()
    rml_header1 = models.CharField(max_length=200)
    account_no = models.CharField(max_length=64)
    company_registry = models.CharField(max_length=64)
    custom_footer = models.BooleanField()
    project_time_mode = models.ForeignKey(ProductUom)
    expects_chart_of_accounts = models.BooleanField()
    paypal_account = models.CharField(max_length=128)
    overdue_msg = models.TextField()
    tax_calculation_rounding_method = models.CharField(max_length=-1)
    expense_currency_exchange_account = models.ForeignKey(AccountAccount)
    income_currency_exchange_account = models.ForeignKey(AccountAccount)
    vat_check_vies = models.BooleanField()
    schedule_range = models.FloatField()
    po_lead = models.FloatField()
    security_lead = models.FloatField()
    manufacturing_lead = models.FloatField()
    timesheet_max_difference = models.FloatField()
    timesheet_range = models.CharField(max_length=-1)
    class Meta:
        db_table = u'res_company'

class IrModuleModuleDependency(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=128)
    version_pattern = models.CharField(max_length=128)
    module = models.ForeignKey(IrModuleModule)
    class Meta:
        db_table = u'ir_module_module_dependency'

class ResCurrency(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=32)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    rounding = models.DecimalField(max_digits=65535, decimal_places=65535)
    symbol = models.CharField(max_length=4)
    company = models.ForeignKey(ResCompany)
    date = models.DateField()
    base = models.BooleanField()
    active = models.BooleanField()
    position = models.CharField(max_length=-1)
    accuracy = models.IntegerField()
    class Meta:
        db_table = u'res_currency'

class ResLang(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=64)
    code = models.CharField(unique=True, max_length=16)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_format = models.CharField(max_length=64)
    direction = models.CharField(max_length=-1)
    thousands_sep = models.CharField(max_length=64)
    translatable = models.BooleanField()
    time_format = models.CharField(max_length=64)
    decimal_point = models.CharField(max_length=64)
    active = models.BooleanField()
    iso_code = models.CharField(max_length=16)
    grouping = models.CharField(max_length=64)
    class Meta:
        db_table = u'res_lang'

class IrModelData(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.IntegerField()
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    noupdate = models.BooleanField()
    name = models.CharField(max_length=128)
    date_init = models.DateTimeField()
    date_update = models.DateTimeField()
    module = models.CharField(max_length=64)
    model = models.CharField(max_length=64)
    res_id = models.IntegerField()
    class Meta:
        db_table = u'ir_model_data'

class IrSequenceType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    code = models.CharField(unique=True, max_length=32)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'ir_sequence_type'

class IrModelAccess(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    model = models.ForeignKey(IrModel)
    perm_read = models.BooleanField()
    name = models.CharField(max_length=64)
    perm_write = models.BooleanField()
    perm_unlink = models.BooleanField()
    active = models.BooleanField()
    perm_create = models.BooleanField()
    group = models.ForeignKey(ResGroups)
    class Meta:
        db_table = u'ir_model_access'

class IrActWizard(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=32)
    usage = models.CharField(max_length=32)
    wiz_name = models.CharField(max_length=64)
    create_uid = models.IntegerField()
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    help = models.TextField()
    multi = models.BooleanField()
    model = models.CharField(max_length=64)
    class Meta:
        db_table = u'ir_act_wizard'

class IrUiViewSc(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    user = models.ForeignKey(ResUsers)
    res_id = models.IntegerField()
    resource = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    class Meta:
        db_table = u'ir_ui_view_sc'

class IrActions(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=32)
    usage = models.CharField(max_length=32)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    help = models.TextField()
    class Meta:
        db_table = u'ir_actions'

class IrUiViewGroupRel(models.Model):
    view = models.ForeignKey(IrUiView)
    group = models.ForeignKey(ResGroups)
    class Meta:
        db_table = u'ir_ui_view_group_rel'

class IrDefault(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    uid = models.ForeignKey(ResUsers, db_column='uid')
    ref_table = models.CharField(max_length=64)
    company = models.ForeignKey(ResCompany)
    value = models.CharField(max_length=64)
    ref_id = models.IntegerField()
    field_tbl = models.CharField(max_length=64)
    field_name = models.CharField(max_length=64)
    page = models.CharField(max_length=64)
    class Meta:
        db_table = u'ir_default'

class IrActionsTodo(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    note = models.TextField()
    state = models.CharField(max_length=-1)
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    type = models.CharField(max_length=-1)
    action_id = models.IntegerField()
    class Meta:
        db_table = u'ir_actions_todo'

class IrActClient(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=32)
    usage = models.CharField(max_length=32)
    create_uid = models.IntegerField()
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    help = models.TextField()
    res_model = models.CharField(max_length=64)
    params_store = models.TextField() # This field type is a guess.
    tag = models.CharField(max_length=64)
    context = models.CharField(max_length=250)
    class Meta:
        db_table = u'ir_act_client'

class ResGroupsWizardRel(models.Model):
    uid = models.ForeignKey(IrActWizard, db_column='uid')
    gid = models.ForeignKey(ResGroups, db_column='gid')
    class Meta:
        db_table = u'res_groups_wizard_rel'

class IrActWindowView(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    act_window = models.ForeignKey(IrActWindow)
    multi = models.BooleanField()
    view_mode = models.CharField(max_length=-1)
    view = models.ForeignKey(IrUiView)
    sequence = models.IntegerField()
    class Meta:
        db_table = u'ir_act_window_view'

class ResGroupsActionRel(models.Model):
    uid = models.ForeignKey(IrActionsTodo, db_column='uid')
    gid = models.ForeignKey(ResGroups, db_column='gid')
    class Meta:
        db_table = u'res_groups_action_rel'

class IrTranslation(models.Model):
    id = models.IntegerField(primary_key=True)
    lang = models.ForeignKey(ResLang, db_column='lang')
    src = models.TextField()
    name = models.CharField(max_length=-1)
    res_id = models.IntegerField()
    module = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    value = models.TextField()
    type = models.CharField(max_length=-1)
    comments = models.TextField()
    class Meta:
        db_table = u'ir_translation'

class IrExports(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    resource = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    class Meta:
        db_table = u'ir_exports'

class WizardIrModelMenuCreate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    menu = models.ForeignKey(IrUiMenu)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'wizard_ir_model_menu_create'

class OsvMemoryAutovacuum(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'osv_memory_autovacuum'

class IrConfigParameter(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    key = models.CharField(max_length=256)
    value = models.TextField()
    class Meta:
        db_table = u'ir_config_parameter'

class IrFieldsConverter(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'ir_fields_converter'

class BaseModuleUpgrade(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    module_info = models.TextField()
    class Meta:
        db_table = u'base_module_upgrade'

class BaseLanguageInstall(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    lang = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    overwrite = models.BooleanField()
    class Meta:
        db_table = u'base_language_install'

class BaseModuleUpdate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    add = models.IntegerField()
    update = models.IntegerField()
    state = models.CharField(max_length=-1)
    class Meta:
        db_table = u'base_module_update'

class BaseModuleImport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    module_name = models.CharField(max_length=128)
    module_file = models.TextField() # This field type is a guess.
    state = models.CharField(max_length=-1)
    class Meta:
        db_table = u'base_module_import'

class BaseLanguageImport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    code = models.CharField(max_length=5)
    data = models.TextField() # This field type is a guess.
    name = models.CharField(max_length=64)
    overwrite = models.BooleanField()
    class Meta:
        db_table = u'base_language_import'

class BaseModuleConfiguration(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'base_module_configuration'

class BaseUpdateTranslations(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    lang = models.CharField(max_length=-1)
    class Meta:
        db_table = u'base_update_translations'

class ResPartnerTitle(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    domain = models.CharField(max_length=24)
    name = models.CharField(max_length=46)
    shortcut = models.CharField(max_length=16)
    class Meta:
        db_table = u'res_partner_title'

class ResConfigInstaller(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'res_config_installer'

class ResConfigSettings(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'res_config_settings'

class ResCurrencyRateType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'res_currency_rate_type'

class IrActionsConfigurationWizard(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    note = models.TextField()
    class Meta:
        db_table = u'ir_actions_configuration_wizard'

class ResConfig(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'res_config'

class ResRequestLink(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    priority = models.IntegerField()
    object = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'res_request_link'

class IrProperty(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    value_text = models.TextField()
    value_float = models.FloatField()
    name = models.CharField(max_length=128)
    value_integer = models.IntegerField()
    type = models.CharField(max_length=-1)
    company = models.ForeignKey(ResCompany)
    fields = models.ForeignKey(IrModelFields)
    value_datetime = models.DateTimeField()
    value_binary = models.TextField() # This field type is a guess.
    value_reference = models.CharField(max_length=128)
    res_id = models.CharField(max_length=128)
    class Meta:
        db_table = u'ir_property'

class IrModelRelation(models.Model):
    id = models.IntegerField()
    create_uid = models.IntegerField()
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    date_init = models.DateTimeField()
    date_update = models.DateTimeField()
    module = models.ForeignKey(IrModuleModule, db_column='module')
    model = models.ForeignKey(IrModel, db_column='model')
    name = models.CharField(max_length=128)
    class Meta:
        db_table = u'ir_model_relation'

class ResPartnerBankType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    code = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    format_layout = models.TextField()
    class Meta:
        db_table = u'res_partner_bank_type'

class IrUiMenuGroupRel(models.Model):
    menu = models.ForeignKey(IrUiMenu)
    gid = models.ForeignKey(ResGroups, db_column='gid')
    class Meta:
        db_table = u'ir_ui_menu_group_rel'

class IrUiViewCustom(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    user = models.ForeignKey(ResUsers)
    arch = models.TextField()
    ref = models.ForeignKey(IrUiView)
    class Meta:
        db_table = u'ir_ui_view_custom'

class ResGroupsReportRel(models.Model):
    uid = models.ForeignKey(IrActReportXml, db_column='uid')
    gid = models.ForeignKey(ResGroups, db_column='gid')
    class Meta:
        db_table = u'res_groups_report_rel'

class IrActWindowGroupRel(models.Model):
    act = models.ForeignKey(IrActWindow)
    gid = models.ForeignKey(ResGroups, db_column='gid')
    class Meta:
        db_table = u'ir_act_window_group_rel'

class IrServerObjectLines(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    server = models.ForeignKey(IrActServer)
    type = models.CharField(max_length=32)
    value = models.TextField()
    col1 = models.ForeignKey(IrModelFields, db_column='col1')
    class Meta:
        db_table = u'ir_server_object_lines'

class IrExportsLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    export = models.ForeignKey(IrExports)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'ir_exports_line'

class ResPartnerBankTypeField(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    bank_type = models.ForeignKey(ResPartnerBankType)
    readonly = models.BooleanField()
    required = models.BooleanField()
    name = models.CharField(max_length=64)
    size = models.IntegerField()
    class Meta:
        db_table = u'res_partner_bank_type_field'

class IrValues(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=128)
    key = models.CharField(max_length=128)
    key2 = models.CharField(max_length=256)
    model = models.CharField(max_length=128)
    value = models.TextField()
    meta = models.TextField()
    res_id = models.IntegerField()
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    model = models.ForeignKey(IrModel)
    user = models.ForeignKey(ResUsers)
    company = models.ForeignKey(ResCompany)
    action_id = models.IntegerField()
    class Meta:
        db_table = u'ir_values'

class IrActServer(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=32)
    usage = models.CharField(max_length=32)
    create_uid = models.IntegerField()
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    help = models.TextField()
    model = models.ForeignKey(IrModel)
    code = models.TextField()
    sequence = models.IntegerField()
    sms = models.CharField(max_length=160)
    write_id = models.CharField(max_length=256)
    srcmodel = models.ForeignKey(IrModel)
    message = models.TextField()
    trigger_name = models.CharField(max_length=128)
    condition = models.CharField(max_length=256)
    subject = models.CharField(max_length=1024)
    loop_action = models.ForeignKey('self', db_column='loop_action')
    trigger_obj = models.ForeignKey(IrModelFields)
    mobile = models.CharField(max_length=512)
    copy_object = models.CharField(max_length=256)
    wkf_model = models.ForeignKey(IrModel)
    state = models.CharField(max_length=32)
    record = models.ForeignKey(IrModelFields)
    expression = models.CharField(max_length=512)
    email = models.CharField(max_length=512)
    action_id = models.IntegerField()
    class Meta:
        db_table = u'ir_act_server'

class IrModelFieldsGroupRel(models.Model):
    field = models.ForeignKey(IrModelFields)
    group = models.ForeignKey(ResGroups)
    class Meta:
        db_table = u'ir_model_fields_group_rel'

class WkfTriggers(models.Model):
    id = models.IntegerField(primary_key=True)
    instance = models.ForeignKey(WkfInstance)
    workitem = models.ForeignKey(WkfWorkitem)
    model = models.CharField(max_length=128)
    res_id = models.IntegerField()
    class Meta:
        db_table = u'wkf_triggers'

class RuleGroupRel(models.Model):
    rule_group = models.ForeignKey(IrRule)
    group = models.ForeignKey(ResGroups)
    class Meta:
        db_table = u'rule_group_rel'

class IrModelConstraint(models.Model):
    id = models.IntegerField()
    create_uid = models.IntegerField()
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    date_init = models.DateTimeField()
    date_update = models.DateTimeField()
    module = models.ForeignKey(IrModuleModule, db_column='module')
    model = models.ForeignKey(IrModel, db_column='model')
    type = models.CharField(max_length=1)
    name = models.CharField(max_length=128)
    class Meta:
        db_table = u'ir_model_constraint'

class ResCompanyUsersRel(models.Model):
    cid = models.ForeignKey(ResCompany, db_column='cid')
    user = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'res_company_users_rel'

class RelServerActions(models.Model):
    server = models.ForeignKey(IrActServer)
    action = models.ForeignKey(IrActServer)
    class Meta:
        db_table = u'rel_server_actions'

class ResPartnerResPartnerCategoryRel(models.Model):
    category = models.ForeignKey(ResPartnerCategory)
    partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'res_partner_res_partner_category_rel'

class IrRule(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    model = models.ForeignKey(IrModel)
    domain_force = models.TextField()
    name = models.CharField(max_length=128)
    global_field = models.BooleanField(db_column='global') # Field renamed because it was a Python reserved word.
    active = models.BooleanField()
    perm_unlink = models.BooleanField()
    perm_write = models.BooleanField()
    perm_read = models.BooleanField()
    perm_create = models.BooleanField()
    class Meta:
        db_table = u'ir_rule'

class BaseLanguageExport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    lang = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    name = models.CharField(max_length=-1)
    format = models.CharField(max_length=-1)
    data = models.TextField() # This field type is a guess.
    class Meta:
        db_table = u'base_language_export'

class ResBank(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    city = models.CharField(max_length=128)
    fax = models.CharField(max_length=64)
    name = models.CharField(max_length=128)
    zip = models.CharField(max_length=24)
    country = models.ForeignKey(ResCountry, db_column='country')
    street2 = models.CharField(max_length=128)
    bic = models.CharField(max_length=64)
    phone = models.CharField(max_length=64)
    state = models.ForeignKey(ResCountryState, db_column='state')
    street = models.CharField(max_length=128)
    active = models.BooleanField()
    email = models.CharField(max_length=64)
    class Meta:
        db_table = u'res_bank'

class ResCurrencyRate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    currency = models.ForeignKey(ResCurrency)
    rate = models.DecimalField(max_digits=65535, decimal_places=65535)
    name = models.DateField()
    currency_rate_type = models.ForeignKey(ResCurrencyRateType)
    class Meta:
        db_table = u'res_currency_rate'

class ResPartnerCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    parent_left = models.IntegerField()
    parent_right = models.IntegerField()
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    parent = models.ForeignKey('self')
    active = models.BooleanField()
    class Meta:
        db_table = u'res_partner_category'

class IrCron(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    function = models.CharField(max_length=64)
    interval_type = models.CharField(max_length=-1)
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=60)
    args = models.TextField()
    numbercall = models.IntegerField()
    nextcall = models.DateTimeField()
    priority = models.IntegerField()
    doall = models.BooleanField()
    active = models.BooleanField()
    interval_number = models.IntegerField()
    model = models.CharField(max_length=64)
    class Meta:
        db_table = u'ir_cron'

class IrModuleModule(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    website = models.CharField(max_length=256)
    summary = models.CharField(max_length=256)
    name = models.CharField(unique=True, max_length=128)
    author = models.CharField(max_length=128)
    url = models.CharField(max_length=128)
    state = models.CharField(max_length=16)
    latest_version = models.CharField(max_length=64)
    shortdesc = models.CharField(max_length=256)
    complexity = models.CharField(max_length=32)
    category_id = models.IntegerField()
    description = models.ForeignKey(IrModuleCategory, db_column='description')
    application = models.BooleanField()
    demo = models.BooleanField()
    web = models.BooleanField()
    license = models.CharField(max_length=32)
    sequence = models.IntegerField()
    auto_install = models.BooleanField()
    menus_by_module = models.TextField()
    maintainer = models.CharField(max_length=128)
    contributors = models.TextField()
    views_by_module = models.TextField()
    icon = models.CharField(max_length=128)
    reports_by_module = models.TextField()
    published_version = models.CharField(max_length=64)
    class Meta:
        db_table = u'ir_module_module'

class RelModulesLangexport(models.Model):
    wiz = models.ForeignKey(BaseLanguageExport)
    module = models.ForeignKey(IrModuleModule)
    class Meta:
        db_table = u'rel_modules_langexport'

class ResCountry(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    address_format = models.TextField()
    currency = models.ForeignKey(ResCurrency)
    code = models.CharField(unique=True, max_length=2)
    name = models.CharField(unique=True, max_length=64)
    class Meta:
        db_table = u'res_country'

class ResGroupsImpliedRel(models.Model):
    gid = models.ForeignKey(ResGroups, db_column='gid')
    hid = models.ForeignKey(ResGroups, db_column='hid')
    class Meta:
        db_table = u'res_groups_implied_rel'

class MultiCompanyDefault(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=256)
    sequence = models.IntegerField()
    expression = models.CharField(max_length=256)
    company_dest = models.ForeignKey(ResCompany)
    field = models.ForeignKey(IrModelFields)
    company = models.ForeignKey(ResCompany)
    object = models.ForeignKey(IrModel)
    class Meta:
        db_table = u'multi_company_default'

class ResRequest(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    body = models.TextField()
    name = models.CharField(max_length=128)
    date_sent = models.DateTimeField()
    ref_doc2 = models.CharField(max_length=128)
    priority = models.CharField(max_length=-1)
    ref_doc1 = models.CharField(max_length=128)
    state = models.CharField(max_length=-1)
    act_from = models.ForeignKey(ResUsers, db_column='act_from')
    ref_partner = models.ForeignKey(ResPartner)
    active = models.BooleanField()
    trigger_date = models.DateTimeField()
    act_to = models.ForeignKey(ResUsers, db_column='act_to')
    class Meta:
        db_table = u'res_request'

class ResRequestHistory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    body = models.TextField()
    act_from = models.ForeignKey(ResUsers, db_column='act_from')
    name = models.CharField(max_length=128)
    req = models.ForeignKey(ResRequest)
    date_sent = models.DateTimeField()
    act_to = models.ForeignKey(ResUsers, db_column='act_to')
    class Meta:
        db_table = u'res_request_history'

class ChangePasswordWizard(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'change_password_wizard'

class ChangePasswordUser(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    user_login = models.CharField(max_length=-1)
    user = models.ForeignKey(ResUsers)
    new_passwd = models.CharField(max_length=-1)
    wizard = models.ForeignKey(ChangePasswordWizard)
    class Meta:
        db_table = u'change_password_user'

class ResPartnerBank(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    bank_name = models.CharField(max_length=32)
    owner_name = models.CharField(max_length=128)
    sequence = models.IntegerField()
    street = models.CharField(max_length=128)
    partner = models.ForeignKey(ResPartner)
    bank = models.ForeignKey(ResBank, db_column='bank')
    bank_bic = models.CharField(max_length=16)
    city = models.CharField(max_length=128)
    name = models.CharField(max_length=64)
    zip = models.CharField(max_length=24)
    footer = models.BooleanField()
    country = models.ForeignKey(ResCountry)
    company = models.ForeignKey(ResCompany)
    state = models.CharField(max_length=-1)
    state = models.ForeignKey(ResCountryState)
    acc_number = models.CharField(max_length=64)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'res_partner_bank'

class MailFollowersMailMessageSubtypeRel(models.Model):
    mail_followers = models.ForeignKey(MailFollowers)
    mail_message_subtype = models.ForeignKey(MailMessageSubtype)
    class Meta:
        db_table = u'mail_followers_mail_message_subtype_rel'

class IrModel(models.Model):
    id = models.IntegerField(primary_key=True)
    model = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    state = models.CharField(max_length=16)
    info = models.TextField()
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'ir_model'

class MailComposeMessage(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    body = models.TextField()
    model = models.CharField(max_length=128)
    record_name = models.CharField(max_length=-1)
    date = models.DateTimeField()
    subject = models.CharField(max_length=-1)
    composition_mode = models.CharField(max_length=-1)
    message_id = models.CharField(max_length=-1)
    parent = models.ForeignKey(MailMessage)
    res_id = models.IntegerField()
    subtype = models.ForeignKey(MailMessageSubtype)
    filter = models.ForeignKey(IrFilters)
    author = models.ForeignKey(ResPartner)
    type = models.CharField(max_length=-1)
    email_from = models.CharField(max_length=-1)
    template_id = models.IntegerField()
    class Meta:
        db_table = u'mail_compose_message'

class PublisherWarrantyContract(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'publisher_warranty_contract'

class MailComposeMessageResPartnerRel(models.Model):
    wizard = models.ForeignKey(MailComposeMessage)
    partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'mail_compose_message_res_partner_rel'

class MailAlias(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    alias_model = models.ForeignKey(IrModel)
    alias_defaults = models.TextField()
    alias_force_thread_id = models.IntegerField()
    alias_name = models.CharField(unique=True, max_length=-1)
    alias_user = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'mail_alias'

class MailMessageSubtype(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    parent = models.ForeignKey('self')
    name = models.CharField(max_length=-1)
    relation_field = models.CharField(max_length=-1)
    default = models.BooleanField()
    res_model = models.CharField(max_length=-1)
    description = models.TextField()
    class Meta:
        db_table = u'mail_message_subtype'

class MailFollowers(models.Model):
    id = models.IntegerField(primary_key=True)
    res_model = models.CharField(max_length=128)
    res_id = models.IntegerField()
    partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'mail_followers'

class MailVote(models.Model):
    message = models.ForeignKey(MailMessage)
    user = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'mail_vote'

class MailMessage(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    body = models.TextField()
    model = models.CharField(max_length=128)
    record_name = models.CharField(max_length=-1)
    date = models.DateTimeField()
    subject = models.CharField(max_length=-1)
    message_id = models.CharField(max_length=-1)
    parent = models.ForeignKey('self')
    res_id = models.IntegerField()
    subtype = models.ForeignKey(MailMessageSubtype)
    author = models.ForeignKey(ResPartner)
    type = models.CharField(max_length=-1)
    email_from = models.CharField(max_length=-1)
    class Meta:
        db_table = u'mail_message'

class MessageAttachmentRel(models.Model):
    message = models.ForeignKey(MailMessage)
    attachment = models.ForeignKey(IrAttachment)
    class Meta:
        db_table = u'message_attachment_rel'

class MailMessageResPartnerRel(models.Model):
    mail_message = models.ForeignKey(MailMessage)
    res_partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'mail_message_res_partner_rel'

class ResUsers(models.Model):
    id = models.IntegerField(primary_key=True)
    active = models.BooleanField()
    login = models.CharField(unique=True, max_length=64)
    password = models.CharField(max_length=64)
    company = models.ForeignKey(ResCompany)
    partner = models.ForeignKey(ResPartner)
    create_uid = models.ForeignKey('self', db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey('self', db_column='write_uid')
    menu_id = models.IntegerField()
    login_date = models.DateField()
    signature = models.TextField()
    action_id = models.IntegerField()
    alias = models.ForeignKey(MailAlias)
    share = models.BooleanField()
    default_section = models.ForeignKey(CrmCaseSection)
    pos_config = models.ForeignKey(PosConfig, db_column='pos_config')
    ean13 = models.CharField(max_length=13)
    class Meta:
        db_table = u'res_users'

class MailMail(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    mail_message = models.ForeignKey(MailMessage)
    notification = models.BooleanField()
    auto_delete = models.BooleanField()
    body_html = models.TextField()
    mail_server = models.ForeignKey(IrMailServer)
    state = models.CharField(max_length=-1)
    references = models.TextField()
    email_cc = models.CharField(max_length=-1)
    reply_to = models.CharField(max_length=-1)
    email_to = models.TextField()
    email_from = models.CharField(max_length=-1)
    fetchmail_server = models.ForeignKey(FetchmailServer)
    class Meta:
        db_table = u'mail_mail'

class MailGroupResGroupRel(models.Model):
    mail_group = models.ForeignKey(MailGroup)
    groups = models.ForeignKey(ResGroups)
    class Meta:
        db_table = u'mail_group_res_group_rel'

class MailWizardInvite(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    res_model = models.CharField(max_length=128)
    res_id = models.IntegerField()
    message = models.TextField()
    class Meta:
        db_table = u'mail_wizard_invite'

class MailWizardInviteResPartnerRel(models.Model):
    mail_wizard_invite = models.ForeignKey(MailWizardInvite)
    res_partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'mail_wizard_invite_res_partner_rel'

class IrAttachment(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    description = models.TextField()
    datas_fname = models.CharField(max_length=256)
    url = models.CharField(max_length=1024)
    res_model = models.CharField(max_length=64)
    company = models.ForeignKey(ResCompany)
    res_name = models.CharField(max_length=128)
    type = models.CharField(max_length=-1)
    res_id = models.IntegerField()
    file_size = models.IntegerField()
    db_datas = models.TextField() # This field type is a guess.
    store_fname = models.CharField(max_length=256)
    name = models.CharField(max_length=256)
    class Meta:
        db_table = u'ir_attachment'

class ResGroups(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    comment = models.TextField()
    category = models.ForeignKey(IrModuleCategory)
    share = models.BooleanField()
    is_portal = models.BooleanField()
    class Meta:
        db_table = u'res_groups'

class MailComposeMessageIrAttachmentsRel(models.Model):
    wizard = models.ForeignKey(MailComposeMessage)
    attachment = models.ForeignKey(IrAttachment)
    class Meta:
        db_table = u'mail_compose_message_ir_attachments_rel'

class IrMailServer(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    smtp_port = models.IntegerField()
    smtp_host = models.CharField(max_length=128)
    smtp_user = models.CharField(max_length=64)
    smtp_pass = models.CharField(max_length=64)
    smtp_debug = models.BooleanField()
    active = models.BooleanField()
    smtp_encryption = models.CharField(max_length=-1)
    class Meta:
        db_table = u'ir_mail_server'

class MailGroup(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    menu = models.ForeignKey(IrUiMenu)
    image_medium = models.TextField() # This field type is a guess.
    name = models.CharField(max_length=64)
    alias = models.ForeignKey(MailAlias)
    image = models.TextField() # This field type is a guess.
    image_small = models.TextField() # This field type is a guess.
    group_public = models.ForeignKey(ResGroups)
    public = models.CharField(max_length=-1)
    description = models.TextField()
    class Meta:
        db_table = u'mail_group'

class IrUiMenu(models.Model):
    id = models.IntegerField(primary_key=True)
    parent = models.ForeignKey('self')
    name = models.CharField(max_length=64)
    icon = models.CharField(max_length=64)
    parent_left = models.IntegerField()
    parent_right = models.IntegerField()
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    web_icon_data = models.TextField() # This field type is a guess.
    sequence = models.IntegerField()
    web_icon_hover = models.CharField(max_length=128)
    web_icon_hover_data = models.TextField() # This field type is a guess.
    needaction_enabled = models.BooleanField()
    web_icon = models.CharField(max_length=128)
    mail_group = models.ForeignKey(MailGroup)
    class Meta:
        db_table = u'ir_ui_menu'

class AccountAnalyticLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=256)
    unit_amount = models.FloatField()
    date = models.DateField()
    company_id = models.IntegerField()
    account = models.ForeignKey(AccountAnalyticAccount)
    code = models.CharField(max_length=8)
    general_account = models.ForeignKey(AccountAccount)
    currency_id = models.IntegerField()
    move = models.ForeignKey(AccountMoveLine)
    product = models.ForeignKey(ProductProduct)
    product_uom = models.ForeignKey(ProductUom)
    journal = models.ForeignKey(AccountAnalyticJournal)
    amount_currency = models.DecimalField(max_digits=65535, decimal_places=65535)
    ref = models.CharField(max_length=64)
    to_invoice = models.ForeignKey(HrTimesheetInvoiceFactor, db_column='to_invoice')
    invoice = models.ForeignKey(AccountInvoice)
    class Meta:
        db_table = u'account_analytic_line'

class ResPartner(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=128)
    lang = models.CharField(max_length=64)
    company = models.ForeignKey(ResCompany)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    comment = models.TextField()
    ean13 = models.CharField(max_length=13)
    color = models.IntegerField()
    image = models.TextField() # This field type is a guess.
    use_parent_address = models.BooleanField()
    active = models.BooleanField()
    street = models.CharField(max_length=128)
    supplier = models.BooleanField()
    city = models.CharField(max_length=128)
    user = models.ForeignKey(ResUsers)
    zip = models.CharField(max_length=24)
    title = models.ForeignKey(ResPartnerTitle, db_column='title')
    function = models.CharField(max_length=128)
    country = models.ForeignKey(ResCountry)
    parent = models.ForeignKey('self')
    employee = models.BooleanField()
    type = models.CharField(max_length=-1)
    email = models.CharField(max_length=240)
    vat = models.CharField(max_length=32)
    website = models.CharField(max_length=64)
    fax = models.CharField(max_length=64)
    street2 = models.CharField(max_length=128)
    phone = models.CharField(max_length=64)
    credit_limit = models.FloatField()
    date = models.DateField()
    tz = models.CharField(max_length=64)
    customer = models.BooleanField()
    image_medium = models.TextField() # This field type is a guess.
    mobile = models.CharField(max_length=64)
    ref = models.CharField(max_length=64)
    image_small = models.TextField() # This field type is a guess.
    birthdate = models.CharField(max_length=64)
    is_company = models.BooleanField()
    state = models.ForeignKey(ResCountryState)
    notification_email_send = models.CharField(max_length=-1)
    opt_out = models.BooleanField()
    signup_type = models.CharField(max_length=-1)
    signup_expiration = models.DateTimeField()
    signup_token = models.CharField(max_length=-1)
    section = models.ForeignKey(CrmCaseSection)
    last_reconciliation_date = models.DateTimeField()
    debit_limit = models.FloatField()
    vat_subjected = models.BooleanField()
    speaker = models.BooleanField()
    class Meta:
        db_table = u'res_partner'

class IrActWindow(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=32)
    usage = models.CharField(max_length=32)
    view = models.ForeignKey(IrUiView)
    res_model = models.CharField(max_length=64)
    view_type = models.CharField(max_length=16)
    domain = models.CharField(max_length=250)
    create_uid = models.IntegerField()
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    help = models.TextField()
    search_view = models.ForeignKey(IrUiView)
    auto_refresh = models.IntegerField()
    view_mode = models.CharField(max_length=250)
    multi = models.BooleanField()
    context = models.CharField(max_length=250)
    target = models.CharField(max_length=-1)
    auto_search = models.BooleanField()
    filter = models.BooleanField()
    src_model = models.CharField(max_length=64)
    limit = models.IntegerField()
    res_id = models.IntegerField()
    class Meta:
        db_table = u'ir_act_window'

class IrActReportXml(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=32)
    usage = models.CharField(max_length=32)
    model = models.CharField(max_length=64)
    report_name = models.CharField(max_length=64)
    report_xsl = models.CharField(max_length=256)
    report_xml = models.CharField(max_length=256)
    auto = models.BooleanField()
    create_uid = models.IntegerField()
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.IntegerField()
    help = models.TextField()
    report_rml_content_data = models.TextField() # This field type is a guess.
    header = models.BooleanField()
    report_type = models.CharField(max_length=32)
    report_file = models.CharField(max_length=256)
    multi = models.BooleanField()
    report_rml = models.CharField(max_length=256)
    attachment = models.CharField(max_length=128)
    report_sxw_content_data = models.TextField() # This field type is a guess.
    attachment_use = models.BooleanField()
    class Meta:
        db_table = u'ir_act_report_xml'

class FetchmailServer(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    active = models.BooleanField()
    user = models.CharField(max_length=256)
    date = models.DateTimeField()
    configuration = models.TextField()
    port = models.IntegerField()
    password = models.CharField(max_length=1024)
    name = models.CharField(max_length=256)
    script = models.CharField(max_length=64)
    is_ssl = models.BooleanField()
    object = models.ForeignKey(IrModel)
    server = models.CharField(max_length=256)
    priority = models.IntegerField()
    attach = models.BooleanField()
    state = models.CharField(max_length=-1)
    type = models.CharField(max_length=-1)
    original = models.BooleanField()
    action = models.ForeignKey(IrActServer)
    class Meta:
        db_table = u'fetchmail_server'

class FetchmailConfigSettings(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'fetchmail_config_settings'

class EmailTemplateAttachmentRel(models.Model):
    email_template = models.ForeignKey(EmailTemplate)
    attachment = models.ForeignKey(IrAttachment)
    class Meta:
        db_table = u'email_template_attachment_rel'

class EmailTemplatePreview(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    model = models.ForeignKey(IrModel)
    sub_model_object_field = models.ForeignKey(IrModelFields, db_column='sub_model_object_field')
    auto_delete = models.BooleanField()
    mail_server = models.ForeignKey(IrMailServer)
    body_html = models.TextField()
    email_to = models.CharField(max_length=-1)
    sub_object = models.ForeignKey(IrModel, db_column='sub_object')
    ref_ir_act_window = models.ForeignKey(IrActWindow, db_column='ref_ir_act_window')
    subject = models.CharField(max_length=-1)
    lang = models.CharField(max_length=-1)
    name = models.CharField(max_length=-1)
    email_recipients = models.CharField(max_length=-1)
    model_object_field = models.ForeignKey(IrModelFields, db_column='model_object_field')
    report_name = models.CharField(max_length=-1)
    report_template = models.ForeignKey(IrActReportXml, db_column='report_template')
    ref_ir_value = models.ForeignKey(IrValues, db_column='ref_ir_value')
    user_signature = models.BooleanField()
    null_value = models.CharField(max_length=-1)
    reply_to = models.CharField(max_length=-1)
    email_cc = models.CharField(max_length=-1)
    model = models.CharField(max_length=128)
    copyvalue = models.CharField(max_length=-1)
    res_id = models.CharField(max_length=-1)
    email_from = models.CharField(max_length=-1)
    class Meta:
        db_table = u'email_template_preview'

class ProductUl(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    type = models.CharField(max_length=-1)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'product_ul'

class IrModelFields(models.Model):
    id = models.IntegerField(primary_key=True)
    model = models.CharField(max_length=64)
    model = models.ForeignKey(IrModel)
    name = models.CharField(max_length=64)
    relation = models.CharField(max_length=64)
    select_level = models.CharField(max_length=4)
    field_description = models.CharField(max_length=256)
    ttype = models.CharField(max_length=64)
    state = models.CharField(max_length=64)
    view_load = models.BooleanField()
    relate = models.BooleanField()
    relation_field = models.CharField(max_length=128)
    translate = models.BooleanField()
    serialization_field = models.ForeignKey('self')
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    domain = models.CharField(max_length=256)
    selection = models.CharField(max_length=128)
    on_delete = models.CharField(max_length=-1)
    selectable = models.BooleanField()
    size = models.IntegerField()
    required = models.BooleanField()
    readonly = models.BooleanField()
    complete_name = models.CharField(max_length=64)
    class Meta:
        db_table = u'ir_model_fields'

class ProductProduct(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    ean13 = models.CharField(max_length=13)
    color = models.IntegerField()
    image = models.TextField() # This field type is a guess.
    price_extra = models.DecimalField(max_digits=65535, decimal_places=65535)
    default_code = models.CharField(max_length=64)
    name_template = models.CharField(max_length=128)
    active = models.BooleanField()
    variants = models.CharField(max_length=64)
    image_medium = models.TextField() # This field type is a guess.
    image_small = models.TextField() # This field type is a guess.
    product_tmpl = models.ForeignKey(ProductTemplate)
    price_margin = models.DecimalField(max_digits=65535, decimal_places=65535)
    track_outgoing = models.BooleanField()
    track_incoming = models.BooleanField()
    valuation = models.CharField(max_length=-1)
    track_production = models.BooleanField()
    hr_expense_ok = models.BooleanField()
    expense_pdt = models.BooleanField()
    income_pdt = models.BooleanField()
    available_in_pos = models.BooleanField()
    pos_categ = models.ForeignKey(PosCategory)
    to_weight = models.BooleanField()
    event_type = models.ForeignKey(EventType)
    event_ok = models.BooleanField()
    class Meta:
        db_table = u'product_product'

class ProductSupplierinfo(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.ForeignKey(ResPartner, db_column='name')
    sequence = models.IntegerField()
    company = models.ForeignKey(ResCompany)
    qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    delay = models.IntegerField()
    min_qty = models.FloatField()
    product_code = models.CharField(max_length=64)
    product_name = models.CharField(max_length=128)
    product = models.ForeignKey(ProductTemplate)
    class Meta:
        db_table = u'product_supplierinfo'

class PricelistPartnerinfo(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    min_quantity = models.FloatField()
    price = models.DecimalField(max_digits=65535, decimal_places=65535)
    suppinfo = models.ForeignKey(ProductSupplierinfo)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'pricelist_partnerinfo'

class ProductTemplate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    warranty = models.FloatField()
    uos = models.ForeignKey(ProductUom)
    list_price = models.DecimalField(max_digits=65535, decimal_places=65535)
    description = models.TextField()
    weight = models.DecimalField(max_digits=65535, decimal_places=65535)
    weight_net = models.DecimalField(max_digits=65535, decimal_places=65535)
    standard_price = models.DecimalField(max_digits=65535, decimal_places=65535)
    mes_type = models.CharField(max_length=-1)
    uom = models.ForeignKey(ProductUom)
    description_purchase = models.TextField()
    cost_method = models.CharField(max_length=-1)
    categ = models.ForeignKey(ProductCategory)
    name = models.CharField(max_length=128)
    uos_coeff = models.DecimalField(max_digits=65535, decimal_places=65535)
    volume = models.FloatField()
    sale_ok = models.BooleanField()
    description_sale = models.TextField()
    product_manager = models.ForeignKey(ResUsers, db_column='product_manager')
    company = models.ForeignKey(ResCompany)
    state = models.CharField(max_length=-1)
    produce_delay = models.FloatField()
    uom_po = models.ForeignKey(ProductUom)
    rental = models.BooleanField()
    type = models.CharField(max_length=-1)
    loc_rack = models.CharField(max_length=16)
    loc_row = models.CharField(max_length=16)
    sale_delay = models.FloatField()
    loc_case = models.CharField(max_length=16)
    supply_method = models.CharField(max_length=-1)
    procure_method = models.CharField(max_length=-1)
    purchase_ok = models.BooleanField()
    class Meta:
        db_table = u'product_template'

class ProductPriceType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    active = models.BooleanField()
    field = models.CharField(max_length=32)
    currency = models.ForeignKey(ResCurrency)
    name = models.CharField(max_length=32)
    class Meta:
        db_table = u'product_price_type'

class ProductPriceList(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    qty1 = models.IntegerField()
    qty2 = models.IntegerField()
    qty3 = models.IntegerField()
    qty4 = models.IntegerField()
    qty5 = models.IntegerField()
    price_list = models.ForeignKey(ProductPricelist, db_column='price_list')
    class Meta:
        db_table = u'product_price_list'

class ProductUomCateg(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'product_uom_categ'

class ProductPricelistType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    key = models.CharField(max_length=64)
    class Meta:
        db_table = u'product_pricelist_type'

class ProductCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    parent_left = models.IntegerField()
    parent_right = models.IntegerField()
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    parent = models.ForeignKey('self')
    type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'product_category'

class ProductPackaging(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    ul = models.ForeignKey(ProductUl, db_column='ul')
    code = models.CharField(max_length=14)
    product = models.ForeignKey(ProductProduct)
    weight = models.FloatField()
    sequence = models.IntegerField()
    ul_qty = models.IntegerField()
    ean = models.CharField(max_length=14)
    qty = models.FloatField()
    width = models.FloatField()
    length = models.FloatField()
    rows = models.IntegerField()
    height = models.FloatField()
    weight_ul = models.FloatField()
    name = models.TextField()
    class Meta:
        db_table = u'product_packaging'

class ProductPricelist(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    currency = models.ForeignKey(ResCurrency)
    name = models.CharField(max_length=64)
    active = models.BooleanField()
    type = models.CharField(max_length=-1)
    company = models.ForeignKey(ResCompany)
    class Meta:
        db_table = u'product_pricelist'

class ShareWizardResultLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    password = models.CharField(max_length=64)
    user = models.ForeignKey(ResUsers)
    newly_created = models.BooleanField()
    share_wizard = models.ForeignKey(ShareWizard)
    class Meta:
        db_table = u'share_wizard_result_line'

class ProductPricelistVersion(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    active = models.BooleanField()
    pricelist = models.ForeignKey(ProductPricelist)
    date_end = models.DateField()
    date_start = models.DateField()
    company_id = models.IntegerField()
    class Meta:
        db_table = u'product_pricelist_version'

class ProductPricelistItem(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    price_round = models.DecimalField(max_digits=65535, decimal_places=65535)
    price_discount = models.DecimalField(max_digits=65535, decimal_places=65535)
    base_pricelist = models.ForeignKey(ProductPricelist)
    sequence = models.IntegerField()
    price_max_margin = models.DecimalField(max_digits=65535, decimal_places=65535)
    company_id = models.IntegerField()
    name = models.CharField(max_length=64)
    product_tmpl = models.ForeignKey(ProductTemplate)
    product = models.ForeignKey(ProductProduct)
    base = models.IntegerField()
    price_version = models.ForeignKey(ProductPricelistVersion)
    min_quantity = models.IntegerField()
    price_min_margin = models.DecimalField(max_digits=65535, decimal_places=65535)
    categ = models.ForeignKey(ProductCategory)
    price_surcharge = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'product_pricelist_item'

class ProjectTaskHistoryCumulative(models.Model):
    id = models.TextField()
    end_date = models.DateField()
    history_id = models.IntegerField()
    date = models.DateField()
    task_id = models.IntegerField()
    type_id = models.IntegerField()
    user_id = models.IntegerField()
    kanban_state = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    remaining_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    planned_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    project_id = models.IntegerField()
    class Meta:
        db_table = u'project_task_history_cumulative'

class ProjectTaskWork(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    hours = models.FloatField()
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=128)
    task = models.ForeignKey(ProjectTask)
    date = models.DateTimeField()
    company_id = models.IntegerField()
    class Meta:
        db_table = u'project_task_work'

class ProjectTaskHistory(models.Model):
    id = models.IntegerField(primary_key=True)
    user = models.ForeignKey(ResUsers)
    task = models.ForeignKey(ProjectTask)
    end_date = models.DateField()
    type = models.ForeignKey(ProjectTaskType)
    kanban_state = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    date = models.DateField()
    planned_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    remaining_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'project_task_history'

class ProjectTaskReevaluate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    remaining_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'project_task_reevaluate'

class ReportProjectTaskUser(models.Model):
    nbr = models.IntegerField()
    id = models.IntegerField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    date_start = models.DateTimeField()
    date_end = models.DateTimeField()
    date_deadline = models.DateField()
    no_of_days = models.FloatField()
    user_id = models.IntegerField()
    progress = models.DecimalField(max_digits=65535, decimal_places=65535)
    project_id = models.IntegerField()
    state = models.CharField(max_length=-1)
    hours_effective = models.DecimalField(max_digits=65535, decimal_places=65535)
    priority = models.CharField(max_length=-1)
    name = models.CharField(max_length=128)
    company_id = models.IntegerField()
    partner_id = models.IntegerField()
    stage_id = models.IntegerField()
    remaining_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    total_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    hours_delay = models.DecimalField(max_digits=65535, decimal_places=65535)
    hours_planned = models.FloatField()
    closing_days = models.FloatField()
    opening_days = models.FloatField()
    delay_endings_days = models.FloatField()
    class Meta:
        db_table = u'report_project_task_user'

class ProjectUserRel(models.Model):
    project = models.ForeignKey(ProjectProject)
    uid = models.ForeignKey(ResUsers, db_column='uid')
    class Meta:
        db_table = u'project_user_rel'

class ProductUom(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    uom_type = models.CharField(max_length=-1)
    category = models.ForeignKey(ProductUomCateg)
    name = models.CharField(max_length=64)
    rounding = models.DecimalField(max_digits=65535, decimal_places=65535)
    factor = models.DecimalField(max_digits=65535, decimal_places=65535)
    active = models.BooleanField()
    class Meta:
        db_table = u'product_uom'

class ProjectTaskType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    fold = models.BooleanField()
    case_default = models.BooleanField()
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    state = models.CharField(max_length=-1)
    description = models.TextField()
    class Meta:
        db_table = u'project_task_type'

class PortalPaymentAcquirer(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    visible = models.BooleanField()
    name = models.CharField(max_length=-1)
    form_template = models.TextField()
    class Meta:
        db_table = u'portal_payment_acquirer'

class ProjectTaskDelegate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    planned_hours = models.FloatField()
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=64)
    state = models.CharField(max_length=-1)
    project = models.ForeignKey(ProjectProject)
    prefix = models.CharField(max_length=64)
    planned_hours_me = models.FloatField()
    new_task_description = models.TextField()
    class Meta:
        db_table = u'project_task_delegate'

class ProjectTaskParentRel(models.Model):
    parent = models.ForeignKey(ProjectTask)
    task = models.ForeignKey(ProjectTask)
    class Meta:
        db_table = u'project_task_parent_rel'

class ProjectTaskTypeRel(models.Model):
    type = models.ForeignKey(ProjectTaskType)
    project = models.ForeignKey(ProjectProject)
    class Meta:
        db_table = u'project_task_type_rel'

class ProjectCategoryProjectTaskRel(models.Model):
    project_task = models.ForeignKey(ProjectTask)
    project_category = models.ForeignKey(ProjectCategory)
    class Meta:
        db_table = u'project_category_project_task_rel'

class ProjectProject(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    alias_model = models.CharField(max_length=-1)
    color = models.IntegerField()
    alias = models.ForeignKey(MailAlias)
    active = models.BooleanField()
    effective_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    planned_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    privacy_visibility = models.CharField(max_length=-1)
    analytic_account = models.ForeignKey(AccountAnalyticAccount)
    sequence = models.IntegerField()
    priority = models.IntegerField()
    total_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    state = models.CharField(max_length=-1)
    resource_calendar = models.ForeignKey(ResourceCalendar)
    progress_rate = models.DecimalField(max_digits=65535, decimal_places=65535)
    project_escalation = models.ForeignKey('self')
    class Meta:
        db_table = u'project_project'

class ProjectConfigSettings(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    group_manage_delegation_task = models.BooleanField()
    module_pad = models.BooleanField()
    module_project_mrp = models.BooleanField()
    module_project_issue_sheet = models.BooleanField()
    group_tasks_work_on_tasks = models.BooleanField()
    module_project_long_term = models.BooleanField()
    time_unit = models.ForeignKey(ProductUom, db_column='time_unit')
    module_project_issue = models.BooleanField()
    group_time_work_estimation_tasks = models.BooleanField()
    module_project_timesheet = models.BooleanField()
    fetchmail_issue = models.BooleanField()
    class Meta:
        db_table = u'project_config_settings'

class ProjectCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'project_category'

class PortalWizard(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    portal = models.ForeignKey(ResGroups)
    welcome_message = models.TextField()
    class Meta:
        db_table = u'portal_wizard'

class PortalWizardUser(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    in_portal = models.BooleanField()
    partner = models.ForeignKey(ResPartner)
    email = models.CharField(max_length=240)
    wizard = models.ForeignKey(PortalWizard)
    class Meta:
        db_table = u'portal_wizard_user'

class ShareWizardResGroupRel(models.Model):
    share = models.ForeignKey(ShareWizard)
    group = models.ForeignKey(ResGroups)
    class Meta:
        db_table = u'share_wizard_res_group_rel'

class ShareWizard(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    domain = models.CharField(max_length=256)
    record_name = models.CharField(max_length=128)
    invite = models.BooleanField()
    view_type = models.CharField(max_length=32)
    user_type = models.CharField(max_length=-1)
    email_2 = models.CharField(max_length=64)
    email_3 = models.CharField(max_length=64)
    embed_option_search = models.BooleanField()
    message = models.TextField()
    name = models.CharField(max_length=64)
    embed_option_title = models.BooleanField()
    email_1 = models.CharField(max_length=64)
    new_users = models.TextField()
    access_mode = models.CharField(max_length=-1)
    action = models.ForeignKey(IrActWindow)
    class Meta:
        db_table = u'share_wizard'

class ShareWizardResUserRel(models.Model):
    share = models.ForeignKey(ShareWizard)
    user = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'share_wizard_res_user_rel'

class BaseActionRuleLeadTest(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    state = models.CharField(max_length=-1)
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=64)
    active = models.BooleanField()
    partner = models.ForeignKey(ResPartner)
    date_action_last = models.DateTimeField()
    class Meta:
        db_table = u'base_action_rule_lead_test'

class IrFilters(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    is_default = models.BooleanField()
    model_id = models.CharField(max_length=-1)
    domain = models.TextField()
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=64)
    context = models.TextField()
    class Meta:
        db_table = u'ir_filters'

class BaseActionRuleIrActServerRel(models.Model):
    base_action_rule = models.ForeignKey(BaseActionRule)
    ir_act_server = models.ForeignKey(IrActServer)
    class Meta:
        db_table = u'base_action_rule_ir_act_server_rel'

class BaseActionRuleResPartnerRel(models.Model):
    base_action_rule = models.ForeignKey(BaseActionRule)
    res_partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'base_action_rule_res_partner_rel'

class BaseActionRule(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    model = models.ForeignKey(IrModel)
    filter_pre = models.ForeignKey(IrFilters)
    sequence = models.IntegerField()
    act_user = models.ForeignKey(ResUsers)
    last_run = models.DateTimeField()
    trg_date = models.ForeignKey(IrModelFields)
    trg_date_range_type = models.CharField(max_length=-1)
    filter = models.ForeignKey(IrFilters)
    active = models.BooleanField()
    trg_date_range = models.IntegerField()
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'base_action_rule'

class EventAttendeeRel(models.Model):
    event = models.ForeignKey(CalendarEvent)
    attendee = models.ForeignKey(CalendarAttendee)
    class Meta:
        db_table = u'event_attendee_rel'

class CalendarAttendeeChildRel(models.Model):
    attendee = models.ForeignKey(CalendarAttendee)
    child = models.ForeignKey(CalendarAttendee)
    class Meta:
        db_table = u'calendar_attendee_child_rel'

class AlarmAttendeeRel(models.Model):
    alarm = models.ForeignKey(CalendarAlarm)
    attendee = models.ForeignKey(CalendarAttendee)
    class Meta:
        db_table = u'alarm_attendee_rel'

class CalendarAttendeeParentRel(models.Model):
    attendee = models.ForeignKey(CalendarAttendee)
    parent = models.ForeignKey(CalendarAttendee)
    class Meta:
        db_table = u'calendar_attendee_parent_rel'

class CalendarEventResPartnerRel(models.Model):
    calendar_event = models.ForeignKey(CalendarEvent)
    res_partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'calendar_event_res_partner_rel'

class CalendarEvent(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    allday = models.BooleanField()
    sequence = models.IntegerField()
    we = models.BooleanField()
    base_calendar_alarm = models.ForeignKey(CalendarAlarm)
    rrule = models.CharField(max_length=124)
    duration = models.FloatField()
    organizer = models.CharField(max_length=256)
    month_list = models.IntegerField()
    user = models.ForeignKey(ResUsers)
    vtimezone = models.CharField(max_length=64)
    tu = models.BooleanField()
    recurrency = models.BooleanField()
    week_list = models.CharField(max_length=-1)
    day = models.IntegerField()
    state = models.CharField(max_length=-1)
    base_calendar_url = models.CharField(max_length=264)
    location = models.CharField(max_length=264)
    th = models.BooleanField()
    exrule = models.CharField(max_length=352)
    su = models.BooleanField()
    exdate = models.TextField()
    fr = models.BooleanField()
    recurrent_id_date = models.DateTimeField()
    description = models.TextField()
    end_date = models.DateField()
    class_field = models.CharField(max_length=-1, db_column='class') # Field renamed because it was a Python reserved word.
    byday = models.CharField(max_length=-1)
    date = models.DateTimeField()
    active = models.BooleanField()
    show_as = models.CharField(max_length=-1)
    count = models.IntegerField()
    end_type = models.CharField(max_length=-1)
    name = models.CharField(max_length=64)
    date_deadline = models.DateTimeField()
    mo = models.BooleanField()
    interval = models.IntegerField()
    recurrent_id = models.IntegerField()
    alarm = models.ForeignKey(ResAlarm)
    organizer = models.ForeignKey(ResUsers)
    sa = models.BooleanField()
    rrule_type = models.CharField(max_length=-1)
    select1 = models.CharField(max_length=-1)
    class Meta:
        db_table = u'calendar_event'

class CalendarTodoResPartnerRel(models.Model):
    calendar_todo = models.ForeignKey(CalendarTodo)
    res_partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'calendar_todo_res_partner_rel'

class CalendarTodo(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    allday = models.BooleanField()
    sequence = models.IntegerField()
    we = models.BooleanField()
    base_calendar_alarm = models.ForeignKey(CalendarAlarm)
    rrule = models.CharField(max_length=124)
    duration = models.IntegerField()
    organizer = models.CharField(max_length=256)
    month_list = models.IntegerField()
    user = models.ForeignKey(ResUsers)
    vtimezone = models.CharField(max_length=64)
    tu = models.BooleanField()
    recurrency = models.BooleanField()
    week_list = models.CharField(max_length=-1)
    day = models.IntegerField()
    state = models.CharField(max_length=-1)
    base_calendar_url = models.CharField(max_length=264)
    show_as = models.CharField(max_length=-1)
    location = models.CharField(max_length=264)
    th = models.BooleanField()
    exrule = models.CharField(max_length=352)
    exdate = models.TextField()
    fr = models.BooleanField()
    recurrent_id_date = models.DateTimeField()
    description = models.TextField()
    end_date = models.DateField()
    byday = models.CharField(max_length=-1)
    date = models.DateTimeField()
    active = models.BooleanField()
    class_field = models.CharField(max_length=-1, db_column='class') # Field renamed because it was a Python reserved word.
    count = models.IntegerField()
    end_type = models.CharField(max_length=-1)
    name = models.CharField(max_length=64)
    date_deadline = models.DateTimeField()
    mo = models.BooleanField()
    interval = models.IntegerField()
    su = models.BooleanField()
    alarm = models.ForeignKey(ResAlarm)
    recurrent_id = models.IntegerField()
    organizer = models.ForeignKey(ResUsers)
    sa = models.BooleanField()
    rrule_type = models.CharField(max_length=-1)
    select1 = models.CharField(max_length=-1)
    class Meta:
        db_table = u'calendar_todo'

class CrmMeetingPartnerRel(models.Model):
    meeting = models.ForeignKey(CrmMeeting)
    partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'crm_meeting_partner_rel'

class CalendarAttendee(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    cn = models.CharField(max_length=124)
    cutype = models.CharField(max_length=-1)
    partner = models.ForeignKey(ResPartner)
    availability = models.CharField(max_length=-1)
    user = models.ForeignKey(ResUsers)
    language = models.CharField(max_length=-1)
    delegated_from = models.CharField(max_length=124)
    sent_by = models.CharField(max_length=124)
    member = models.CharField(max_length=124)
    delegated_to = models.CharField(max_length=124)
    state = models.CharField(max_length=-1)
    role = models.CharField(max_length=-1)
    ref = models.CharField(max_length=128)
    email = models.CharField(max_length=124)
    dir = models.CharField(max_length=124)
    rsvp = models.BooleanField()
    class Meta:
        db_table = u'calendar_attendee'

class MeetingAttendeeRel(models.Model):
    event = models.ForeignKey(CrmMeeting)
    attendee = models.ForeignKey(CalendarAttendee)
    class Meta:
        db_table = u'meeting_attendee_rel'

class CalendarAlarm(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    model = models.ForeignKey(IrModel)
    repeat = models.IntegerField()
    description = models.TextField()
    trigger_occurs = models.CharField(max_length=-1)
    duration = models.IntegerField()
    active = models.BooleanField()
    trigger_related = models.CharField(max_length=-1)
    trigger_duration = models.IntegerField()
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=124)
    attach = models.TextField() # This field type is a guess.
    event_end_date = models.DateTimeField()
    trigger_interval = models.CharField(max_length=-1)
    alarm = models.ForeignKey(ResAlarm)
    state = models.CharField(max_length=-1)
    action = models.CharField(max_length=-1)
    event_date = models.DateTimeField()
    trigger_date = models.DateTimeField()
    res_id = models.IntegerField()
    class Meta:
        db_table = u'calendar_alarm'

class ResAlarm(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    trigger_duration = models.IntegerField()
    name = models.CharField(max_length=256)
    trigger_occurs = models.CharField(max_length=-1)
    trigger_interval = models.CharField(max_length=-1)
    duration = models.IntegerField()
    repeat = models.IntegerField()
    active = models.BooleanField()
    trigger_related = models.CharField(max_length=-1)
    class Meta:
        db_table = u'res_alarm'

class MeetingCategoryRel(models.Model):
    event = models.ForeignKey(CrmMeeting)
    type = models.ForeignKey(CrmMeetingType)
    class Meta:
        db_table = u'meeting_category_rel'

class CrmPaymentMode(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    section = models.ForeignKey(CrmCaseSection)
    class Meta:
        db_table = u'crm_payment_mode'

class CrmCaseCateg(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    object = models.ForeignKey(IrModel)
    section = models.ForeignKey(CrmCaseSection)
    class Meta:
        db_table = u'crm_case_categ'

class CrmMeetingType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'crm_meeting_type'

class CrmCaseChannel(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    active = models.BooleanField()
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'crm_case_channel'

class CrmMeeting(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_closed = models.DateTimeField()
    allday = models.BooleanField()
    sequence = models.IntegerField()
    we = models.BooleanField()
    base_calendar_alarm = models.ForeignKey(CalendarAlarm)
    rrule = models.CharField(max_length=124)
    duration = models.FloatField()
    organizer = models.CharField(max_length=256)
    month_list = models.IntegerField()
    user = models.ForeignKey(ResUsers)
    vtimezone = models.CharField(max_length=64)
    tu = models.BooleanField()
    recurrency = models.BooleanField()
    week_list = models.CharField(max_length=-1)
    state = models.CharField(max_length=16)
    base_calendar_url = models.CharField(max_length=264)
    location = models.CharField(max_length=264)
    th = models.BooleanField()
    exrule = models.CharField(max_length=352)
    exdate = models.TextField()
    fr = models.BooleanField()
    recurrent_id_date = models.DateTimeField()
    description = models.TextField()
    end_date = models.DateField()
    class_field = models.CharField(max_length=-1, db_column='class') # Field renamed because it was a Python reserved word.
    byday = models.CharField(max_length=-1)
    date = models.DateTimeField()
    active = models.BooleanField()
    day = models.IntegerField()
    name = models.CharField(max_length=128)
    count = models.IntegerField()
    end_type = models.CharField(max_length=-1)
    date_open = models.DateTimeField()
    date_deadline = models.DateTimeField()
    mo = models.BooleanField()
    interval = models.IntegerField()
    su = models.BooleanField()
    alarm = models.ForeignKey(ResAlarm)
    recurrent_id = models.IntegerField()
    select1 = models.CharField(max_length=-1)
    organizer = models.ForeignKey(ResUsers)
    sa = models.BooleanField()
    rrule_type = models.CharField(max_length=-1)
    show_as = models.CharField(max_length=-1)
    opportunity = models.ForeignKey(CrmLead)
    phonecall = models.ForeignKey(CrmPhonecall)
    class Meta:
        db_table = u'crm_meeting'

class CrmPhonecallReport(models.Model):
    id = models.IntegerField()
    name = models.TextField()
    month = models.TextField()
    day = models.TextField()
    creation_date = models.TextField()
    opening_date = models.TextField()
    date_closed = models.TextField()
    state = models.CharField(max_length=16)
    user_id = models.IntegerField()
    section_id = models.IntegerField()
    categ_id = models.IntegerField()
    partner_id = models.IntegerField()
    duration = models.FloatField()
    company_id = models.IntegerField()
    priority = models.CharField(max_length=-1)
    nbr = models.IntegerField()
    create_date = models.DateTimeField()
    delay_close = models.FloatField()
    delay_open = models.FloatField()
    class Meta:
        db_table = u'crm_phonecall_report'

class CrmPartnerBinding(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    action = models.CharField(max_length=-1)
    partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'crm_partner_binding'

class CrmLeadReport(models.Model):
    id = models.IntegerField()
    deadline_year = models.TextField()
    deadline_month = models.TextField()
    deadline_day = models.TextField()
    creation_year = models.TextField()
    creation_month = models.TextField()
    creation_day = models.TextField()
    opening_date = models.TextField()
    date_closed = models.TextField()
    state = models.CharField(max_length=-1)
    user_id = models.IntegerField()
    probability = models.FloatField()
    stage_id = models.IntegerField()
    type = models.CharField(max_length=-1)
    company_id = models.IntegerField()
    priority = models.CharField(max_length=-1)
    section_id = models.IntegerField()
    channel_id = models.IntegerField()
    type_id = models.IntegerField()
    partner_id = models.IntegerField()
    country_id = models.IntegerField()
    planned_revenue = models.FloatField()
    probable_revenue = models.FloatField()
    nbr = models.IntegerField()
    create_date = models.DateTimeField()
    delay_close = models.FloatField()
    delay_expected = models.FloatField()
    delay_open = models.FloatField()
    class Meta:
        db_table = u'crm_lead_report'

class CrmSegmentationLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    expr_name = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    expr_value = models.FloatField()
    operator = models.CharField(max_length=-1)
    segmentation = models.ForeignKey(CrmSegmentation)
    expr_operator = models.CharField(max_length=-1)
    class Meta:
        db_table = u'crm_segmentation_line'

class SaleMemberRel(models.Model):
    section = models.ForeignKey(CrmCaseSection)
    member = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'sale_member_rel'

class SectionStageRel(models.Model):
    stage = models.ForeignKey(CrmCaseStage)
    section = models.ForeignKey(CrmCaseSection)
    class Meta:
        db_table = u'section_stage_rel'

class CrmMergeOpportunity(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'crm_merge_opportunity'

class MergeOpportunityRel(models.Model):
    merge = models.ForeignKey(CrmMergeOpportunity)
    opportunity = models.ForeignKey(CrmLead)
    class Meta:
        db_table = u'merge_opportunity_rel'

class CrmSegmentation(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    categ = models.ForeignKey(ResPartnerCategory)
    state = models.CharField(max_length=-1)
    sales_purchase_active = models.BooleanField()
    exclusif = models.BooleanField()
    partner_id = models.IntegerField()
    description = models.TextField()
    class Meta:
        db_table = u'crm_segmentation'

class CrmLead2OpportunityPartner(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    action = models.CharField(max_length=-1)
    partner = models.ForeignKey(ResPartner)
    name = models.CharField(max_length=-1)
    class Meta:
        db_table = u'crm_lead2opportunity_partner'

class CrmLeadCrmLead2OpportunityPartnerRel(models.Model):
    crm_lead2opportunity_partner = models.ForeignKey(CrmLead2OpportunityPartner)
    crm_lead = models.ForeignKey(CrmLead)
    class Meta:
        db_table = u'crm_lead_crm_lead2opportunity_partner_rel'

class CrmOpportunity2Phonecall(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=64)
    categ = models.ForeignKey(CrmCaseCateg)
    section = models.ForeignKey(CrmCaseSection)
    note = models.TextField()
    phone = models.CharField(max_length=64)
    date = models.DateTimeField()
    contact_name = models.CharField(max_length=64)
    partner = models.ForeignKey(ResPartner)
    action = models.CharField(max_length=-1)
    class Meta:
        db_table = u'crm_opportunity2phonecall'

class CrmLead2OpportunityPartnerMassResUsersRel(models.Model):
    crm_lead2opportunity_partner_mass = models.ForeignKey(CrmLead2OpportunityPartnerMass)
    res_users = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'crm_lead2opportunity_partner_mass_res_users_rel'

class CrmPhonecall2Phonecall(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=64)
    categ = models.ForeignKey(CrmCaseCateg)
    section = models.ForeignKey(CrmCaseSection)
    note = models.TextField()
    phone = models.CharField(max_length=64)
    date = models.DateTimeField()
    action = models.CharField(max_length=-1)
    contact_name = models.CharField(max_length=64)
    partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'crm_phonecall2phonecall'

class ResCountryState(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    code = models.CharField(max_length=3)
    country = models.ForeignKey(ResCountry)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'res_country_state'

class PortalCrmCrmContactUsResCompanyRel(models.Model):
    portal_crm_crm_contact_us = models.ForeignKey(PortalCrmCrmContactUs)
    res_company = models.ForeignKey(ResCompany)
    class Meta:
        db_table = u'portal_crm_crm_contact_us_res_company_rel'

class CrmLeadCrmLead2OpportunityPartnerMassRel(models.Model):
    crm_lead2opportunity_partner_mass = models.ForeignKey(CrmLead2OpportunityPartnerMass)
    crm_lead = models.ForeignKey(CrmLead)
    class Meta:
        db_table = u'crm_lead_crm_lead2opportunity_partner_mass_rel'

class CrmLeadCategoryRel(models.Model):
    lead = models.ForeignKey(CrmLead)
    category = models.ForeignKey(CrmCaseCateg)
    class Meta:
        db_table = u'crm_lead_category_rel'

class CrmLead2OpportunityPartnerMass(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=-1)
    action = models.CharField(max_length=-1)
    partner = models.ForeignKey(ResPartner)
    section = models.ForeignKey(CrmCaseSection)
    class Meta:
        db_table = u'crm_lead2opportunity_partner_mass'

class CrmLead(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_closed = models.DateTimeField()
    type = models.ForeignKey(CrmCaseResourceType)
    color = models.IntegerField()
    date_action_last = models.DateTimeField()
    day_close = models.DecimalField(max_digits=65535, decimal_places=65535)
    active = models.BooleanField()
    street = models.CharField(max_length=128)
    day_open = models.DecimalField(max_digits=65535, decimal_places=65535)
    contact_name = models.CharField(max_length=64)
    partner = models.ForeignKey(ResPartner)
    city = models.CharField(max_length=128)
    date_open = models.DateTimeField()
    user = models.ForeignKey(ResUsers)
    opt_out = models.BooleanField()
    title = models.ForeignKey(ResPartnerTitle, db_column='title')
    partner_name = models.CharField(max_length=64)
    planned_revenue = models.FloatField()
    country = models.ForeignKey(ResCountry)
    company = models.ForeignKey(ResCompany)
    priority = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    email_cc = models.TextField()
    date_action_next = models.DateTimeField()
    type = models.CharField(max_length=-1)
    street2 = models.CharField(max_length=128)
    function = models.CharField(max_length=128)
    fax = models.CharField(max_length=64)
    description = models.TextField()
    planned_cost = models.FloatField()
    ref2 = models.CharField(max_length=128)
    section = models.ForeignKey(CrmCaseSection)
    title_action = models.CharField(max_length=64)
    phone = models.CharField(max_length=64)
    probability = models.FloatField()
    payment_mode = models.ForeignKey(CrmPaymentMode, db_column='payment_mode')
    date_action = models.DateField()
    name = models.CharField(max_length=64)
    stage = models.ForeignKey(CrmCaseStage)
    zip = models.CharField(max_length=24)
    date_deadline = models.DateField()
    mobile = models.CharField(max_length=64)
    ref = models.CharField(max_length=128)
    channel = models.ForeignKey(CrmCaseChannel)
    state = models.ForeignKey(ResCountryState)
    email_from = models.CharField(max_length=128)
    referred = models.CharField(max_length=64)
    class Meta:
        db_table = u'crm_lead'

class CrmPhonecall(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_closed = models.DateTimeField()
    description = models.TextField()
    state = models.CharField(max_length=16)
    date_action_last = models.DateTimeField()
    section = models.ForeignKey(CrmCaseSection)
    active = models.BooleanField()
    duration = models.FloatField()
    partner_mobile = models.CharField(max_length=32)
    date = models.DateTimeField()
    categ = models.ForeignKey(CrmCaseCateg)
    opportunity = models.ForeignKey(CrmLead)
    user = models.ForeignKey(ResUsers)
    date_open = models.DateTimeField()
    partner = models.ForeignKey(ResPartner)
    date_action_next = models.DateTimeField()
    company = models.ForeignKey(ResCompany)
    name = models.CharField(max_length=64)
    priority = models.CharField(max_length=-1)
    partner_phone = models.CharField(max_length=32)
    email_from = models.CharField(max_length=128)
    class Meta:
        db_table = u'crm_phonecall'

class AccountPaymentTerm(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    active = models.BooleanField()
    note = models.TextField()
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'account_payment_term'

class AccountAccountFinancialReport(models.Model):
    account = models.ForeignKey(AccountAccount)
    report_line = models.ForeignKey(AccountFinancialReport)
    class Meta:
        db_table = u'account_account_financial_report'

class AccountPaymentTermLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    payment = models.ForeignKey(AccountPaymentTerm)
    days2 = models.IntegerField()
    value = models.CharField(max_length=-1)
    value_amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    days = models.IntegerField()
    class Meta:
        db_table = u'account_payment_term_line'

class AccountMove(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    state = models.CharField(max_length=-1)
    ref = models.CharField(max_length=64)
    company_id = models.IntegerField()
    journal = models.ForeignKey(AccountJournal)
    period = models.ForeignKey(AccountPeriod)
    narration = models.TextField()
    date = models.DateField()
    balance = models.DecimalField(max_digits=65535, decimal_places=65535)
    partner_id = models.IntegerField()
    to_check = models.BooleanField()
    class Meta:
        db_table = u'account_move'

class AccountSubscription(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    model = models.ForeignKey(AccountModel)
    period_nbr = models.IntegerField()
    name = models.CharField(max_length=64)
    date_start = models.DateField()
    period_total = models.IntegerField()
    state = models.CharField(max_length=-1)
    period_type = models.CharField(max_length=-1)
    ref = models.CharField(max_length=16)
    class Meta:
        db_table = u'account_subscription'

class AccountMoveReconcile(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    opening_reconciliation = models.BooleanField()
    type = models.CharField(max_length=16)
    class Meta:
        db_table = u'account_move_reconcile'

class AccountAddtmplWizard(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    cparent = models.ForeignKey(AccountAccount)
    class Meta:
        db_table = u'account_addtmpl_wizard'

class AccountFiscalPositionTemplate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    note = models.TextField()
    chart_template = models.ForeignKey(AccountChartTemplate)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'account_fiscal_position_template'

class AccountAccountTemplateTaxRel(models.Model):
    account = models.ForeignKey(AccountAccountTemplate)
    tax = models.ForeignKey(AccountTaxTemplate)
    class Meta:
        db_table = u'account_account_template_tax_rel'

class AccountFiscalPositionAccountTemplate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    position = models.ForeignKey(AccountFiscalPositionTemplate)
    account_dest = models.ForeignKey(AccountAccountTemplate)
    account_src = models.ForeignKey(AccountAccountTemplate)
    class Meta:
        db_table = u'account_fiscal_position_account_template'

class ProjectAccountAnalyticLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    from_date = models.DateField()
    to_date = models.DateField()
    class Meta:
        db_table = u'project_account_analytic_line'

class AccountAnalyticJournal(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    code = models.CharField(max_length=8)
    name = models.CharField(max_length=64)
    active = models.BooleanField()
    type = models.CharField(max_length=32)
    company = models.ForeignKey(ResCompany)
    class Meta:
        db_table = u'account_analytic_journal'

class AccountAnalyticCostLedgerJournalReport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date1 = models.DateField()
    date2 = models.DateField()
    class Meta:
        db_table = u'account_analytic_cost_ledger_journal_report'

class AccountAnalyticCostLedger(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date1 = models.DateField()
    date2 = models.DateField()
    class Meta:
        db_table = u'account_analytic_cost_ledger'

class AccountAnalyticInvertedBalance(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date1 = models.DateField()
    date2 = models.DateField()
    class Meta:
        db_table = u'account_analytic_inverted_balance'

class AccountInstaller(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_stop = models.DateField()
    charts = models.CharField(max_length=-1)
    company = models.ForeignKey(ResCompany)
    date_start = models.DateField()
    period = models.CharField(max_length=-1)
    has_default_company = models.BooleanField()
    class Meta:
        db_table = u'account_installer'

class AccountAnalyticBalance(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date1 = models.DateField()
    date2 = models.DateField()
    empty_acc = models.BooleanField()
    class Meta:
        db_table = u'account_analytic_balance'

class AccountAnalyticChart(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    from_date = models.DateField()
    to_date = models.DateField()
    class Meta:
        db_table = u'account_analytic_chart'

class AccountBankStatement(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    balance_start = models.DecimalField(max_digits=65535, decimal_places=65535)
    journal = models.ForeignKey(AccountJournal)
    period = models.ForeignKey(AccountPeriod)
    total_entry_encoding = models.DecimalField(max_digits=65535, decimal_places=65535)
    date = models.DateField()
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=64)
    closing_date = models.DateTimeField()
    balance_end = models.DecimalField(max_digits=65535, decimal_places=65535)
    company_id = models.IntegerField()
    state = models.CharField(max_length=-1)
    balance_end_real = models.DecimalField(max_digits=65535, decimal_places=65535)
    pos_session = models.ForeignKey(PosSession)
    class Meta:
        db_table = u'account_bank_statement'

class AccountJournalCashboxLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    journal = models.ForeignKey(AccountJournal)
    pieces = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'account_journal_cashbox_line'

class AccountCommonReportAccountJournalRel(models.Model):
    account_common_report = models.ForeignKey(AccountCommonReport)
    account_journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_common_report_account_journal_rel'

class AccountCashboxLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    bank_statement = models.ForeignKey(AccountBankStatement)
    number_opening = models.IntegerField()
    number_closing = models.IntegerField()
    pieces = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'account_cashbox_line'

class AccountMoveLineReconcileSelect(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    account = models.ForeignKey(AccountAccount)
    class Meta:
        db_table = u'account_move_line_reconcile_select'

class AccountMoveLineUnreconcileSelect(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    account = models.ForeignKey(AccountAccount)
    class Meta:
        db_table = u'account_move_line_unreconcile_select'

class AccountCommonAccountReportAccountJournalRel(models.Model):
    account_common_account_report = models.ForeignKey(AccountCommonAccountReport)
    account_journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_common_account_report_account_journal_rel'

class AccountSubscriptionGenerate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.DateField()
    class Meta:
        db_table = u'account_subscription_generate'

class AccountMoveBankReconcile(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_move_bank_reconcile'

class AccountUnreconcile(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'account_unreconcile'

class AccountMoveLineReconcile(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    trans_nbr = models.IntegerField()
    credit = models.DecimalField(max_digits=65535, decimal_places=65535)
    writeoff = models.DecimalField(max_digits=65535, decimal_places=65535)
    debit = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'account_move_line_reconcile'

class AccountUnreconcileReconcile(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'account_unreconcile_reconcile'

class AccountJournalSelect(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'account_journal_select'

class AccountPartnerLedgerJournalRel(models.Model):
    account = models.ForeignKey(AccountPartnerLedger)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_partner_ledger_journal_rel'

class AccountPeriodClose(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    sure = models.BooleanField()
    class Meta:
        db_table = u'account_period_close'

class AccountOpenClosedFiscalyear(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    fyear = models.ForeignKey(AccountFiscalyear)
    class Meta:
        db_table = u'account_open_closed_fiscalyear'

class AccountInvoiceCancel(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'account_invoice_cancel'

class AccountFiscalyearCloseState(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    fy = models.ForeignKey(AccountFiscalyear)
    class Meta:
        db_table = u'account_fiscalyear_close_state'

class AccountInvoiceConfirm(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'account_invoice_confirm'

class AccountChart(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    target_move = models.CharField(max_length=-1)
    fiscalyear = models.ForeignKey(AccountFiscalyear, db_column='fiscalyear')
    class Meta:
        db_table = u'account_chart'

class AccountStateOpen(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'account_state_open'

class AccountCentralJournalJournalRel(models.Model):
    account = models.ForeignKey(AccountCentralJournal)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_central_journal_journal_rel'

class ValidateAccountMoveLines(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'validate_account_move_lines'

class AccountUseModel(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'account_use_model'

class AccountTaxChart(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    period = models.ForeignKey(AccountPeriod)
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_tax_chart'

class ValidateAccountMove(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    period = models.ForeignKey(AccountPeriod)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'validate_account_move'

class AccountChangeCurrency(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    currency = models.ForeignKey(ResCurrency)
    class Meta:
        db_table = u'account_change_currency'

class CashBoxIn(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    ref = models.CharField(max_length=32)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'cash_box_in'

class CashBoxOut(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'cash_box_out'

class ReportAccountReceivable(models.Model):
    id = models.IntegerField()
    name = models.TextField()
    balance = models.DecimalField(max_digits=65535, decimal_places=65535)
    debit = models.DecimalField(max_digits=65535, decimal_places=65535)
    credit = models.DecimalField(max_digits=65535, decimal_places=65535)
    type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'report_account_receivable'

class AccountBalanceReportJournalRel(models.Model):
    account = models.ForeignKey(AccountBalanceReport)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_balance_report_journal_rel'

class ReportAgedReceivable(models.Model):
    id = models.IntegerField()
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'report_aged_receivable'

class TempRange(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'temp_range'

class AccountAnalyticAccount(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    code = models.CharField(max_length=-1)
    description = models.TextField()
    quantity_max = models.FloatField()
    currency_id = models.IntegerField()
    date = models.DateField()
    partner = models.ForeignKey(ResPartner)
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=128)
    parent = models.ForeignKey('self')
    date_start = models.DateField()
    company = models.ForeignKey(ResCompany)
    state = models.CharField(max_length=-1)
    manager = models.ForeignKey(ResUsers)
    type = models.CharField(max_length=-1)
    template = models.ForeignKey('self')
    use_tasks = models.BooleanField()
    use_issues = models.BooleanField()
    use_timesheets = models.BooleanField()
    amount_max = models.FloatField()
    pricelist = models.ForeignKey(ProductPricelist)
    to_invoice = models.ForeignKey(HrTimesheetInvoiceFactor, db_column='to_invoice')
    class Meta:
        db_table = u'account_analytic_account'

class ReportInvoiceCreated(models.Model):
    id = models.IntegerField()
    name = models.CharField(max_length=64)
    type = models.CharField(max_length=-1)
    number = models.CharField(max_length=64)
    partner_id = models.IntegerField()
    amount_untaxed = models.DecimalField(max_digits=65535, decimal_places=65535)
    amount_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    currency_id = models.IntegerField()
    date_invoice = models.DateField()
    date_due = models.DateField()
    residual = models.DecimalField(max_digits=65535, decimal_places=65535)
    state = models.CharField(max_length=-1)
    origin = models.CharField(max_length=64)
    create_date = models.DateTimeField()
    class Meta:
        db_table = u'report_invoice_created'

class ReportAccountTypeSales(models.Model):
    id = models.IntegerField()
    name = models.TextField()
    month = models.TextField()
    amount_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    currency_id = models.IntegerField()
    period_id = models.IntegerField()
    product_id = models.IntegerField()
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    user_type = models.IntegerField()
    class Meta:
        db_table = u'report_account_type_sales'

class ReportAccountSales(models.Model):
    id = models.IntegerField()
    name = models.TextField()
    month = models.TextField()
    amount_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    currency_id = models.IntegerField()
    period_id = models.IntegerField()
    product_id = models.IntegerField()
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    account_id = models.IntegerField()
    class Meta:
        db_table = u'report_account_sales'

class AccountEntriesReport(models.Model):
    id = models.IntegerField()
    date = models.DateField()
    date_maturity = models.DateField()
    date_created = models.DateField()
    ref = models.CharField(max_length=64)
    move_state = models.CharField(max_length=-1)
    move_line_state = models.CharField(max_length=-1)
    reconcile_id = models.IntegerField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    partner_id = models.IntegerField()
    product_id = models.IntegerField()
    product_uom_id = models.IntegerField()
    company_id = models.IntegerField()
    journal_id = models.IntegerField()
    fiscalyear_id = models.IntegerField()
    period_id = models.IntegerField()
    account_id = models.IntegerField()
    analytic_account_id = models.IntegerField()
    type = models.CharField(max_length=-1)
    user_type = models.IntegerField()
    nbr = models.IntegerField()
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    currency_id = models.IntegerField()
    amount_currency = models.DecimalField(max_digits=65535, decimal_places=65535)
    debit = models.DecimalField(max_digits=65535, decimal_places=65535)
    credit = models.DecimalField(max_digits=65535, decimal_places=65535)
    balance = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'account_entries_report'

class AnalyticEntriesReport(models.Model):
    id = models.IntegerField()
    nbr = models.BigIntegerField()
    date = models.DateField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    user_id = models.IntegerField()
    name = models.CharField(max_length=256)
    partner_id = models.IntegerField()
    company_id = models.IntegerField()
    currency_id = models.IntegerField()
    account_id = models.IntegerField()
    general_account_id = models.IntegerField()
    journal_id = models.IntegerField()
    move_id = models.IntegerField()
    product_id = models.IntegerField()
    product_uom_id = models.IntegerField()
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    unit_amount = models.FloatField()
    class Meta:
        db_table = u'analytic_entries_report'

class AccountTreasuryReport(models.Model):
    id = models.IntegerField()
    fiscalyear_id = models.IntegerField()
    period_id = models.IntegerField()
    debit = models.DecimalField(max_digits=65535, decimal_places=65535)
    credit = models.DecimalField(max_digits=65535, decimal_places=65535)
    balance = models.DecimalField(max_digits=65535, decimal_places=65535)
    date = models.DateField()
    company_id = models.IntegerField()
    class Meta:
        db_table = u'account_treasury_report'

class AccountFiscalPositionAccount(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    position = models.ForeignKey(AccountFiscalPosition)
    account_dest = models.ForeignKey(AccountAccount)
    account_src = models.ForeignKey(AccountAccount)
    class Meta:
        db_table = u'account_fiscal_position_account'

class ProductTaxesRel(models.Model):
    prod = models.ForeignKey(ProductTemplate)
    tax = models.ForeignKey(AccountTax)
    class Meta:
        db_table = u'product_taxes_rel'

class ProductSupplierTaxesRel(models.Model):
    prod = models.ForeignKey(ProductTemplate)
    tax = models.ForeignKey(AccountTax)
    class Meta:
        db_table = u'product_supplier_taxes_rel'

class AccountFiscalPosition(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    note = models.TextField()
    name = models.CharField(max_length=64)
    active = models.BooleanField()
    company = models.ForeignKey(ResCompany)
    class Meta:
        db_table = u'account_fiscal_position'

class AccountFiscalPositionTax(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    position = models.ForeignKey(AccountFiscalPosition)
    tax_dest = models.ForeignKey(AccountTax)
    tax_src = models.ForeignKey(AccountTax)
    class Meta:
        db_table = u'account_fiscal_position_tax'

class AccountSequenceFiscalyear(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    sequence = models.ForeignKey(IrSequence)
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    sequence_main = models.ForeignKey(IrSequence)
    class Meta:
        db_table = u'account_sequence_fiscalyear'

class AccountAccount(models.Model):
    id = models.IntegerField(primary_key=True)
    parent_left = models.IntegerField()
    parent_right = models.IntegerField()
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    code = models.CharField(max_length=64)
    reconcile = models.BooleanField()
    currency = models.ForeignKey(ResCurrency)
    user_type = models.ForeignKey(AccountAccountType, db_column='user_type')
    active = models.BooleanField()
    name = models.CharField(max_length=256)
    level = models.IntegerField()
    company = models.ForeignKey(ResCompany)
    shortcut = models.CharField(max_length=12)
    note = models.TextField()
    parent = models.ForeignKey('self')
    currency_mode = models.CharField(max_length=-1)
    type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_account'

class AccountTaxCode(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    info = models.TextField()
    code = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    company = models.ForeignKey(ResCompany)
    sign = models.FloatField()
    notprintable = models.BooleanField()
    parent = models.ForeignKey('self')
    class Meta:
        db_table = u'account_tax_code'

class AccountJournalTypeRel(models.Model):
    journal = models.ForeignKey(AccountJournal)
    type = models.ForeignKey(AccountAccountType)
    class Meta:
        db_table = u'account_journal_type_rel'

class AccountSubscriptionLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.DateField()
    subscription = models.ForeignKey(AccountSubscription)
    move = models.ForeignKey(AccountMove)
    class Meta:
        db_table = u'account_subscription_line'

class AccountJournal(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    default_debit_account = models.ForeignKey(AccountAccount)
    code = models.CharField(max_length=5)
    default_credit_account = models.ForeignKey(AccountAccount)
    loss_account = models.ForeignKey(AccountAccount)
    currency = models.ForeignKey(ResCurrency, db_column='currency')
    internal_account = models.ForeignKey(AccountAccount)
    allow_date = models.BooleanField()
    sequence = models.ForeignKey(IrSequence)
    update_posted = models.BooleanField()
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=64)
    cash_control = models.BooleanField()
    centralisation = models.BooleanField()
    group_invoice_lines = models.BooleanField()
    with_last_closing_balance = models.BooleanField()
    company = models.ForeignKey(ResCompany)
    analytic_journal = models.ForeignKey(AccountAnalyticJournal)
    profit_account = models.ForeignKey(AccountAccount)
    entry_posted = models.BooleanField()
    type = models.CharField(max_length=32)
    self_checkout_payment_method = models.BooleanField()
    journal_user = models.BooleanField()
    amount_authorized_diff = models.FloatField()
    class Meta:
        db_table = u'account_journal'

class AccountJournalPeriod(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    state = models.CharField(max_length=-1)
    company_id = models.IntegerField()
    journal = models.ForeignKey(AccountJournal)
    period = models.ForeignKey(AccountPeriod)
    active = models.BooleanField()
    class Meta:
        db_table = u'account_journal_period'

class AccountTaxTemplate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    ref_base_code = models.ForeignKey(AccountTaxCodeTemplate)
    domain = models.CharField(max_length=32)
    description = models.CharField(max_length=-1)
    ref_tax_code = models.ForeignKey(AccountTaxCodeTemplate)
    sequence = models.IntegerField()
    ref_base_sign = models.FloatField()
    type_tax_use = models.CharField(max_length=-1)
    base_code = models.ForeignKey(AccountTaxCodeTemplate)
    base_sign = models.FloatField()
    child_depend = models.BooleanField()
    include_base_amount = models.BooleanField()
    applicable_type = models.CharField(max_length=-1)
    ref_tax_sign = models.FloatField()
    account_paid = models.ForeignKey(AccountAccountTemplate)
    account_collected = models.ForeignKey(AccountAccountTemplate)
    chart_template = models.ForeignKey(AccountChartTemplate)
    name = models.CharField(max_length=64)
    tax_code = models.ForeignKey(AccountTaxCodeTemplate)
    parent = models.ForeignKey('self')
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    python_compute = models.TextField()
    tax_sign = models.FloatField()
    python_compute_inv = models.TextField()
    python_applicable = models.TextField()
    type = models.CharField(max_length=-1)
    price_include = models.BooleanField()
    class Meta:
        db_table = u'account_tax_template'

class AccountTax(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    ref_base_code = models.ForeignKey(AccountTaxCode)
    domain = models.CharField(max_length=32)
    description = models.CharField(max_length=-1)
    ref_tax_code = models.ForeignKey(AccountTaxCode)
    sequence = models.IntegerField()
    account_paid = models.ForeignKey(AccountAccount)
    ref_base_sign = models.FloatField()
    type_tax_use = models.CharField(max_length=-1)
    base_code = models.ForeignKey(AccountTaxCode)
    base_sign = models.FloatField()
    child_depend = models.BooleanField()
    include_base_amount = models.BooleanField()
    account_analytic_collected = models.ForeignKey(AccountAnalyticAccount)
    account_analytic_paid = models.ForeignKey(AccountAnalyticAccount)
    active = models.BooleanField()
    ref_tax_sign = models.FloatField()
    applicable_type = models.CharField(max_length=-1)
    account_collected = models.ForeignKey(AccountAccount)
    company = models.ForeignKey(ResCompany)
    name = models.CharField(max_length=64)
    tax_code = models.ForeignKey(AccountTaxCode)
    parent = models.ForeignKey('self')
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    python_compute = models.TextField()
    tax_sign = models.FloatField()
    python_compute_inv = models.TextField()
    python_applicable = models.TextField()
    type = models.CharField(max_length=-1)
    price_include = models.BooleanField()
    class Meta:
        db_table = u'account_tax'

class AccountAccountConsolRel(models.Model):
    child = models.ForeignKey(AccountAccount)
    parent = models.ForeignKey(AccountAccount)
    class Meta:
        db_table = u'account_account_consol_rel'

class AccountAccountType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    close_method = models.CharField(max_length=-1)
    note = models.TextField()
    code = models.CharField(max_length=32)
    name = models.CharField(max_length=64)
    report_type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_account_type'

class AccountAccountTaxDefaultRel(models.Model):
    account = models.ForeignKey(AccountAccount)
    tax = models.ForeignKey(AccountTax)
    class Meta:
        db_table = u'account_account_tax_default_rel'

class AccountPeriod(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_stop = models.DateField()
    code = models.CharField(max_length=12)
    name = models.CharField(max_length=64)
    date_start = models.DateField()
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    company_id = models.IntegerField()
    state = models.CharField(max_length=-1)
    special = models.BooleanField()
    class Meta:
        db_table = u'account_period'

class AccountJournalGroupRel(models.Model):
    journal = models.ForeignKey(AccountJournal)
    group = models.ForeignKey(ResGroups)
    class Meta:
        db_table = u'account_journal_group_rel'

class AccountAccountTypeRel(models.Model):
    journal = models.ForeignKey(AccountJournal)
    account = models.ForeignKey(AccountAccount)
    class Meta:
        db_table = u'account_account_type_rel'

class AccountModel(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    journal = models.ForeignKey(AccountJournal)
    company_id = models.IntegerField()
    name = models.CharField(max_length=64)
    legend = models.TextField()
    class Meta:
        db_table = u'account_model'

class AccountModelLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    analytic_account = models.ForeignKey(AccountAnalyticAccount)
    model = models.ForeignKey(AccountModel)
    account = models.ForeignKey(AccountAccount)
    sequence = models.IntegerField()
    currency = models.ForeignKey(ResCurrency)
    credit = models.DecimalField(max_digits=65535, decimal_places=65535)
    date_maturity = models.CharField(max_length=-1)
    debit = models.DecimalField(max_digits=65535, decimal_places=65535)
    amount_currency = models.FloatField()
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    partner = models.ForeignKey(ResPartner)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'account_model_line'

class AccountFiscalyear(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_stop = models.DateField()
    code = models.CharField(max_length=6)
    name = models.CharField(max_length=64)
    end_journal_period = models.ForeignKey(AccountJournalPeriod)
    date_start = models.DateField()
    company = models.ForeignKey(ResCompany)
    state = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_fiscalyear'

class AccountTemplateFinancialReport(models.Model):
    account_template = models.ForeignKey(AccountAccountTemplate)
    report_line = models.ForeignKey(AccountFinancialReport)
    class Meta:
        db_table = u'account_template_financial_report'

class AccountTaxCodeTemplate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    info = models.TextField()
    notprintable = models.BooleanField()
    code = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    parent = models.ForeignKey('self')
    sign = models.FloatField()
    class Meta:
        db_table = u'account_tax_code_template'

class AccountAnalyticJournalName(models.Model):
    journal_line = models.ForeignKey(AccountAnalyticJournalReport)
    journal_print = models.ForeignKey(AccountAnalyticJournal)
    class Meta:
        db_table = u'account_analytic_journal_name'

class LedgerJournalRel(models.Model):
    ledger = models.ForeignKey(AccountAnalyticCostLedgerJournalReport)
    journal = models.ForeignKey(AccountAnalyticJournal)
    class Meta:
        db_table = u'ledger_journal_rel'

class AccountInvoiceLineTax(models.Model):
    invoice_line = models.ForeignKey(AccountInvoiceLine)
    tax = models.ForeignKey(AccountTax)
    class Meta:
        db_table = u'account_invoice_line_tax'

class AccountBankStatementLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    analytic_account = models.ForeignKey(AccountAnalyticAccount)
    ref = models.CharField(max_length=32)
    statement = models.ForeignKey(AccountBankStatement)
    sequence = models.IntegerField()
    type = models.CharField(max_length=-1)
    company_id = models.IntegerField()
    name = models.CharField(max_length=-1)
    note = models.TextField()
    journal_id = models.IntegerField()
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    date = models.DateField()
    partner = models.ForeignKey(ResPartner)
    account = models.ForeignKey(AccountAccount)
    voucher = models.ForeignKey(AccountVoucher)
    pos_statement = models.ForeignKey(PosOrder)
    class Meta:
        db_table = u'account_bank_statement_line'

class AccountInvoiceLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    origin = models.CharField(max_length=256)
    uos = models.ForeignKey(ProductUom)
    account = models.ForeignKey(AccountAccount)
    name = models.TextField()
    sequence = models.IntegerField()
    invoice = models.ForeignKey(AccountInvoice)
    price_unit = models.DecimalField(max_digits=65535, decimal_places=65535)
    price_subtotal = models.DecimalField(max_digits=65535, decimal_places=65535)
    company_id = models.IntegerField()
    discount = models.DecimalField(max_digits=65535, decimal_places=65535)
    account_analytic = models.ForeignKey(AccountAnalyticAccount)
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    partner_id = models.IntegerField()
    product = models.ForeignKey(ProductProduct)
    class Meta:
        db_table = u'account_invoice_line'

class AccountAutomaticReconcile(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    power = models.IntegerField()
    max_amount = models.FloatField()
    reconciled = models.IntegerField()
    unreconciled = models.IntegerField()
    allow_write_off = models.BooleanField()
    writeoff_acc = models.ForeignKey(AccountAccount)
    journal = models.ForeignKey(AccountJournal)
    period = models.ForeignKey(AccountPeriod)
    class Meta:
        db_table = u'account_automatic_reconcile'

class AccountPartnerReconcileProcess(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    progress = models.FloatField()
    today_reconciled = models.FloatField()
    next_partner = models.ForeignKey(ResPartner)
    to_reconcile = models.FloatField()
    class Meta:
        db_table = u'account_partner_reconcile_process'

class AccountInvoiceTax(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    tax_amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    account = models.ForeignKey(AccountAccount)
    sequence = models.IntegerField()
    invoice = models.ForeignKey(AccountInvoice)
    manual = models.BooleanField()
    company_id = models.IntegerField()
    base_amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    base = models.DecimalField(max_digits=65535, decimal_places=65535)
    tax_code = models.ForeignKey(AccountTaxCode)
    account_analytic = models.ForeignKey(AccountAnalyticAccount)
    base_code = models.ForeignKey(AccountTaxCode)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'account_invoice_tax'

class AccountCommonJournalReport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    chart_account = models.ForeignKey(AccountAccount)
    date_from = models.DateField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    date_to = models.DateField()
    amount_currency = models.BooleanField()
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_common_journal_report'

class AccountAccountFinancialReportType(models.Model):
    report = models.ForeignKey(AccountFinancialReport)
    account_type = models.ForeignKey(AccountAccountType)
    class Meta:
        db_table = u'account_account_financial_report_type'

class AccountFiscalPositionTaxTemplate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    position = models.ForeignKey(AccountFiscalPositionTemplate)
    tax_dest = models.ForeignKey(AccountTaxTemplate)
    tax_src = models.ForeignKey(AccountTaxTemplate)
    class Meta:
        db_table = u'account_fiscal_position_tax_template'

class AccountChartTemplate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    property_account_expense_categ = models.ForeignKey(AccountAccountTemplate, db_column='property_account_expense_categ')
    property_account_income_opening = models.ForeignKey(AccountAccountTemplate, db_column='property_account_income_opening')
    property_account_expense_opening = models.ForeignKey(AccountAccountTemplate, db_column='property_account_expense_opening')
    visible = models.BooleanField()
    tax_code_root = models.ForeignKey(AccountTaxCodeTemplate)
    property_account_income_categ = models.ForeignKey(AccountAccountTemplate, db_column='property_account_income_categ')
    property_account_income = models.ForeignKey(AccountAccountTemplate, db_column='property_account_income')
    complete_tax_set = models.BooleanField()
    code_digits = models.IntegerField()
    name = models.CharField(max_length=64)
    property_account_expense = models.ForeignKey(AccountAccountTemplate, db_column='property_account_expense')
    property_account_receivable = models.ForeignKey(AccountAccountTemplate, db_column='property_account_receivable')
    property_account_payable = models.ForeignKey(AccountAccountTemplate, db_column='property_account_payable')
    parent = models.ForeignKey('self')
    bank_account_view = models.ForeignKey(AccountAccountTemplate)
    account_root = models.ForeignKey(AccountAccountTemplate)
    class Meta:
        db_table = u'account_chart_template'

class AccountCommonJournalReportAccountJournalRel(models.Model):
    account_common_journal_report = models.ForeignKey(AccountCommonJournalReport)
    account_journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_common_journal_report_account_journal_rel'

class AccountAccountTemplate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    note = models.TextField()
    code = models.CharField(max_length=64)
    reconcile = models.BooleanField()
    user_type = models.ForeignKey(AccountAccountType, db_column='user_type')
    shortcut = models.CharField(max_length=12)
    currency = models.ForeignKey(ResCurrency)
    parent = models.ForeignKey('self')
    nocreate = models.BooleanField()
    type = models.CharField(max_length=-1)
    chart_template = models.ForeignKey(AccountChartTemplate)
    name = models.CharField(max_length=256)
    class Meta:
        db_table = u'account_account_template'

class AccountCommonReport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    chart_account = models.ForeignKey(AccountAccount)
    date_from = models.DateField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    date_to = models.DateField()
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_common_report'

class AccountInvoice(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    origin = models.CharField(max_length=64)
    date_due = models.DateField()
    check_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    reference = models.CharField(max_length=64)
    supplier_invoice_number = models.CharField(max_length=64)
    number = models.CharField(max_length=64)
    account = models.ForeignKey(AccountAccount)
    company = models.ForeignKey(ResCompany)
    currency = models.ForeignKey(ResCurrency)
    partner = models.ForeignKey(ResPartner)
    fiscal_position = models.ForeignKey(AccountFiscalPosition, db_column='fiscal_position')
    user = models.ForeignKey(ResUsers)
    partner_bank = models.ForeignKey(ResPartnerBank)
    payment_term = models.ForeignKey(AccountPaymentTerm, db_column='payment_term')
    reference_type = models.CharField(max_length=-1)
    journal = models.ForeignKey(AccountJournal)
    amount_tax = models.DecimalField(max_digits=65535, decimal_places=65535)
    state = models.CharField(max_length=-1)
    type = models.CharField(max_length=-1)
    internal_number = models.CharField(max_length=32)
    reconciled = models.BooleanField()
    residual = models.DecimalField(max_digits=65535, decimal_places=65535)
    move_name = models.CharField(max_length=64)
    date_invoice = models.DateField()
    period = models.ForeignKey(AccountPeriod)
    amount_untaxed = models.DecimalField(max_digits=65535, decimal_places=65535)
    move = models.ForeignKey(AccountMove)
    amount_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    name = models.CharField(max_length=64)
    comment = models.TextField()
    sent = models.BooleanField()
    section = models.ForeignKey(CrmCaseSection)
    class Meta:
        db_table = u'account_invoice'

class AccountMoveLineReconcileWriteoff(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    comment = models.CharField(max_length=64)
    analytic = models.ForeignKey(AccountAnalyticAccount)
    writeoff_acc = models.ForeignKey(AccountAccount)
    journal = models.ForeignKey(AccountJournal)
    date_p = models.DateField()
    class Meta:
        db_table = u'account_move_line_reconcile_writeoff'

class AccountInvoiceRefund(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.DateField()
    journal = models.ForeignKey(AccountJournal)
    filter_refund = models.CharField(max_length=-1)
    description = models.CharField(max_length=128)
    period = models.ForeignKey(AccountPeriod, db_column='period')
    class Meta:
        db_table = u'account_invoice_refund'

class WizardMultiChartsAccounts(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    only_one_chart_template = models.BooleanField()
    purchase_tax_rate = models.FloatField()
    complete_tax_set = models.BooleanField()
    code_digits = models.IntegerField()
    chart_template = models.ForeignKey(AccountChartTemplate)
    sale_tax = models.ForeignKey(AccountTaxTemplate, db_column='sale_tax')
    company = models.ForeignKey(ResCompany)
    purchase_tax = models.ForeignKey(AccountTaxTemplate, db_column='purchase_tax')
    currency = models.ForeignKey(ResCurrency)
    sale_tax_rate = models.FloatField()
    class Meta:
        db_table = u'wizard_multi_charts_accounts'

class AccountBankAccountsWizard(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    currency = models.ForeignKey(ResCurrency)
    acc_name = models.CharField(max_length=64)
    account_type = models.CharField(max_length=32)
    bank_account = models.ForeignKey(WizardMultiChartsAccounts)
    class Meta:
        db_table = u'account_bank_accounts_wizard'

class AccountAnalyticJournalReport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date1 = models.DateField()
    date2 = models.DateField()
    class Meta:
        db_table = u'account_analytic_journal_report'

class AccountJournalAccountVatDeclarationRel(models.Model):
    account_vat_declaration = models.ForeignKey(AccountVatDeclaration)
    account_journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_journal_account_vat_declaration_rel'

class AccountPartnerBalance(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    display_partner = models.CharField(max_length=-1)
    chart_account = models.ForeignKey(AccountAccount)
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    date_from = models.DateField()
    result_selection = models.CharField(max_length=-1)
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    date_to = models.DateField()
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_partner_balance'

class AccountCommonPartnerReport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    chart_account = models.ForeignKey(AccountAccount)
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    date_from = models.DateField()
    result_selection = models.CharField(max_length=-1)
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    date_to = models.DateField()
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_common_partner_report'

class AccountBankStatementLineMoveRel(models.Model):
    statement_line = models.ForeignKey(AccountBankStatementLine)
    move = models.ForeignKey(AccountMove)
    class Meta:
        db_table = u'account_bank_statement_line_move_rel'

class AccountCommonPartnerReportAccountJournalRel(models.Model):
    account_common_partner_report = models.ForeignKey(AccountCommonPartnerReport)
    account_journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_common_partner_report_account_journal_rel'

class AccountAgedTrialBalanceJournalRel(models.Model):
    account = models.ForeignKey(AccountAgedTrialBalance)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_aged_trial_balance_journal_rel'

class AccountCommonAccountReport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    chart_account = models.ForeignKey(AccountAccount)
    date_from = models.DateField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    date_to = models.DateField()
    display_account = models.CharField(max_length=-1)
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_common_account_report'

class ReconcileAccountRel(models.Model):
    reconcile = models.ForeignKey(AccountAutomaticReconcile)
    account = models.ForeignKey(AccountAccount)
    class Meta:
        db_table = u'reconcile_account_rel'

class AccountPartnerLedger(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    initial_balance = models.BooleanField()
    chart_account = models.ForeignKey(AccountAccount)
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    date_from = models.DateField()
    result_selection = models.CharField(max_length=-1)
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    page_split = models.BooleanField()
    date_to = models.DateField()
    amount_currency = models.BooleanField()
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_partner_ledger'

class AccountAgedTrialBalance(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    chart_account = models.ForeignKey(AccountAccount)
    period_length = models.IntegerField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    date_from = models.DateField()
    date_to = models.DateField()
    result_selection = models.CharField(max_length=-1)
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    direction_selection = models.CharField(max_length=-1)
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_aged_trial_balance'

class AccountFinancialReport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    parent = models.ForeignKey('self')
    name = models.CharField(max_length=128)
    sequence = models.IntegerField()
    level = models.IntegerField()
    style_overwrite = models.IntegerField()
    sign = models.IntegerField()
    account_report = models.ForeignKey('self')
    display_detail = models.CharField(max_length=-1)
    type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_financial_report'

class AccountPartnerBalanceJournalRel(models.Model):
    account = models.ForeignKey(AccountPartnerBalance)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_partner_balance_journal_rel'

class AccountFiscalyearClose(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    fy = models.ForeignKey(AccountFiscalyear)
    fy2 = models.ForeignKey(AccountFiscalyear)
    period = models.ForeignKey(AccountPeriod)
    journal = models.ForeignKey(AccountJournal)
    report_name = models.CharField(max_length=64)
    class Meta:
        db_table = u'account_fiscalyear_close'

class AccountVatDeclaration(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    chart_account = models.ForeignKey(AccountAccount)
    date_from = models.DateField()
    date_to = models.DateField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    based_on = models.CharField(max_length=-1)
    display_detail = models.BooleanField()
    chart_tax = models.ForeignKey(AccountTaxCode)
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_vat_declaration'

class AccountMoveLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    statement = models.ForeignKey(AccountBankStatement)
    journal_id = models.IntegerField()
    currency = models.ForeignKey(ResCurrency)
    date_maturity = models.DateField()
    partner = models.ForeignKey(ResPartner)
    reconcile_partial = models.ForeignKey(AccountMoveReconcile)
    analytic_account = models.ForeignKey(AccountAnalyticAccount)
    credit = models.DecimalField(max_digits=65535, decimal_places=65535)
    centralisation = models.CharField(max_length=8)
    company_id = models.IntegerField()
    tax_code = models.ForeignKey(AccountTaxCode)
    state = models.CharField(max_length=-1)
    debit = models.DecimalField(max_digits=65535, decimal_places=65535)
    blocked = models.BooleanField()
    ref = models.CharField(max_length=64)
    account = models.ForeignKey(AccountAccount)
    period_id = models.IntegerField()
    date_created = models.DateField()
    date = models.DateField()
    move = models.ForeignKey(AccountMove)
    name = models.CharField(max_length=64)
    reconcile = models.ForeignKey(AccountMoveReconcile)
    tax_amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    product = models.ForeignKey(ProductProduct)
    account_tax = models.ForeignKey(AccountTax)
    product_uom = models.ForeignKey(ProductUom)
    amount_currency = models.DecimalField(max_digits=65535, decimal_places=65535)
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'account_move_line'

class AccountJournalAccountingReportRel(models.Model):
    accounting_report = models.ForeignKey(AccountingReport)
    account_journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_journal_accounting_report_rel'

class AccountReportGeneralLedger(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    initial_balance = models.BooleanField()
    chart_account = models.ForeignKey(AccountAccount)
    date_from = models.DateField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    sortby = models.CharField(max_length=-1)
    target_move = models.CharField(max_length=-1)
    date_to = models.DateField()
    amount_currency = models.BooleanField()
    display_account = models.CharField(max_length=-1)
    landscape = models.BooleanField()
    class Meta:
        db_table = u'account_report_general_ledger'

class AccountReportGeneralLedgerJournalRel(models.Model):
    account = models.ForeignKey(AccountReportGeneralLedger)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_report_general_ledger_journal_rel'

class AccountingReport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    period_to_cmp = models.ForeignKey(AccountPeriod, db_column='period_to_cmp')
    chart_account = models.ForeignKey(AccountAccount)
    period_from_cmp = models.ForeignKey(AccountPeriod, db_column='period_from_cmp')
    filter_cmp = models.CharField(max_length=-1)
    enable_filter = models.BooleanField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    date_to_cmp = models.DateField()
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    date_to = models.DateField()
    account_report = models.ForeignKey(AccountFinancialReport)
    fiscalyear_id_cmp = models.ForeignKey(AccountFiscalyear, db_column='fiscalyear_id_cmp')
    date_from = models.DateField()
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    label_filter = models.CharField(max_length=32)
    date_from_cmp = models.DateField()
    debit_credit = models.BooleanField()
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'accounting_report'

class AccountUseModelRelation(models.Model):
    account = models.ForeignKey(AccountUseModel)
    model = models.ForeignKey(AccountModel)
    class Meta:
        db_table = u'account_use_model_relation'

class AccountPrintJournalJournalRel(models.Model):
    account = models.ForeignKey(AccountPrintJournal)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_print_journal_journal_rel'

class AccountPrintJournal(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    chart_account = models.ForeignKey(AccountAccount)
    sort_selection = models.CharField(max_length=-1)
    date_from = models.DateField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    date_to = models.DateField()
    amount_currency = models.BooleanField()
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_print_journal'

class AccountBalanceReport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    chart_account = models.ForeignKey(AccountAccount)
    date_from = models.DateField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    date_to = models.DateField()
    display_account = models.CharField(max_length=-1)
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_balance_report'

class AccountStatementFromInvoiceLines(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'account_statement_from_invoice_lines'

class AccountCentralJournal(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    chart_account = models.ForeignKey(AccountAccount)
    date_from = models.DateField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    date_to = models.DateField()
    amount_currency = models.BooleanField()
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_central_journal'

class AccountGeneralJournalJournalRel(models.Model):
    account = models.ForeignKey(AccountGeneralJournal)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'account_general_journal_journal_rel'

class AccountGeneralJournal(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    chart_account = models.ForeignKey(AccountAccount)
    date_from = models.DateField()
    period_to = models.ForeignKey(AccountPeriod, db_column='period_to')
    filter = models.CharField(max_length=-1)
    period_from = models.ForeignKey(AccountPeriod, db_column='period_from')
    fiscalyear = models.ForeignKey(AccountFiscalyear)
    date_to = models.DateField()
    amount_currency = models.BooleanField()
    target_move = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_general_journal'

class IrSequence(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    code = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    number_next = models.IntegerField()
    implementation = models.CharField(max_length=-1)
    company = models.ForeignKey(ResCompany)
    padding = models.IntegerField()
    number_increment = models.IntegerField()
    prefix = models.CharField(max_length=64)
    active = models.BooleanField()
    suffix = models.CharField(max_length=64)
    class Meta:
        db_table = u'ir_sequence'

class SaleReceiptReport(models.Model):
    id = models.IntegerField()
    date = models.DateField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    partner_id = models.IntegerField()
    currency_id = models.IntegerField()
    journal_id = models.IntegerField()
    user_id = models.IntegerField()
    company_id = models.IntegerField()
    nbr = models.BigIntegerField()
    type = models.CharField(max_length=-1)
    state = models.CharField(max_length=32)
    pay_now = models.CharField(max_length=-1)
    date_due = models.DateField()
    account_id = models.IntegerField()
    price_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    price_total_tax = models.DecimalField(max_digits=65535, decimal_places=65535)
    delay_to_pay = models.FloatField()
    due_delay = models.FloatField()
    class Meta:
        db_table = u'sale_receipt_report'

class AccountVoucherLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    reconcile = models.BooleanField()
    voucher = models.ForeignKey(AccountVoucher)
    amount_unreconciled = models.DecimalField(max_digits=65535, decimal_places=65535)
    account = models.ForeignKey(AccountAccount)
    name = models.CharField(max_length=256)
    move_line = models.ForeignKey(AccountMoveLine)
    untax_amount = models.FloatField()
    company_id = models.IntegerField()
    amount_original = models.DecimalField(max_digits=65535, decimal_places=65535)
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    account_analytic = models.ForeignKey(AccountAnalyticAccount)
    type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'account_voucher_line'

class StockIncoterms(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    active = models.BooleanField()
    code = models.CharField(max_length=3)
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'stock_incoterms'

class AccountMoveLineRelation(models.Model):
    move = models.ForeignKey(AccountStatementFromInvoiceLines)
    line = models.ForeignKey(AccountMoveLine)
    class Meta:
        db_table = u'account_move_line_relation'

class AccountVoucher(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    comment = models.CharField(max_length=64)
    date_due = models.DateField()
    is_multi_currency = models.BooleanField()
    reference = models.CharField(max_length=64)
    number = models.CharField(max_length=32)
    writeoff_acc = models.ForeignKey(AccountAccount)
    date = models.DateField()
    narration = models.TextField()
    partner = models.ForeignKey(ResPartner)
    payment_rate_currency = models.ForeignKey(ResCurrency)
    pay_now = models.CharField(max_length=-1)
    company = models.ForeignKey(ResCompany)
    state = models.CharField(max_length=32)
    pre_line = models.BooleanField()
    payment_rate = models.DecimalField(max_digits=65535, decimal_places=65535)
    type = models.CharField(max_length=-1)
    payment_option = models.CharField(max_length=-1)
    account = models.ForeignKey(AccountAccount)
    period = models.ForeignKey(AccountPeriod)
    active = models.BooleanField()
    move = models.ForeignKey(AccountMove)
    tax = models.ForeignKey(AccountTax)
    tax_amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    name = models.CharField(max_length=256)
    analytic = models.ForeignKey(AccountAnalyticAccount)
    journal = models.ForeignKey(AccountJournal)
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'account_voucher'

class StockTracking(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    active = models.BooleanField()
    serial = models.CharField(max_length=64)
    date = models.DateTimeField()
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'stock_tracking'

class StockInventoryMoveRel(models.Model):
    inventory = models.ForeignKey(StockInventory)
    move = models.ForeignKey(StockMove)
    class Meta:
        db_table = u'stock_inventory_move_rel'

class StockMoveHistoryIds(models.Model):
    child = models.ForeignKey(StockMove)
    parent = models.ForeignKey(StockMove)
    class Meta:
        db_table = u'stock_move_history_ids'

class ActionTraceability(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'action_traceability'

class StockReportProdlots(models.Model):
    id = models.IntegerField()
    location_id = models.IntegerField()
    product_id = models.IntegerField()
    prodlot_id = models.IntegerField()
    qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_report_prodlots'

class StockReportTracklots(models.Model):
    id = models.IntegerField()
    location_id = models.IntegerField()
    product_id = models.IntegerField()
    tracking_id = models.IntegerField()
    name = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_report_tracklots'

class ReportStockLinesDate(models.Model):
    id = models.IntegerField()
    product_id = models.IntegerField()
    date = models.DateTimeField()
    class Meta:
        db_table = u'report_stock_lines_date'

class ReportStockMove(models.Model):
    id = models.IntegerField()
    date = models.DateTimeField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    day_diff = models.DecimalField(max_digits=65535, decimal_places=65535)
    day_diff1 = models.DecimalField(max_digits=65535, decimal_places=65535)
    day_diff2 = models.DecimalField(max_digits=65535, decimal_places=65535)
    location_id = models.IntegerField()
    picking_id = models.IntegerField()
    company_id = models.IntegerField()
    location_dest_id = models.IntegerField()
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_qty_out = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_qty_in = models.DecimalField(max_digits=65535, decimal_places=65535)
    partner_id = models.IntegerField()
    product_id = models.IntegerField()
    state = models.CharField(max_length=-1)
    product_uom = models.IntegerField()
    categ_id = models.IntegerField()
    type = models.CharField(max_length=-1)
    stock_journal = models.IntegerField()
    value = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'report_stock_move'

class ReportStockInventory(models.Model):
    id = models.IntegerField()
    date = models.DateTimeField()
    year = models.TextField()
    month = models.TextField()
    partner_id = models.IntegerField()
    location_id = models.IntegerField()
    product_id = models.IntegerField()
    product_categ_id = models.IntegerField()
    location_type = models.CharField(max_length=-1)
    scrap_location = models.BooleanField()
    company_id = models.IntegerField()
    state = models.CharField(max_length=-1)
    prodlot_id = models.IntegerField()
    value = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'report_stock_inventory'

class StockMoveSplit(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    product = models.ForeignKey(ProductProduct)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    location = models.ForeignKey(StockLocation)
    use_exist = models.BooleanField()
    qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_move_split'

class StockMoveScrap(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    location = models.ForeignKey(StockLocation)
    product = models.ForeignKey(ProductProduct)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_move_scrap'

class StockInventoryMerge(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'stock_inventory_merge'

class StockFillInventory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    set_stock_zero = models.BooleanField()
    location = models.ForeignKey(StockLocation)
    recursive = models.BooleanField()
    class Meta:
        db_table = u'stock_fill_inventory'

class StockSplitInto(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_split_into'

class StockInventoryLineSplit(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    product = models.ForeignKey(ProductProduct)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    location = models.ForeignKey(StockLocation)
    use_exist = models.BooleanField()
    qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_inventory_line_split'

class StockInvoiceOnshipping(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    group = models.BooleanField()
    invoice_date = models.DateField()
    journal_id = models.CharField(max_length=-1)
    class Meta:
        db_table = u'stock_invoice_onshipping'

class StockChangeProductQty(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    prodlot = models.ForeignKey(StockProductionLot)
    location = models.ForeignKey(StockLocation)
    new_quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    product = models.ForeignKey(ProductProduct)
    class Meta:
        db_table = u'stock_change_product_qty'

class StockJournal(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=32)
    class Meta:
        db_table = u'stock_journal'

class StockLocationProduct(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    from_date = models.DateTimeField()
    type = models.CharField(max_length=-1)
    to_date = models.DateTimeField()
    class Meta:
        db_table = u'stock_location_product'

class StockReturnPicking(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    invoice_state = models.CharField(max_length=-1)
    class Meta:
        db_table = u'stock_return_picking'

class StockConfigSettings(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    group_uom = models.BooleanField()
    decimal_precision = models.IntegerField()
    group_stock_inventory_valuation = models.BooleanField()
    module_stock_invoice_directly = models.BooleanField()
    group_stock_multiple_locations = models.BooleanField()
    module_product_expiry = models.BooleanField()
    group_stock_packaging = models.BooleanField()
    module_stock_location = models.BooleanField()
    group_stock_tracking_lot = models.BooleanField()
    group_stock_production_lot = models.BooleanField()
    group_product_variant = models.BooleanField()
    group_uos = models.BooleanField()
    module_claim_from_delivery = models.BooleanField()
    class Meta:
        db_table = u'stock_config_settings'

class StockReturnPickingMemory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    wizard = models.ForeignKey(StockReturnPicking)
    product = models.ForeignKey(ProductProduct)
    move = models.ForeignKey(StockMove)
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_return_picking_memory'

class StockChangeStandardPrice(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    stock_account_input = models.ForeignKey(AccountAccount, db_column='stock_account_input')
    stock_journal = models.ForeignKey(AccountJournal, db_column='stock_journal')
    enable_stock_in_out_acc = models.BooleanField()
    new_price = models.DecimalField(max_digits=65535, decimal_places=65535)
    stock_account_output = models.ForeignKey(AccountAccount, db_column='stock_account_output')
    class Meta:
        db_table = u'stock_change_standard_price'

class StockInventoryLineSplitLines(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    prodlot = models.ForeignKey(StockProductionLot)
    wizard_exist = models.ForeignKey(StockInventoryLineSplit)
    name = models.CharField(max_length=64)
    wizard = models.ForeignKey(StockInventoryLineSplit)
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_inventory_line_split_lines'

class StockInventory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    state = models.CharField(max_length=-1)
    name = models.CharField(max_length=64)
    date_done = models.DateTimeField()
    date = models.DateTimeField()
    company = models.ForeignKey(ResCompany)
    class Meta:
        db_table = u'stock_inventory'

class StockMoveConsume(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    location = models.ForeignKey(StockLocation)
    product = models.ForeignKey(ProductProduct)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_move_consume'

class StockProductionLot(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    company = models.ForeignKey(ResCompany)
    prefix = models.CharField(max_length=64)
    product = models.ForeignKey(ProductProduct)
    date = models.DateTimeField()
    ref = models.CharField(max_length=256)
    class Meta:
        db_table = u'stock_production_lot'

class StockInventoryLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    product = models.ForeignKey(ProductProduct)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    prod_lot = models.ForeignKey(StockProductionLot)
    company_id = models.IntegerField()
    inventory = models.ForeignKey(StockInventory)
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    location = models.ForeignKey(StockLocation)
    class Meta:
        db_table = u'stock_inventory_line'

class StockPartialMoveLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    update_cost = models.BooleanField()
    product = models.ForeignKey(ProductProduct)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    wizard = models.ForeignKey(StockPartialMove)
    currency = models.ForeignKey(ResCurrency, db_column='currency')
    prodlot = models.ForeignKey(StockProductionLot)
    cost = models.FloatField()
    location_dest = models.ForeignKey(StockLocation)
    location = models.ForeignKey(StockLocation)
    move = models.ForeignKey(StockMove)
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_partial_move_line'

class StockProductionLotRevision(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    indice = models.CharField(max_length=16)
    name = models.CharField(max_length=64)
    date = models.DateField()
    lot = models.ForeignKey(StockProductionLot)
    author = models.ForeignKey(ResUsers)
    company_id = models.IntegerField()
    description = models.TextField()
    class Meta:
        db_table = u'stock_production_lot_revision'

class StockPartialMove(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.DateTimeField()
    picking = models.ForeignKey(StockPicking)
    class Meta:
        db_table = u'stock_partial_move'

class StockPartialPickingLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    update_cost = models.BooleanField()
    product = models.ForeignKey(ProductProduct)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    wizard = models.ForeignKey(StockPartialPicking)
    currency = models.ForeignKey(ResCurrency, db_column='currency')
    prodlot = models.ForeignKey(StockProductionLot)
    cost = models.FloatField()
    location_dest = models.ForeignKey(StockLocation)
    location = models.ForeignKey(StockLocation)
    move = models.ForeignKey(StockMove)
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_partial_picking_line'

class StockPartialPicking(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.DateTimeField()
    picking = models.ForeignKey(StockPicking)
    class Meta:
        db_table = u'stock_partial_picking'

class StockMoveSplitLines(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    prodlot = models.ForeignKey(StockProductionLot)
    wizard_exist = models.ForeignKey(StockMoveSplit)
    name = models.CharField(max_length=64)
    wizard = models.ForeignKey(StockMoveSplit)
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'stock_move_split_lines'

class MrpPropertyGroup(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    description = models.TextField()
    class Meta:
        db_table = u'mrp_property_group'

class ProcurementOrderpointCompute(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    automatic = models.BooleanField()
    class Meta:
        db_table = u'procurement_orderpoint_compute'

class StockMove(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    origin = models.CharField(max_length=64)
    product_uos_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    date_expected = models.DateTimeField()
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    price_unit = models.DecimalField(max_digits=65535, decimal_places=65535)
    date = models.DateTimeField()
    prodlot = models.ForeignKey(StockProductionLot)
    move_dest = models.ForeignKey('self')
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_uos = models.ForeignKey(ProductUom, db_column='product_uos')
    partner = models.ForeignKey(ResPartner)
    name = models.CharField(max_length=-1)
    note = models.TextField()
    product = models.ForeignKey(ProductProduct)
    auto_validate = models.BooleanField()
    price_currency = models.ForeignKey(ResCurrency)
    location = models.ForeignKey(StockLocation)
    company = models.ForeignKey(ResCompany)
    picking = models.ForeignKey(StockPicking)
    priority = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    location_dest = models.ForeignKey(StockLocation)
    tracking = models.ForeignKey(StockTracking)
    product_packaging = models.ForeignKey(ProductPackaging, db_column='product_packaging')
    purchase_line = models.ForeignKey(PurchaseOrderLine)
    sale_line = models.ForeignKey(SaleOrderLine)
    production = models.ForeignKey(MrpProduction)
    class Meta:
        db_table = u'stock_move'

class StockPicking(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    origin = models.CharField(max_length=64)
    date_done = models.DateTimeField()
    min_date = models.DateTimeField()
    date = models.DateTimeField()
    partner = models.ForeignKey(ResPartner)
    stock_journal = models.ForeignKey(StockJournal)
    backorder = models.ForeignKey('self')
    name = models.CharField(max_length=64)
    location = models.ForeignKey(StockLocation)
    move_type = models.CharField(max_length=-1)
    company = models.ForeignKey(ResCompany)
    invoice_state = models.CharField(max_length=-1)
    note = models.TextField()
    state = models.CharField(max_length=-1)
    location_dest = models.ForeignKey(StockLocation)
    max_date = models.DateTimeField()
    auto_picking = models.BooleanField()
    type = models.CharField(max_length=-1)
    purchase = models.ForeignKey(PurchaseOrder)
    sale = models.ForeignKey(SaleOrder)
    class Meta:
        db_table = u'stock_picking'

class ProcurementOrderCompute(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'procurement_order_compute'

class MakeProcurement(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    uom = models.ForeignKey(ProductUom)
    date_planned = models.DateField()
    qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    product = models.ForeignKey(ProductProduct)
    warehouse = models.ForeignKey(StockWarehouse)
    class Meta:
        db_table = u'make_procurement'

class ProcurementOrderComputeAll(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    automatic = models.BooleanField()
    class Meta:
        db_table = u'procurement_order_compute_all'

class MrpProperty(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    composition = models.CharField(max_length=-1)
    group = models.ForeignKey(MrpPropertyGroup)
    description = models.TextField()
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'mrp_property'

class StockWarehouseOrderpoint(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    product_max_qty = models.FloatField()
    product_min_qty = models.FloatField()
    qty_multiple = models.IntegerField()
    procurement = models.ForeignKey(ProcurementOrder)
    name = models.CharField(max_length=32)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    company = models.ForeignKey(ResCompany)
    warehouse = models.ForeignKey(StockWarehouse)
    logic = models.CharField(max_length=-1)
    active = models.BooleanField()
    location = models.ForeignKey(StockLocation)
    product = models.ForeignKey(ProductProduct)
    class Meta:
        db_table = u'stock_warehouse_orderpoint'

class StockWarehouse(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    lot_input = models.ForeignKey(StockLocation)
    lot_output = models.ForeignKey(StockLocation)
    name = models.CharField(max_length=128)
    lot_stock = models.ForeignKey(StockLocation)
    partner = models.ForeignKey(ResPartner)
    company = models.ForeignKey(ResCompany)
    class Meta:
        db_table = u'stock_warehouse'

class PurchaseOrderGroup(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'purchase_order_group'

class StockLocation(models.Model):
    id = models.IntegerField(primary_key=True)
    parent_left = models.IntegerField()
    parent_right = models.IntegerField()
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    comment = models.TextField()
    chained_delay = models.IntegerField()
    chained_company = models.ForeignKey(ResCompany)
    active = models.BooleanField()
    posz = models.IntegerField()
    posx = models.IntegerField()
    posy = models.IntegerField()
    valuation_in_account = models.ForeignKey(AccountAccount)
    partner = models.ForeignKey(ResPartner)
    icon = models.CharField(max_length=64)
    valuation_out_account = models.ForeignKey(AccountAccount)
    scrap_location = models.BooleanField()
    name = models.CharField(max_length=64)
    chained_location = models.ForeignKey('self')
    chained_journal = models.ForeignKey(StockJournal)
    chained_picking_type = models.CharField(max_length=-1)
    company = models.ForeignKey(ResCompany)
    chained_auto_packing = models.CharField(max_length=-1)
    complete_name = models.CharField(max_length=256)
    usage = models.CharField(max_length=-1)
    location = models.ForeignKey('self')
    chained_location_type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'stock_location'

class PurchaseConfigSettings(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    group_uom = models.BooleanField()
    module_purchase_analytic_plans = models.BooleanField()
    group_costing_method = models.BooleanField()
    module_purchase_requisition = models.BooleanField()
    default_invoice_method = models.CharField(max_length=-1)
    module_purchase_double_validation = models.BooleanField()
    group_analytic_account_for_purchases = models.BooleanField()
    group_purchase_pricelist = models.BooleanField()
    module_warning = models.BooleanField()
    class Meta:
        db_table = u'purchase_config_settings'

class PurchaseOrderLineInvoice(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'purchase_order_line_invoice'

class PurchaseReport(models.Model):
    id = models.IntegerField()
    date = models.DateField()
    name = models.TextField()
    month = models.TextField()
    day = models.TextField()
    state = models.CharField(max_length=-1)
    date_approve = models.DateField()
    expected_date = models.DateField()
    dest_address_id = models.IntegerField()
    pricelist_id = models.IntegerField()
    validator = models.IntegerField()
    warehouse_id = models.IntegerField()
    partner_id = models.IntegerField()
    user_id = models.IntegerField()
    company_id = models.IntegerField()
    product_id = models.IntegerField()
    category_id = models.IntegerField()
    product_uom = models.IntegerField()
    location_id = models.IntegerField()
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    delay = models.FloatField()
    delay_pass = models.FloatField()
    nbr = models.BigIntegerField()
    price_total = models.DecimalField(max_digits=16, decimal_places=2)
    negociation = models.DecimalField(max_digits=16, decimal_places=2)
    price_standard = models.DecimalField(max_digits=16, decimal_places=2)
    price_average = models.DecimalField(max_digits=16, decimal_places=2)
    class Meta:
        db_table = u'purchase_report'

class PurchaseOrderTaxe(models.Model):
    ord = models.ForeignKey(PurchaseOrderLine)
    tax = models.ForeignKey(AccountTax)
    class Meta:
        db_table = u'purchase_order_taxe'

class PurchaseOrderLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    order = models.ForeignKey(PurchaseOrder)
    price_unit = models.DecimalField(max_digits=65535, decimal_places=65535)
    move_dest = models.ForeignKey(StockMove)
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    partner_id = models.IntegerField()
    invoiced = models.BooleanField()
    name = models.TextField()
    date_planned = models.DateField()
    company_id = models.IntegerField()
    state = models.CharField(max_length=-1)
    product = models.ForeignKey(ProductProduct)
    account_analytic = models.ForeignKey(AccountAnalyticAccount)
    class Meta:
        db_table = u'purchase_order_line'

class PurchaseInvoiceRel(models.Model):
    purchase = models.ForeignKey(PurchaseOrder)
    invoice = models.ForeignKey(AccountInvoice)
    class Meta:
        db_table = u'purchase_invoice_rel'

class PurchaseOrderLineInvoiceRel(models.Model):
    order_line = models.ForeignKey(PurchaseOrderLine)
    invoice = models.ForeignKey(AccountInvoiceLine)
    class Meta:
        db_table = u'purchase_order_line_invoice_rel'

class HrJob(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    requirements = models.TextField()
    name = models.CharField(max_length=128)
    description = models.TextField()
    company = models.ForeignKey(ResCompany)
    state = models.CharField(max_length=-1)
    no_of_recruitment = models.FloatField()
    expected_employees = models.DecimalField(max_digits=65535, decimal_places=65535)
    no_of_employee = models.DecimalField(max_digits=65535, decimal_places=65535)
    department = models.ForeignKey(HrDepartment)
    alias = models.ForeignKey(MailAlias)
    survey = models.ForeignKey(Survey)
    class Meta:
        db_table = u'hr_job'

class HrEmployeeCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    parent = models.ForeignKey('self')
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'hr_employee_category'

class PurchaseOrder(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    origin = models.CharField(max_length=64)
    journal = models.ForeignKey(AccountJournal)
    date_order = models.DateField()
    partner = models.ForeignKey(ResPartner)
    dest_address = models.ForeignKey(ResPartner)
    fiscal_position = models.ForeignKey(AccountFiscalPosition, db_column='fiscal_position')
    amount_untaxed = models.DecimalField(max_digits=65535, decimal_places=65535)
    location = models.ForeignKey(StockLocation)
    company = models.ForeignKey(ResCompany)
    amount_tax = models.DecimalField(max_digits=65535, decimal_places=65535)
    state = models.CharField(max_length=-1)
    pricelist = models.ForeignKey(ProductPricelist)
    warehouse = models.ForeignKey(StockWarehouse)
    payment_term = models.ForeignKey(AccountPaymentTerm)
    partner_ref = models.CharField(max_length=64)
    date_approve = models.DateField()
    amount_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    name = models.CharField(max_length=64)
    notes = models.TextField()
    invoice_method = models.CharField(max_length=-1)
    shipped = models.BooleanField()
    validator = models.ForeignKey(ResUsers, db_column='validator')
    minimum_planned_date = models.DateField()
    class Meta:
        db_table = u'purchase_order'

class HrConfigSettings(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    module_hr_contract = models.BooleanField()
    module_hr_holidays = models.BooleanField()
    module_hr_timesheet = models.BooleanField()
    module_hr_payroll = models.BooleanField()
    module_hr_timesheet_sheet = models.BooleanField()
    module_hr_attendance = models.BooleanField()
    module_hr_evaluation = models.BooleanField()
    module_account_analytic_analysis = models.BooleanField()
    module_hr_expense = models.BooleanField()
    module_hr_recruitment = models.BooleanField()
    group_hr_attendance = models.BooleanField()
    timesheet_range = models.CharField(max_length=-1)
    timesheet_max_difference = models.FloatField()
    module_document_ftp = models.BooleanField()
    fetchmail_applicants = models.BooleanField()
    class Meta:
        db_table = u'hr_config_settings'

class EmployeeCategoryRel(models.Model):
    category = models.ForeignKey(HrEmployeeCategory)
    emp = models.ForeignKey(HrEmployee)
    class Meta:
        db_table = u'employee_category_rel'

class CrmCaseStage(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    case_default = models.BooleanField()
    requirements = models.TextField()
    name = models.CharField(max_length=64)
    probability = models.FloatField()
    sequence = models.IntegerField()
    on_change = models.BooleanField()
    fold = models.BooleanField()
    state = models.CharField(max_length=-1)
    type = models.CharField(max_length=16)
    class Meta:
        db_table = u'crm_case_stage'

class HrEmployee(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    address = models.ForeignKey(ResPartner)
    coach = models.ForeignKey('self')
    resource = models.ForeignKey(ResourceResource)
    color = models.IntegerField()
    image = models.TextField() # This field type is a guess.
    marital = models.CharField(max_length=-1)
    identification_id = models.CharField(max_length=32)
    bank_account = models.ForeignKey(ResPartnerBank)
    job = models.ForeignKey(HrJob)
    work_phone = models.CharField(max_length=32)
    country = models.ForeignKey(ResCountry)
    parent = models.ForeignKey('self')
    notes = models.TextField()
    department = models.ForeignKey(HrDepartment)
    otherid = models.CharField(max_length=64)
    mobile_phone = models.CharField(max_length=32)
    birthday = models.DateField()
    sinid = models.CharField(max_length=32)
    work_email = models.CharField(max_length=240)
    work_location = models.CharField(max_length=32)
    image_medium = models.TextField() # This field type is a guess.
    name_related = models.CharField(max_length=-1)
    ssnid = models.CharField(max_length=32)
    image_small = models.TextField() # This field type is a guess.
    address_home = models.ForeignKey(ResPartner)
    gender = models.CharField(max_length=-1)
    passport_id = models.CharField(max_length=64)
    public_info = models.TextField()
    visibility = models.CharField(max_length=-1)
    uom_id = models.IntegerField()
    journal = models.ForeignKey(AccountAnalyticJournal)
    product = models.ForeignKey(ProductProduct)
    evaluation_date = models.DateField()
    evaluation_plan = models.ForeignKey(HrEvaluationPlan)
    class Meta:
        db_table = u'hr_employee'

class PortalCrmCrmContactUs(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_closed = models.DateTimeField()
    type = models.ForeignKey(CrmCaseResourceType)
    color = models.IntegerField()
    date_action_last = models.DateTimeField()
    day_close = models.DecimalField(max_digits=65535, decimal_places=65535)
    active = models.BooleanField()
    street = models.CharField(max_length=128)
    day_open = models.DecimalField(max_digits=65535, decimal_places=65535)
    contact_name = models.CharField(max_length=64)
    partner = models.ForeignKey(ResPartner)
    city = models.CharField(max_length=128)
    user = models.ForeignKey(ResUsers)
    opt_out = models.BooleanField()
    date_open = models.DateTimeField()
    title = models.ForeignKey(ResPartnerTitle, db_column='title')
    partner_name = models.CharField(max_length=64)
    planned_revenue = models.FloatField()
    country = models.ForeignKey(ResCountry)
    company = models.ForeignKey(ResCompany)
    priority = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    email_cc = models.TextField()
    date_action_next = models.DateTimeField()
    type = models.CharField(max_length=-1)
    street2 = models.CharField(max_length=128)
    function = models.CharField(max_length=128)
    fax = models.CharField(max_length=64)
    description = models.TextField()
    planned_cost = models.FloatField()
    ref2 = models.CharField(max_length=128)
    section = models.ForeignKey(CrmCaseSection)
    phone = models.CharField(max_length=64)
    probability = models.FloatField()
    payment_mode = models.ForeignKey(CrmPaymentMode, db_column='payment_mode')
    date_action = models.DateField()
    title_action = models.CharField(max_length=64)
    name = models.CharField(max_length=64)
    stage = models.ForeignKey(CrmCaseStage)
    zip = models.CharField(max_length=24)
    date_deadline = models.DateField()
    mobile = models.CharField(max_length=64)
    ref = models.CharField(max_length=128)
    channel = models.ForeignKey(CrmCaseChannel)
    state = models.ForeignKey(ResCountryState)
    email_from = models.CharField(max_length=128)
    referred = models.CharField(max_length=64)
    class Meta:
        db_table = u'portal_crm_crm_contact_us'

class HrExpenseReport(models.Model):
    id = models.IntegerField()
    date = models.DateTimeField()
    employee_id = models.IntegerField()
    journal_id = models.IntegerField()
    currency_id = models.IntegerField()
    date_confirm = models.DateField()
    date_valid = models.DateField()
    voucher_id = models.IntegerField()
    user_id = models.IntegerField()
    department_id = models.IntegerField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    delay_valid = models.FloatField()
    delay_confirm = models.FloatField()
    product_id = models.IntegerField()
    analytic_account = models.IntegerField()
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    company_id = models.IntegerField()
    price_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    price_average = models.DecimalField(max_digits=16, decimal_places=2)
    nbr = models.BigIntegerField()
    no_of_products = models.DecimalField(max_digits=65535, decimal_places=65535)
    no_of_account = models.IntegerField()
    state = models.CharField(max_length=-1)
    class Meta:
        db_table = u'hr_expense_report'

class HrEmployeePortalCrmCrmContactUsRel(models.Model):
    portal_crm_crm_contact_us = models.ForeignKey(PortalCrmCrmContactUs)
    hr_employee = models.ForeignKey(HrEmployee)
    class Meta:
        db_table = u'hr_employee_portal_crm_crm_contact_us_rel'

class CrmCaseSection(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    working_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    alias = models.ForeignKey(MailAlias)
    code = models.CharField(unique=True, max_length=8)
    active = models.BooleanField()
    change_responsible = models.BooleanField()
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=64)
    note = models.TextField()
    parent = models.ForeignKey('self')
    complete_name = models.CharField(max_length=256)
    reply_to = models.CharField(max_length=64)
    resource_calendar = models.ForeignKey(ResourceCalendar)
    class Meta:
        db_table = u'crm_case_section'

class CrmCaseResourceType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    section = models.ForeignKey(CrmCaseSection)
    class Meta:
        db_table = u'crm_case_resource_type'

class HrDepartment(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    company = models.ForeignKey(ResCompany)
    note = models.TextField()
    parent = models.ForeignKey('self')
    manager = models.ForeignKey(HrEmployee)
    class Meta:
        db_table = u'hr_department'

class HrExpenseExpense(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    state = models.CharField(max_length=-1)
    company = models.ForeignKey(ResCompany)
    currency = models.ForeignKey(ResCurrency)
    date = models.DateField()
    date_valid = models.DateField()
    voucher = models.ForeignKey(AccountVoucher)
    date_confirm = models.DateField()
    employee = models.ForeignKey(HrEmployee)
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=128)
    journal = models.ForeignKey(AccountJournal)
    note = models.TextField()
    user_valid = models.ForeignKey(ResUsers, db_column='user_valid')
    account_move = models.ForeignKey(AccountMove)
    department = models.ForeignKey(HrDepartment)
    class Meta:
        db_table = u'hr_expense_expense'

class HrExpenseLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    sequence = models.IntegerField()
    name = models.CharField(max_length=128)
    date_value = models.DateField()
    uom = models.ForeignKey(ProductUom)
    product = models.ForeignKey(ProductProduct)
    expense = models.ForeignKey(HrExpenseExpense)
    unit_amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    unit_quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    ref = models.CharField(max_length=32)
    analytic_account = models.ForeignKey(AccountAnalyticAccount, db_column='analytic_account')
    description = models.TextField()
    class Meta:
        db_table = u'hr_expense_line'

class SaleMakeInvoice(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    grouped = models.BooleanField()
    invoice_date = models.DateField()
    class Meta:
        db_table = u'sale_make_invoice'

class SaleOrderLineMakeInvoice(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'sale_order_line_make_invoice'

class SaleOrderLinePropertyRel(models.Model):
    order = models.ForeignKey(SaleOrderLine)
    property = models.ForeignKey(MrpProperty)
    class Meta:
        db_table = u'sale_order_line_property_rel'

class AccountInvoiceReport(models.Model):
    id = models.IntegerField()
    date = models.DateField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    product_id = models.IntegerField()
    partner_id = models.IntegerField()
    payment_term = models.IntegerField()
    period_id = models.IntegerField()
    uom_name = models.CharField(max_length=64)
    currency_id = models.IntegerField()
    journal_id = models.IntegerField()
    fiscal_position = models.IntegerField()
    user_id = models.IntegerField()
    company_id = models.IntegerField()
    nbr = models.BigIntegerField()
    type = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    categ_id = models.IntegerField()
    date_due = models.DateField()
    account_id = models.IntegerField()
    account_line_id = models.IntegerField()
    partner_bank_id = models.IntegerField()
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    price_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    price_average = models.DecimalField(max_digits=65535, decimal_places=65535)
    currency_rate = models.DecimalField(max_digits=65535, decimal_places=65535)
    residual = models.DecimalField(max_digits=65535, decimal_places=65535)
    section_id = models.IntegerField()
    class Meta:
        db_table = u'account_invoice_report'

class SaleOrderTax(models.Model):
    order_line = models.ForeignKey(SaleOrderLine)
    tax = models.ForeignKey(AccountTax)
    class Meta:
        db_table = u'sale_order_tax'

class AccountConfigSettings(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_stop = models.DateField()
    sale_journal = models.ForeignKey(AccountJournal)
    module_account_voucher = models.BooleanField()
    module_account_asset = models.BooleanField()
    period = models.CharField(max_length=-1)
    module_account_accountant = models.BooleanField()
    module_account_followup = models.BooleanField()
    purchase_journal = models.ForeignKey(AccountJournal)
    has_chart_of_accounts = models.BooleanField()
    sale_refund_journal = models.ForeignKey(AccountJournal)
    complete_tax_set = models.BooleanField()
    module_account_budget = models.BooleanField()
    date_start = models.DateField()
    purchase_refund_journal = models.ForeignKey(AccountJournal)
    company = models.ForeignKey(ResCompany)
    sale_tax_rate = models.FloatField()
    group_check_supplier_invoice_total = models.BooleanField()
    module_account_check_writing = models.BooleanField()
    default_purchase_tax = models.ForeignKey(AccountTax, db_column='default_purchase_tax')
    has_default_company = models.BooleanField()
    purchase_tax_rate = models.FloatField()
    default_sale_tax = models.ForeignKey(AccountTax, db_column='default_sale_tax')
    has_fiscal_year = models.BooleanField()
    module_account_payment = models.BooleanField()
    sale_tax = models.ForeignKey(AccountTaxTemplate, db_column='sale_tax')
    group_multi_currency = models.BooleanField()
    purchase_tax = models.ForeignKey(AccountTaxTemplate, db_column='purchase_tax')
    group_proforma_invoices = models.BooleanField()
    decimal_precision = models.IntegerField()
    code_digits = models.IntegerField()
    chart_template = models.ForeignKey(AccountChartTemplate)
    group_analytic_accounting = models.BooleanField()
    module_purchase_analytic_plans = models.BooleanField()
    group_analytic_account_for_purchases = models.BooleanField()
    group_analytic_account_for_sales = models.BooleanField()
    module_sale_analytic_plans = models.BooleanField()
    group_payment_options = models.BooleanField()
    class Meta:
        db_table = u'account_config_settings'

class SaleOrderLineInvoiceRel(models.Model):
    order_line = models.ForeignKey(SaleOrderLine)
    invoice = models.ForeignKey(AccountInvoiceLine)
    class Meta:
        db_table = u'sale_order_line_invoice_rel'

class CrmMakeSale(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    close = models.BooleanField()
    shop = models.ForeignKey(SaleShop)
    partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'crm_make_sale'

class SaleOrderInvoiceRel(models.Model):
    order = models.ForeignKey(SaleOrder)
    invoice = models.ForeignKey(AccountInvoice)
    class Meta:
        db_table = u'sale_order_invoice_rel'

class SaleReport(models.Model):
    id = models.IntegerField()
    product_id = models.IntegerField()
    product_uom = models.IntegerField()
    product_uom_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    price_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    nbr = models.IntegerField()
    date = models.DateField()
    date_confirm = models.DateField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    partner_id = models.IntegerField()
    user_id = models.IntegerField()
    shop_id = models.IntegerField()
    company_id = models.IntegerField()
    delay = models.FloatField()
    state = models.CharField(max_length=-1)
    categ_id = models.IntegerField()
    shipped = models.BooleanField()
    shipped_qty_1 = models.IntegerField()
    pricelist_id = models.IntegerField()
    analytic_account_id = models.IntegerField()
    class Meta:
        db_table = u'sale_report'

class SaleOrderCategoryRel(models.Model):
    order = models.ForeignKey(SaleOrder)
    category = models.ForeignKey(CrmCaseCateg)
    class Meta:
        db_table = u'sale_order_category_rel'

class SaleAdvancePaymentInv(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    advance_payment_method = models.CharField(max_length=-1)
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    product = models.ForeignKey(ProductProduct)
    qtty = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'sale_advance_payment_inv'

class SaleOrderLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    product_uos_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    sequence = models.IntegerField()
    order = models.ForeignKey(SaleOrder)
    price_unit = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_uom_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    discount = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_uos = models.ForeignKey(ProductUom, db_column='product_uos')
    name = models.TextField()
    company_id = models.IntegerField()
    salesman_id = models.IntegerField()
    state = models.CharField(max_length=-1)
    product = models.ForeignKey(ProductProduct)
    order_partner_id = models.IntegerField()
    th_weight = models.FloatField()
    invoiced = models.BooleanField()
    type = models.CharField(max_length=-1)
    address_allotment = models.ForeignKey(ResPartner)
    procurement = models.ForeignKey(ProcurementOrder)
    delay = models.FloatField()
    product_packaging = models.ForeignKey(ProductPackaging, db_column='product_packaging')
    event = models.ForeignKey(EventEvent)
    class Meta:
        db_table = u'sale_order_line'

class SaleOrder(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    origin = models.CharField(max_length=64)
    order_policy = models.CharField(max_length=-1)
    shop = models.ForeignKey(SaleShop)
    client_order_ref = models.CharField(max_length=64)
    date_order = models.DateField()
    partner = models.ForeignKey(ResPartner)
    note = models.TextField()
    fiscal_position = models.ForeignKey(AccountFiscalPosition, db_column='fiscal_position')
    user = models.ForeignKey(ResUsers)
    payment_term = models.ForeignKey(AccountPaymentTerm, db_column='payment_term')
    company_id = models.IntegerField()
    amount_tax = models.DecimalField(max_digits=65535, decimal_places=65535)
    state = models.CharField(max_length=-1)
    pricelist = models.ForeignKey(ProductPricelist)
    partner_invoice = models.ForeignKey(ResPartner)
    amount_untaxed = models.DecimalField(max_digits=65535, decimal_places=65535)
    date_confirm = models.DateField()
    amount_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    project = models.ForeignKey(AccountAnalyticAccount)
    name = models.CharField(max_length=64)
    partner_shipping = models.ForeignKey(ResPartner)
    invoice_quantity = models.CharField(max_length=-1)
    section = models.ForeignKey(CrmCaseSection)
    picking_policy = models.CharField(max_length=-1)
    incoterm = models.ForeignKey(StockIncoterms, db_column='incoterm')
    shipped = models.BooleanField()
    class Meta:
        db_table = u'sale_order'

class PosSession(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    config = models.ForeignKey(PosConfig)
    cash_journal_id = models.IntegerField()
    start_at = models.DateTimeField()
    cash_register_id = models.IntegerField()
    user = models.ForeignKey(ResUsers)
    name = models.CharField(unique=True, max_length=32)
    stop_at = models.DateTimeField()
    state = models.CharField(max_length=-1)
    class Meta:
        db_table = u'pos_session'

class PosDiscount(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    discount = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'pos_discount'

class PosCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    image_medium = models.TextField() # This field type is a guess.
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    image = models.TextField() # This field type is a guess.
    image_small = models.TextField() # This field type is a guess.
    parent = models.ForeignKey('self')
    class Meta:
        db_table = u'pos_category'

class PosConfirm(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'pos_confirm'

class PosEanWizard(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    ean13_pattern = models.CharField(max_length=32)
    class Meta:
        db_table = u'pos_ean_wizard'

class PosOpenStatement(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'pos_open_statement'

class PosDetails(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_end = models.DateField()
    date_start = models.DateField()
    class Meta:
        db_table = u'pos_details'

class PosMakePayment(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    payment_date = models.DateField()
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    payment_name = models.CharField(max_length=32)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'pos_make_payment'

class PosPaymentReportUser(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'pos_payment_report_user'

class PosReceipt(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'pos_receipt'

class PosPaymentReport(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'pos_payment_report'

class ReportSalesByUserPos(models.Model):
    id = models.IntegerField()
    date_order = models.TextField()
    user_id = models.IntegerField()
    qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'report_sales_by_user_pos'

class ReportTransactionPos(models.Model):
    id = models.IntegerField()
    no_trans = models.BigIntegerField()
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    disc = models.DecimalField(max_digits=65535, decimal_places=65535)
    date_create = models.TextField()
    user_id = models.IntegerField()
    journal_id = models.IntegerField()
    jl_id = models.IntegerField()
    invoice_id = models.BigIntegerField()
    product_nb = models.BigIntegerField()
    class Meta:
        db_table = u'report_transaction_pos'

class ReportSalesByUserPosMonth(models.Model):
    id = models.IntegerField()
    date_order = models.TextField()
    user_id = models.IntegerField()
    qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'report_sales_by_user_pos_month'

class ReportSalesByMarginPos(models.Model):
    id = models.IntegerField()
    user_id = models.IntegerField()
    product_name = models.CharField(max_length=128)
    date_order = models.TextField()
    qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    net_margin_per_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    total = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'report_sales_by_margin_pos'

class ReportSalesByMarginPosMonth(models.Model):
    id = models.IntegerField()
    user_id = models.IntegerField()
    product_name = models.CharField(max_length=128)
    date_order = models.TextField()
    qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    net_margin_per_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    total = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'report_sales_by_margin_pos_month'

class ReportPosOrder(models.Model):
    id = models.IntegerField()
    nbr = models.BigIntegerField()
    date = models.DateField()
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    price_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    total_discount = models.DecimalField(max_digits=65535, decimal_places=65535)
    average_price = models.DecimalField(max_digits=16, decimal_places=2)
    delay_validation = models.BigIntegerField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    partner_id = models.IntegerField()
    state = models.CharField(max_length=-1)
    user_id = models.IntegerField()
    shop_id = models.IntegerField()
    company_id = models.IntegerField()
    journal_id = models.IntegerField()
    product_id = models.IntegerField()
    class Meta:
        db_table = u'report_pos_order'

class PosSessionOpening(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    pos_config = models.ForeignKey(PosConfig)
    pos_state_str = models.CharField(max_length=32)
    pos_session = models.ForeignKey(PosSession)
    show_config = models.BooleanField()
    class Meta:
        db_table = u'pos_session_opening'

class PosSalesUserToday(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'pos_sales_user_today'

class ResUserSale(models.Model):
    user = models.ForeignKey(PosPaymentReportUser)
    sale = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'res_user_sale'

class PosBoxEntries(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    user = models.ForeignKey(ResUsers)
    product_id = models.IntegerField()
    ref = models.CharField(max_length=32)
    journal = models.ForeignKey(AccountJournal)
    session = models.ForeignKey(PosSession)
    name = models.CharField(max_length=32)
    class Meta:
        db_table = u'pos_box_entries'

class PosConfigJournalRel(models.Model):
    pos_config = models.ForeignKey(PosConfig)
    journal = models.ForeignKey(AccountJournal)
    class Meta:
        db_table = u'pos_config_journal_rel'

class SaleShop(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    pricelist = models.ForeignKey(ProductPricelist)
    project = models.ForeignKey(AccountAnalyticAccount)
    name = models.CharField(max_length=64)
    payment_default = models.ForeignKey(AccountPaymentTerm)
    company = models.ForeignKey(ResCompany)
    warehouse = models.ForeignKey(StockWarehouse)
    class Meta:
        db_table = u'sale_shop'

class PosOrder(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    sale_journal = models.IntegerField()
    pos_reference = models.CharField(max_length=64)
    account_move = models.ForeignKey(AccountMove, db_column='account_move')
    date_order = models.DateTimeField()
    partner = models.ForeignKey(ResPartner)
    nb_print = models.IntegerField()
    note = models.TextField()
    user = models.ForeignKey(ResUsers)
    invoice = models.ForeignKey(AccountInvoice)
    company = models.ForeignKey(ResCompany)
    session = models.ForeignKey(PosSession)
    name = models.CharField(max_length=64)
    state = models.CharField(max_length=-1)
    shop_id = models.IntegerField()
    pricelist = models.ForeignKey(ProductPricelist)
    picking = models.ForeignKey(StockPicking)
    class Meta:
        db_table = u'pos_order'

class PosOrderLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    notice = models.CharField(max_length=128)
    product = models.ForeignKey(ProductProduct)
    order = models.ForeignKey(PosOrder)
    price_unit = models.DecimalField(max_digits=65535, decimal_places=65535)
    price_subtotal = models.DecimalField(max_digits=65535, decimal_places=65535)
    company = models.ForeignKey(ResCompany)
    price_subtotal_incl = models.DecimalField(max_digits=65535, decimal_places=65535)
    qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    discount = models.DecimalField(max_digits=65535, decimal_places=65535)
    name = models.CharField(max_length=32)
    class Meta:
        db_table = u'pos_order_line'

class PosDetailsReportUserRel(models.Model):
    user = models.ForeignKey(PosDetails)
    wizard = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'pos_details_report_user_rel'

class PosSaleUser(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_end = models.DateField()
    date_start = models.DateField()
    class Meta:
        db_table = u'pos_sale_user'

class SaleUserRel(models.Model):
    user = models.ForeignKey(PosSaleUser)
    uid = models.ForeignKey(ResUsers, db_column='uid')
    class Meta:
        db_table = u'sale_user_rel'

class SaleUserRelToday(models.Model):
    user = models.ForeignKey(PosSalesUserToday)
    uid = models.ForeignKey(ResUsers, db_column='uid')
    class Meta:
        db_table = u'sale_user_rel_today'

class PosConfig(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    iface_vkeyboard = models.BooleanField()
    iface_cashdrawer = models.BooleanField()
    name = models.CharField(max_length=32)
    state = models.CharField(max_length=-1)
    journal = models.ForeignKey(AccountJournal)
    iface_self_checkout = models.BooleanField()
    iface_electronic_scale = models.BooleanField()
    shop = models.ForeignKey(SaleShop)
    group_by = models.BooleanField()
    iface_payment_terminal = models.BooleanField()
    sequence = models.ForeignKey(IrSequence)
    iface_print_via_proxy = models.BooleanField()
    class Meta:
        db_table = u'pos_config'

class MrpProductionMoveIds(models.Model):
    production = models.ForeignKey(MrpProduction)
    move = models.ForeignKey(StockMove)
    class Meta:
        db_table = u'mrp_production_move_ids'

class MrpRoutingWorkcenter(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    cycle_nbr = models.FloatField()
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    company_id = models.IntegerField()
    note = models.TextField()
    routing = models.ForeignKey(MrpRouting)
    workcenter = models.ForeignKey(MrpWorkcenter)
    hour_nbr = models.FloatField()
    class Meta:
        db_table = u'mrp_routing_workcenter'

class ChangeProductionQty(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'change_production_qty'

class MrpWorkcenterLoad(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    measure_unit = models.CharField(max_length=-1)
    time_unit = models.CharField(max_length=-1)
    class Meta:
        db_table = u'mrp_workcenter_load'

class MrpProductPrice(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    number = models.IntegerField()
    class Meta:
        db_table = u'mrp_product_price'

class MrpProductProduce(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    mode = models.CharField(max_length=-1)
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'mrp_product_produce'

class ReportWorkcenterLoad(models.Model):
    id = models.IntegerField()
    name = models.TextField()
    hour = models.DecimalField(max_digits=65535, decimal_places=65535)
    cycle = models.DecimalField(max_digits=65535, decimal_places=65535)
    workcenter_id = models.IntegerField()
    class Meta:
        db_table = u'report_workcenter_load'

class ReportMrpInout(models.Model):
    id = models.IntegerField()
    date = models.TextField()
    value = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'report_mrp_inout'

class MrpRouting(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    note = models.TextField()
    code = models.CharField(max_length=8)
    name = models.CharField(max_length=64)
    active = models.BooleanField()
    location = models.ForeignKey(StockLocation)
    company = models.ForeignKey(ResCompany)
    class Meta:
        db_table = u'mrp_routing'

class MrpBomPropertyRel(models.Model):
    bom = models.ForeignKey(MrpBom)
    property = models.ForeignKey(MrpProperty)
    class Meta:
        db_table = u'mrp_bom_property_rel'

class MrpProductionProductLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    product_uos_qty = models.FloatField()
    name = models.CharField(max_length=64)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_uos = models.ForeignKey(ProductUom, db_column='product_uos')
    production = models.ForeignKey(MrpProduction)
    product = models.ForeignKey(ProductProduct)
    class Meta:
        db_table = u'mrp_production_product_line'

class NoteNote(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.TextField()
    sequence = models.IntegerField()
    color = models.IntegerField()
    memo = models.TextField()
    date_done = models.DateField()
    open = models.BooleanField()
    class Meta:
        db_table = u'note_note'

class MrpProduction(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    origin = models.CharField(max_length=64)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    product_uos_qty = models.FloatField()
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_uos = models.ForeignKey(ProductUom, db_column='product_uos')
    user = models.ForeignKey(ResUsers)
    location_src = models.ForeignKey(StockLocation)
    cycle_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    date_start = models.DateTimeField()
    company = models.ForeignKey(ResCompany)
    priority = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    bom = models.ForeignKey(MrpBom)
    date_finished = models.DateTimeField()
    name = models.CharField(max_length=64)
    product = models.ForeignKey(ProductProduct)
    date_planned = models.DateTimeField()
    move_prod = models.ForeignKey(StockMove)
    routing = models.ForeignKey(MrpRouting)
    hour_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    location_dest = models.ForeignKey(StockLocation)
    picking = models.ForeignKey(StockPicking)
    class Meta:
        db_table = u'mrp_production'

class ProcurementPropertyRel(models.Model):
    procurement = models.ForeignKey(ProcurementOrder)
    property = models.ForeignKey(MrpProperty)
    class Meta:
        db_table = u'procurement_property_rel'

class MrpConfigSettings(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    module_mrp_byproduct = models.BooleanField()
    module_mrp_jit = models.BooleanField()
    group_mrp_properties = models.BooleanField()
    module_product_manufacturer = models.BooleanField()
    module_mrp_repair = models.BooleanField()
    module_mrp_operations = models.BooleanField()
    group_mrp_routings = models.BooleanField()
    module_stock_no_autopicking = models.BooleanField()
    class Meta:
        db_table = u'mrp_config_settings'

class MrpBom(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_stop = models.DateField()
    code = models.CharField(max_length=16)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    product_uos_qty = models.FloatField()
    date_start = models.DateField()
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_uos = models.ForeignKey(ProductUom, db_column='product_uos')
    product_efficiency = models.FloatField()
    active = models.BooleanField()
    product_rounding = models.FloatField()
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    company = models.ForeignKey(ResCompany)
    routing = models.ForeignKey(MrpRouting)
    product = models.ForeignKey(ProductProduct)
    bom = models.ForeignKey('self')
    position = models.CharField(max_length=64)
    type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'mrp_bom'

class ProcurementOrder(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    origin = models.CharField(max_length=64)
    product_uom = models.ForeignKey(ProductUom, db_column='product_uom')
    product_uos_qty = models.FloatField()
    procure_method = models.CharField(max_length=-1)
    product_qty = models.DecimalField(max_digits=65535, decimal_places=65535)
    product_uos = models.ForeignKey(ProductUom, db_column='product_uos')
    message = models.CharField(max_length=124)
    location = models.ForeignKey(StockLocation)
    move = models.ForeignKey(StockMove)
    note = models.TextField()
    name = models.TextField()
    date_planned = models.DateTimeField()
    close_move = models.BooleanField()
    company = models.ForeignKey(ResCompany)
    date_close = models.DateTimeField()
    priority = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    product = models.ForeignKey(ProductProduct)
    purchase = models.ForeignKey(PurchaseOrder)
    production = models.ForeignKey(MrpProduction)
    bom = models.ForeignKey(MrpBom)
    class Meta:
        db_table = u'procurement_order'

class MrpWorkcenter(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    costs_cycle_account = models.ForeignKey(AccountAnalyticAccount)
    capacity_per_cycle = models.FloatField()
    time_start = models.FloatField()
    product = models.ForeignKey(ProductProduct)
    resource = models.ForeignKey(ResourceResource)
    costs_journal = models.ForeignKey(AccountAnalyticJournal)
    time_stop = models.FloatField()
    note = models.TextField()
    costs_hour = models.FloatField()
    costs_hour_account = models.ForeignKey(AccountAnalyticAccount)
    costs_cycle = models.FloatField()
    costs_general_account = models.ForeignKey(AccountAccount)
    time_cycle = models.FloatField()
    class Meta:
        db_table = u'mrp_workcenter'

class MrpProductionWorkcenterLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    hour = models.DecimalField(max_digits=65535, decimal_places=65535)
    production = models.ForeignKey(MrpProduction)
    workcenter = models.ForeignKey(MrpWorkcenter)
    cycle = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'mrp_production_workcenter_line'

class NoteTag(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=-1)
    class Meta:
        db_table = u'note_tag'

class NoteTagsRel(models.Model):
    note = models.ForeignKey(NoteNote)
    tag = models.ForeignKey(NoteTag)
    class Meta:
        db_table = u'note_tags_rel'

class NoteStage(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    fold = models.BooleanField()
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=-1)
    sequence = models.IntegerField()
    class Meta:
        db_table = u'note_stage'

class NoteStageRel(models.Model):
    note = models.ForeignKey(NoteNote)
    stage = models.ForeignKey(NoteStage)
    class Meta:
        db_table = u'note_stage_rel'

class ProjectIssueReport(models.Model):
    id = models.IntegerField()
    name = models.TextField()
    month = models.TextField()
    day = models.TextField()
    opening_date = models.TextField()
    creation_date = models.TextField()
    state = models.CharField(max_length=-1)
    user_id = models.IntegerField()
    working_hours_open = models.DecimalField(max_digits=65535, decimal_places=65535)
    working_hours_close = models.DecimalField(max_digits=65535, decimal_places=65535)
    section_id = models.IntegerField()
    stage_id = models.IntegerField()
    date_closed = models.TextField()
    company_id = models.IntegerField()
    priority = models.CharField(max_length=-1)
    project_id = models.IntegerField()
    version_id = models.IntegerField()
    nbr = models.IntegerField()
    partner_id = models.IntegerField()
    channel_id = models.IntegerField()
    task_id = models.IntegerField()
    create_date = models.DateTimeField()
    delay_open = models.FloatField()
    delay_close = models.FloatField()
    email = models.BigIntegerField()
    class Meta:
        db_table = u'project_issue_report'

class ProjectIssueVersion(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    active = models.BooleanField()
    name = models.CharField(max_length=32)
    class Meta:
        db_table = u'project_issue_version'

class ProjectTask(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    sequence = models.IntegerField()
    color = models.IntegerField()
    date_end = models.DateTimeField()
    effective_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    planned_hours = models.FloatField()
    partner = models.ForeignKey(ResPartner)
    user = models.ForeignKey(ResUsers)
    date_start = models.DateTimeField()
    company = models.ForeignKey(ResCompany)
    priority = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    progress = models.DecimalField(max_digits=65535, decimal_places=65535)
    project = models.ForeignKey(ProjectProject)
    description = models.TextField()
    kanban_state = models.CharField(max_length=-1)
    active = models.BooleanField()
    delay_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    stage = models.ForeignKey(ProjectTaskType)
    name = models.CharField(max_length=128)
    date_deadline = models.DateField()
    notes = models.TextField()
    total_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    remaining_hours = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'project_task'

class ProjectIssue(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_closed = models.DateTimeField()
    date_deadline = models.DateField()
    color = models.IntegerField()
    date_action_last = models.DateTimeField()
    day_close = models.DecimalField(max_digits=65535, decimal_places=65535)
    active = models.BooleanField()
    duration = models.FloatField()
    day_open = models.DecimalField(max_digits=65535, decimal_places=65535)
    partner = models.ForeignKey(ResPartner)
    user = models.ForeignKey(ResUsers)
    date_open = models.DateTimeField()
    company = models.ForeignKey(ResCompany)
    priority = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    working_hours_close = models.DecimalField(max_digits=65535, decimal_places=65535)
    working_hours_open = models.DecimalField(max_digits=65535, decimal_places=65535)
    progress = models.DecimalField(max_digits=65535, decimal_places=65535)
    date_action_next = models.DateTimeField()
    description = models.TextField()
    kanban_state = models.CharField(max_length=-1)
    section = models.ForeignKey(CrmCaseSection)
    version = models.ForeignKey(ProjectIssueVersion)
    email_cc = models.CharField(max_length=256)
    date = models.DateTimeField()
    stage = models.ForeignKey(ProjectTaskType)
    project = models.ForeignKey(ProjectProject)
    name = models.CharField(max_length=128)
    task = models.ForeignKey(ProjectTask)
    channel = models.ForeignKey(CrmCaseChannel)
    email_from = models.CharField(max_length=128)
    class Meta:
        db_table = u'project_issue'

class ProjectCategoryProjectIssueRel(models.Model):
    project_issue = models.ForeignKey(ProjectIssue)
    project_category = models.ForeignKey(ProjectCategory)
    class Meta:
        db_table = u'project_category_project_issue_rel'

class HrAnalyticTimesheet(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    line = models.ForeignKey(AccountAnalyticLine)
    partner_id = models.IntegerField()
    sheet_id = models.IntegerField()
    class Meta:
        db_table = u'hr_analytic_timesheet'

class HrAnalyticalTimesheetEmployee(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    month = models.IntegerField()
    employee = models.ForeignKey(HrEmployee)
    year = models.IntegerField()
    class Meta:
        db_table = u'hr_analytical_timesheet_employee'

class HrAttendanceError(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    init_date = models.DateField()
    end_date = models.DateField()
    max_delay = models.IntegerField()
    class Meta:
        db_table = u'hr_attendance_error'

class HrAttendanceMonth(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    month = models.IntegerField()
    year = models.IntegerField()
    class Meta:
        db_table = u'hr_attendance_month'

class HrActionReason(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    action_type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'hr_action_reason'

class HrAttendance(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    action = models.CharField(max_length=-1)
    employee = models.ForeignKey(HrEmployee)
    action_desc = models.ForeignKey(HrActionReason, db_column='action_desc')
    name = models.DateTimeField()
    day = models.CharField(max_length=32)
    sheet_id = models.IntegerField()
    class Meta:
        db_table = u'hr_attendance'

class HrAttendanceWeek(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    init_date = models.DateField()
    end_date = models.DateField()
    class Meta:
        db_table = u'hr_attendance_week'

class HrSignInProject(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.DateTimeField()
    emp = models.ForeignKey(HrEmployee)
    server_date = models.DateTimeField()
    name = models.CharField(max_length=32)
    class Meta:
        db_table = u'hr_sign_in_project'

class HrAnalyticalTimesheetUsers(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    month = models.IntegerField()
    year = models.IntegerField()
    class Meta:
        db_table = u'hr_analytical_timesheet_users'

class HrSignOutProject(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    info = models.CharField(max_length=256)
    account = models.ForeignKey(AccountAnalyticAccount)
    date_start = models.DateTimeField()
    date = models.DateTimeField()
    server_date = models.DateTimeField()
    emp = models.ForeignKey(HrEmployee)
    analytic_amount = models.FloatField()
    name = models.CharField(max_length=32)
    class Meta:
        db_table = u'hr_sign_out_project'

class TimesheetEmployeeRel(models.Model):
    timesheet = models.ForeignKey(HrAnalyticalTimesheetUsers)
    employee = models.ForeignKey(HrEmployee)
    class Meta:
        db_table = u'timesheet_employee_rel'

class SurveyPage(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    note = models.TextField()
    title = models.CharField(max_length=128)
    survey = models.ForeignKey(Survey)
    sequence = models.IntegerField()
    class Meta:
        db_table = u'survey_page'

class SurveyQuestion(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    comment_maximum_float = models.FloatField()
    validation_type = models.CharField(max_length=-1)
    comment_valid_type = models.CharField(max_length=-1)
    comment_maximum_date = models.DateField()
    make_comment_field_err_msg = models.TextField()
    numeric_required_sum_err_msg = models.TextField()
    comment_column = models.BooleanField()
    validation_valid_err_msg = models.TextField()
    rating_allow_one_column_require = models.BooleanField()
    is_validation_require = models.BooleanField()
    validation_minimum_date = models.DateField()
    comment_minimum_date = models.DateField()
    req_error_msg = models.TextField()
    sequence = models.IntegerField()
    question = models.CharField(max_length=128)
    validation_maximum_date = models.DateField()
    comment_field_type = models.CharField(max_length=-1)
    is_require_answer = models.BooleanField()
    comment_minimum_no = models.IntegerField()
    is_comment_require = models.BooleanField()
    validation_maximum_no = models.IntegerField()
    numeric_required_sum = models.IntegerField()
    type = models.CharField(max_length=-1)
    column_name = models.CharField(max_length=256)
    req_ans = models.IntegerField()
    minimum_req_ans = models.IntegerField()
    comment_minimum_float = models.FloatField()
    comment_valid_err_msg = models.TextField()
    validation_maximum_float = models.FloatField()
    validation_minimum_no = models.IntegerField()
    descriptive_text = models.TextField()
    maximum_req_ans = models.IntegerField()
    comment_maximum_no = models.IntegerField()
    make_comment_field = models.BooleanField()
    in_visible_menu_choice = models.BooleanField()
    validation_minimum_float = models.FloatField()
    in_visible_answer_type = models.BooleanField()
    page = models.ForeignKey(SurveyPage)
    required_type = models.CharField(max_length=-1)
    comment_label = models.CharField(max_length=255)
    in_visible_rating_weight = models.BooleanField()
    allow_comment = models.BooleanField()
    no_of_rows = models.IntegerField()
    class Meta:
        db_table = u'survey_question'

class HrTimesheetInvoiceCreate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.BooleanField()
    price = models.BooleanField()
    time = models.BooleanField()
    product = models.ForeignKey(ProductProduct, db_column='product')
    name = models.BooleanField()
    class Meta:
        db_table = u'hr_timesheet_invoice_create'

class SurveyTblColumnHeading(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    column = models.ForeignKey(SurveyQuestionColumnHeading)
    response_table = models.ForeignKey(SurveyResponseLine)
    value = models.CharField(max_length=255)
    name = models.IntegerField()
    class Meta:
        db_table = u'survey_tbl_column_heading'

class HrTimesheetAnalyticProfit(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_from = models.DateField()
    date_to = models.DateField()
    class Meta:
        db_table = u'hr_timesheet_analytic_profit'

class AnalyticProfitJournalRel(models.Model):
    analytic = models.ForeignKey(HrTimesheetAnalyticProfit)
    journal = models.ForeignKey(AccountAnalyticJournal)
    class Meta:
        db_table = u'analytic_profit_journal_rel'

class HrTimesheetInvoiceCreateFinal(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.BooleanField()
    price = models.BooleanField()
    time = models.BooleanField()
    product = models.ForeignKey(ProductProduct, db_column='product')
    name = models.BooleanField()
    class Meta:
        db_table = u'hr_timesheet_invoice_create_final'

class ReportAnalyticAccountClose(models.Model):
    id = models.IntegerField()
    name = models.IntegerField()
    state = models.CharField(max_length=-1)
    quantity = models.FloatField()
    balance = models.DecimalField(max_digits=65535, decimal_places=65535)
    partner_id = models.IntegerField()
    quantity_max = models.FloatField()
    date_deadline = models.DateField()
    class Meta:
        db_table = u'report_analytic_account_close'

class ReportAccountAnalyticLineToInvoice(models.Model):
    month = models.TextField()
    name = models.TextField()
    id = models.IntegerField()
    product_id = models.IntegerField()
    account_id = models.IntegerField()
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    sale_price = models.FloatField()
    unit_amount = models.FloatField()
    product_uom_id = models.IntegerField()
    class Meta:
        db_table = u'report_account_analytic_line_to_invoice'

class ReportTimesheetLine(models.Model):
    id = models.IntegerField()
    date = models.DateField()
    name = models.TextField()
    month = models.TextField()
    user_id = models.IntegerField()
    day = models.TextField()
    invoice_id = models.IntegerField()
    product_id = models.IntegerField()
    account_id = models.IntegerField()
    general_account_id = models.IntegerField()
    quantity = models.FloatField()
    cost = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'report_timesheet_line'

class ReportTimesheetUser(models.Model):
    id = models.IntegerField()
    name = models.TextField()
    month = models.TextField()
    user_id = models.IntegerField()
    quantity = models.FloatField()
    cost = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'report_timesheet_user'

class ReportTimesheetAccount(models.Model):
    id = models.IntegerField()
    name = models.TextField()
    month = models.TextField()
    user_id = models.IntegerField()
    account_id = models.IntegerField()
    quantity = models.FloatField()
    class Meta:
        db_table = u'report_timesheet_account'

class ReportTimesheetAccountDate(models.Model):
    id = models.IntegerField()
    name = models.TextField()
    month = models.TextField()
    user_id = models.IntegerField()
    account_id = models.IntegerField()
    quantity = models.FloatField()
    class Meta:
        db_table = u'report_timesheet_account_date'

class ReportTimesheetInvoice(models.Model):
    id = models.IntegerField()
    user_id = models.IntegerField()
    account_id = models.IntegerField()
    manager_id = models.IntegerField()
    quantity = models.FloatField()
    amount_invoice = models.FloatField()
    class Meta:
        db_table = u'report_timesheet_invoice'

class HrTimesheetInvoiceFactor(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    customer_name = models.CharField(max_length=128)
    name = models.CharField(max_length=128)
    factor = models.FloatField()
    class Meta:
        db_table = u'hr_timesheet_invoice_factor'

class HrRecruitmentReport(models.Model):
    id = models.IntegerField()
    date = models.DateTimeField()
    date_closed = models.DateTimeField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    state = models.CharField(max_length=-1)
    partner_id = models.IntegerField()
    company_id = models.IntegerField()
    user_id = models.IntegerField()
    job_id = models.IntegerField()
    type_id = models.IntegerField()
    available = models.BigIntegerField()
    department_id = models.IntegerField()
    priority = models.CharField(max_length=-1)
    stage_id = models.IntegerField()
    salary_prop = models.FloatField()
    salary_prop_avg = models.FloatField()
    salary_exp = models.FloatField()
    salary_exp_avg = models.FloatField()
    delay_close = models.FloatField()
    nbr = models.BigIntegerField()
    class Meta:
        db_table = u'hr_recruitment_report'

class AnalyticProfitEmpRel(models.Model):
    analytic = models.ForeignKey(HrTimesheetAnalyticProfit)
    emp = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'analytic_profit_emp_rel'

class HrTimesheetCurrentOpen(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'hr_timesheet_current_open'

class TimesheetReport(models.Model):
    id = models.IntegerField()
    name = models.CharField(max_length=64)
    date = models.DateField()
    date_from = models.DateField()
    date_to = models.DateField()
    day = models.TextField()
    year = models.TextField()
    month = models.TextField()
    nbr = models.BigIntegerField()
    quantity = models.FloatField()
    cost = models.DecimalField(max_digits=65535, decimal_places=65535)
    account_id = models.IntegerField()
    product_id = models.IntegerField()
    total_diff = models.FloatField()
    total_timesheet = models.FloatField()
    total_attendance = models.FloatField()
    to_invoice = models.IntegerField()
    general_account_id = models.IntegerField()
    user_id = models.IntegerField()
    company_id = models.IntegerField()
    department_id = models.IntegerField()
    state = models.CharField(max_length=-1)
    class Meta:
        db_table = u'timesheet_report'

class HrTimesheetSheetSheetDay(models.Model):
    id = models.IntegerField()
    name = models.DateField()
    sheet_id = models.IntegerField()
    total_timesheet = models.FloatField()
    total_attendance = models.FloatField()
    total_difference = models.FloatField()
    class Meta:
        db_table = u'hr_timesheet_sheet_sheet_day'

class HrTimesheetSheetSheetAccount(models.Model):
    id = models.IntegerField()
    name = models.IntegerField()
    sheet_id = models.IntegerField()
    total = models.FloatField()
    invoice_rate = models.IntegerField()
    class Meta:
        db_table = u'hr_timesheet_sheet_sheet_account'

class HrTimesheetReport(models.Model):
    id = models.IntegerField()
    date = models.DateField()
    day = models.TextField()
    year = models.TextField()
    month = models.TextField()
    cost = models.DecimalField(max_digits=65535, decimal_places=65535)
    quantity = models.FloatField()
    account_id = models.IntegerField()
    journal_id = models.IntegerField()
    product_id = models.IntegerField()
    general_account_id = models.IntegerField()
    user_id = models.IntegerField()
    company_id = models.IntegerField()
    currency_id = models.IntegerField()
    class Meta:
        db_table = u'hr_timesheet_report'

class HrTimesheetSheetSheet(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_to = models.DateField()
    employee = models.ForeignKey(HrEmployee)
    user_id = models.IntegerField()
    name = models.CharField(max_length=64)
    date_from = models.DateField()
    company = models.ForeignKey(ResCompany)
    state = models.CharField(max_length=-1)
    department = models.ForeignKey(HrDepartment)
    class Meta:
        db_table = u'hr_timesheet_sheet_sheet'

class SurveyQuestionWiz(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.IntegerField()
    class Meta:
        db_table = u'survey_question_wiz'

class SurveySendInvitationLog(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    note = models.TextField()
    class Meta:
        db_table = u'survey_send_invitation_log'

class SurveyNameWiz(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    note = models.TextField()
    store_ans = models.TextField()
    transfer = models.BooleanField()
    survey = models.ForeignKey(Survey)
    response = models.CharField(max_length=16)
    page_no = models.IntegerField()
    page = models.CharField(max_length=12)
    class Meta:
        db_table = u'survey_name_wiz'

class SurveyPrintAnswer(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    paper_size = models.CharField(max_length=-1)
    without_pagebreak = models.BooleanField()
    page_number = models.BooleanField()
    orientation = models.CharField(max_length=-1)
    class Meta:
        db_table = u'survey_print_answer'

class SurveySendInvitation(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    mail_from = models.CharField(max_length=256)
    send_mail_existing = models.BooleanField()
    mail_subject_existing = models.CharField(max_length=256)
    mail = models.TextField()
    mail_subject = models.CharField(max_length=256)
    send_mail = models.BooleanField()
    class Meta:
        db_table = u'survey_send_invitation'

class SurveyResPartner(models.Model):
    partner = models.ForeignKey(SurveySendInvitation)
    survey = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'survey_res_partner'

class SurveyPrintResponse(models.Model):
    response = models.ForeignKey(SurveyPrintAnswer)
    print_field = models.ForeignKey(SurveyResponse) # Field renamed because it was a Python reserved word.
    class Meta:
        db_table = u'survey_print_response'

class SurveyResponseAnswer(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    comment = models.TextField()
    comment_field = models.CharField(max_length=255)
    response = models.ForeignKey(SurveyResponseLine)
    value_choice = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    answer = models.ForeignKey(SurveyAnswer)
    column = models.ForeignKey(SurveyQuestionColumnHeading)
    class Meta:
        db_table = u'survey_response_answer'

class SurveySurveyPrintRel(models.Model):
    survey_print = models.ForeignKey(SurveyPrint)
    survey = models.ForeignKey(Survey)
    class Meta:
        db_table = u'survey_survey_print_rel'

class SurveyUsersRel(models.Model):
    sid = models.ForeignKey(Survey, db_column='sid')
    uid = models.ForeignKey(ResUsers, db_column='uid')
    class Meta:
        db_table = u'survey_users_rel'

class SurveyInvitedUserRel(models.Model):
    sid = models.ForeignKey(Survey, db_column='sid')
    uid = models.ForeignKey(ResUsers, db_column='uid')
    class Meta:
        db_table = u'survey_invited_user_rel'

class SurveyType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    code = models.CharField(max_length=64)
    name = models.CharField(max_length=128)
    class Meta:
        db_table = u'survey_type'

class HrRecruitmentStage(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    fold = models.BooleanField()
    state = models.CharField(max_length=-1)
    requirements = models.TextField()
    name = models.CharField(max_length=64)
    sequence = models.IntegerField()
    department = models.ForeignKey(HrDepartment)
    class Meta:
        db_table = u'hr_recruitment_stage'

class SurveyHistory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.DateTimeField()
    survey = models.ForeignKey(Survey)
    user = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'survey_history'

class SurveyPrintStatistics(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'survey_print_statistics'

class SurveyQuestionColumnHeading(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    in_visible_menu_choice = models.BooleanField()
    in_visible_rating_weight = models.BooleanField()
    title = models.CharField(max_length=128)
    menu_choice = models.TextField()
    question = models.ForeignKey(SurveyQuestion)
    rating_weight = models.IntegerField()
    class Meta:
        db_table = u'survey_question_column_heading'

class SurveyAnswer(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    sequence = models.IntegerField()
    in_visible_answer_type = models.BooleanField()
    answer = models.CharField(max_length=128)
    menu_choice = models.TextField()
    type = models.CharField(max_length=-1)
    question = models.ForeignKey(SurveyQuestion)
    class Meta:
        db_table = u'survey_answer'

class SurveyResponseLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    comment = models.TextField()
    date_create = models.DateTimeField()
    state = models.CharField(max_length=-1)
    response = models.ForeignKey(SurveyResponse)
    question = models.ForeignKey(SurveyQuestion)
    single_text = models.CharField(max_length=255)
    class Meta:
        db_table = u'survey_response_line'

class SurveySurveyPrintStatisticsRel(models.Model):
    survey_print_statistics = models.ForeignKey(SurveyPrintStatistics)
    survey = models.ForeignKey(Survey)
    class Meta:
        db_table = u'survey_survey_print_statistics_rel'

class HrRecruitmentSource(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'hr_recruitment_source'

class Survey(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    color = models.IntegerField()
    responsible = models.ForeignKey(ResUsers)
    date_open = models.DateTimeField()
    title = models.CharField(max_length=128)
    response_user = models.IntegerField()
    tot_comp_survey = models.IntegerField()
    date_close = models.DateTimeField()
    note = models.TextField()
    state = models.CharField(max_length=-1)
    max_response_limit = models.IntegerField()
    tot_start_survey = models.IntegerField()
    type = models.ForeignKey(SurveyType, db_column='type')
    send_response = models.BooleanField()
    class Meta:
        db_table = u'survey'

class HrRecruitmentDegree(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(unique=True, max_length=64)
    sequence = models.IntegerField()
    class Meta:
        db_table = u'hr_recruitment_degree'

class SurveyPrint(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    paper_size = models.CharField(max_length=-1)
    without_pagebreak = models.BooleanField()
    page_number = models.BooleanField()
    orientation = models.CharField(max_length=-1)
    class Meta:
        db_table = u'survey_print'

class SurveyRequest(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    state = models.CharField(max_length=-1)
    user = models.ForeignKey(ResUsers)
    date_deadline = models.DateField()
    survey = models.ForeignKey(Survey)
    response = models.ForeignKey(SurveyResponse, db_column='response')
    email = models.CharField(max_length=64)
    is_evaluation = models.BooleanField()
    class Meta:
        db_table = u'survey_request'

class SurveyResponse(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_create = models.DateTimeField()
    state = models.CharField(max_length=-1)
    user = models.ForeignKey(ResUsers)
    response_type = models.CharField(max_length=-1)
    survey = models.ForeignKey(Survey)
    class Meta:
        db_table = u'survey_response'

class SurveyBrowseAnswer(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    survey = models.ForeignKey(Survey)
    response = models.ForeignKey(SurveyResponse)
    class Meta:
        db_table = u'survey_browse_answer'

class HiredEmployee(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'hired_employee'

class HrRecruitmentPartnerCreate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    close = models.BooleanField()
    class Meta:
        db_table = u'hr_recruitment_partner_create'

class HrApplicantCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'hr_applicant_category'

class FleetVehicleState(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(unique=True, max_length=-1)
    sequence = models.IntegerField()
    class Meta:
        db_table = u'fleet_vehicle_state'

class HrApplicant(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_closed = models.DateTimeField()
    probability = models.FloatField()
    type = models.ForeignKey(HrRecruitmentDegree)
    color = models.IntegerField()
    day_close = models.DecimalField(max_digits=65535, decimal_places=65535)
    salary_expected_extra = models.CharField(max_length=100)
    active = models.BooleanField()
    salary_proposed = models.FloatField()
    day_open = models.DecimalField(max_digits=65535, decimal_places=65535)
    partner = models.ForeignKey(ResPartner)
    user = models.ForeignKey(ResUsers)
    reference = models.CharField(max_length=128)
    date_open = models.DateTimeField()
    partner_name = models.CharField(max_length=64)
    company = models.ForeignKey(ResCompany)
    availability = models.IntegerField()
    priority = models.CharField(max_length=-1)
    state = models.CharField(max_length=-1)
    emp = models.ForeignKey(HrEmployee)
    salary_proposed_extra = models.CharField(max_length=100)
    department = models.ForeignKey(HrDepartment)
    description = models.TextField()
    stage = models.ForeignKey(HrRecruitmentStage)
    title_action = models.CharField(max_length=64)
    partner_mobile = models.CharField(max_length=32)
    email_cc = models.TextField()
    date = models.DateTimeField()
    date_action = models.DateField()
    response = models.IntegerField()
    job = models.ForeignKey(HrJob)
    salary_expected = models.FloatField()
    name = models.CharField(max_length=128)
    partner_phone = models.CharField(max_length=32)
    source = models.ForeignKey(HrRecruitmentSource)
    email_from = models.CharField(max_length=128)
    class Meta:
        db_table = u'hr_applicant'

class HrApplicantHrApplicantCategoryRel(models.Model):
    hr_applicant = models.ForeignKey(HrApplicant)
    hr_applicant_category = models.ForeignKey(HrApplicantCategory)
    class Meta:
        db_table = u'hr_applicant_hr_applicant_category_rel'

class FleetVehicleTag(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=-1)
    class Meta:
        db_table = u'fleet_vehicle_tag'

class FleetVehicleVehicleTagRel(models.Model):
    vehicle_tag = models.ForeignKey(FleetVehicle)
    tag = models.ForeignKey(FleetVehicleTag)
    class Meta:
        db_table = u'fleet_vehicle_vehicle_tag_rel'

class FleetContractState(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'fleet_contract_state'

class FleetVehicleModelBrand(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    image = models.TextField() # This field type is a guess.
    image_medium = models.TextField() # This field type is a guess.
    image_small = models.TextField() # This field type is a guess.
    name = models.CharField(max_length=64)
    class Meta:
        db_table = u'fleet_vehicle_model_brand'

class FleetVehicleOdometer(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.DateField()
    value = models.FloatField()
    vehicle = models.ForeignKey(FleetVehicle)
    name = models.CharField(max_length=-1)
    class Meta:
        db_table = u'fleet_vehicle_odometer'

class FleetVehicleLogContract(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    ins_ref = models.CharField(max_length=64)
    purchaser = models.ForeignKey(ResPartner)
    expiration_date = models.DateField()
    notes = models.TextField()
    cost_amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    insurer = models.ForeignKey(ResPartner)
    state = models.CharField(max_length=-1)
    cost = models.ForeignKey(FleetVehicleCost)
    cost_generated = models.FloatField()
    start_date = models.DateField()
    cost_frequency = models.CharField(max_length=-1)
    name = models.TextField()
    class Meta:
        db_table = u'fleet_vehicle_log_contract'

class FleetVehicleLogServices(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    purchaser = models.ForeignKey(ResPartner)
    notes = models.TextField()
    vendor = models.ForeignKey(ResPartner)
    cost_amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    cost = models.ForeignKey(FleetVehicleCost)
    inv_ref = models.CharField(max_length=64)
    class Meta:
        db_table = u'fleet_vehicle_log_services'

class FleetVehicleLogFuel(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    liter = models.FloatField()
    cost = models.ForeignKey(FleetVehicleCost)
    purchaser = models.ForeignKey(ResPartner)
    inv_ref = models.CharField(max_length=64)
    notes = models.TextField()
    vendor = models.ForeignKey(ResPartner)
    price_per_liter = models.FloatField()
    cost_amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'fleet_vehicle_log_fuel'

class FleetServiceType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    category = models.CharField(max_length=-1)
    name = models.CharField(max_length=-1)
    class Meta:
        db_table = u'fleet_service_type'

class FleetVehicleModelVendors(models.Model):
    model = models.ForeignKey(FleetVehicleModel)
    partner = models.ForeignKey(ResPartner)
    class Meta:
        db_table = u'fleet_vehicle_model_vendors'

class FleetVehicleModel(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    brand = models.ForeignKey(FleetVehicleModelBrand)
    name = models.CharField(max_length=-1)
    modelname = models.CharField(max_length=32)
    class Meta:
        db_table = u'fleet_vehicle_model'

class EmailTemplate(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    model = models.ForeignKey(IrModel)
    sub_model_object_field = models.ForeignKey(IrModelFields, db_column='sub_model_object_field')
    auto_delete = models.BooleanField()
    mail_server = models.ForeignKey(IrMailServer)
    body_html = models.TextField()
    email_to = models.CharField(max_length=-1)
    sub_object = models.ForeignKey(IrModel, db_column='sub_object')
    ref_ir_act_window = models.ForeignKey(IrActWindow, db_column='ref_ir_act_window')
    subject = models.CharField(max_length=-1)
    lang = models.CharField(max_length=-1)
    name = models.CharField(max_length=-1)
    email_recipients = models.CharField(max_length=-1)
    model_object_field = models.ForeignKey(IrModelFields, db_column='model_object_field')
    report_name = models.CharField(max_length=-1)
    report_template = models.ForeignKey(IrActReportXml, db_column='report_template')
    ref_ir_value = models.ForeignKey(IrValues, db_column='ref_ir_value')
    user_signature = models.BooleanField()
    null_value = models.CharField(max_length=-1)
    reply_to = models.CharField(max_length=-1)
    email_cc = models.CharField(max_length=-1)
    model = models.CharField(max_length=128)
    copyvalue = models.CharField(max_length=-1)
    email_from = models.CharField(max_length=-1)
    class Meta:
        db_table = u'email_template'

class EventRegistration(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    origin = models.CharField(max_length=124)
    phone = models.CharField(max_length=64)
    nb_register = models.IntegerField()
    partner = models.ForeignKey(ResPartner)
    date_closed = models.DateTimeField()
    user = models.ForeignKey(ResUsers)
    name = models.CharField(max_length=128)
    date_open = models.DateTimeField()
    event = models.ForeignKey(EventEvent)
    company_id = models.IntegerField()
    state = models.CharField(max_length=16)
    email = models.CharField(max_length=64)
    class Meta:
        db_table = u'event_registration'

class EventConfirm(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'event_confirm'

class FleetVehicle(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    vin_sn = models.CharField(max_length=32)
    color = models.CharField(max_length=32)
    acquisition_date = models.DateField()
    license_plate = models.CharField(max_length=32)
    driver = models.ForeignKey(ResPartner)
    seats = models.IntegerField()
    horsepower = models.IntegerField()
    co2 = models.FloatField()
    car_value = models.FloatField()
    fuel_type = models.CharField(max_length=-1)
    company = models.ForeignKey(ResCompany)
    odometer_unit = models.CharField(max_length=-1)
    location = models.CharField(max_length=128)
    model = models.ForeignKey(FleetVehicleModel)
    doors = models.IntegerField()
    power = models.IntegerField()
    horsepower_tax = models.FloatField()
    name = models.CharField(max_length=-1)
    transmission = models.CharField(max_length=-1)
    state = models.ForeignKey(FleetVehicleState)
    class Meta:
        db_table = u'fleet_vehicle'

class ReportEventRegistration(models.Model):
    id = models.TextField()
    event_id = models.IntegerField()
    user_id = models.IntegerField()
    user_id_registration = models.IntegerField()
    name_registration = models.CharField(max_length=128)
    company_id = models.IntegerField()
    speaker_id = models.IntegerField()
    event_date = models.TextField()
    year = models.TextField()
    month = models.TextField()
    nbevent = models.BigIntegerField()
    draft_state = models.IntegerField()
    confirm_state = models.IntegerField()
    event_type = models.IntegerField()
    register_max = models.IntegerField()
    event_state = models.CharField(max_length=-1)
    registration_state = models.CharField(max_length=16)
    class Meta:
        db_table = u'report_event_registration'

class HrEvaluationEvaluation(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    employee = models.ForeignKey(HrEmployee)
    plan = models.ForeignKey(HrEvaluationPlan)
    rating = models.CharField(max_length=-1)
    note_action = models.TextField()
    date_close = models.DateField()
    note_summary = models.TextField()
    state = models.CharField(max_length=-1)
    date = models.DateField()
    class Meta:
        db_table = u'hr_evaluation_evaluation'

class EventType(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    default_registration_max = models.IntegerField()
    default_email_event = models.ForeignKey(EmailTemplate, db_column='default_email_event')
    name = models.CharField(max_length=64)
    default_email_registration = models.ForeignKey(EmailTemplate, db_column='default_email_registration')
    default_registration_min = models.IntegerField()
    default_reply_to = models.CharField(max_length=64)
    class Meta:
        db_table = u'event_type'

class FleetVehicleCost(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    vehicle = models.ForeignKey(FleetVehicle)
    cost_subtype = models.ForeignKey(FleetServiceType)
    contract = models.ForeignKey(FleetVehicleLogContract)
    odometer = models.ForeignKey(FleetVehicleOdometer)
    parent = models.ForeignKey('self')
    amount = models.FloatField()
    cost_type = models.CharField(max_length=-1)
    year = models.CharField(max_length=-1)
    date = models.DateField()
    auto_generated = models.BooleanField()
    name = models.CharField(max_length=-1)
    class Meta:
        db_table = u'fleet_vehicle_cost'

class EventEvent(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    address = models.ForeignKey(ResPartner)
    email_registration = models.ForeignKey(EmailTemplate)
    main_speaker = models.ForeignKey(ResPartner)
    date_end = models.DateTimeField()
    register_max = models.IntegerField()
    email_confirmation = models.ForeignKey(EmailTemplate)
    user = models.ForeignKey(ResUsers)
    company = models.ForeignKey(ResCompany)
    register_min = models.IntegerField()
    name = models.CharField(max_length=64)
    note = models.TextField()
    state = models.CharField(max_length=-1)
    type = models.ForeignKey(EventType, db_column='type')
    reply_to = models.CharField(max_length=64)
    date_begin = models.DateTimeField()
    speaker_confirmed = models.BooleanField()
    visibility = models.CharField(max_length=-1)
    class Meta:
        db_table = u'event_event'

class HrEvaluationReport(models.Model):
    id = models.IntegerField()
    create_date = models.DateTimeField()
    day = models.TextField()
    employee_id = models.IntegerField()
    request_id = models.IntegerField()
    plan_id = models.IntegerField()
    rating = models.CharField(max_length=-1)
    deadline = models.DateField()
    closed = models.DateField()
    year = models.TextField()
    month = models.TextField()
    nbr = models.BigIntegerField()
    state = models.CharField(max_length=-1)
    delay_date = models.FloatField()
    overpass_delay = models.FloatField()
    class Meta:
        db_table = u'hr_evaluation_report'

class HrEvaluationPlan(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    month_next = models.IntegerField()
    name = models.CharField(max_length=64)
    month_first = models.IntegerField()
    active = models.BooleanField()
    company = models.ForeignKey(ResCompany)
    class Meta:
        db_table = u'hr_evaluation_plan'

class HrEvaluationPlanPhase(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    plan = models.ForeignKey(HrEvaluationPlan)
    name = models.CharField(max_length=64)
    send_anonymous_manager = models.BooleanField()
    sequence = models.IntegerField()
    company_id = models.IntegerField()
    mail_feature = models.BooleanField()
    send_anonymous_employee = models.BooleanField()
    mail_body = models.TextField()
    email_subject = models.TextField()
    send_answer_employee = models.BooleanField()
    survey = models.ForeignKey(Survey)
    send_answer_manager = models.BooleanField()
    action = models.CharField(max_length=-1)
    wait = models.BooleanField()
    class Meta:
        db_table = u'hr_evaluation_plan_phase'

class HrEvaluationInterview(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    user_to_review = models.ForeignKey(HrEmployee)
    evaluation = models.ForeignKey(HrEvaluationEvaluation)
    request = models.ForeignKey(SurveyRequest)
    class Meta:
        db_table = u'hr_evaluation_interview'

class SummaryEmpRel(models.Model):
    sum = models.ForeignKey(HrHolidaysSummaryEmployee)
    emp = models.ForeignKey(HrEmployee)
    class Meta:
        db_table = u'summary_emp_rel'

class HrHolidaysRemainingLeavesUser(models.Model):
    id = models.IntegerField()
    name = models.CharField(max_length=64)
    no_of_leaves = models.DecimalField(max_digits=65535, decimal_places=65535)
    user_id = models.IntegerField()
    leave_type = models.CharField(max_length=64)
    class Meta:
        db_table = u'hr_holidays_remaining_leaves_user'

class HrHolidaysSummaryDept(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_from = models.DateField()
    holiday_type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'hr_holidays_summary_dept'

class SummaryDeptRel(models.Model):
    sum = models.ForeignKey(HrHolidaysSummaryDept)
    dept = models.ForeignKey(HrDepartment)
    class Meta:
        db_table = u'summary_dept_rel'

class HrHolidaysSummaryEmployee(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date_from = models.DateField()
    holiday_type = models.CharField(max_length=-1)
    class Meta:
        db_table = u'hr_holidays_summary_employee'

class HrHolidaysStatus(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=64)
    double_validation = models.BooleanField()
    color_name = models.CharField(max_length=-1)
    limit = models.BooleanField()
    active = models.BooleanField()
    categ = models.ForeignKey(CrmMeetingType)
    class Meta:
        db_table = u'hr_holidays_status'

class HrHolidays(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    manager_id2 = models.ForeignKey(HrEmployee, db_column='manager_id2')
    meeting = models.ForeignKey(CrmMeeting)
    department_id = models.IntegerField()
    holiday_status = models.ForeignKey(HrHolidaysStatus)
    date_to = models.DateTimeField()
    employee = models.ForeignKey(HrEmployee)
    user_id = models.IntegerField()
    name = models.CharField(max_length=64)
    number_of_days_temp = models.FloatField()
    date_from = models.DateTimeField()
    number_of_days = models.DecimalField(max_digits=65535, decimal_places=65535)
    holiday_type = models.CharField(max_length=-1)
    parent = models.ForeignKey('self')
    state = models.CharField(max_length=-1)
    manager = models.ForeignKey(HrEmployee)
    type = models.CharField(max_length=-1)
    notes = models.TextField()
    category = models.ForeignKey(HrEmployeeCategory)
    class Meta:
        db_table = u'hr_holidays'

class LunchAlert(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    alter_type = models.CharField(max_length=-1)
    monday = models.BooleanField()
    tuesday = models.BooleanField()
    friday = models.BooleanField()
    wednesday = models.BooleanField()
    thursday = models.BooleanField()
    sunday = models.BooleanField()
    specific_day = models.DateField()
    active_to = models.FloatField()
    active_from = models.FloatField()
    message = models.TextField()
    saturday = models.BooleanField()
    class Meta:
        db_table = u'lunch_alert'

class ReportLunchOrderLine(models.Model):
    id = models.IntegerField()
    user_id = models.IntegerField()
    date = models.DateField()
    year = models.TextField()
    month = models.TextField()
    day = models.TextField()
    note = models.TextField()
    price_total = models.DecimalField(max_digits=65535, decimal_places=65535)
    class Meta:
        db_table = u'report_lunch_order_line'

class LunchCashmove(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.DateField()
    state = models.CharField(max_length=-1)
    user = models.ForeignKey(ResUsers)
    description = models.TextField()
    order = models.ForeignKey(LunchOrderLine)
    amount = models.FloatField()
    class Meta:
        db_table = u'lunch_cashmove'

class LunchValidation(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'lunch_validation'

class LunchCancel(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'lunch_cancel'

class LunchProductCategory(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    name = models.CharField(max_length=-1)
    class Meta:
        db_table = u'lunch_product_category'

class LunchOrderOrder(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    class Meta:
        db_table = u'lunch_order_order'

class LunchOrder(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    date = models.DateField()
    state = models.CharField(max_length=-1)
    total = models.DecimalField(max_digits=65535, decimal_places=65535)
    user = models.ForeignKey(ResUsers)
    class Meta:
        db_table = u'lunch_order'

class LunchProduct(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    supplier = models.ForeignKey(ResPartner, db_column='supplier')
    price = models.DecimalField(max_digits=65535, decimal_places=65535)
    category = models.ForeignKey(LunchProductCategory)
    name = models.CharField(max_length=64)
    description = models.TextField()
    class Meta:
        db_table = u'lunch_product'

class LunchOrderLine(models.Model):
    id = models.IntegerField(primary_key=True)
    create_uid = models.ForeignKey(ResUsers, db_column='create_uid')
    create_date = models.DateTimeField()
    write_date = models.DateTimeField()
    write_uid = models.ForeignKey(ResUsers, db_column='write_uid')
    user_id = models.IntegerField()
    order = models.ForeignKey(LunchOrder)
    price = models.FloatField()
    note = models.TextField()
    supplier = models.IntegerField()
    state = models.CharField(max_length=-1)
    date = models.DateField()
    product = models.ForeignKey(LunchProduct)
    class Meta:
        db_table = u'lunch_order_line'

