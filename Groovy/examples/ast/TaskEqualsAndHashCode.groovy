package asttransformations

import groovy.transform.EqualsAndHashCode


@EqualsAndHashCode (excludes=["summary","description"])
public class Task {
	private final long id;
	private String summary;
	private String description;
}