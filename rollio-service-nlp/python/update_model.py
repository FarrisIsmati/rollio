import spacy
import random

PATH = './tweet_model'
nlp = spacy.load(PATH)
TRAIN_DATA = []

#
# def train_spacy(data,iterations):
#     TRAIN_DATA = data
#     nlp = spacy.load(PATH)
#
#     # get names of other pipes to disable them during training
#     other_pipes = [pipe for pipe in nlp.pipe_names if pipe != 'ner']
#     with nlp.disable_pipes(*other_pipes):  # only train NER
#         optimizer = nlp.begin_training()
#         for itn in range(iterations):
#             print("Starting iteration " + str(itn))
#             random.shuffle(TRAIN_DATA)
#             losses = {}
#             for text, annotations in TRAIN_DATA:
#                 nlp.update(
#                     [text],  # batch of texts
#                     [annotations],  # batch of annotations
#                     drop=0.2,  # dropout - make it harder to memorise data
#                     sgd=optimizer,  # callable to update weights
#                     losses=losses)
#             print(losses)
#     return nlp


# train_spacy(TRAIN_DATA, 20)
nlp.to_disk(PATH)

#Test your text
test_text = input("Enter test tweet text to parse: ")
doc = nlp(test_text)
for ent in doc.ents:
    print(ent.text, ent.start_char, ent.end_char, ent.label_)
