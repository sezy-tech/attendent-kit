from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename
import time
import face_recognition
import jwt
import logging
from dotenv import load_dotenv
from io import BytesIO

app = Flask(__name__)
handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
app.logger.addHandler(handler)
logging.basicConfig(level=logging.DEBUG)


# Initialize the JWT Manager
load_dotenv()
COOKIE_ACCESS_TOKEN_KEY = os.getenv("COOKIE_ACCESS_TOKEN_KEY")
JWT_AT_SECRET = os.getenv("JWT_AT_SECRET")
JWT_AT_EXPIRES_IN = os.getenv("JWT_AT_EXPIRES_IN")

# Directory to store the uploaded face images
UPLOAD_FOLDER = os.path.join(os.getcwd(), "faces")
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


def get_token_userid():
    token = request.cookies.get(COOKIE_ACCESS_TOKEN_KEY)
    if token:
        try:
            decoded_token = jwt.decode(token, JWT_AT_SECRET, algorithms=["HS256"])
            user_id = decoded_token.get("id")
            return user_id, None  # Return user_id and no error message
        except jwt.ExpiredSignatureError:
            return None, "Token has expired!"  # Return None and error message
        except jwt.InvalidTokenError:
            return None, "Invalid token!"  # Return None and error message
    return None, "No token provided!"  # Return None and error message if no token


@app.route("/status", methods=["GET"])
def status():
    print("====================addfaces")
    return jsonify({"message": "success"}), 401


@app.route("/face/addfaces2", methods=["POST"])
def save_face2():
    print("====================addfaces")
    # Get user_id from the token
    user_id, error_message = get_token_userid()
    if user_id:
        # Check if a file is part of the request
        if "file" not in request.files:
            return jsonify({"error": "File is undefined"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Define the upload path based on user_id
        upload_path = os.path.join(UPLOAD_FOLDER, user_id)

        # Ensure the directory exists
        os.makedirs(upload_path, exist_ok=True)

        # Generate a unique file name based on the current timestamp
        timestamp = int(time.time())
        file_extension = file.filename.split(".")[-1]
        unique_file_name = f"{timestamp}.{file_extension}"

        # Secure the filename and save the file
        file_path = os.path.join(upload_path, secure_filename(unique_file_name))

        try:
            known_image = face_recognition.load_image_file(file_path)
            known_face_encodings = face_recognition.face_encodings(known_image)
            if not known_face_encodings:
                app.logger.warning(f"No face found in file: {file_path}")
                return jsonify({"valid": "false"}), 400
        except Exception as e:
            return jsonify({"valid": "false"}), 400

        try:
            file.save(file_path)
        except Exception as e:
            print("Error saving file:", e)
            return jsonify({"error": "Failed to save file"}), 500

        return jsonify({"message": "File saved successfully", "file_path": file_path})

    # Return error message if token is invalid or not provided
    return jsonify({"message": error_message}), 401


@app.route("/face/verify2", methods=["POST"])
def verify_face2():
    app.logger.warning(f"================================verify_face")
    # user_id = '1'  # For testing with a specific user ID
    user_id, error_message = get_token_userid()
    if user_id:
        # Ensure the user's directory exists
        user_folder = os.path.join(UPLOAD_FOLDER, user_id)
        if not os.path.exists(user_folder):
            app.logger.warning(f"User folder not found: {user_folder}")
            return jsonify({"error": "No known faces found for the user"}), 400
        known_faces = []
        try:
            # Load known faces from files in the user's folder
            for filename in os.listdir(user_folder):
                file_path = os.path.join(user_folder, filename)
                try:
                    known_image = face_recognition.load_image_file(file_path)
                    known_face_encodings = face_recognition.face_encodings(known_image)
                    if known_face_encodings:
                        known_faces.append(known_face_encodings[0])
                    else:
                        app.logger.warning(f"No face found in file: {file_path}")
                except Exception as e:
                    app.logger.error(
                        f"Error processing file {file_path}: {e}", exc_info=True
                    )
                    continue

            if not known_faces:
                app.logger.warning(f"No valid faces found for user ID {user_id}")
                return (
                    jsonify({"error": "No valid known faces found for the user"}),
                    400,
                )

        except Exception as e:
            app.logger.error(
                f"Error loading known faces for user ID {user_id}: {e}", exc_info=True
            )
            return jsonify({"error": "Failed to load known faces"}), 500

        if "file" not in request.files:
            app.logger.warning("File not found in request")
            return jsonify({"error": "File is undefined"}), 400

        unknown_face_file = request.files["file"]
        unknown_face_path = os.path.join(user_folder, f"temp_{time.time()}.jpg")

        try:
            unknown_face_file.save(unknown_face_path)
            unknown_image = face_recognition.load_image_file(unknown_face_path)
            unknown_face_encodings = face_recognition.face_encodings(unknown_image)

            if not unknown_face_encodings:
                app.logger.warning("No face detected in the uploaded image")
                return jsonify({"error": "No face detected in the uploaded image"}), 400

            unknown_face_encoding = unknown_face_encodings[0]
            results = face_recognition.compare_faces(
                known_faces, unknown_face_encoding, tolerance=0.3
            )

            match_found = any(results)
            app.logger.info(f"Face comparison results: {results}")

            return jsonify({"match": match_found})

        except Exception as e:
            app.logger.error(f"Error verifying face: {e}", exc_info=True)
            return jsonify({"error": "Failed to verify face"}), 500

        finally:
            if os.path.exists(unknown_face_path):
                os.remove(unknown_face_path)
                app.logger.debug(f"Temporary file removed: {unknown_face_path}")

    return jsonify({"message": "error"}), 500

@app.route("/face/addfaces", methods=["POST"])
def save_face():
    print("====================addfacessss")
    # Get user_id from the token
    user_id, error_message = get_token_userid()
    if user_id:
        # Check if a file is part of the request
        if "file" not in request.files:
            return jsonify({"error": "File is undefined"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Define the upload path based on user_id
        upload_path = os.path.join(UPLOAD_FOLDER, user_id)

        # Ensure the directory exists
        os.makedirs(upload_path, exist_ok=True)

        # Generate a unique file name based on the current timestamp
        timestamp = int(time.time())
        file_extension = file.filename.split(".")[-1]
        unique_file_name = f"{timestamp}.{file_extension}"
        # try:
        #     # return jsonify({"valid": "false", "message": "No face found in the image."}), 400
            
        #     # Load the image file for face recognition
        #     known_image = face_recognition.load_image_file(file2)
        #     # Attempt to find face encodings in the image
        #     known_face_encodings = face_recognition.face_encodings(known_image)
        #     if not known_face_encodings:
        #         # No faces were found in the image
        #         return jsonify({"valid": "false", "message": "No face found in the image."}), 400
        # except Exception as e:
        #     return jsonify({"message": str(e)}), 400

        # file = request.files["file"]
        # Secure the filename and save the file
        file_path = os.path.join(upload_path, secure_filename(unique_file_name))

        try:
            # Save the file only if faces are found
            file.save(file_path)
        except Exception as e:
            print("Error saving file:", e)
            return jsonify({"error": "Failed to save file"}), 500

        return jsonify({"message": "File saved successfully", "file_path": file_path})

    # Return error message if token is invalid or not provided
    return jsonify({"message": error_message}), 401



@app.route("/face/verify", methods=["POST"])
def verify_face():
    app.logger.warning("================================verify_faces")

    user_id, error_message = get_token_userid()
    if not user_id:
        return jsonify({"error": "User ID not found"}), 500

    user_folder = os.path.join(UPLOAD_FOLDER, user_id)
    if not os.path.exists(user_folder):
        app.logger.warning(f"User folder not found: {user_folder}")
        return jsonify({"error": "No known faces found for the user"}), 400

    if "file" not in request.files:
        app.logger.warning("File not found in request")
        return jsonify({"error": "File is undefined"}), 400

    unknown_face_file = request.files["file"]
    return process_unknown_face(unknown_face_file, user_folder)


def process_unknown_face(unknown_face_file, user_folder):
    try:
        unknown_face_bytes = unknown_face_file.read()  # Đọc nội dung file vào bộ nhớ
        unknown_face_encoding = extract_face_encoding(unknown_face_bytes)
        if unknown_face_encoding is None:
            return jsonify({"error": "No face detected in the uploaded image"}), 400

        match_found = compare_each_face(user_folder, unknown_face_encoding)
        return jsonify({"match": match_found})
    except Exception as e:
        app.logger.error(f"Error verifying face: {e}", exc_info=True)
        return jsonify({"error": "Failed to verify face"}), 500


def compare_each_face(user_folder, unknown_face_encoding):
    try:
        for filename in os.listdir(user_folder):
            file_path = os.path.join(user_folder, filename)
            known_face_encoding = extract_face_encoding_from_path(file_path)
            if known_face_encoding is None:
                continue

            match_found = face_recognition.compare_faces(
                [known_face_encoding], unknown_face_encoding, tolerance=0.6
            )
            app.logger.info(f"Face {filename}: {match_found}")
            if match_found[0]:  # If a match is found, exit early
                print("===++++++++++++++++")
                print(filename)
                return True
        return False
    except Exception as e:
        app.logger.error(f"Error comparing faces: {e}", exc_info=True)
        return False


def extract_face_encoding(image_bytes):
    try:
        image = face_recognition.load_image_file(
            BytesIO(image_bytes)
        )  # Tải ảnh từ BytesIO
        face_encodings = face_recognition.face_encodings(image)
        if not face_encodings:
            return None
        return face_encodings[0]
    except Exception as e:
        app.logger.error(f"Error processing face encoding: {e}", exc_info=True)
        return None


def extract_face_encoding_from_path(file_path):
    try:
        image = face_recognition.load_image_file(file_path)
        face_encodings = face_recognition.face_encodings(image)
        if not face_encodings:
            return None
        return face_encodings[0]
    except Exception as e:
        app.logger.error(f"Error processing face encoding: {e}", exc_info=True)
        return None


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
