import boto3
from io import BytesIO
from sklearn.externals import joblib

def get_model():
    bucket = boto3.resource("s3").Bucket("pydata-bucket-farris")
    with BytesIO() as modelfo:
        bucket.download_fileobj(Key="model/model.pkl", Fileobj=modelfo)
        model = joblib.load(modelfo)
    return model

def predict(event):
    body = event["Body"]
    model = get_model()
    result = model.predict([body])
    return result.tolist()[0]

def lambda_handler(event, context):
    result = predict(event)
    return {"statusCode": 200,
            "body": result}
