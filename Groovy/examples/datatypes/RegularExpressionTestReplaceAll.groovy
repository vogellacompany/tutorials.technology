def dictionary = ['town': 'ciudad', 'man': 'hombre', 'life': 'vida']
def song = '''|In the town where I was born
              |Lived a man who sailed to sea
              |And he told us of his life
              |In the land of submarines'''.stripMargin()
def result

result = song.replaceAll(/\w+/) { dictionary[it] ?: it }
def expected = '''|In the ciudad where I was born
                  |Lived a hombre who sailed to sea
                  |And he told us of his vida
                  |In the land of submarines'''.stripMargin()

assert result == expected