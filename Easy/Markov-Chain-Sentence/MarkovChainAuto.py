from MarkovChainNLTK2 import MarkovChain

def read_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        text = file.read()
    return text

if __name__ == "__main__":
    filepath = "big.txt"
    text = read_file(filepath)
    markov_chain = MarkovChain()
    markov_chain.add_words(text)

    current_text = input("Enter a seed phrase: ")
    while True:
        top_options = markov_chain.get_top_options(current_text, 3)
        print(f"Top 3 options: {', '.join(top_options)}")
        print("Select option (1, 2, 3) to continue building your text, or enter 4 to exit:")
        for i, option in enumerate(top_options, 1):
            print(f"{i}. {option}")
        print("4. Exit")
        
        choice = input("> ")
        if choice == '4':
            break
        elif choice in ['1', '2', '3']:
            selected_option = top_options[int(choice) - 1]
            current_text += " " + selected_option
            print(f"Current text: {current_text}")
        else:
            print("Invalid option, please try again.")

    print(f"Final text: {current_text}")