'''
Init lambda function main method
'''
__author__ = 'Farris Ismati'

# DEPENDENCIES
from src.LambdaHandler import LambdaHandler

def handler(event, context):
    hdl = LambdaHandler()
    print(hdl.handle(event, context))

handler(1,2)
