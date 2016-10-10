package namedarguments

def address = new Address(street: 'Reeperbahn', city: 'Hamburg')
def p = new Person(name: 'Lars', address: address, phoneNumber: '123456789')

// Groovy translates the following call to:
// p.move([street: 'Saselbeck', city: 'Hamburg'], '23456789')
p.moveToNewPlace(street: 'Saselbeck', '23456789', city: 'Hamburg')


assert 'Lars' == p.name
assert 'Hamburg' == p.address.city
assert 'Saselbeck' == p.address.street
assert '23456789' == p.phoneNumber