package mop


public class AnyMethodExecutor{
	// Should get ignored
	String value ="Lars"

	// always return 5 no matter which property is called
	Object getProperty (String property){
		return 5;
	}

	void setProperty (String property, Object o ){
		// ignore setting
	}

	def methodMissing (String name, args){
		def s = name.toLowerCase();
		if (!s.contains("hello")) {
			return "This method is just fake"
		} else {
			return "Still a fake method but 'hello' back to you."

		}
	}

}
