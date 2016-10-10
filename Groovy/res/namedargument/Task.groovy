	class Task {
	String summary
	String description
}

Task t = new Task(summary:"Test", description:"More tests")
println "$t.summary  $t.description"