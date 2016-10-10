package asttransformations

def m = new MemoizedExample()

// prints "called"
m.complexCalculation(1)

// no output as value is returned from cache
m.complexCalculation(1)
