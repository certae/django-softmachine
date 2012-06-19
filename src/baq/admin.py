from models import Persona, Carro
from django.contrib import admin


#class PersonaAdmin(admin.ModelAdmin):
#    #fields = ['nombre','apellido','telefono']
#    fieldsets = [('Datos Personales', {'fields': ['apellido','nombre'],'classes':['collapse']}),
#                 ('Numeros',{'fields':['telefono'],'classes':['collapse']})]
#
#class CarroAdmin(admin.ModelAdmin):
#    fields = ['nombre','marca','modelo','persona']

admin.site.register(Persona)
admin.site.register(Carro )
