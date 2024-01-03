from flask import Flask, Response
import time
import cv2
import imutils

# 추가
from ultralytics import YOLO 
import pyzbar.pyzbar as pyzbar
import serial #시리얼 통신을 위한 모듈
import serial.tools.list_ports #포트 순회를 위한 포트 참조
import threading #프로그램 실행시 스레드 생성을 위함 
import pymysql


#데이터베이스 접속문(읽은 데이터 저장을 위해)
conn = pymysql.connect(host='127.0.0.1', user='root', password='1234',db='smart_factory',use_unicode=True)
cur = conn.cursor()

my_serial = None
app = Flask(__name__)
time.sleep(2.0)


#물품 타입에 따라 섹션 분류후 데이터 베이스 저장 
def save2sql(type,key):
    section= 0
    now =time.strftime('%c', time.localtime(time.time()))
    if type == "digital" or type == "books":
        section = 1
    elif type == "clothes" or type == "food":
        section = 2
    else :
        return 0
    return (f"INSERT INTO status VALUES ('{section}','{now}','1','{type} {key}')")
        
def serial_send(type):
    print(type)
    section = "\n"
    if type == "digital" or type == "books":
        section = "1\n"
    elif type == "clothes" or type == "food":
        section = "2\n"
    else :
        section = 'E\n'
    return section


def serial_read_thread(): #명령어에 대한 회신을 받아서 디코딩
    global serial_receive_data
    while True :
        read_data=my_serial.readline()
        if read_data :
            serial_receive_data=read_data.decode()
            print("read_data :", serial_receive_data)


serial_receive_data = ""

def generate():
    count =0
    b_barcode_info = 0
    while True:
        
        ret, frame = cap.read()
        if ret:
            # YOLO를 통해 물체 감지
            results = model(frame, verbose=False)
            plots = results[0].plot()
            boxes = results[0].boxes
            
            # BGR을 RGB로 변환
            rgb_image = cv2.cvtColor(plots, cv2.COLOR_BGR2RGB)
            if boxes:
                # 바코드 찾기
                barcodes = pyzbar.decode(rgb_image)
                
                if barcodes:
                    for barcode in barcodes:
                        x, y, w, h = barcode.rect
                        barcode_info = barcode.data.decode()
                        # print("바코드 정보:", barcode_info)
                        if barcode_info and (barcode_info!=b_barcode_info):
                            cv2.imwrite(f"C:/Users/202-24/data/barcode{count}.png", rgb_image)
                            type,key=barcode_info.split(" ")
                            my_serial.write(serial_send(type).encode()) # 아두이노로 전송
                            cur.execute(save2sql(type,key)) # sql에 넣기 
                            count += 1
                            b_barcode_info = barcode_info
                            
           
            _, buffer = cv2.imencode('.jpg', plots) 
            frame = buffer.tobytes()                   
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    # YOLO 모델 초기화
    model = YOLO('C:/Users/202-24/runs/detect/train12/weights/best.pt')
    cap = cv2.VideoCapture(0)

    for p in list(serial.tools.list_ports.comports()):
        if 'Uno' in p.description:
            if not my_serial : 
                print(f"{p} 포트에 연결하였습니다.")
                my_serial = serial.Serial(p.device, baudrate=9600, timeout=1.0)
                time.sleep(2.0)
                print("Good")

                t1=threading.Thread(target=serial_read_thread) #작업 단위 하나 추가
                t1.daemon=True  #데몬:메인 스레드가 종료될 때 함께 종료되는 스레드
                t1.start()

    try :
        app.run(host="0.0.0.0", port="8002", debug=False)
    except KeyboardInterrupt :
        my_serial.close()
        conn.commit()
        conn.close()
        cap.release()              
