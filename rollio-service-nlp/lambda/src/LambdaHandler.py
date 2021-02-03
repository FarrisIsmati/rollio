"""
Main handler function
"""

# DEPENDENCIES
from nlp.AssertModel import AssertModel

class LambdaHandler():
    def handle(self, event, context):
        try:
            assertTweet = AssertModel()
            responseBody = assertTweet.predict('Sorry we are not in chinatown') # Look up SQS message parameters event.body[0].tweet

            return {
                'status': 200,
                'body': responseBody
            }
        except:
            return {
                'status': 400,
                'body': {'error': 'Error with prediction handler'}      
            }

         # PUT ON LAMBDA
         # MAKE CALLS LOCALLY
         # GET IT ALL CONNECTED
         # CONFIGURE BACKUP REGEX STUFF
         # MAKE IMPROVEMENTS TO FRONT END
         # BUILD VENDOR SEED 
         # HOST
         # DONE :)
