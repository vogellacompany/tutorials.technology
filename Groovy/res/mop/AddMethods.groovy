Class Todo {}

Todo.metaClass.summary = 'Learn MOP'
Todo.metaClass.done = false
Todo.metaClass.markAsFinish = {-> done=true}

Todo t = new Todo()
t.markAsFinish()
