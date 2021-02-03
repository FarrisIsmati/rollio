"""
Class sets up prediciton class for the affirmation of a tweet, whether a vendor is stating they will or will not be at a location
"""

# DEPENDENCIES
from nlp.DataTokenizer import DataTokenizer
from sklearn.preprocessing import MinMaxScaler
from numpy import load
import warnings  
# Ignore tensorflow warnings
with warnings.catch_warnings():  
    warnings.filterwarnings("ignore",category=FutureWarning)
    from tensorflow import keras
    from keras import backend as K

class AffirmationModel:
    def __init__(self, affirmation_model_path, scaler_data_path, train_data, max_len):
        self.max_len = max_len # Max Tweet Length

        try:
            self.scaler_data = self.__load_scaler_data(scaler_data_path)
        except:
            print('Error: Failed to load scaler data')

        # Sets up tokenizer
        try:
            # Setup Tokenizer
            self.DataTokenizer = DataTokenizer(train_data) # Time consuming step (Figure out how to optimize, pretokenized data loaded into lambda?)
            self.tokenizer = self.DataTokenizer.tokenizer
        except:
            print('Error: Failed to setup Data Tokenizer')

        try:
            K.clear_session() # Speeds up model loading?
            self.nlp_affirmation = keras.models.load_model(affirmation_model_path, compile=False)
        except:
            print('Error: Failed to load keras affirmation model')
            
    def predict(self,tweet):
        # Predict affirmation
        tokenized_tweets = self.DataTokenizer.tokenize_tweets([self.__tweet_lower(tweet)])
        predict_tweets = [self.__pad_array(data, self.max_len) for data in tokenized_tweets]
        scaled_test_data = self.__scale_test_data(predict_tweets)
        affirmation_prediction = self.nlp_affirmation.predict_classes(scaled_test_data)
        
        if affirmation_prediction[0] == 0:
            return True
        else:
            return False
    
    # Tweet lower
    def __tweet_lower(self, text):
        text = text.replace('&amp;', 'and')

        return text.lower()
        
    def __create_zeros_array(self, length):
        zeros_arr = []

        i = 0
        while i < length:
            zeros_arr.append(0)
            i += 1

        return zeros_arr

    def __pad_array(self,data, max_len):
        zeros_len = self.max_len - len(data)
        zeros_arr = self.__create_zeros_array(zeros_len)

        return [*data,*zeros_arr]
    
    def __load_scaler_data(self, directory):
        try:
            data = load(directory)
            
            return data
        except ModuleNotFoundError:
            raise
            
    def __scale_test_data(self, data):
        scaler_object = MinMaxScaler()
        scaler_object.fit(self.scaler_data)
        scale_data = scaler_object.transform(data)
        
        return scale_data