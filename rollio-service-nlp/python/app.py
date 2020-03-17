from flask import Flask, request, jsonify, Response
import json
from parse import parse_tweet
app = Flask(__name__)

@app.route("/parse-location", methods=['POST'])
def extract_schema():
    try:
        payload = request.get_json()
        response = []

        if "text" in payload:
            parsed_entities = parse_tweet(payload.get("text"))
            for ent in parsed_entities:
                response.append({'text': ent.text, 'start': ent.start_char, 'end': ent.end_char, 'label': ent.label_});

        else:
            raise Exception( "Missing required field text")

        return Response(json.dumps(response), status=200, mimetype='application/json')
    except Exception as e:
        print(str(e))
        response = {"Status":"Failed", "Location":"Internal", "Cause": str(e)}
        return Response(json.dumps(response), status=400, mimetype='application/json')
