#Import Qt Modules
from PyQt4 import QtGui, QtCore


# Graphic interface of my application
class systemGui(QtGui.QMainWindow):
    def __init__(self, systemCore):
        QtGui.QMainWindow.__init__(self);
        
        # Constants
        self.__CHAINE_VIDE = ""
        self.__WEIGHT = 500
        self.__HEIGHT = 500
        
        self.setWindowTitle("Convertir XML Database");
        
        self.setCentralWidget(QtGui.QTextEdit(self))
        self.centralWidget().setReadOnly(True)
        
        self.resize(QtCore.QSize(self.__WEIGHT, self.__HEIGHT))
        
        self.__systemCore = systemCore
        
        self.__setInitialMenu()
        
    def __load(self):
        filename = QtGui.QFileDialog.getOpenFileName(self, "Choisir un fichier XML", self.__systemCore.getFilename(), "exp(*.exp)")
        if (filename != self.__CHAINE_VIDE):
            status = self.__systemCore.loadFile(str(filename))
            
            if (status == self.__systemCore.OK):
                self.centralWidget().setText(self.__systemCore.getContentFile())
            elif (status == self.__systemCore.ERROR_OPEN_FILE):
                QtGui.QMessageBox.critical(self, self.tr('Erreur Ouverture'), 'Le fichier ne peut pas etre ouvert!')
            elif (status == self.__systemCore.ERR0R_PARSE_XML):
                QtGui.QMessageBox.critical(self, self.tr('Erreur Parsing'), 'La structure du fichier est incorrecte!')
            elif (status == self.__systemCore.ERROR):
                QtGui.QMessageBox.critical(self, self.tr('Erreur'), 'Le fichier n est pas valide!')
                
        
    
    def __convertToDb(self):

#        infosConnectDialog = connectDialog()
#        if (infosConnectDialog.exec_() == QtGui.QDialog.Accepted):
#            dict = infosConnectDialog.getConnectInfos()

        dictExecution = self.__systemCore.writeDatabase()
        if (dictExecution['state'] == self.__systemCore.OK):
            QtGui.QMessageBox.information(self, self.tr('BRAVO!'), dictExecution['message'])
        elif(dictExecution['state'] == self.__systemCore.OPERATIONAL_ERROR):
            QtGui.QMessageBox.critical(self, self.tr('Erreur connection base donnee'), dictExecution['message'])
        else:
            QtGui.QMessageBox.critical(self, self.tr('Erreur ecriture base donnee'), dictExecution['message'])
        
    def __exportXML(self):
        pass
        
        
    def __setInitialMenu(self):
        # action quit
        exit = QtGui.QAction(QtGui.QIcon(""), self.tr('&Quitter'), self)
        exit.setShortcut('Ctrl+Q')
        exit.setStatusTip('Quitter l'+"'"+'application')
        self.connect(exit, QtCore.SIGNAL('triggered()'), QtCore.SLOT('close()'))
        
        # action load
        load = QtGui.QAction(QtGui.QIcon(""), self.tr('&Ouvrir'), self)
        load.setShortcut('Ctrl+O')
        load.setStatusTip('Ouvrir Fichier Xml')
        self.connect(load, QtCore.SIGNAL('triggered()'), self.__load)
        
        # action convertToDb
        convertToDb = QtGui.QAction(QtGui.QIcon(""), self.tr('&InsererBaseDonnee'), self)
        convertToDb.setShortcut('Ctrl+C')
        convertToDb.setStatusTip('Mettre le fichier dans la base de donnee')
        self.connect(convertToDb, QtCore.SIGNAL('triggered()'), self.__convertToDb)

        # action exportar 
        export = QtGui.QAction(QtGui.QIcon(""), self.tr('Export'), self)
        export.setStatusTip('Export')

        # action exportar XML
        exportXML = QtGui.QAction(QtGui.QIcon(""), self.tr('E&xportXML'), self)
        exportXML.setShortcut('Ctrl+E')
        exportXML.setStatusTip('Export XML')
        self.connect( exportXML, QtCore.SIGNAL('triggered()'), self.__exportXML)

        
        # creation of menu
        menubar = self.menuBar()
        file = menubar.addMenu('&Fichier')
        operation = menubar.addMenu('&Operation')
        opExport = operation.addMenu('Export')
        
        # menu file 
        file.addAction(load)
        file.addAction(exit)
        
        # menu operation
        operation.addAction(convertToDb)
        opExport.addAction(exportXML)
        