# Groupomania Social Network
Groupomania is an internal social network for Groupomania's employees. The goal of this tool is to facilitate more interaction between colleagues. A file with the company's logos has been provided. As well as the user requirements specifications.
The design was free of choice. 
The backend has been developed using Express. The data is stored on a SQL Database. The frontend of the app was developed with Vue.js. 

## Getting Started

### Prerequisites
Make sure you have the following software installed on your machine:
- [Node.js](https://nodejs.org/) (v18.16.0)
- [MySQL](https://dev.mysql.com/downloads/) (v8.0.34)
- [Vue.js](https://vuejs.org/) (@vue/cli v5.0.8)

### Database Setup

1. Create a MySQL database for the project.
2. In the `backend` directory, create a `.env` file with the following content, replacing the values with your own:
   ```env
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

### Installation

#### Backend

1. Clone the repository.
2. Navigate to the `backend` directory.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the backend server.

#### Frontend

1. Clone the repository.
2. Navigate to the `frontend` directory.
3. Run `npm install` to install dependencies.
4. Run `npm run serve` to start the frontend app.

## Usage

- Access the backend at http://localhost:3000.
- Access the frontend at http://localhost:8080.

### Database Configuration

In the `backend/config/database.js` file, you can find the configuration for the MySQL connection. Make sure it matches your setup. If needed, update the file with your own database host, user, password, and name.

```javascript
const mysql2 = require('mysql2');

module.exports = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: 'utf8mb4',
});
```
