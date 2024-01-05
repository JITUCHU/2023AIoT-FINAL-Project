import cv2 #pip install cv2
from ultralytics import YOLO 
import pyzbar.pyzbar as pyzbar
import serial #시리얼 통신을 위한 모듈
import serial.tools.list_ports #포트 순회를 위한 포트 참조
import threading #프로그램 실행시 스레드 생성을 위함 
import time
import pymysql
from flask import Flask, Response
from time import sleep
import imutils

#데이터베이스 접속문(읽은 데이터 저장을 위해)
conn = pymysql.connect(host='127.0.0.1', user='root', password='1234',db='smart_factory',use_unicode=True)
cur = conn.cursor()

app = Flask(__name__)

@app.route('/video_feed')
def video_feed():
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

def generate():
    while True:
        ret, frame = cap.read()  
        frame = imutils.resize(frame, width=400)
        if ret :
            results = model(frame, verbose=False)
            plots = results[0].plot()
            _, buffer = cv2.imencode('.jpg', frame) 
            frame = buffer.tobytes()  
            yield (b'--frame\r\n'
                    b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

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


#1초마다 재귀호출을 하는 스레드 생성
def send_1sec(): 
    t2 = threading.Timer(0.1,send_1sec) 
    t2.daemon=True
    t2.start()
    time.sleep(2.0)


# YOLO 모델 초기화
model = YOLO('C:/Users/202-24/runs/detect/train12/weights/best.pt')

ports=list(serial.tools.list_ports.comports())

cap = cv2.VideoCapture(0)



    
def main():
    count =0
    b_barcode_info = 0
    send_1sec()
    while cap.isOpened():
        
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
                            
                            
            # 화면에 이미지 출력
            cv2.imshow("YOLO Detection", plots)
            
            # 'esc' 키를 누르면 종료
            if cv2.waitKey(1) == 27:
                break
        else :
            print("카메라에서 프레임을 읽을 수 없습니다.")
            break


if __name__=="__main__": #메인 스레드일 경우에만 동작한다.
    ports=list(serial.tools.list_ports.comports())#usb포트에 있는 넘들 리스트로 가져와서 
    app.run(host="0.0.0.0", port="8002", debug=True)
    for p in ports:#wemos보드가 있으면 연결한다.
        if 'Uno' in p.description:
            print(f"{p} 포트에 연결하였습니다.")
            my_serial = serial.Serial(p.device, baudrate=9600, timeout=1.0)
            #time.sleep(2.0)
    
    t1=threading.Thread(target=serial_read_thread) #작업 단위 하나 추가
    t1.daemon=True  #데몬:메인 스레드가 종료될 때 함께 종료되는 스레드
    t1.start()

    
    main()
    my_serial.close()
    conn.commit()
    conn.close()
    cap.release()                                                   
    cv2.destroyAllWindows()
