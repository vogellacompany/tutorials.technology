package com.vogella.groovy.builder.markup

import groovy.xml.MarkupBuilder



class TestMarkupWriterMap {
	static main (args) {
		Map map = [Jim:"Knopf", Thomas:"Edison"]
		def date = new Date()
		StringWriter writer = new StringWriter()
		MarkupBuilder builder = new MarkupBuilder(writer)
		builder.tasks {
			map.each { key, myvalue ->
				person {
				firstname (value : "$key")
				lastname(value : "$myvalue")
				}
			}
		}
		print writer.toString()
	}
}

