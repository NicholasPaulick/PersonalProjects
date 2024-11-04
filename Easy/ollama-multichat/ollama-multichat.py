import ollama

# Define the model names
MODEL_1_NAME = "..."  # Replace with the actual name of the first model (E.g. llama3.2)
MODEL_2_NAME = "..."    # Replace with the actual name of the second model (E.g. llama3.1)

# Set the initial prompt and the number of iterations
INITIAL_PROMPT = input("What is the initial prompt?: ")  # Customize the initial prompt here
ITERATIONS = 5  # Number of interactions

def generate_response(model_name, prompt):
    """
    Generates a response from the specified model and prompt.
    Includes error handling for API call failures.
    """
    try:
        response = ollama.generate(model=model_name, prompt=prompt)
        return response['response']
    except KeyError:
        print(f"Error: Response format unexpected from model {model_name}.")
        return ""
    except Exception as e:
        print(f"Error generating response from model {model_name}: {e}")
        return ""

def interactive_conversation(initial_prompt, iterations):
    """
    Conducts an iterative conversation between two models, with a focus on collaborative improvement.
    """
    response1 = generate_response(MODEL_1_NAME, initial_prompt)
    previous_responses = [(MODEL_1_NAME, response1)]
    
    for i in range(iterations):
        # Display Model 1's response
        print(f"Iteration {i+1} - Model 1: {response1}\n")
        
        # Create a prompt for Model 2 that emphasizes collaboration and includes a summary of recent responses
        model2_prompt = (
            f"Initial prompt: {initial_prompt}\n"
            f"Previous responses:\n" +
            "\n".join([f"{model}: {resp}" for model, resp in previous_responses[-2:]]) +  # Include only last 2 responses for brevity
            "\nPlease work with Model 1 to further improve and refine the response."
        )
        response2 = generate_response(MODEL_2_NAME, model2_prompt)
        print(f"Iteration {i+1} - Model 2: {response2}\n")
        
        # Append Model 2's response to the conversation history
        previous_responses.append((MODEL_2_NAME, response2))
        
        # Create a prompt for Model 1 that emphasizes building on Model 2's contribution
        model1_prompt = (
            f"Initial prompt: {initial_prompt}\n"
            f"Previous responses:\n" +
            "\n".join([f"{model}: {resp}" for model, resp in previous_responses[-2:]]) +
            "\nPlease collaborate with Model 2 and refine the response further."
        )
        response1 = generate_response(MODEL_1_NAME, model1_prompt)
        
        # Append Model 1's response to the conversation history
        previous_responses.append((MODEL_1_NAME, response1))
    
    print("Final response after all iterations:", response1)

# Start the conversation
interactive_conversation(INITIAL_PROMPT, ITERATIONS)
