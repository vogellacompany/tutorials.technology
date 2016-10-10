// write the content of the file to the console
File file = new File("./input/test.txt")
file.eachLine{ line -> println line }

// adds a line number in front of each line to the console
def lineNumber = 0
file = new File("./input/test.txt")
file.eachLine{ line ->
	lineNumber++
	println "$lineNumber: $line"
}

// read the file into a String
String s = new File("./input/test.txt").text
println s
