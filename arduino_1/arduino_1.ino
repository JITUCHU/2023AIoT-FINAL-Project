#include <Wire.h>
#include "PCA9685.h"
#define MOTOR_A1 9
#define MOTOR_A2 10

PCA9685 driver;
PCA9685_ServoEval pwmServo(102, 470); // (-90deg, +90deg)

const int motor1 = 0; // 1번 모터
const int motor2 = 1; // 2번 모터

unsigned long previousMillis = 0; // 이전 시간 저장
const long interval = 2000; // 2초

void setup() {
  Wire.begin();                 // Wire must be started first
  Wire.setClock(400000);        // Supported baud rates are 100kHz, 400kHz, and 1000kHz
  driver.resetDevices();        // Software resets all PCA9685 devices on Wire line

  driver.init();         // Address pins A5-A0 set to B000000
  driver.setPWMFrequency(50);   // Set frequency to 50Hz

  Serial.begin(9600); // 시리얼 통신 시작
  pinMode(A0, INPUT);
  pinMode(MOTOR_A1, OUTPUT);
  pinMode(MOTOR_A2, OUTPUT);
}

void loop() {
  unsigned int vr = map(analogRead(A0), 0, 1023, 0, 511);
  if(vr < 256)
  {
    analogWrite(MOTOR_A1, 255-vr);
    analogWrite(MOTOR_A2, 0);
  }
  else{
    analogWrite(MOTOR_A1, 0);
    analogWrite(MOTOR_A2, vr-256);
  }
  delay(10);


  if (Serial.available() > 0) { // 시리얼 입력 확인
    int command = Serial.parseInt(); // 정수형 입력 받음

    if (command == 1) { // 입력값이 1인 경우 1번 모터를 30도 회전
      int angle = 30; // 30도 각도
      driver.setChannelPWM(motor1, pwmServo.pwmForAngle(angle));
      previousMillis = millis(); // 현재 시간 저장
    } else if (command == 2) { // 입력값이 2인 경우 2번 모터를 30도 회전
      int angle = -30; // -30도 각도
      driver.setChannelPWM(motor2, pwmServo.pwmForAngle(angle));
      previousMillis = millis(); // 현재 시간 저장
    }
  }

  // 지정된 시간이 지나면 모터를 0도로 돌려줌
  unsigned long currentMillis = millis(); // 현재 시간 저장
  if (currentMillis - previousMillis >= interval) {
    driver.setChannelPWM(motor1, pwmServo.pwmForAngle(0)); // 1번 모터 멈춤
    driver.setChannelPWM(motor2, pwmServo.pwmForAngle(0)); // 2번 모터 멈춤
  }
}
