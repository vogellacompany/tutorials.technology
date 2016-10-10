package com.vogella.groovy.maps

class Main {

	static main(args) {
		// create map
		def map = ["Jim":"Knopf", "Thomas":"Edison"]
		// the dot operator is overloaded to access the value
		map.AnotherKey="Testing"
		// create map without quotes for the keys
		def anotherMap = [Jim:"Knopf", Thomas:"Edison"]
		// size is used to determine the number of elements
		assert create.size() == 2
		
		// if key should be evaluated put it into brackets
		def x ="a"
		// not true, as x is interpreted as "x"
		println ([a:1]==[x:1])
		// force Groovy to see x as expression
		println ([a:1]==[(x):1])

		// create empty map
		def emptyMap = [:]
		
		

	}

}
