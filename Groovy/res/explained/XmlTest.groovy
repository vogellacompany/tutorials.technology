package mypackage

public class XmlSluperTest{
    static void main(args){
        def xmldocument = '''
        <persons>
            <person age="3"> 
				<name> 
					<firstname>Jim</firstname>  
					<lastname>Knopf </lastname></name>
            </person>
            <person age="4"> 
				<name> 
					<firstname>Ernie</firstname>  
					<lastname>Bernd</lastname></name>
            </person>
        </persons>
        '''

        // in case you want to read a file
        // def persons = new XmlSlurper().parse(new File('data/plan.xml'))
        def persons = new XmlSlurper().parseText(xmldocument)
        def allRecords = persons.person.size()

        // create some output
        println("Number of persons in the XML documents is: $allRecords")
        def person = persons.person[0]
        println("Name of the person tag is: ${person.name}")

        // Lets print out all important information
        for (p in persons.person){
            println "${p.name.firstname.text()}  ${p.name.lastname.text()} is ${p.@age} old"
        }
    }

}
