from flask import Flask , jsonify
from numpy.f2py.crackfortran import appenddecl

app = Flask(__name__)
@app.route("/api/users", methods=['GET'])

def users():
    return jsonify(
        {
            'users': [
                "youssef",
                "wessim",
                "omar",
                "yessin"
            ]
        }
    )

if __name__ == "__main__":
    app.run(debug=True , port=8080)