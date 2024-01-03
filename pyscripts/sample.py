from flask import Flask, Response
from time import sleep
import cv2
import imutils

app = Flask(__name__)
capture = cv2.VideoCapture(0)  
sleep(2.0)

def generate():
    while True:
        ret, frame = capture.read()  
        frame = imutils.resize(frame, width=400)
        if ret :
            _, buffer = cv2.imencode('.jpg', frame) 
            frame = buffer.tobytes()  
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port="8002", debug=True)