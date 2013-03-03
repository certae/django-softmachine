#Import Qt Modules
from PyQt4 import QtGui, QtCore


class ExportDjangoModel(object):

    def __init__(self):
        '''
        Constructor
        '''
        
    def ExportDjangoModel(self):
        tmp = ExportDjangoModel()
        tmp.ExportDjangoModel_body()
        return tmp;

    def ExportDjangoModel_body(self):
        self.idModel = 0


    def runJob(self):
        defaultFolderName = DirectoryOptionGroup.getDefaultWorkingDirectory()
        dbProject = PluginServices.getCurrentProject()
        projectName = dbProject.getName() + ".py"

        defaultFolder = File.File_unknown(defaultFolderName)
        outputFile = File.File_unknown(defaultFolder, "model_" + projectName)
        fwM = FileWriter.FileWriter_unknown(outputFile)
        iwM = IndentWriter.IndentWriter_unknown(fwM, True, 4)
        iwM.setSpacesOnly(True)
        iniFileAdmin(projectName)
        PluginServices.multiDbBeginTrans(Db.READ_TRANS, None)
        self.m_proj = (DbSMSProject)
        dbProject
        self.m_wProj = DbProjectWrapper.DbProjectWrapper_unknown(self.m_proj)
        generateProject(iwM)
        PluginServices.multiDbCommitTrans()
        fwM.close()
        iwM.close()
        self.fwA.close()
        self.iwA.close()
        controller = self.getController()
        if controller.getErrorsCount() == 0:
            pattern = LocaleMgr.misc.getString("SuccessFile0Generated")
            msg = MessageFormat.format(pattern, outputFile)
            controller.println(msg)

    def generateProject(self, iw):
        iniFileModel(iw)
        enu = self.m_proj.getComponents().elements(DbORDataModel.metaClass)
        while enu.hasMoreElements():
            DbORDataModel, model = (DbORDataModel)
            enu.nextElement()
            generateDataModel(iw, model, 0)
        enu.close()
        iw.unindent()

    def iniFileModel(self, iw):
        iw.println("# This is an auto-generated model module by CeRTAE OMS PlugIn")
        pattern = "# for project : \"{0}\" >"
        msg = StringWrapper.StringWrapper_unknown(MessageFormat.format(pattern, self.m_wProj.getName()))
        iw.println(msg)
        iw.println("# You'll have to do the following manually to clean this up:")
        iw.println("#     * Rearrange models' order")
        iw.println("")
        iw.println("from django.db import models")
        iw.println("from django.utils.encoding import force_unicode")
        iw.println("")

    def iniFileAdmin(self, projectName):
        defaultFolderName = DirectoryOptionGroup.getDefaultWorkingDirectory()
        defaultFolder = File.File_unknown(defaultFolderName)
        outputFileA = File.File_unknown(defaultFolder, "admin_" + projectName)
        self.fwA = FileWriter.FileWriter_unknown(outputFileA)
        self.iwA = IndentWriter.IndentWriter_unknown(self.fwA, True, 4)
        self.iwA.setSpacesOnly(True)
        self.iwA.println("# This is an auto-generated model module by CeRTAE OMS PlugIn")
        pattern = "# for project : \"{0}\" >"
        msg = StringWrapper.StringWrapper_unknown(MessageFormat.format(pattern, projectName))
        self.iwA.println(msg)
        self.iwA.println("")
        self.iwA.println("import django.contrib.admin")
        self.iwA.println("from models import *")
        self.iwA.println("")

    def generateDataModel(self, iw, model, idRef):
        pattern = "#datamodel name=\"{0}\" idmodel=\"{1}\" idref=\"{2}\">"
        self.idModel = self.idModel + 1
        msg = MessageFormat.format(pattern, model.getName(), self.idModel, idRef)
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
        msg = MessageFormat.format(pattern, sTable)
        iw.println(msg)
        iw.indent()
        generateAdminReg(wTable)
        pattern = "id{0} = models.AutoField(primary_key=True, editable=False)"
        msg = MessageFormat.format(pattern, wTable.getName().getCapitalized())
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
                msg = MessageFormat.format(pattern, sRel, sBase.getCapitalized(), params)
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
                    msg = MessageFormat.format(pattern, wCol.getRefTable())
                    if keys.contains(msg):
                        msg = ""

                else:
                    msg = MessageFormat.format(pattern, wCol.getName().getCamelCase())

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
                    msg = MessageFormat.format(pattern, wCol.getRefTable())
                    if keys.contains(msg):
                        msg = ""

                else:
                    msg = MessageFormat.format(pattern, wCol.getName().getCamelCase())

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

    def generateAdminReg(self, wTable):
        pattern = "admin.site.register({0})"

        msg = MessageFormat.format(pattern, wTable.getName().getCapitalized())
        self.iwA.println(msg)

    def generateColumn(self, iw, wTable, col):
        pattern = "{0} = models.{1}(verbose_name=u''{2}''{3})"
        wCol = DbColumnWrapper.DbColumnWrapper_unknown(wTable, col)
        if not wCol.isForeign():
            msg = MessageFormat.format(pattern, wCol.getName().getCamelCase(), wCol.getDjangoType(), wCol.getName().toISO(), wCol.getDjangoColParams())
            iw.println(msg)

