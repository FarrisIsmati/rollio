"""
Main handler function
"""

# DEPENDENCIES
from nlp.AssertModel import AssertModel

class LambdaHandler():
    def handle(self, event, context):
        print(event)
        try:
            assertTweet = AssertModel()
            responseBody = assertTweet.predict('Today we are in chinatown') # Look up SQS message parameters event.body[0].tweet

            return {
                'status': 200,
                'body': responseBody
            }
        except:
            return {
                'status': 400,
                'body': {'error': 'Error with prediction handler'}      
            }