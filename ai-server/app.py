from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from resemblyzer import preprocess_wav, VoiceEncoder
import numpy as np
import os
from pathlib import Path

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, Flask!'

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/voice/verify', methods=['GET'])
def verify_voice():
    # Check if the post request has the file part
    # if 'audio1' not in request.files or 'audio2' not in request.files:
    #     return jsonify({'error': 'Missing audio files'}), 400
    
    audio_file_path1 = request.args.get('path1')
    audio_file_path2 = request.args.get('path2')
    
    # audio_file_path1 = "path_to_audio_file_1.wav"
    # audio_file_path2 = "path_to_audio_file_2.wav"

    # Tiền xử lý các file âm thanh
    wav_fpath1 = Path(audio_file_path1)
    wav_fpath2 = Path(audio_file_path2)
    wav1 = preprocess_wav(wav_fpath1)
    wav2 = preprocess_wav(wav_fpath2)

    # Khởi tạo encoder và tạo embeddings
    encoder = VoiceEncoder()
    embed1 = encoder.embed_utterance(wav1)
    embed2 = encoder.embed_utterance(wav2)

    # Tính toán độ tương đồng (sử dụng cosine similarity)
    similarity = np.dot(embed1, embed2) / (np.linalg.norm(embed1) * np.linalg.norm(embed2))
    print(f"Độ tương đồng giữa hai đoạn âm thanh: {similarity}")

    # Quyết định xem hai giọng nói có phải của cùng một người hay không dựa trên ngưỡng đã chọn
    threshold = 0.8  # Ngưỡng này có thể thay đổi tùy vào ứng dụng
        
    result = "Có khả năng là cùng một người." if similarity > threshold else "Không phải là cùng một người."
    
    # Clean up uploaded files after processing
    # os.remove(filepath1)

    return jsonify({'similarity': similarity, 'result': result})

if __name__ == '__main__':
    app.run(debug=True)
