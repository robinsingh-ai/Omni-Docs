#!/bin/bash

# Check if a project name is provided as an argument
if [ -z "$1" ]; then
  echo "Please provide a project name as an argument."
  exit 1
fi

if [ -d "$1" ]; then
  echo "Directory $1 already exists."
    while true; do
        read -p "Do you want to overwrite it? (y/n) " yn
        case $yn in
        [Yy]* ) break;;
        [Nn]* ) exit;;
        * ) echo "Please answer yes or no.";;
        esac
    done
fi

# Create project directory and navigate into it
mkdir "$1"
cd "$1" || exit

# Initialize a Node.js project
npm init -y

# Install required dependencies
npm install --save-dev typescript ts-node
npx tsc --init
npm install express
npm install --save-dev @types/node @types/express
npm install --save-dev nodemon typescript
npm install express body-parser
npm i --save-dev @types/pg
npm install dotenv
npm install pg

# For Authentication
npm install --save-dev @types/bcrypt
npm install --save-dev @types/jsonwebtoken

# Test Setup
npm install --save-dev jest typescript ts-jest @types/jest
npm install --save-dev @types/supertest

echo "Setting up folders"

# Initialize git
git init

mkdir src
mkdir src/controllers
mkdir src/middleware
mkdir src/models
mkdir src/services
mkdir src/routes
mkdir src/database
mkdir src/utils

echo "Creating necessary files..."

touch src/controllers/requestController.ts
touch src/middleware/authMiddleware.ts
touch src/models/requestModel.ts
touch src/routes/requestRoutes.ts
touch src/services/requestService.ts
touch src/database/dbConfig.ts
touch src/utils/threadWorker.ts

# Create server.ts file
touch src/server.ts

# Create meta files
touch .gitignore
touch .env
touch Readme.md

echo "setting up typescript configuration"

echo "{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}" > tsconfig.json

# Write content to .gitignore
echo "node_modules/
.env
dist/
" > .gitignore

echo "Adding a env file for your secrets"

echo "PORT=8080
# Database connection
DB_HOST=localhost
DB_PORT=5432
DB_USER=username
DB_PASSWORD=postgres
DB_NAME=$1 
USER_SERVICE_BASE_URL=http://localhost:3000
BOOKS_SERVICE_BASE_URL=http://localhost:3001
CHECKOUT_SERVICE_BASE_URL=http://localhost:3002
REQUEST_SERVICE_BASE_URL=http://localhost:3003
LIBRARIAN_SERVICE_BASE_URL=http://localhost:3004
NOTIFICATION_SERVICE_BASE_URL=http://localhost:3005
" > .env

echo "setting up your server file"

echo "// src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import requestRoutes from './routes/requestRoutes';
import dotenv from 'dotenv';
import pool from './database/dbConfig';
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(bodyParser.json());
// Middleware to parse JSON requests
app.use(express.json());
// Mount the checkout routes
app.use('/api/requests', requestRoutes);
/*
* Uncomment the following code to test the connection to the database
pool
    .connect()
    .then(() => {
        console.log('service Connected to the database');
    })
    .catch((error: any) => {
        console.error('Unable to connect to the database:', error);
    });
*/
app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
" > src/server.ts

echo "
// db.ts
import { Pool } from 'pg';
const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT) || 5432;
const database = process.env.DB_NAME || 'checkout_service';
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const pool = new Pool({
    host,
    port,
    database,
    user: username,
    password,
});
export default pool;
" > src/database/dbConfig.ts

echo "// requestRoutes.ts
import express from 'express';
import RequestService from '../services/requestService';
const requestRoutes = express.Router();
const requestService = new RequestService()
requestRoutes.get('/get', requestService.dummyRequest);
requestRoutes.get('/expensive', requestService.expensiveRequest);
// requestRoutes.get('/get', requestManager.getRequests);
// requestRoutes.post('/update/:requestId/approve', requestManager.updateRequest);
// requestRoutes.post('/update/:requestId/reject', requestManager.updateRequest);
// Add other routes as needed
export default requestRoutes;
" > src/routes/requestRoutes.ts

echo "// src/services/requestService.ts
import { Request, Response } from 'express';
import { Worker } from 'worker_threads';
import path from 'path';

class RequestService {
    async dummyRequest(req: Request, res: Response): Promise<void> {
        try {
            const { user_id, book_title, book_author, justification } = req.body;
            res.status(201).json({ message: 'Request submitted successfully' });
        } catch (error) {
            console.error('Error in submitRequest:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async expensiveRequest(req: Request, res: Response): Promise<void> {
        const startTime = new Date().getTime();
        const worker = new Worker(path.join(__dirname, '../utils/threadWorker.js'));
        worker.on('message', (result) => {
            const endTime = new Date().getTime();
            const timeTaken = (endTime - startTime) / 1000;

            res.status(200).json({
                message: 'Expensive request completed',
                time: \`Time taken: \${timeTaken} seconds\`,
                result: result
            });
        });

        worker.on('error', (error) => {
            console.error('Error in worker:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
    }
}
export default RequestService;
" > src/services/requestService.ts

echo "// threadWorker.ts
// src/utils/threadWorker.ts
import { parentPort } from 'worker_threads';

function expensiveOperation() {
    let sum = 0;
    for (let i = 0; i < 10000000000; i++) {
        sum += i;
    }
    return sum;
}

if (parentPort) {
    const result = expensiveOperation();
    parentPort.postMessage(result);
}
" > src/utils/threadWorker.ts

echo "updating packages..."

npm update

echo "Project setup completed successfully!"

cat <<EOF
Add the following to scripts in package.json

"start": "npm run build && node dist/server.js",
"dev": "npm run watch && nodemon dist/server.js",
"build": "tsc",
"serve": "node dist/server.js",
"watch": "tsc -w",
"test": "jest",
"test:watch": "jest --watch"
EOF