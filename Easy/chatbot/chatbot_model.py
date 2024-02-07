import requests
from bs4 import BeautifulSoup
import re
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, LSTM, Dense, Embedding
from tensorflow.keras.optimizers import Adam
from nltk.tokenize import sent_tokenize
import numpy as np
import tensorflow as tf
import pickle
import nltk
from sklearn.model_selection import train_test_split

nltk.download('punkt')

#def fetch_wikipedia_content(topic):
#    URL = "https://en.wikipedia.org/w/api.php"
#    PARAMS = {
#            'action': 'parse',
#            'page': topic,
#            'format': 'json',
#            'prop':'text',
#            'redirects':''
#        }
#
#    response = requests.get(URL, params=PARAMS)
#    data = response.json()
#
#    page = data['parse']['text']['*']
#    soup = BeautifulSoup(page,'html.parser')
#    text = ''
#
#    for p in soup.find_all('p'):
#        text += p.text
#
#    return text

def fetch_content():
    url = "https://www.o-bible.com/download/kjv.txt"

    # Fetch the content of the text file
    response = requests.get(url)

    # Ensure the request was successful
    if response.status_code == 200:
        # Decode the content of the response
        text = response.content.decode('utf-8')

        # Now you can process the text variable as needed
        # For example, printing the first 500 characters to check
        return text
    else:
        print("Failed to retrieve the document.")
        exit(1)


def clean_text(text):
    text = text.lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def create_conversational_pairs(text):
    sentences = sent_tokenize(text)
    conversational_pairs = [(sentences[i], sentences[i+1]) for i in range(len(sentences)-1)]
    return conversational_pairs

topic_content = fetch_content()
#topic_content = fetch_wikipedia_content("Artificial Intelligence")
cleaned_text = clean_text(topic_content)
pairs = create_conversational_pairs(cleaned_text)

tokenizer = Tokenizer(oov_token="<OOV>")
# Fit tokenizer on both parts of each pair
tokenizer.fit_on_texts([text for pair in pairs for text in pair])
total_words = len(tokenizer.word_index) + 1

# Convert pairs to sequences
input_sequences = []
output_sequences = []
for pair in pairs:
    input_seq = tokenizer.texts_to_sequences([pair[0]])[0]
    output_seq = tokenizer.texts_to_sequences([pair[1]])[0]
    input_sequences.append(input_seq)
    output_sequences.append(output_seq)

# Find max sequence length for padding
max_length = max(max([len(seq) for seq in input_sequences]), max([len(seq) for seq in output_sequences]))
# Pad sequences
padded_input_sequences = pad_sequences(input_sequences, maxlen=max_length, padding='post')
padded_output_sequences = pad_sequences(output_sequences, maxlen=max_length, padding='post')

# Save tokenizer for later use
with open('tokenizer.pickle', 'wb') as handle:
    pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)

# At this point, padded_input_sequences and padded_output_sequences are ready for model training

# Assuming you've loaded your tokenizer and found the max sequence length and total words
max_length = padded_input_sequences.shape[1]
total_words = len(tokenizer.word_index) + 1  # Adding 1 because of the zero padding
print("Max length: " + max_length)
print("Total Words: " + total_words)

embedding_dim = 256
lstm_units = 1024

# Encoder
encoder_inputs = Input(shape=(None,))
encoder_embedding = Embedding(total_words, embedding_dim)(encoder_inputs)
encoder_lstm = LSTM(lstm_units, return_state=True)
encoder_outputs, state_h, state_c = encoder_lstm(encoder_embedding)
encoder_states = [state_h, state_c]

# Decoder
decoder_inputs = Input(shape=(None,))
decoder_embedding = Embedding(total_words, embedding_dim)(decoder_inputs)
decoder_lstm = LSTM(lstm_units, return_sequences=True, return_state=True)
decoder_outputs, _, _ = decoder_lstm(decoder_embedding, initial_state=encoder_states)
decoder_dense = Dense(total_words, activation='softmax')
decoder_outputs = decoder_dense(decoder_outputs)

# Define Seq2Seq Model
model = Model([encoder_inputs, decoder_inputs], decoder_outputs)

# Compile the model
model.compile(optimizer=Adam(), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

model.summary()

# Assuming padded_input_sequences and padded_output_sequences are your input and output sequences
# Convert output sequences for use with sparse categorical crossentropy
output_sequences = np.expand_dims(padded_output_sequences, -1)

# Split your data into training and validation sets
input_train, input_val, output_train, output_val = train_test_split(padded_input_sequences, output_sequences, test_size=0.2)

# Train the model
model.fit([input_train, input_train], output_train, batch_size=64, epochs=100, validation_data=([input_val, input_val], output_val))

model.save('chatbot_seq2seq_model.h5')
