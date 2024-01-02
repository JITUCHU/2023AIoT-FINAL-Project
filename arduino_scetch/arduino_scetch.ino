#include <Wire.h>
#include "PCA9685.h"

// 세그먼트 핀 번호
#define A 1
#define B 2
#define C 3
#define D 4
#define E 5
#define F 6
#define G 7

// 컨베이어 벨트 모터 핀 번호
#define CB_MOTOR_1 9
#define CB_MOTOR_2 10

PCA9685 driver;
PCA9685_ServoEval pwmServo(102, 470); // (-90deg, +90deg)

const int AS_MOTOR_1 = 0; // 1번 모터
const int AS_MOTOR_2 = 1; // 2번 모터

// 세그먼트 출력 함수
void displaySegment(char ch) {
  switch (ch) {
    case '1':
      digitalWrite(B, LOW);
      digitalWrite(C, LOW);
      break;
    case '2':
      digitalWrite(A, LOW);
      digitalWrite(B, LOW);
      digitalWrite(G, LOW);
      digitalWrite(E, LOW);
      digitalWrite(D, LOW);
      break;
    case 'E':
      digitalWrite(A, LOW);
      digitalWrite(D, LOW);
      digitalWrite(E, LOW);
      digitalWrite(F, LOW);
      digitalWrite(G, LOW);
      break;
    default:
      break;
  }
}

// 세그먼트 초기화 함수
void clearSegment() {
  digitalWrite(A, HIGH);
  digitalWrite(B, HIGH);
  digitalWrite(C, HIGH);
  digitalWrite(D, HIGH);
  digitalWrite(E, HIGH);
  digitalWrite(F, HIGH);
  digitalWrite(G, HIGH);
}

// 물품 분류용 모터 동작 함수
void ASMotorAct(char ch) {
  switch (ch) {
    case '1':
      displaySegment(ch);
      delay(4000);
      driver.setChannelPWM(AS_MOTOR_1, pwmServo.pwmForAngle(70));
      delay(5000);
      driver.setChannelPWM(AS_MOTOR_1, pwmServo.pwmForAngle(0));
      break;
    case '2':
      displaySegment(ch);
      delay(9000);
      driver.setChannelPWM(AS_MOTOR_2, pwmServo.pwmForAngle(-70));
      delay(5000);
      driver.setChannelPWM(AS_MOTOR_2, pwmServo.pwmForAngle(0));
      break;
    case 'E':
      displaySegment(ch);
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
  pinMode(A, OUTPUT);
  pinMode(B, OUTPUT);
  pinMode(C, OUTPUT);
  pinMode(D, OUTPUT);
  pinMode(E, OUTPUT);
  pinMode(F, OUTPUT);
  pinMode(G, OUTPUT);
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
    clearSegment();
  }
}