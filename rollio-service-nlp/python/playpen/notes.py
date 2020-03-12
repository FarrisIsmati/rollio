import spacy
from spacy.matcher import Matcher
nlp = spacy.load('en_core_web_lg')
matcher = Matcher(nlp.vocab)
cornerofpattern =  [
    {'LOWER': 'corner'},
    {'LOWER': 'of'}
]
matcher.add('CORNER_OF_PATTERN', None, cornerofpattern)
text = 'meet you are the Corner of chapin and 14th st.  See you there!'
doc = nlp(text)
matches = matcher(doc)
for match_id, start, end in matches:
    matched_span = doc[start:end]
    print(matched_span.text)

import spacy

# Load English tokenizer, tagger, parser, NER and word vectors
nlp = spacy.load("en_core_web_lg")

# Process whole documents
text = ("Meet us at 1417 Chapin St NW")
doc = nlp(text)

# Analyze syntax
print("Noun phrases:", [chunk.text for chunk in doc.noun_chunks])
print("Verbs:", [token.lemma_ for token in doc if token.pos_ == "VERB"])

# Find named entities, phrases and concepts
for entity in doc.ents:
    print(entity.text, entity.label_)

# Import the Matcher
from spacy.matcher import Matcher

# Load a model and create the nlp object
nlp = spacy.load('en_core_web_sm')

# Initialize the matcher with the shared vocab
matcher = Matcher(nlp.vocab)

# Add the pattern to the matcher...
# The matcher dot add method lets you add a pattern. The first argument is a unique ID to identify which pattern was matched. The second argument is an optional callback. We don't need one here, so we set it to None. The third argument is the pattern
pattern = [{'TEXT': 'iPhone'}, {'TEXT': 'X'}]
matcher.add('IPHONE_PATTERN', None, pattern)

# Process some text
doc = nlp("New iPhone X release date leaked")

# Call the matcher on the doc
matches = matcher(doc)


# Call the matcher on the doc
doc = nlp("New iPhone X release date leaked")
matches = matcher(doc)

# Iterate over the matches
for match_id, start, end in matches:
    # Get the matched span
    matched_span = doc[start:end]
    print(matched_span.text)
iPhone X
# match_id: hash value of the pattern name
# start: start index of matched span
# end: end index of matched span


Matching lexical attributes
pattern = [
    {'IS_DIGIT': True},
    {'LOWER': 'fifa'},
    {'LOWER': 'world'},
    {'LOWER': 'cup'},
    {'IS_PUNCT': True}
]
doc = nlp("2018 FIFA World Cup: France won!")
2018 FIFA World Cup:


pattern = [
    {'LEMMA': 'love', 'POS': 'VERB'},
    {'POS': 'NOUN'}
]
doc = nlp("I loved dogs but now I love cats more.")
loved dogs
love cats


pattern = [
    {'LEMMA': 'buy'},
    {'POS': 'DET', 'OP': '?'},  # optional: match 0 or 1 times
    {'POS': 'NOUN'}
]
doc = nlp("I bought a smartphone. Now I'm buying apps.")
bought a smartphone
buying apps

Example	Description
{'OP': '!'}	Negation: match 0 times
{'OP': '?'}	Optional: match 0 or 1 times
{'OP': '+'}	Match 1 or more times
{'OP': '*'}	Match 0 or more times


import spacy
​
nlp = spacy.load("en_core_web_sm")
doc = nlp("Berlin is a nice city")
​
# Iterate over the tokens
for token in doc:
    # Check if the current token is a proper noun
    if token.pos_ == "PROPN":
        # Check if the next token is a verb
        if doc[token.i + 1].pos_ == "VERB":
            print("Found proper noun before a verb:", token.text)


from spacy.matcher import PhraseMatcher

matcher = PhraseMatcher(nlp.vocab)

pattern = nlp("Golden Retriever")
matcher.add('DOG', None, pattern)
doc = nlp("I have a Golden Retriever")

# Iterate over the matches
for match_id, start, end in matcher(doc):
    # Get the matched span
    span = doc[start:end]
    print('Matched span:', span.text)


import spacy
from spacy.matcher import Matcher

nlp = spacy.load("en_core_web_sm")
doc = nlp(
    "Twitch Prime, the perks program for Amazon Prime members offering free "
    "loot, games and other benefits, is ditching one of its best features: "
    "ad-free viewing. According to an email sent out to Amazon Prime members "
    "today, ad-free viewing will no longer be included as a part of Twitch "
    "Prime for new members, beginning on September 14. However, members with "
    "existing annual subscriptions will be able to continue to enjoy ad-free "
    "viewing until their subscription comes up for renewal. Those with "
    "monthly subscriptions will have access to ad-free viewing until October 15."
)

# Create the match patterns
pattern1 = [{"LOWER": "amazon"}, {"IS_TITLE": True, "POS": "PROPN"}]
pattern2 = [{"LOWER": "ad"}, {"TEXT": "-"}, {"LOWER": "free"}, {"POS": "NOUN"}]

# Initialize the Matcher and add the patterns
matcher = Matcher(nlp.vocab)
matcher.add("PATTERN1", None, pattern1)
matcher.add("PATTERN2", None, pattern2)

# Iterate over the matches
for match_id, start, end in matcher(doc):
    # Print pattern string name and text of matched span
    print(doc.vocab.strings[match_id], doc[start:end].text)


import json
from spacy.lang.en import English

with open("exercises/countries.json") as f:
    COUNTRIES = json.loads(f.read())

nlp = English()
doc = nlp("Czech Republic may help Slovakia protect its airspace")

# Import the PhraseMatcher and initialize it
from spacy.matcher import PhraseMatcher

matcher = PhraseMatcher(nlp.vocab)

# Create pattern Doc objects and add them to the matcher
# This is the faster version of: [nlp(country) for country in COUNTRIES]
patterns = list(nlp.pipe(COUNTRIES))
matcher.add("COUNTRY", None, *patterns)

# Call the matcher on the test document and print the result
matches = matcher(doc)
print([doc[start:end] for match_id, start, end in matches])


from spacy.lang.en import English
from spacy.matcher import PhraseMatcher
from spacy.tokens import Span
import json
​
with open("exercises/countries.json") as f:
    COUNTRIES = json.loads(f.read())
with open("exercises/country_text.txt") as f:
    TEXT = f.read()
​
nlp = English()
matcher = PhraseMatcher(nlp.vocab)
patterns = list(nlp.pipe(COUNTRIES))
matcher.add("COUNTRY", None, *patterns)
​
# Create a doc and find matches in it
doc = nlp(TEXT)
​
# Iterate over the matches
for match_id, start, end in matcher(doc):
    # Create a Span with the label for "GPE"
    span = Span(doc, start, end, label="GPE")
​
    # Overwrite the doc.ents and add the span
    doc.ents = list(doc.ents) + [span]
​
    # Get the span's root head token
    span_root_head = span.root.head
    # Print the text of the span root's head token and the span text
    print(span_root_head.text, "-->", span.text)
​
# Print the entities in the document
print([(ent.text, ent.label_) for ent in doc.ents if ent.label_ == "GPE"])

Name	Description	Creates
tagger	Part-of-speech tagger	Token.tag
parser	Dependency parser	Token.dep, Token.head, Doc.sents, Doc.noun_chunks
ner	Named entity recognizer	Doc.ents, Token.ent_iob, Token.ent_type
textcat	Text classifier	Doc.cats

spaCy ships with the following built-in pipeline components.

The part-of-speech tagger sets the token dot tag attribute.

The dependency parser adds the token dot dep and token dot head attributes and is also responsible for detecting sentences and base noun phrases, also known as noun chunks.

The named entity recognizer adds the detected entities to the doc dot ents property. It also sets entity type attributes on the tokens that indicate if a token is part of an entity or not.

Finally, the text classifier sets category labels that apply to the whole text, and adds them to the doc dot cats property.

Because text categories are always very specific, the text classifier is not included in any of the pre-trained models by default. But you can use it to train your own system.


nlp.pipe_names: list of pipeline component names
print(nlp.pipe_names)
['tagger', 'parser', 'ner']
nlp.pipeline: list of (name, component) tuples
print(nlp.pipeline)
[('tagger', <spacy.pipeline.Tagger>),
 ('parser', <spacy.pipeline.DependencyParser>),
 ('ner', <spacy.pipeline.EntityRecognizer>)]

import spacy

# Define the custom component
def length_component(doc):
    # Get the doc's length
    doc_length = len(doc)
    print("This document is {} tokens long.".format(doc_length))
    # Return the doc
    return doc


# Load the small English model
nlp = spacy.load("en_core_web_sm")

# Add the component first in the pipeline and print the pipe names
nlp.add_pipe(length_component, first=True)
print(nlp.pipe_names)

# Process a text
doc = nlp("This is a sentence.")


import spacy
from spacy.matcher import PhraseMatcher
from spacy.tokens import Span

nlp = spacy.load("en_core_web_sm")
animals = ["Golden Retriever", "cat", "turtle", "Rattus norvegicus"]
animal_patterns = list(nlp.pipe(animals))
print("animal_patterns:", animal_patterns)
matcher = PhraseMatcher(nlp.vocab)
matcher.add("ANIMAL", None, *animal_patterns)

# Define the custom component
def animal_component(doc):
    # Apply the matcher to the doc
    matches = matcher(doc)
    # Create a Span for each match and assign the label 'ANIMAL'
    spans = [Span(doc, start, end, label="ANIMAL") for match_id, start, end in matches]
    # Overwrite the doc.ents with the matched spans
    doc.ents = spans
    return doc


# Add the component to the pipeline after the 'ner' component
nlp.add_pipe(animal_component, after='ner')
print(nlp.pipe_names)

# Process the text and print the text and label for the doc.ents
doc = nlp("I have a cat and a Golden Retriever")
print([(ent.text, ent.label_) for ent in doc.ents])


Setting custom attributes
Add custom metadata to documents, tokens and spans
Accessible via the ._ property
doc._.title = 'My document'
token._.is_color = True
span._.has_color = False
Registered on the global Doc, Token or Span using the set_extension method
# Import global classes
from spacy.tokens import Doc, Token, Span

# Set extensions on the Doc, Token and Span
Doc.set_extension('title', default=None)
Token.set_extension('is_color', default=False)
Span.set_extension('has_color', default=False)


Property extensions (1)
Define a getter and an optional setter function
Getter only called when you retrieve the attribute value
from spacy.tokens import Token

# Define getter function
def get_is_color(token):
    colors = ['red', 'yellow', 'blue']
    return token.text in colors

# Set extension on the Token with getter
Token.set_extension('is_color', getter=get_is_color)

doc = nlp("The sky is blue.")
print(doc[3]._.is_color, '-', doc[3].text)



Property extensions (2)
Span extensions should almost always use a getter
from spacy.tokens import Span

# Define getter function
def get_has_color(span):
    colors = ['red', 'yellow', 'blue']
    return any(token.text in colors for token in span)

# Set extension on the Span with getter
Span.set_extension('has_color', getter=get_has_color)

doc = nlp("The sky is blue.")
print(doc[1:4]._.has_color, '-', doc[1:4].text)
print(doc[0:2]._.has_color, '-', doc[0:2].text)


Method extensions
Assign a function that becomes available as an object method
Lets you pass arguments to the extension function
from spacy.tokens import Doc

# Define method with arguments
def has_token(doc, token_text):
    in_doc = token_text in [token.text for token in doc]
    return in_doc

# Set extension on the Doc with method
Doc.set_extension('has_token', method=has_token)

doc = nlp("The sky is blue.")
print(doc._.has_token('blue'), '- blue')
print(doc._.has_token('cloud'), '- cloud')




from spacy.lang.en import English
from spacy.tokens import Token

nlp = English()

# Define the getter function that takes a token and returns its reversed text
def get_reversed(token):
    return token.text[::-1]


# Register the Token property extension 'reversed' with the getter get_reversed
Token.set_extension('reversed', getter=get_reversed)

# Process the text and print the reversed attribute for each token
doc = nlp("All generalizations are false, including this one.")
for token in doc:
    print("reversed:", token._.reversed)


from spacy.lang.en import English
from spacy.tokens import Doc

nlp = English()

# Define the getter function
def get_has_number(doc):
    # Return if any of the tokens in the doc return True for token.like_num
    return any(token.like_num for token in doc)


# Register the Doc property extension 'has_number' with the getter get_has_number
Doc.set_extension('has_number', getter=get_has_number)

# Process the text and check the custom has_number attribute
doc = nlp("The museum closed for five years in 2012.")
print("has_number:", doc._.has_number)

from spacy.lang.en import English
from spacy.tokens import Span

nlp = English()

# Define the method
def to_html(span, tag):
    # Wrap the span text in a HTML tag and return it
    return "<{tag}>{text}</{tag}>".format(tag=tag, text=span.text)


# Register the Span property extension 'to_html' with the method to_html
Span.set_extension("to_html", method=to_html)

# Process the text and call the to_html method on the span with the tag name 'strong'
doc = nlp("Hello world, this is a sentence.")
span = doc[0:2]
print(span._.to_html("strong"))

import spacy
from spacy.tokens import Span

nlp = spacy.load("en_core_web_sm")


def get_wikipedia_url(span):
    # Get a Wikipedia URL if the span has one of the labels
    if span.label_ in ("PERSON", "ORG", "GPE", "LOCATION"):
        entity_text = span.text.replace(" ", "_")
        return "https://en.wikipedia.org/w/index.php?search=" + entity_text


# Set the Span extension wikipedia_url using get getter get_wikipedia_url
Span.set_extension("wikipedia_url", getter=get_wikipedia_url)

doc = nlp(
    "In over fifty years from his very first recordings right through to his "
    "last album, David Bowie was at the vanguard of contemporary culture."
)
for ent in doc.ents:
    # Print the text and Wikipedia URL of the entity
    print(ent.text, ent._.wikipedia_url)



import json
from spacy.lang.en import English
from spacy.tokens import Span
from spacy.matcher import PhraseMatcher

with open("exercises/countries.json") as f:
    COUNTRIES = json.loads(f.read())

with open("exercises/capitals.json") as f:
    CAPITALS = json.loads(f.read())

nlp = English()
matcher = PhraseMatcher(nlp.vocab)
matcher.add("COUNTRY", None, *list(nlp.pipe(COUNTRIES)))


def countries_component(doc):
    # Create an entity Span with the label 'GPE' for all matches
    matches = matcher(doc)
    doc.ents = [Span(doc, start, end, label="GPE") for match_id, start, end in matches]
    return doc


# Add the component to the pipeline
nlp.add_pipe(countries_component)
print(nlp.pipe_names)

# Getter that looks up the span text in the dictionary of country capitals
get_capital = lambda span: CAPITALS.get(span.text)

# Register the Span extension attribute 'capital' with the getter get_capital
Span.set_extension("capital", getter=get_capital)

# Process the text and print the entity text, label and capital attributes
doc = nlp("Czech Republic may help Slovakia protect its airspace")
print([(ent.text, ent.label_, ent._.capital) for ent in doc.ents])



import json
import spacy
​
nlp = spacy.load("en_core_web_sm")
​
with open("exercises/tweets.json") as f:
    TEXTS = json.loads(f.read())
​
# Process the texts and print the adjectives
for doc in nlp.pipe(TEXTS):
    print([token.text for token in doc if token.pos_ == "ADJ"])


import json
import spacy

nlp = spacy.load("en_core_web_sm")

with open("exercises/tweets.json") as f:
    TEXTS = json.loads(f.read())

# Process the texts and print the entities
docs = list(nlp.pipe(TEXTS))
entities = [doc.ents for doc in docs]
print(*entities)


from spacy.lang.en import English

nlp = English()

people = ["David Bowie", "Angela Merkel", "Lady Gaga"]

# Create a list of patterns for the PhraseMatcher
patterns = list(nlp.pipe(people))


import json
from spacy.lang.en import English
from spacy.tokens import Doc
​
with open("exercises/bookquotes.json") as f:
    DATA = json.loads(f.read())
​
nlp = English()
​
# Register the Doc extension 'author' (default None)
Doc.set_extension("author", default=None)
​
# Register the Doc extension 'book' (default None)
Doc.set_extension("book", default=None)
​
for doc, context in nlp.pipe(DATA, as_tuples=True):
    # Set the doc._.book and doc._.author attributes from the context
    doc._.book = context["book"]
    doc._.author = context["author"]
​
    # Print the text and custom attribute data
    print(doc.text, "\n", "— '{}' by {}".format(doc._.book, doc._.author), "\n")


import spacy

nlp = spacy.load("en_core_web_sm")
text = (
    "Chick-fil-A is an American fast food restaurant chain headquartered in "
    "the city of College Park, Georgia, specializing in chicken sandwiches."
)

# Only tokenize the text
doc = nlp.make_doc(text)
print([token.text for token in doc])

import spacy

nlp = spacy.load("en_core_web_sm")
text = (
    "Chick-fil-A is an American fast food restaurant chain headquartered in "
    "the city of College Park, Georgia, specializing in chicken sandwiches."
)

# Disable the tagger and parser
with nlp.disable_pipes("tagger", "parser"):
    # Process the text
    doc = nlp(text)
    # Print the entities in the doc
    print(doc.ents)

# How training works (1)
# 1. Initialize the model weights randomly with nlp.begin_training
# 2. Predict a few examples with the current weights by calling nlp.update
# 3. Compare prediction with true labels
# 4. Calculate how to change weights to improve predictions
# 5. Update weights slightly
# 6. Go back to 2.

# Example: Training the entity recognizer
# The entity recognizer tags words and phrases in context
# Each token can only be part of one entity
# Examples need to come with context
# ("iPhone X is coming", {'entities': [(0, 8, 'GADGET')]})
# Texts with no entities are also important
# ("I need a new phone! Any tips?", {'entities': []})
# Goal: teach the model to generalize

import json
from spacy.matcher import Matcher
from spacy.lang.en import English

with open("exercises/iphone.json") as f:
    TEXTS = json.loads(f.read())

nlp = English()
matcher = Matcher(nlp.vocab)

# Two tokens whose lowercase forms match 'iphone' and 'x'
pattern1 = [{"LOWER": "iphone"}, {"LOWER": "x"}]

# Token whose lowercase form matches 'iphone' and an optional digit
pattern2 = [{"LOWER": "iphone"}, {"IS_DIGIT": True, "OP": "?"}]

# Add patterns to the matcher
matcher.add("GADGET", None, pattern1, pattern2)


# creating training data...

import json
from spacy.matcher import Matcher
from spacy.lang.en import English

with open("exercises/iphone.json") as f:
    TEXTS = json.loads(f.read())

nlp = English()
matcher = Matcher(nlp.vocab)
pattern1 = [{"LOWER": "iphone"}, {"LOWER": "x"}]
pattern2 = [{"LOWER": "iphone"}, {"IS_DIGIT": True, "OP": "?"}]
matcher.add("GADGET", None, pattern1, pattern2)

TRAINING_DATA = []

# Create a Doc object for each text in TEXTS
for doc in nlp.pipe(TEXTS):
    # Match on the doc and create a list of matched spans
    spans = [doc[start:end] for match_id, start, end in matcher(doc)]
    # Get (start character, end character, label) tuples of matches
    entities = [(span.start_char, span.end_char, "GADGET") for span in spans]
    # Format the matches as a (doc.text, entities) tuple
    training_example = (doc.text, {"entities": entities})
    # Append the example to the training data
    TRAINING_DATA.append(training_example)

print(*TRAINING_DATA, sep="\n")

# The steps of a training loop
# 1. Loop for a number of times.
# 2. Shuffle the training data.
# 3. Divide the data into batches.
# 4. Update the model for each batch.
# 5. Save the updated model

Example loop
TRAINING_DATA = [
    ("How to preorder the iPhone X", {'entities': [(20, 28, 'GADGET')]})
    # And many more examples...
]
# Loop for 10 iterations
for i in range(10):
    # Shuffle the training data
    random.shuffle(TRAINING_DATA)
    # Create batches and iterate over them
    for batch in spacy.util.minibatch(TRAINING_DATA):
        # Split the batch in texts and annotations
        texts = [text for text, annotation in batch]
        annotations = [annotation for text, annotation in batch]
        # Update the model
        nlp.update(texts, annotations)

# Save the model
nlp.to_disk(path_to_model)

# Updating an existing model
# Improve the predictions on new data
# Especially useful to improve existing categories, like PERSON
# Also possible to add new categories
# Be careful and make sure the model doesn't "forget" the old ones

# spaCy lets you update an existing pre-trained model with more data – for example, to improve its predictions on different texts.
# This is especially useful if you want to improve categories the model already knows, like "person" or "organization".
# You can also update a model to add new categories.
# Just make sure to always update it with examples of the new category and examples of the other categories it previously predicted correctly. Otherwise improving the new category might hurt the other categories.


# Setting up a new pipeline from scratch...

# Start with blank English model
nlp = spacy.blank('en')
# Create blank entity recognizer and add it to the pipeline
ner = nlp.create_pipe('ner')
nlp.add_pipe(ner)
# Add a new label
ner.add_label('GADGET')

# Start the training
nlp.begin_training()
# Train for 10 iterations
for itn in range(10):
    random.shuffle(examples)
    # Divide examples into batches
    for batch in spacy.util.minibatch(examples, size=2):
        texts = [text for text, annotation in batch]
        annotations = [annotation for text, annotation in batch]
        # Update the model
        nlp.update(texts, annotations)


# BUILDING A TRAINING LOOP

# Let’s write a simple training loop from scratch!
#
# The pipeline you’ve created in the previous exercise is available as the nlp object. It already contains the entity recognizer with the added label 'GADGET'.
#
# The small set of labelled examples that you’ve created previously is available as TRAINING_DATA. To see the examples, you can print them in your script.
#
# Call nlp.begin_training, create a training loop for 10 iterations and shuffle the training data.
# Create batches of training data using spacy.util.minibatch and iterate over the batches.
# Convert the (text, annotations) tuples in the batch to lists of texts and annotations.
# For each batch, use nlp.update to update the model with the texts and annotations.

import spacy
import random
import json
​
with open("exercises/gadgets.json") as f:
    TRAINING_DATA = json.loads(f.read())
​
nlp = spacy.blank("en")
ner = nlp.create_pipe("ner")
nlp.add_pipe(ner)
ner.add_label("GADGET")
​
# Start the training
nlp.begin_training()
​
# Loop for 10 iterations
for itn in range(10):
    # Shuffle the training data
    random.shuffle(TRAINING_DATA)
    losses = {}
​
    # Batch the examples and iterate over them
    for batch in spacy.util.minibatch(TRAINING_DATA, size=2):
        texts = [text for text, entities in batch]
        annotations = [entities for text, entities in batch]
​
        # Update the model
        nlp.update(texts, annotations, losses=losses)
        print(losses)

# Problem 1: Models can "forget" things
# Existing model can overfit on new data
# e.g.: if you only update it with WEBSITE, it can "unlearn" what a PERSON is
# Also known as "catastrophic forgetting" problem

Solution 1: Mix in previously correct predictions
For example, if you're training WEBSITE, also include examples of PERSON
Run existing spaCy model over data and extract all other relevant entities
BAD:

TRAINING_DATA = [
    ('Reddit is a website', {'entities': [(0, 6, 'WEBSITE')]})
]
GOOD:

TRAINING_DATA = [
    ('Reddit is a website', {'entities': [(0, 6, 'WEBSITE')]}),
    ('Obama is a person', {'entities': [(0, 5, 'PERSON')]})
]


# Problem 2: Models can't learn everything
# spaCy's models make predictions based on local context
# Model can struggle to learn if decision is difficult to make based on context
# Label scheme needs to be consistent and not too specific
# For example: CLOTHING is better than ADULT_CLOTHING and CHILDRENS_CLOTHING

# Solution 2: Plan your label scheme carefully
# Pick categories that are reflected in local context
# More generic is better than too specific
# Use rules to go from generic labels to specific categories
# BAD:

LABELS = ['ADULT_SHOES', 'CHILDRENS_SHOES', 'BANDS_I_LIKE']
# GOOD:

LABELS = ['CLOTHING', 'BAND']

# Your new spaCy skills
# Extract linguistic features: part-of-speech tags, dependencies, named entities
# Work with pre-trained statistical models
# Find words and phrases using Matcher and PhraseMatcher match rules
# Best practices for working with data structures Doc, Token Span, Vocab, Lexeme
# Find semantic similarities using word vectors
# Write custom pipeline components with extension attributes
# Scale up your spaCy pipelines and make them fast
# Create training data for spaCy' statistical models
# Train and update spaCy's neural network models with new data

