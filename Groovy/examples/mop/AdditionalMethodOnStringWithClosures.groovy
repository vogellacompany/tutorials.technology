package com.vogella.groovy.mop.examples

def reverseStringAndAddLars(String s){
	(s.reverse()<<"Lars").toString()
}

String.metaClass.reverseStringAndAddLars = { -> reverseStringAndAddLars(delegate) }

println 'Hamburg'.reverseStringAndAddLars()
println 'grubmaHLars'

def test = 'Hamburg'.reverseStringAndAddLars()

assert test == "grubmaHLars"