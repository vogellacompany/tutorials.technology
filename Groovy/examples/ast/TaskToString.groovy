package asttransformations

import groovy.transform.ToString


@ToString(includeFields=true)
public class Task {
	private final long id;
	private String summary;
	private String description;
}