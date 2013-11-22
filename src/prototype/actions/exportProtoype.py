# -*- coding: utf-8 -*-

from prototype.models import Model, Entity, Prototype

from protoLib.protoActionEdit import setSecurityInfo 
from protoLib.utilsBase import JSONEncoder, slugify
from protoLib.protoAuth import getUserProfile

from django.core.files import File

PROTO_PREFIX = "prototype.ProtoTable."


def exportPrototypeModel( queryset ):

    # Variable strig para el modelo 
    strModel = '' 

    for pModel in queryset:
        
        modelCode = slugify( pModel.code, '_' )

        for pEntity in pModel.entity_set.all():
            enttCode = slugify( pEntity.code , '_')

            for pProperty in pEntity.property_set.all():

                pptCode =  slugify( pProperty.code, '_' ) 
                if pProperty.isForeign:
                    pType = slugify( pProperty.relationship.refEntity.code , '_') 
                else: pType = slugify( pProperty.baseType , '_')

#                     'name': pptCode,
#                     'type': pType or 'string',
#                     'blank': not pProperty.isPrimary,

                # relations
                if pProperty.isForeign:
                    if not pProperty.isRequired: 
                        extras = '[arrowhead=empty, arrowtail=dot]'
                    else: extras  = ''  # [arrowhead=none, arrowtail=none]


    def iniFileModel(self, iw):
        iw.println("# This is an auto-generated model module by CeRTAE OMS PlugIn")
        pattern = "# for model : \"{0}\" >"

        msg = pattern.format( self.m_wProj.getName())
        iw.println(msg)
        iw.println("# You'll have to do the following manually to clean this up:")
        iw.println("#     * Rearrange models' order")
        iw.println("")
        iw.println("from django.db import models")
        iw.println("from django.utils.encoding import force_unicode")
        iw.println("")


    def generateDataModel(self, iw, model, idRef):
        pattern = "#datamodel name=\"{0}\" idmodel=\"{1}\" idref=\"{2}\">"
        self.idModel = self.idModel + 1
        msg = pattern.format( model.getName(), self.idModel, idRef)
        iw.println(msg)
        idRef = self.idModel
        enu = model.getComponents().elements(DbORTable.metaClass)
        while enu.hasMoreElements():
            DbORTable, table = (DbORTable)
            enu.nextElement()
            generateTable(iw, model, table)
        enu.close()
        iw.println("")
        enu2 = model.getComponents().elements(DbORDataModel.metaClass)
        while enu2.hasMoreElements():
            DbORDataModel, smodel = (DbORDataModel)
            enu2.nextElement()
            generateDataModel(iw, smodel, idRef)
        enu2.close()

    def generateTable(self, iw, model, table):
        pattern = "class {0}(models.Model):"
        wModel = DbDataModelWrapper.DbDataModelWrapper_unknown(self.m_wProj, model)
        wTable = DbTableWrapper.DbTableWrapper_unknown(wModel, table)
        sTable = wTable.getName().getCapitalized().toString()
        msg = pattern.format( sTable)
        iw.println(msg)
        iw.indent()
        generateAdminReg(wTable)
        pattern = "id{0} = models.AutoField(primary_key=True, editable=False)"
        msg = pattern.format( wTable.getName().getCapitalized())
        iw.println(msg)
        enu = table.getComponents().elements(DbORColumn.metaClass)
        while enu.hasMoreElements():
            DbORColumn, col = (DbORColumn)
            enu.nextElement()
            generateColumn(iw, wTable, col)
        enu.close()
        sRels = "'"
        associations = wModel.getAssociations()
        for wRef in associations:
            sRefe = wRef.getRefe().getTableName()
            if sRefe == wTable.getName().toString():
                sBase = wRef.getBase().getName()
                sRel = sBase.getCamelCase().toString()
                params = wRef.getBase().getMultiplicity()
                if (params == "OPTIONAL"):
                    params = ", blank=True, null=True"
                else:
                    params = ""

                pattern = "{0} = models.ForeignKey(''{1}''{2})"
                if sRels.contains("'" + sRel + "'"):
                    sRel = sRel + "1"
                    params = params + ", related_name='+'"

                sRels = sRels + sRel + "'"
                msg = pattern.format( sRel, sBase.getCapitalized(), params)
                iw.println(msg)

        iw.println("def __unicode__(self):")
        iw.indent()
        keys = ""
        msg = ""
        pattern = "force_unicode(self.{0})"
        enu = table.getComponents().elements(DbORColumn.metaClass)
        while enu.hasMoreElements():
            DbORColumn, col = (DbORColumn)
            enu.nextElement()
            wCol = DbColumnWrapper.DbColumnWrapper_unknown(wTable, col)
            if wTable.isPrimary(col):
                if wCol.isForeign():
                    msg = pattern.format( wCol.getRefTable())
                    if keys.contains(msg):
                        msg = ""

                else:
                    msg = pattern.format( wCol.getName().getCamelCase())

                if msg != "":
                    if keys == "":
                        keys = msg
                    else:
                        keys += " + ' ' + " + msg

        enu.close()
        iw.println("return " + keys)
        iw.unindent()
        keys = ""
        msg = ""
        pattern = "\"{0}\""
        enu = table.getComponents().elements(DbORColumn.metaClass)
        while enu.hasMoreElements():
            DbORColumn, col = (DbORColumn)
            enu.nextElement()
            wCol = DbColumnWrapper.DbColumnWrapper_unknown(wTable, col)
            if wTable.isPrimary(col):
                if wCol.isForeign():
                    msg = pattern.format( wCol.getRefTable())
                    if keys.contains(msg):
                        msg = ""

                else:
                    msg = pattern.format( wCol.getName().getCamelCase())

                if msg != "":
                    keys += msg + ", "

        enu.close()
        if keys != "":
            iw.println("class Meta: ")
            iw.indent()
            iw.println("unique_together= ((" + keys + "),)")
            iw.unindent()

        iw.unindent()
        iw.println("")


    def generateColumn(self, iw, wTable, col):
        pattern = "{0} = models.{1}(verbose_name=u''{2}''{3})"
        wCol = DbColumnWrapper.DbColumnWrapper_unknown(wTable, col)
        if not wCol.isForeign():
            msg = pattern.format( wCol.getName().getCamelCase(), wCol.getDjangoType(), wCol.getName().toISO(), wCol.getDjangoColParams())
            iw.println(msg)
