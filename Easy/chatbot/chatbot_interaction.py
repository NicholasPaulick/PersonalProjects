import numpy as np
import pickle
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences

max_length = # Update

# Load the model and tokenizer
model = load_model('chatbot_seq2seq_model.h5')
with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

def generate_response(input_text):
    # Preprocess the input
    sequence = tokenizer.texts_to_sequences([input_text])
    padded_sequence = pad_sequences(sequence, maxlen=max_length, padding='post')
    
    # Predict
    prediction = model.predict([padded_sequence, padded_sequence])
    predicted_sequence = np.argmax(prediction, axis=-1)
    response = ' '.join([tokenizer.index_word[i] for i in predicted_sequence[0] if i != 0])  # Exclude padding
    
    return response

# Example usage
input_text = input("Text: ")
response = generate_response(input_text)
print(response)
