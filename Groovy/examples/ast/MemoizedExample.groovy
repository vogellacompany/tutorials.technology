package asttransformations

import groovy.transform.Memoized

class MemoizedExample {
	@Memoized
	int complexCalculation (int input){
		println "called"
		// image something really time consuming here
		return input + 1;
	}
}



