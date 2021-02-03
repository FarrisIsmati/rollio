"""
Class asserts predictions of both affirmation model and ner model, returns the results back in a prediction
"""

# DEPENDENCIES
from nlp.AffirmationModel import AffirmationModel
from data.tweet_ner_data_label import train_data
from nlp.NERModel import NERModel
from pathlib import Path

class AssertModel:
    def __init__(self):
        # Set paths to model and scalar data, MAX LENGTH CURRENTLY AT 35, get it from train data
        scaler_data_path = str(Path(__file__).resolve().parents[1]) + '/model/tweet_affirmation_model/scaler_data.npy'
        affirmation_model_path = str(Path(__file__).resolve().parents[1]) + '/model/tweet_affirmation_model/test'
        ner_model_path = str(Path(__file__).resolve().parents[1]) + '/model/tweet_ner_model'

        self.affirmationModel = AffirmationModel(affirmation_model_path,scaler_data_path, train_data, 35)
        self.nerModel = NERModel(ner_model_path)

    def predict(self, tweet):
        affirmation = self.affirmationModel.predict(tweet)
        named_entities = self.nerModel.predict(tweet)
 
        location_types = {
            'TRUCK_LOCATION': [],
            'FAC': [],
            'GPE': [],
            'LOC': [],
        }
        
        for ent in named_entities:
            if ent.label_ in location_types:
                location_types[ent.label_].append(ent.text)
        
        result = {
            'tweet': tweet,
            'affirmation': affirmation,
            'locations': location_types
        }
        
        return result
