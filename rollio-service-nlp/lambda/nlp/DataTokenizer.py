"""
Class takes in full training set, cleans it up, and tokenizes it to run NLP Neural Networks
"""

# DEPENDENCIES
import spacy
import warnings
import numpy as np
from pathlib import Path

# Ignore tensorflow warnings
with warnings.catch_warnings():  
    warnings.filterwarnings("ignore",category=FutureWarning)
    from tensorflow import keras
    from keras.preprocessing.text import Tokenizer

class DataTokenizer:
    def __init__(self, train_data):
        self.nlp = spacy.load('en_core_web_md', disable=['parser', 'tagger'])
        self.tokenizer = Tokenizer()
        self.train_data = train_data

        # Sets up tokenizer
        try:
            self.__init_tokenizer()
        except Exception as e:
            print('Error: Failed to setup tokenizer on data')
            print(e)
            raise

    # Clean data
    def __tweet_clean(self, text):
        lower = []
        text = text.replace('&amp;', 'and')

        for token in self.nlp(text):
            lower.append(token.text.lower())

        return lower
            
    # Organize Tweet Data for tokenizer
    def __organize_tweet_data(self):
        tweet_sequences = []

        # Organize tweets & train data into arrays
        for tweet_data in self.train_data:
            tweet_sequences.append(self.__tweet_clean(tweet_data[0]))

        return tweet_sequences
    
    def __init_tokenizer(self):
        path = Path(__file__).parent.parent / 'model/tweet_affirmation_model/organized_tweet_data.npy'
        data = np.load(path, None, True)
        self.tokenizer.fit_on_texts(data)
        
    # Tokenization Methods
    def tokenize_tweets(self, data):
        self.tokenizer.fit_on_texts(data)

        return self.tokenizer.texts_to_sequences(data)
