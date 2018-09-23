const int pinSound = A0;

void setup(){
  Serial.begin(9600);

}

void loop(){
  int thresholdValue = analogRead(pinSound);
  if (sensorValue > thresholdValue){
    Serial.print(thresholdValue);
    Serial.println(thresholdValue);
  }
  delay(200);

}
