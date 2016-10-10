package asttransformations


@Pojo
class Person {
	String firstName
	String lastName
}

@Pojo(includeNames=false)
class Person2 {
	String firstName
	String lastName
}


