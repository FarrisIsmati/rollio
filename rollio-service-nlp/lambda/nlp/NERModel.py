"""
Class to predict models for Named Entity Recognition, expects the loaded NER model to have B-TRUCK_LOCATION as a custom NER pipe name
"""

class NERModel:
    def __init__(self, ner_model_path):
        try:
            self.nlp_ner = spacy.load(ner_model_path)
            
            # Check the classes have loaded back consistently
            # assert nlp.get_pipe("ner").move_names == move_names
            if self.nlp_ner.get_pipe('ner').move_names[0] != 'B-TRUCK_LOCATION':
                print('WARNING: NER Pipe doesn\'t have Truck Location')
        except ModuleNotFoundError:
            raise
            
    def predict(self, text):
        doc = self.nlp_ner(text)
        
        if doc.ents:
            return doc.ents
        else:
            return []