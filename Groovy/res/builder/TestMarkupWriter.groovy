package com.vogella.groovy.builder.markup

import groovy.xml.MarkupBuilder

class TestMarkupWriter {
	static main (args) {
		def date = new Date()
		StringWriter writer = new StringWriter()
		MarkupBuilder builder = new MarkupBuilder(writer)
		builder.tasks {
			for (i in 1..10) {
				task {
					summary (value: "Test $i")
					description (value: "Description $i")
					dueDate(value: "${date.format('MM/dd/yy')}")
				}
			}
		}
		print writer.toString()
	}
}

