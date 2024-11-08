from flask import Flask, request, jsonify, send_file
from transformers import pipeline
from flask_cors import CORS
from gtts import gTTS
import os

app = Flask(__name__)
CORS(app)

# Use Helsinki-NLP models, which support a wide range of language pairs
translation_pipelines = {
    "de": pipeline("translation", model="Helsinki-NLP/opus-mt-en-de"),  # English to German
    "es": pipeline("translation", model="Helsinki-NLP/opus-mt-en-es")   # English to Spanish
}

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get("text")
    target_lang = data.get("lang", "de")  # Default to German if no language is specified

    # Use the specified translation pipeline
    translation_pipeline = translation_pipelines.get(target_lang, translation_pipelines["de"])
    translation = translation_pipeline(text)
    return jsonify(translation=translation[0]['translation_text'])

@app.route('/tts', methods=['POST'])
def tts():
    data = request.get_json()
    text = data.get("text")
    lang = data.get("lang", "de")  # Default to German for TTS
    tts = gTTS(text=text, lang=lang)
    tts.save("translation.mp3")
    return send_file("translation.mp3", as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
