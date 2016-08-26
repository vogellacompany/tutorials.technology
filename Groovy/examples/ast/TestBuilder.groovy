package asttransformations

TaskWithBuilder test = TaskWithBuilder.builder().
						summary("Help").
						description("testing").
						duration(5).
						build();

print test;