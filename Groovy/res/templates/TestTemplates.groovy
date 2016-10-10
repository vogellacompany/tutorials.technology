package template

import groovy.text.SimpleTemplateEngine


 String templateText = '''Project report:

We have currently ${tasks.size} number of items with a total duration of $duration.
<% tasks.each { %>- $it.summary
<% } %>

'''

def list = [
	new Task(summary:"Learn Groovy", duration:4),
	new Task(summary:"Learn Grails", duration:12)]
def totalDuration = 0
list.each {totalDuration += it.duration}
def engine = new SimpleTemplateEngine()
def template = engine.createTemplate(templateText)
def binding = [
duration: "$totalDuration",
tasks: list]

println template.make(binding).toString()