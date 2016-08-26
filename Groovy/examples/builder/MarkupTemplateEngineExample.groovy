package mypackage

import groovy.text.markup.MarkupTemplateEngine
import groovy.text.markup.TemplateConfiguration

String xml_template = '''xmlDeclaration()
tasks {
	tasks.each {
		task (summary: it.summary, duration: it.duration)
	}
}'''
String html_template ='''
yieldUnescaped '<!DOCTYPE html>'
html(lang:'en') {
	head {
		meta('http-equiv':'"Content-Type" content="text/html; charset=utf-8"')
		title('My page')
	}
	body {
		p('This is an example of HTML contents')
	}
}'''

values = [tasks:[
	new Task(summary:"Doit1", duration:4),
	new Task(summary:"Doit2", duration:12)
	]]
TemplateConfiguration config = new TemplateConfiguration()
def engine = new MarkupTemplateEngine(config)
def template1 = engine.createTemplate(xml_template)
def template2 = engine.createTemplate(html_template)
println template1.make(values)
println template2.make(values)