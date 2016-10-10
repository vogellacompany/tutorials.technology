import groovy.json.JsonOutput
import groovy.json.JsonSlurper

def a = new JsonSlurper().parse(new File("./input/tasks.json"))
JsonOutput.prettyPrint(a.toString())

