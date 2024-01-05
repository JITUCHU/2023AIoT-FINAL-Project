#include <Wire.h>
#include "PCA9685.h"

// 컨베이어 벨트 모터 핀 번호
#define CB_MOTOR_1 9
#define CB_MOTOR_2 10

PCA9685 driver;
PCA9685_ServoEval pwmServo(102, 470); // (-90deg, +90deg)

const int AS_MOTOR_1 = 0; // 1번 모터
const int AS_MOTOR_2 = 1; // 2번 모터

// 물품 분류용 모터 동작 함수
void ASMotorAct(char ch) {
  switch (ch) {
    case '1':
      delay(4000);
      driver.setChannelPWM(AS_MOTOR_1, pwmServo.pwmForAngle(70));
      delay(5000);
      driver.setChannelPWM(AS_MOTOR_1, pwmServo.pwmForAngle(0));
      break;
    case '2':
      delay(9000);
      driver.setChannelPWM(AS_MOTOR_2, pwmServo.pwmForAngle(-70));
      delay(5000);
      driver.setChannelPWM(AS_MOTOR_2, pwmServo.pwmForAngle(0));
      break;
    case 'E':
      break;
    default:
      break;
  }
}

// 셋업
void setup() {
  Wire.begin();                 // Wire must be started first
  Wire.setClock(400000);        // Supported baud rates are 100kHz, 400kHz, and 1000kHz
  driver.resetDevices();        // Software resets all PCA9685 devices on Wire line

  driver.init();         // Address pins A5-A0 set to B000000
  driver.setPWMFrequency(50);   // Set frequency to 50Hz

  Serial.begin(9600); // 시리얼 통신 시작
  pinMode(CB_MOTOR_1, OUTPUT);
  pinMode(CB_MOTOR_2, OUTPUT);

  driver.setChannelPWM(AS_MOTOR_1, pwmServo.pwmForAngle(0));
  driver.setChannelPWM(AS_MOTOR_2, pwmServo.pwmForAngle(0));
}

// 루프
void loop() {

  unsigned int vr = map(analogRead(A0), 0, 1023, 0, 511);

  if(vr < 256)
  {
    analogWrite(CB_MOTOR_1, 255-vr);
    analogWrite(CB_MOTOR_2, 0);
  }
  else{
    analogWrite(CB_MOTOR_1, 0);
    analogWrite(CB_MOTOR_2, vr-256);
  }
  delay(10);

  if(Serial.available() > 0){
    // char chRead = Serial.read();
    String strRead = Serial.readStringUntil('\n');
    char chRead = strRead.charAt(0);
    Serial.println(chRead);

    ASMotorAct(chRead);
    delay(2000);
  }
}