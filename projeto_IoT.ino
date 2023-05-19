
#include <Servo.h>
#include <Stepper.h>
//Definir Pinos dos sensores
//Movement Sensor
#define trigPin 2
#define echoPin 3

//Flame
const int flame_digitalPin = 3; // KY-026 digital interface
const int flame_analogPin = 2; // KY-026 analog interface
int flame_digitalVal; // digital readings
int flame_analogVal; //analog readings

//Servo Motor
const int servo_steps = 2038;
Stepper stepper = Stepper(servo_steps, 7,4,6,3);


//Photoresistor
const int photo_pin = 2;
int photo_value;

//Buzzer
const int buzzer_Pin = 7;

// Definir variables globais :
long duration;
int distance;
bool activationMS,activationFS,activationSM, activationPH, activationBZ;
void setup() {
  // Define inputs and outputs:
  //Movement
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  //Flame
  pinMode(flame_digitalPin, INPUT);
  //Servo Motor
  //Active Buzzer
  pinMode (buzzer_Pin, OUTPUT);
  //Begin Serial communication at a baudrate of 9600:
  Serial.begin(9600);
}
void loop() {
  //Movement Sensor
  activationMS = false;
  movementSensor(activationMS);
  //Flame Sensor
  activationFS = false;
  flameSensor(activationFS);
  //ServoMotor
  activationSM = true;
  servoMotor(activationSM);
  //Photoresistor
  activationPH = false;
  photoResistor(activationPH);
  //Active Buzzer
  activationBZ = false;
  activeBuzzer(activationBZ);
}

//Ta Feito
void movementSensor(bool active){
  if(active == true){
    // Clear the trigPin by setting it LOW:
    digitalWrite(trigPin, LOW);
    delayMicroseconds(5);
    // Trigger the sensor by setting the trigPin high for 10 microseconds:
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    // Read the echoPin, pulseIn() returns the duration (length of the pulse) in microseconds:
    duration = pulseIn(echoPin, HIGH);
    // Calculate the distance:
    distance = duration * 0.034 / 2;
    // Print the distance on the Serial Monitor (Ctrl+Shift+M):
    Serial.print("Distance = ");
    Serial.print(distance);
    Serial.println(" cm");
    delay(50);
  }
}

void flameSensor(bool active){
  //Valores estão ao contrário deve -- Testar novamente
  //reduzir conforme mais perto esteja a chama perto do sensor
  if(active == true){
    // Read the digital interface
    flame_digitalVal = digitalRead(flame_digitalPin);

    // Read the analog interface
    flame_analogVal = analogRead(flame_analogPin); 
    Serial.println(flame_analogVal); // print analog value to serial
    delay(100);
  }
}

//Testar
//valores altos para claridade, baixos para escuridão
void photoResistor(bool active){
  if(active == true){
    photo_value = analogRead(photo_pin);
    Serial.println(photo_value, DEC);
  }
}

//Testar
void servoMotor(bool active){
  if(active == true){
    // Rotate CW slowly at 5 RPM
    stepper.setSpeed(5);
    stepper.step(servo_steps);
    delay(1000);
    
    // Rotate CCW quickly at 10 RPM
    stepper.setSpeed(10);
    stepper.step(-servo_steps);
    delay(1000);
  }
}

//Testar
void activeBuzzer(bool active){
   if(active == true){
    digitalWrite (buzzer_Pin, HIGH);
    delay (500);
    digitalWrite (buzzer_Pin, LOW);
    delay (500);
  }
}