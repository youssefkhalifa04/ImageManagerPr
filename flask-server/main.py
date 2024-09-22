from flask import  send_file
from flask import Flask , jsonify ,request
import os
import io

from flask_cors import CORS
from rembg import remove
from PIL import Image
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})




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


def png_to_jpeg(input_path, output_path):
    image = Image.open(input_path)
    rgb_image = image.convert("RGB")
    rgb_image.save(output_path, format="JPEG")


def jpeg_to_png(input_path, output_path):
    image = Image.open(input_path)
    image.save(output_path, format="PNG")



def remove_background(image_data):
    try:

        image = Image.open(io.BytesIO(image_data))


        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_bytes = buffered.getvalue()


        output_bytes = remove(img_bytes)


        output_image = Image.open(io.BytesIO(output_bytes))


        return output_image
    except Exception as e:
        print(f"Error during background removal: {e}")
        return None







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






def png_to_jpeg(input_path, output_path):
    image = Image.open(input_path)
    rgb_image = image.convert("RGB")
    rgb_image.save(output_path, format="JPEG")


@app.route('/api/png-to-jpeg', methods=['POST'])
def convert_png_to_jpeg():
    try:
        # Read the image from the request
        file = request.files['file']  # The uploaded PNG file
        image = Image.open(file.stream)

        # Convert the image to RGB and save it to a byte stream as JPEG
        rgb_image = image.convert("RGB")
        buffered = io.BytesIO()
        rgb_image.save(buffered, format="JPEG")
        buffered.seek(0)

        # Send the converted JPEG back to the client
        return send_file(buffered, mimetype='image/jpeg', as_attachment=True, download_name='output.jpg')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080)





