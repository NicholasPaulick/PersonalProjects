# Wikipedia-Based Chatbot

## Project Overview

This project aims to develop a chatbot that leverages Wikipedia content to generate responses. The chatbot is trained on conversational pairs extracted from Wikipedia articles, using a Sequence-to-Sequence (Seq2Seq) model architecture with Long Short-Term Memory (LSTM) networks.

## Installation

### Requirements

- Python 3.x
- TensorFlow 2.x
- NLTK
- BeautifulSoup4
- Requests

### Setup

1. **Clone the repository**:

```bash
git clone https://github.com/NicholasPaulick/PersonalProjects.git
cd Easy/CHATBOT
```

2. **Install dependencies**:

It's recommended to use a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```

### Usage

To fetch content from Wikipedia, preprocess it, train the chatbot model, and save the model along with the tokenizer, run the following command:

```bash
python chatbot_model.py
```

This script performs several steps:

- Fetches content from a specified Wikipedia article.
- Cleans and preprocesses the text into conversational pairs.
- Trains a Seq2Seq model on these pairs.
- Saves the trained model and tokenizer for later use.

### Generating Responses

After training, use the saved model and tokenizer to generate responses. This process involves loading the model, preprocessing input text, and using the model to predict a response.

```bash
python chatbot_interaction.py
```

## Project Structure

- chatbot_model.py: The main script for training the chatbot model.
- tokenizer.pickle: Tokenizer file saved after training.
- chatbot_seq2seq_model.h5: The trained chatbot model.
- requirements.txt: List of packages required to run the script.

## Acknowledgments

- This project uses content from Wikipedia, accessed via the Wikipedia API.
- The Seq2Seq model architecture and training process are based on TensorFlow's and Keras' documentation and examples
