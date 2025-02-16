### Medical Supply Delivery Backend
This is the backend for the Medical Supply Delivery Robot project, built with Fastify + TypeScript. It handles real-time robot updates, task scheduling, and patient management.

### Features
- Real-time robot updates
- Task scheduling & Delivery Management
- Patient management
- User authentication

### Installation
1. Clone the repository
2. Navigate to the backend directory
3. Run `npm install`


### Configuration
The backend requires a `.env` file to run. The `.env` file should contain the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/msds
```

### Running the Server
To run the server, run the following command:
```
// Development
npm run dev

// Production
npm run build
npm run start
```

### API Documentation
**The Postman API documentation can be found [here](/backend/MSDS.postman_collection.json).**
