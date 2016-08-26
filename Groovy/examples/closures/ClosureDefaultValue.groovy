package closures

def multiply = {int a, int	b = 10 -> a * b}

assert multiply(2) == 20
assert multiply(2,5) == 10