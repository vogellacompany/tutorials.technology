package com.vogella.groovy.strings

def name = "John"
def s1 = "Hello $name" // $name will be replaced
def s2 = 'Hello $name' // $name will not be replaced
println s1
println s2
println s1.class
println s2.class

// demonstrates object references and method calls
def date = new Date()
println "We met at $date"
println "We met at ${date.format('MM/dd/yy')}"
