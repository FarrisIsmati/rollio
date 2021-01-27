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
        responseBody = assertion(event.tweet)
        
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
         