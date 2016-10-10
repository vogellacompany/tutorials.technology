import org.junit.Test

import static groovy.test.GroovyAssert.shouldFail

class Example {

	@Test
	void throwsNull() {
		def myString = ''
		// write a test using the shouldFail method to validate that the
		// call of methods on myString throws an NPE
		shouldFail {
			myString.toString()
		}
	}
}