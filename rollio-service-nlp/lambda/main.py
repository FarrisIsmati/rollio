'''
Init lambda function main method
'''
__author__ = 'Farris Ismati'

# DEPENDENCIES
from src.LambdaHandler import LambdaHandler

def handler(event, context):
    hdl = LambdaHandler()
    return hdl.handle(event, context)