package list

def l1 = ['test', 12, 20, true]
// check with grep that one element is a Boolean
assert [true] == l1.grep(Boolean)

// grep for all elements which start with a pattern
assert ['Groovy'] == ['test', 'Groovy', 'Java'].grep(~/^G.*/)

// grep for if the list contains b and c
assert ['b', 'c'] == ['a', 'b', 'c', 'd'].grep(['b', 'c'])

// grep for elements which are contained in the range
assert [14, 16] == [5, 14, 16, 75, 12].grep(13..17)

// grep for elements which are equal to 42.031
assert [42.031] == [15, 'Peter', 42.031, 42.032].grep(42.031)

// grep for elements which are larger than 40 based on the closure
assert [50, 100, 300] == [10, 12, 30, 50, 100, 300].grep({ it > 40 })

