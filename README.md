### MSDS
Medical Supply Delivery System (MSDS) is a system that allows users to schedule the transport of medical supplies within hospitals grounds. The system is designed to be used by medical professionals. The system allows users to log in, schedule deliveries, manually control the movement of the delivery robot, manage patient information, and view the status of their deliveries. The system also allows users to view the status of their deliveries and track the location of their deliveries in real-time. 

### Software Components
    * Frontend: [NextJS](https://nextjs.org/)
    * Backend: [NodeJS](https://nodejs.org/en/), [Fastify](https://www.fastify.io/), [TypeScript](https://www.typescriptlang.org/) 
    * Database: [MongoDB](https://www.mongodb.com/)
    * Hosting: [Vercel](https://vercel.com/),  [Render](https://render.com/)

### Hardware Components
    * Single Board Computer: Raspberry Pi 4 Model B (4GB RAM, 32GB SD Card)
    * Microcontroller: Mega 2560 R3, ESP32 CP2102 (38 Pin)
    * Sensors and Perception: Slamtec RP Lidar C1, MPU6050 (IMU), iBeacon Bluetooth nRF51822 module (BLE beacon), RFID Module RC522 
    * Motion and Navigation: 97mm Mecanum Wheels, JGB37-520 Hall Encoder Miniature DC Geared Motor (12V, 178 RPM)
    * Motor Control: 2x L298N Motor Driver
    * User Interface and Display: 1x4 Keypad, 0.96" OLED Display (128x64, I2C)
    * Power: 3S2P (12V) Li-Ion battery pack, 3S 20A BMS (Battery Management System)
    * Chassis: 3 Layer Acrylic Chassis (300mm x 400mm), Plywood between each Acrylic, 3D Printed Standoffs, Foam Board for side panels.

### API Documentation
The API documentation can be found [here](./backend/README.md).

### Installation
1. Clone the repository
2. Navigate to the backend directory
3. Run `npm install`
4. Run the server
6. Follow the instructions in the frontend README.md

### Authors
[Precious Michael](https://eyiza.github.io/precious-michael/)
