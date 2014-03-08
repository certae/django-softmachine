from django.contrib  import admin

from protoLibExt.actions import doWFlowResume
from protoLibExt.models import WflowAdminResume

class WflowAdminResumeAdmin(admin.ModelAdmin):
    actions = [ doWFlowResume, ]

admin.site.register(WflowAdminResume, WflowAdminResumeAdmin)
