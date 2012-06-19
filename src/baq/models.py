from django.db import models

# Create your models here.

class Persona(models.Model):
    nombre = models.CharField(max_length = 40)
    apellido = models.CharField(max_length = 40)
    telefono = models.CharField(max_length = 15)
    
    def __unicode__(self):
        return 'Nombre: %s, Apellido: %s, Telefono: %s' %(self.nombre,self.apellido,self.telefono)
        

class Carro(models.Model):
    marca = models.CharField(max_length = 40)
    nombre = models.CharField(max_length = 40)
    modelo = models.IntegerField()
    persona = models.ForeignKey(Persona)
    
    def __unicode__(self):
        return 'Marca: %s, Modelo: %s, Nombre: %s, Propietario: %s' %(self.marca,self.modelo,self.nombre,self.persona.nombre)
