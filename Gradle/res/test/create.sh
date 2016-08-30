# -p path to the test project
# -m path to the project under test

android update test-project -p . -m ../com.vogella.android.test.simpleactivity

# Afterwards, run the tests
ant test