"""
Description
"""

# DEPENDENCIES
import sys
sys.path.append('../data')
import AssertModel from AssertModel

class LambdaHandler():
    def __init__(self):
        pass

    def handle(self, event, context):
        assertion = AssertModel()
        responseBody = assertion(event.body[0].tweet) # Look up SQS message parameters
        
        # If successful response
        if True:
            return {
                'status': 200,
                'body': responseBody
            }

        # If failed response
        if False:
            return {
                'status': 400,
                'body': responseBody      
            }
         


         # FINISH THE NER MODEL
         # THEN THE REST
         # THEN TEST LOCALLY
         # PUT ON LAMBDA
         # MAKE CALLS LOCALLY
         # GET IT ALL CONNECTED
         # CONFIGURE BACKUP REGEX STUFF
         # MAKE IMPROVEMENTS TO FRONT END
         # BUILD VENDOR SEED 
         # HOST
         # DONE :)