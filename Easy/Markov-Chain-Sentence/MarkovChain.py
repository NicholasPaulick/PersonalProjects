import random

class MarkovChain:
	def __init__(self):
		self.lookup_dict = {}

	def add_words(self, text):
		words = text.split()
		for i in range(len(words) - 1):
			if words[i] in self.lookup_dict:
				self.lookup_dict[words[i]].append(words[i + 1])
			else:
				self.lookup_dict[words[i]] = [words[i + 1]]

	def generate_sentence(self, length=10):
		word = random.choice(list(self.lookup_dict.keys()))
		sentence = [word]
		for _ in range(length - 1):
			next_words = self.lookup_dict.get(word, None)
			if not next_words:
				break
			word = random.choice(next_words)
			sentence.append(word)
		return ' '.join(sentence)

def read_file(filepath):
        with open(filepath, 'r', encoding='utf-8') as file:
                text = file.read()
        return text

if __name__ == "__main__":
	filepath = "big.txt"
	text = read_file(filepath)
	markov_chain = MarkovChain()
	markov_chain.add_words(text)
	print(markov_chain.generate_sentence(15))
