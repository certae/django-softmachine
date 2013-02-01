from models import *
from django.contrib  import admin           

# ==== Fiche Logiciel 
from adminLogiciel import LogicielAdmin 
admin.site.register(Logiciel, LogicielAdmin)

# ==== Fiche Image 
from adminImage import ImageAdmin 
admin.site.register(Image, ImageAdmin)


# ==== Fiche Organisation  
from adminScenario import OrganisationAdmin
admin.site.register(Organisation, OrganisationAdmin)

# ===== Prevoir plugin bibtex 
from adminBase import ReferenceAdmin
admin.site.register(Reference, ReferenceAdmin) 


# ====  Maestros 
from adminBase import FamilleAdmin
admin.site.register(Famille, FamilleAdmin)

from adminBase import TypeLogicielAdmin
admin.site.register(TypeLogiciel, TypeLogicielAdmin)


from adminBase import NiveauAdmin
admin.site.register(Niveau, NiveauAdmin)


#===============================================================================

admin.site.register(CompositionImage)
admin.site.register(Scenario)
admin.site.register(CompositionScenario)
admin.site.register(SpecificationLogiciel)

# admin.site.register(TCO)


