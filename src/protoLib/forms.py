# -*- coding: utf-8 -*-

from django import forms

class UserFilesForm(forms.Form):
    docfile = forms.FileField(
        label='Select a file'
    )

