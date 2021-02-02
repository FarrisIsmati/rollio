"""
Class asserts predictions of both affirmation model and ner model, returns the results back in a prediction
"""

# DEPENDENCIES
import nlp.AffirmationModel
import nlp.NERModel

class AssertModel:
    def __init__(self):
        self.affirmationModel = AffirmationModel()
        self.nerModel = NERModel()

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

