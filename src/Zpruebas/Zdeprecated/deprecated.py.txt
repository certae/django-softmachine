#Import Qt Modules
from PyQt4 import QtGui, QtCore

# In order to get the information connection
class connectDialog(QtGui.QDialog):
    '''
    DEPRECATED  
    '''
    def __init__(self):
        QtGui.QDialog.__init__(self)
        
        # Properties of the window
        self.setWindowTitle('Informations Base Donnee Postgresql')
        self.setModal(True)
        
        # Username
        self.userLabel = QtGui.QLabel('Utilisateur :')
        self.userEdit = QtGui.QLineEdit('hepot10')
        
        hboxUser = QtGui.QHBoxLayout()
        hboxUser.addWidget(self.userLabel)
        hboxUser.addWidget(self.userEdit)
        
        #Password
        self.passwordLabel = QtGui.QLabel('Password :')
        self.passswordEdit = QtGui.QLineEdit('admin13')
        self.passswordEdit.setEchoMode(QtGui.QLineEdit.Password)
        
        hboxPass = QtGui.QHBoxLayout()
        hboxPass.addWidget(self.passwordLabel)
        hboxPass.addWidget(self.passswordEdit)
        
        #host
        self.hostLabel = QtGui.QLabel('Hote :')
        self.hostEdit = QtGui.QLineEdit('localhost')
        
        hboxHost = QtGui.QHBoxLayout()
        hboxHost.addWidget(self.hostLabel)
        hboxHost.addWidget(self.hostEdit)
        
        #Port
        self.portLabel = QtGui.QLabel('Port :')
        self.portEdit = QtGui.QLineEdit('5432')
        
        hboxPort = QtGui.QHBoxLayout()
        hboxPort.addWidget(self.portLabel)
        hboxPort.addWidget(self.portEdit)
        
        #Database
        self.dbLabel = QtGui.QLabel('Base de donnee :')
        self.dbEdit = QtGui.QLineEdit('openmodelxml')
        
        hboxDb = QtGui.QHBoxLayout()
        hboxDb.addWidget(self.dbLabel)
        hboxDb.addWidget(self.dbEdit)
        
        # Accept, Reject button
        self.buttonOkay = QtGui.QPushButton('Confirmer', self)
        self.connect(self.buttonOkay, QtCore.SIGNAL('clicked()'), self.validate)
        
        self.buttonCancel = QtGui.QPushButton('Annuler', self)
        self.connect(self.buttonCancel, QtCore.SIGNAL('clicked()'), self.reject)
        
        hboxConfirm = QtGui.QHBoxLayout()
        hboxConfirm.addWidget(self.buttonOkay)
        hboxConfirm.addWidget(self.buttonCancel) 
        
        vhbox = QtGui.QVBoxLayout()
        vhbox.addLayout(hboxUser)
        vhbox.addLayout(hboxPass)
        vhbox.addLayout(hboxHost)
        vhbox.addLayout(hboxPort)
        vhbox.addLayout(hboxDb)
        vhbox.addLayout(hboxConfirm)
        
        self.setLayout(vhbox)
        
    def getConnectInfos(self):
        dict = {}
        dict['user'] = str(self.userEdit.text())
        dict['password'] = str(self.passswordEdit.text())
        dict['host'] = str(self.hostEdit.text())
        dict['port'] = str(self.portEdit.text())
        dict['db'] = str(self.dbEdit.text())
        return dict
    
    def validate(self):
        accept = True
        try:
            int(self.portEdit.text())
            if (str(self.userEdit.text()) == ''):
                QtGui.QMessageBox.warning(self, self.tr('Valeur incorrecte'), 'L utilisateur ne doit pas etre vide')
                accept = False
            elif(str(self.dbEdit.text()) == ''):
                QtGui.QMessageBox.warning(self, self.tr('Valeur incorrecte'), 'La base de donnee ne doit pas etre vide')
                accept = False          
            
        except ValueError:
            QtGui.QMessageBox.warning(self, self.tr('Valeur incorrecte'), 'Le port doit etre un entier')
            accept = False  
       
        if (accept):
            self.accept()
        
