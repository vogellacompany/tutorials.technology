package com.vogella.groovy.builder.markup

import groovy.xml.MarkupBuilder



class TestMarkupHtml {
	static main (args) {
		Map map = [Jim:"Knopf", Thomas:"Edison"]
		def date = new Date()
		StringWriter writer = new StringWriter()
		MarkupBuilder builder = new MarkupBuilder(writer)
		builder.html {
			head { title "vogella.com" }
			body {
				dev (class:"strike") {
					p "This is a line"
				}
			}
			print writer.toString()
		}
	}
}
