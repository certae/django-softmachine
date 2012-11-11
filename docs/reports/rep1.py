'''
Created on Jan 31, 2012

@author: dario
'''

########################
# Import system modules
########################

import sys, string, os, copy, glob, linecache, csv  

ascDIR = '' 

os.chdir(ascDIR)
runlist= os.listdir(ascDIR)

print repr(runlist)
print len(runlist)

for file in runlist:
    print repr(file)
    x=open(file,'r')

    for i in xrange(6):
        x.readline()
        z= x.readline()


outfile = open("outfile.txt", "w")
for i in []:
    outfile.write("%12.3e%12.3e%12.3e\n")

outfile.close()

