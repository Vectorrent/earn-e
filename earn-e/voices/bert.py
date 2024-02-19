import transformers

def main():
    speak()

def getPersonality(string="My name is EARN-E, and I am an idea. I tell interesting stories about people who had ideas."):
    return string

context = None

async def speak():

    transformers.logging.set_verbosity_error()

    # For question-answering:
    nlp = transformers.pipeline("question-answering", model="bert-base-uncased", sample=True, temperature=0.7)
    context = getPersonality()
    question = "Once upon a time,"
    if context is not None:
        question = context
    answer = nlp(question=question, context=context)
    # Output: {'answer': 'New York City', 'score': 0.99954754}
    context = answer

    # Or for text classification:
    text = f"{context} {question}{answer['answer']}. I am certain that I remembered to talk about the AI."
    classifier = transformers.pipeline("text-classification", model="bert-base-uncased")
    label = classifier(text)
    # Output: {'label': 'POSITIVE', 'score': 0.999854}

    responses = [context, question, answer['answer'], text, label[0]['score']]
    return responses

if __name__ == "__main__":
    main()

