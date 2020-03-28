import spacy
import random

PATH = './tweet_model'
nlp = spacy.load(PATH)
nlp.to_disk(PATH)

def parse_tweet(text):
    doc = nlp(text)
    return doc.ents
