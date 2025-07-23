from flask import Flask, request, jsonify
import whisper
import os
import tempfile
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:3001"])

model = whisper.load_model("base")

@app.route("/transcribe", methods=["POST"])
def transcribe_audio():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio uploaded"}), 400

    audio_file = request.files["audio"]

    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp:
        audio_file.save(temp.name)
        result = model.transcribe(temp.name, language="en")
        os.unlink(temp.name)

    text = result.get("text", "").strip()

    return jsonify({
        "text": text
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)