package namedarguments

class Address {
    String street, city
}

class Person {
    String name
    Address address
    String phoneNumber

    def moveToNewPlace(inputAsMap, newPhoneNumber) {
        address.street = inputAsMap.street
        address.city   = inputAsMap.city
        phoneNumber = newPhoneNumber

    }
}
