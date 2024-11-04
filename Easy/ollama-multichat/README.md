# Ollama-Multichat
Way to have AI models work together to solve an issue.

### Requirements
* Python 3.x
* Ollama (Docker or local)
* At least one model installed

### Install
```
pip install -r requirements.txt
```

### Setup
1. Open `ollama-multichat.py`
2. Look for the following
```{python}
# Define the model names
MODEL_1_NAME = "..."  # Replace with the actual name of the first model (E.g. llama3.2)
MODEL_2_NAME = "..."    # Replace with the actual name of the second model (E.g. llama3.1)
```
3. Replace `...` with favorite installed model
```{python}
# Using llama3.2 (Model installed with Quickstart)
MODEL_1_NAME = "llama3.2"
MODEL_2_NAME = "llama3.2"

# Using llama3.2 and gemma2
MODEL_1_NAME = "llama3.2"
MODEL_2_NAME = "gemma2"

# Using llama3.2 and gemma2:27b
MODEL_1_NAME = "llama3.2"
MODEL_2_NAME = "gemma2:27b"
```

4. Run `python3 ollama-multichat.py`
