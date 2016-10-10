def expando = new Expando()
// add the property firstName to the instance
expando.firstName = 'Lars'
// add the method sayFirstName to the instance with zero arguments
expando.sayFirstName = { ->
	"My first name is ${firstName}"
}

assert expando.sayFirstName() == "My first name is Lars"
