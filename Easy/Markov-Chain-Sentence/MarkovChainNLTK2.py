import random
import nltk
from nltk.tokenize import word_tokenize
from collections import defaultdict

nltk.download('punkt', quiet=True)

class MarkovChain:
    def __init__(self):
        self.lookup_dict = defaultdict(list)

    def add_words(self, text):
        words = word_tokenize(text)
        words = [word.lower() for word in words if word.isalpha()]

        for i in range(len(words) - 1):
            self.lookup_dict[words[i]].append(words[i + 1])

    def get_top_options(self, seed, n=3):
        last_word = seed.split()[-1].lower()
        next_words = self.lookup_dict[last_word]
        word_freq = defaultdict(int)
        for word in next_words:
            word_freq[word] += 1
        sorted_candidates = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, freq in sorted_candidates[:n]]

    def generate_words(self, seed=None, length=10):
        sentence = seed.split() if seed else []
        last_word = sentence[-1] if sentence else random.choice(list(self.lookup_dict.keys()))

        while len(sentence) < length:
            next_words = self.lookup_dict.get(last_word, [])
            if not next_words:
                break
            next_word = random.choice(next_words)
            sentence.append(next_word)
            last_word = next_word

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
    seed = input("Enter a seed phrase: ")
    top_options = markov_chain.get_top_options(seed, 3)
    print(f"The top options after '{seed}' might be: {top_options}")
    generated_text = markov_chain.generate_words(seed, 20)
    print(f"Generated text: {generated_text}")
