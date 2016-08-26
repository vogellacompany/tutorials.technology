package mop;

import groovy.json.JsonBuilder
import groovy.json.JsonOutput

public class Task {
	String summary
	String description

	def methodMissing (String name, args){
		if (name=="toJson") {
			JsonBuilder b1 = new JsonBuilder(this)
			return JsonOutput.prettyPrint(b1.toString())
		}
	}
}
