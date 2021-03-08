"""
Class to predict models for Named Entity Recognition, expects the loaded NER model to have B-TRUCK_LOCATION as a custom NER pipe name
"""
# DEPENDENCIES
import spacy

class NERModel:
    def __init__(self, ner_model_path):
        try:
            self.nlp_ner = spacy.load(ner_model_path)
            
            # Check the classes have loaded back consistently
            # assert nlp.get_pipe("ner").move_names == move_names
            pipe_found = False
            for pipe in self.nlp_ner.get_pipe('ner').move_names:
                if pipe == 'B-TRUCK_LOCATION':
                    pipe_found = True
                    break
                    
            if pipe_found == False:
                print('NER Pipe doesn\'t have Truck Location')

        except Exception as e:
            print('Error: Failed to load NER Model')
            print(e)
            raise
            
    def predict(self, text):
        doc = self.nlp_ner(text)
        
        if doc.ents:
            return doc.ents
        else:
            return []