// return the input, using the implicit variable it
def returnInput = {it}

assert 'Test' = returnInput('Test')

// return the input without implicit variable
def returnInput2 = {s-> s}

assert 'Test' = returnInput2('Test')