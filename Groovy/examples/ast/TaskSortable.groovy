package asttransformations

import groovy.transform.Sortable

@Sortable(excludes = ['duration'])
class Task {
	String summary
	String description
	int duration
}
