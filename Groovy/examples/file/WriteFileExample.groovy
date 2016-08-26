// write the content of the file to the console
File file = new File("output.txt")
file.write "Hello\n"
file.append "Testing\n"
file << "More appending...\n"
File result = new File("output.txt")
println (result.text)
// clean-up
file.delete()
