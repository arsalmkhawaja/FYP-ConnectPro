from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import whisper
from transformers import pipeline
import os
import tempfile

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load models
model = whisper.load_model("base")
sentiment_analysis = pipeline(
    "sentiment-analysis",
    framework="pt",
    model="SamLowe/roberta-base-go_emotions"
)

def analyze_sentiment(text):
    results = sentiment_analysis(text)
    sentiment_results = {
        result['label']: result['score'] for result in results
    }
    return sentiment_results

def get_sentiment_emoji(sentiment):
    emoji_mapping = {
        "disappointment": "😞",
        "sadness": "😢",
        "annoyance": "😠",
        "neutral": "😐",
        "disapproval": "👎",
        "realization": "😮",
        "nervousness": "😬",
        "approval": "👍",
        "joy": "😄",
        "anger": "😡",
        "embarrassment": "😳",
        "caring": "🤗",
        "remorse": "😔",
        "disgust": "🤢",
        "grief": "😥",
        "confusion": "😕",
        "relief": "😌",
        "desire": "😍",
        "admiration": "😌",
        "optimism": "😊",
        "fear": "😨",
        "love": "❤️",
        "excitement": "🎉",
        "curiosity": "🤔",
        "amusement": "😄",
        "surprise": "😲",
        "gratitude": "🙏",
        "pride": "🦁"
    }
    return emoji_mapping.get(sentiment, "")

def display_sentiment_results(sentiment_results, option):
    sentiment_text = ""
    for sentiment, score in sentiment_results.items():
        emoji = get_sentiment_emoji(sentiment)
        if option == "Sentiment Only":
            sentiment_text += f"{sentiment} {emoji}\n"
        elif option == "Sentiment + Score":
            sentiment_text += f"{sentiment} {emoji}: {score}\n"
    return sentiment_text

@app.route('/inference', methods=['POST'])
def inference():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400

    audio_file = request.files['audio']
    sentiment_option = request.form.get('sentimentOption', 'Sentiment Only')

    # Create a temporary file to save the uploaded audio
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        audio_file.save(temp_file.name)
        temp_file_path = temp_file.name

    try:
        # Process the audio file
        audio = whisper.load_audio(temp_file_path)
        audio = whisper.pad_or_trim(audio)
        mel = whisper.log_mel_spectrogram(audio).to(model.device)
        _, probs = model.detect_language(mel)
        lang = max(probs, key=probs.get)
        options = whisper.DecodingOptions(fp16=False)
        result = whisper.decode(model, mel, options)

        sentiment_results = analyze_sentiment(result.text)
        sentiment_output = display_sentiment_results(sentiment_results, sentiment_option)

        return jsonify({
            'language': lang.upper(),
            'transcription': result.text,
            'sentiment': sentiment_output
        })
    finally:
        # Clean up the temporary file
        os.remove(temp_file_path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
