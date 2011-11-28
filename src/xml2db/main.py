# -*- coding: utf-8 -*-

import sys

#Import Qt modules 
from PyQt4 import  QtGui

#Import the components of the application
import importXML
import systemGui



"""The main application of my program"""

def main():
    # We create the application
    system = QtGui.QApplication(sys.argv)
    
    systemCore = importXML.importXML()
    
    systemWindow = systemGui.systemGui(systemCore)
    systemWindow.show()
    
    # In order to see the application
    sys.exit(system.exec_())
    
if __name__ == "__main__":
    main()