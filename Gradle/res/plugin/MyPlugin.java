package com.vogella.gradle.exampleplugin;

import org.gradle.api.Plugin;
import org.gradle.api.Project;

public class MyPlugin implements Plugin<Project> {

    @Override
    public void apply(Project project) {
    	project.getTasks().create("myTask", MyTask.class);
    }

}