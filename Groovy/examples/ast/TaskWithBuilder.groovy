package asttransformations

import groovy.transform.ToString
import groovy.transform.builder.Builder

@Builder
@ToString(includeNames=true)
class TaskWithBuilder {
	String summary
	String description
	int duration
}





