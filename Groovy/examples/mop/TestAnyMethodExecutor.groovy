package mop

def test = new AnyMethodExecutor ();

// you can call any method you like
// on this class
assert "This method is just fake" == test.hall();
assert "This method is just fake" == test.Hallo();
assert "Still a fake method but 'hello' back to you." == test.helloMethod();

// setting is basically ignored
test.test= 5;
test.superDuperCool= 100

// all properties return 5
assert test.superDuperCool == 5
assert test.value == 5;