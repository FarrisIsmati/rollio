"""
Description
"""

class NERModel:
    def __init__(self, ner_model_path):
        try:
            self.nlp_ner = spacy.load(ner_model_path)
        except ModuleNotFoundError:
            raise
            
    def predict(self, text):
        # Check the classes have loaded back consistently
        # assert nlp.get_pipe("ner").move_names == move_names
        if self.nlp_ner.get_pipe('ner').move_names[0] != 'B-TRUCK_LOCATION':
            print('NER Pipe doesn\'t have Truck Location')
            return
        
        doc = self.nlp_ner(text)
        
        if doc.ents:
            return doc.ents
        else:
            return []