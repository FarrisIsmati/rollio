__author__ = 'Farris Ismati'
from src.LambdaHandler import LambdaHandler

def handler(event, context):
    hdl = LambdaHandler()
    return hdl.handle(event, context)