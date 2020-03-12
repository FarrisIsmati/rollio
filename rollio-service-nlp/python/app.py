from flask import Flask, request, jsonify, Response
import json
app = Flask(__name__)

@app.route("/parse-location", methods=['POST'])
def extract_schema():
    try:
        payload = request.get_json()
        print("!!!", payload, "!!!")
        response = None

        if "text" in payload:
            print(payload.get("text"))
            response = "blah"

        else:
            raise Exception( "Missing required field text")

        return Response(json.dumps(response), status=200, mimetype='application/json')
    except Exception as e:
        print(str(e))
        response = {"Status":"Failed", "Location":"Internal", "Cause": str(e)}
        return Response(json.dumps(response), status=400, mimetype='application/json')
