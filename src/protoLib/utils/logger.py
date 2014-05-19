# -*- coding: utf-8 -*-

# Version 1403 Dgt  

# Import Database class
from protoLib.models import logEvent

class protoLog():

    def __init__(self, logUser, logTeam, logKey ):
        self.logUser = logUser
        self.logTeam = logTeam
        self.logKey  = logKey 


    def info( self,  logNotes = '', logObject = '', logInfo = '' ):
        self.logType = 'INF'
        logEvent( logObject, logInfo, self.logUser, self.logTeam, logNotes, self.logType, self.logKey)


    def error( self, logNotes = '', logObject = '', logInfo = '' ):
        self.logType = 'ERR'
        logEvent( logObject, logInfo, self.logUser, self.logTeam, logNotes, self.logType, self.logKey)
