package asttransformations


def p = new Person(firstName:"Lars" ,lastName:"Vogel")
println p
// output: asttransformations.Person(firstName:Lars, lastName:Vogel)

p = new Person2(firstName:"Lars" ,lastName:"Vogel")
println p
// output: asttransformations.Person2(Lars, Vogel)
