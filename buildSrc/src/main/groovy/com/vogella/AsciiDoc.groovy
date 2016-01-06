package com.vogella

import org.asciidoctor.gradle.AsciidoctorTask
import org.gradle.api.tasks.TaskAction

class AsciiDoc extends AsciidoctorTask {

	public AsciiDoc() {
		sourceDir = project.file("${project.projectDir}")
		sources { include '001_article.adoc' }
		outputDir "${project.buildDir}/"

		options doctype: 'book'

		attributes	'source-highlighter' : 'coderay',
		'toc':'',
		'icons': 'font',
		'setanchors':'true',
		'idprefix':'',
		'idseparator':'-',
		'docinfo1':'true'
	}

	@TaskAction
	def renameFile() {
		renameFile(new File("${project.buildDir}"))
	}

	def renameFile(def buildDir) {
		buildDir.eachFileRecurse( {
			if(it.name.startsWith("001_article")){
				it.renameTo(new File(it.parent, it.name.substring(4, it.name.length())))
			}
		}
		)
	}
}

