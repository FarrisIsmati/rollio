"""
Description
"""

# DEPENDENCIES
from tensorflow import keras
from keras.preprocessing.text import Tokenizer

class DataTokenizer:
    def __init__(self, train_data):
        self.tokenizer = Tokenizer()
        self.train_data = train_data

        # Sets up tokenizer
        try:
            self.__init_tokenizer()
        except ModuleNotFoundError:
            raise

    # Clean data
    def __tweet_clean(self, text):
        lower = []
        text = text.replace('&amp;', 'and')

        for token in nlp(text):
            lower.append(token.text.lower())

        return lower
            
    # Orginize Tweet Data for tokenizer
    def __organize_tweet_data(self):
        tweet_sequences = []

        # Organize tweets & train data into arrays
        for tweet_data in self.train_data:
            tweet_sequences.append(self.__tweet_clean(tweet_data[0]))

        return tweet_sequences
    
    def __init_tokenizer(self):
        data = self.__organize_tweet_data()
        self.tokenizer.fit_on_texts(data)
        
    # Tokenization Methods
    def tokenize_tweets(self, data):
        self.tokenizer.fit_on_texts(data)

        return self.tokenizer.texts_to_sequences(data)
