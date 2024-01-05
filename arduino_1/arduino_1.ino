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

// 셋업
void setup() {
  Serial.begin(9600); // 시리얼 통신 시작
  pinMode(A, OUTPUT);
  pinMode(B, OUTPUT);
  pinMode(C, OUTPUT);
  pinMode(D, OUTPUT);
  pinMode(E, OUTPUT);
  pinMode(F, OUTPUT);
  pinMode(G, OUTPUT);
}

// 루프
void loop() {
  displaySegment('1');
  delay(2000);
  clearSegment();
  displaySegment('2');
  delay(2000);
  clearSegment();
  displaySegment('E');
  delay(2000);
  clearSegment();
}