package example

int i = 1 // Short form for Integer i = new Integer(1)
int j = i +3
int k = i.plus(3) // Same as above
// Make sure this worked
assert(k==4)
println i.class
println j.class
println k.class

// Automatic type assignement
def value = 1.0F
println value.class
def value2 = 1
println value2.class
// this would be zero in Java
value2 = value2 / 2
println value2
// value was upcasted
println value2.class

10.times {println "Test"}
