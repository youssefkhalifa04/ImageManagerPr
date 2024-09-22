from flask import Flask , jsonify ,request
from flask_cors import CORS
import os


import io
from rembg import remove
from PIL import Image


def find_images(directory):
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']
    found_images = []

    # Walk through the directory to find images
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.lower().endswith(ext) for ext in image_extensions):
                found_images.append(os.path.join(root, file))

    if len(found_images) == 0:
        return None
    elif len(found_images) == 1:
        return found_images[0]  # If only one image is found, return it
    else:
        return found_images  # If multiple images are found, return the list
def InputImage():
    InputPath = "./hello"  # Directory path where images are stored
    newPath = find_images(InputPath)  # Search for images
    print(newPath)
    # Handle case where no images are found
    if newPath is None:
        print("No image found in the directory.")
        return None

    # If one image is found, use it. If multiple, use the first one.
    if isinstance(newPath, str):
        InputPath = newPath
    else:
        InputPath = newPath[0]  # Use the first image if multiple are found

    image = Image.open(InputPath)
    return [image, InputPath]

def png_to_jpeg(input_path, output_path):
    image = Image.open(input_path)
    rgb_image = image.convert("RGB")  # Convert PNG to RGB before saving as JPEG
    rgb_image.save(output_path, format="JPEG")


# Function to convert JPEG to PNG
def jpeg_to_png(input_path, output_path):
    image = Image.open(input_path)
    image.save(output_path, format="PNG")



def remove_background(image_data):
    try:
        # Load the image from the byte stream
        image = Image.open(io.BytesIO(image_data))

        # Convert the image to bytes for background removal
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_bytes = buffered.getvalue()

        # Remove the background
        output_bytes = remove(img_bytes)

        # Convert the result back into an image object
        output_image = Image.open(io.BytesIO(output_bytes))


        return output_image
    except Exception as e:
        print(f"Error during background removal: {e}")
        return None
app = Flask(__name__)
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os
import io
from rembg import remove
from PIL import Image

app = Flask(__name__)
cors = CORS(app, origins='*')


def find_images(directory):
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']
    found_images = []
    for root, _, files in os.walk(directory):
        for file in files:
            if any(file.lower().endswith(ext) for ext in image_extensions):
                found_images.append(os.path.join(root, file))

    if len(found_images) == 0:
        return None
    elif len(found_images) == 1:
        return found_images[0]
    else:
        return found_images





@app.route("/api/remove-background", methods=['POST'])

def remove_background_endpoint():
    try:
        # Load the image from the request
        file = request.files['file']
        image_data = file.read()  # Read the file as bytes

        # Remove background
        output_image = remove_background(image_data)  # Call your function

        # Save the processed image to a byte stream
        buffered = io.BytesIO()
        output_image.save(buffered, format="PNG")
        buffered.seek(0)  # Move to the beginning of the stream

        return send_file(buffered, mimetype='image/png', as_attachment=True, download_name='output.png')
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8080)

cors = CORS(app , origins='*')









