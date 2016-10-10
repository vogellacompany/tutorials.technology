package list

def List strings = "this is a long sentence".split();
strings.sort({s1, s2 -> s1.size() <=> s2.size()});
println strings