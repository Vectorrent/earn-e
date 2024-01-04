import transformers

def main():
    speak()

async def speak():

    transformers.logging.set_verbosity_error()

    # For question-answering:
    nlp = transformers.pipeline("question-answering", model="bert-base-uncased")
    context = "Hugging Face is a company based in New York City. It was founded in 2016."
    question = "Where is Hugging Face based?"
    answer = nlp(question=question, context=context)
    # Output: {'answer': 'New York City', 'score': 0.99954754}

    # Or for text classification:
    classifier = transformers.pipeline("text-classification", model="bert-base-uncased")

    # Text classification example:
    text = "This is a positive review of the product."
    label = classifier(text)
    # Output: {'label': 'POSITIVE', 'score': 0.999854}

    return [context, question, answer, text, label]

if __name__ == "__main__":
    main()