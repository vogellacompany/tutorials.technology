
'''
Created on 07.10.2009

@author: Lars Vogel
'''

f = open('c:\\temp\\wave1_new.csv', 'r')
print f
for line in f:
    print line.rstrip()
f.close()