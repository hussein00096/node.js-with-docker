const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize, Model, DataTypes, INTEGER, STRING } = require('sequelize');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



const mysql = require('mysql2/promise');



const sequelize = new Sequelize('dd', 'root', 'root', {
  dialect: 'mysql',
  host: '172.20.0.3',
  port: 3306
},);

class User extends Model {}
User.init({
  
  name: {
      type: DataTypes.STRING(150),
      allowNull: false
  },
  email: {
      type: DataTypes.STRING(100),
      allowNull: false
  },
age:{
  type:DataTypes.STRING,
}}, { sequelize, modelName: 'user' });

const app = express();
const port = 9000;

app.use(cors());
app.use(bodyParser.json());

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'API for managing users'
    },
    servers: [
      {
        url: `http://localhost:${port}`
      }
    ]
  },
  apis: ['index.js']
};

// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define routes
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Failed to get users:', error);
    res.status(500).send('Failed to get users');
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
app.post('/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const user = await User.create({ name, email, age });
    res.json(user);
  } catch (error) {
    console.error('Failed to create user:', error);
    res.status(500).send('Failed to create user');
  }
});

// Define Swagger schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         age:
 *           type: integer
 *           description: The age of the user
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *         email:
 *           type: string
 *           description: The email address of the user
 *         age:
 *           type: integer
 *           description: The age of the user
*/

(async () => {

 await mysql.createConnection({
    host: "172.20.0.3",
    port: 3306,
    user: "root",
    password: "root",
}).then(connection => {
    connection.query(`CREATE DATABASE IF NOT EXISTS dd;`).then((res) => {
        console.info("Database create or successfully checked");
        // process.exit(0);
    }).catch("datacreate fild");
})
    await sequelize.sync().catch("errer with sequlize");
    console.log('Database synchronized');

    app.listen(3000, () => console.log('Server running at http://localhost:3000'));
  
    
  }
)();





