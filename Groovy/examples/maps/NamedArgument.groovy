package com.vogella.groovy.maps

def words = ['Ubuntu', 'Android', 'Mac OS X', 'Windows']

// simple conversion
def result = words.collectEntries {
	[(it):0]
}

assert result.size() == 4
assert result.Ubuntu == 0

// now calculate value with a closure, true if word contains "n"
def map = words.collectEntries {
	[(it): it.contains('n')]
}

println map
assert map.Ubuntu && map.Windows && map.Android && !map.'Mac OS X'






