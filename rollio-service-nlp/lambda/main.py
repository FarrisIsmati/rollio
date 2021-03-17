'''
Init lambda function main method
'''
__author__ = 'Farris Ismati'

# DEPENDENCIES
from nlp.AssertModel import AssertModel

def handler(event, context):
    try:
        assertTweet = AssertModel()
        responseBody = assertTweet.predict(event['Body'])
        print('Response')
        print(responseBody)
        
        return {
            'status': 200,
            'body': responseBody
        }
    except Exception as e:
        print(e)
        return {
            'status': 400,
            'body': {'error': 'Error with prediction handler'}      
        }