# PetStarz

## Description

This project is a website for connecting among pet lovers, breeders, organizations and rescues. It is a full-stack web
application built with
React, Node.js, Express, and MongoDB.

## Structure

The project is structured as follows:

```
.
├── admin-fronted
│   ├── public
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── features
│   │   ├── pages
│   │   ├── utils
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   ├── index.js
│   ├──package.json
│   ├──package-lock.json
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middlewares
│   ├── models
│   ├── public
│   ├── routes
│   ├── utils
│   ├── server.js
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── css
│   │   ├── features
│   │   ├── pages
│   │   ├── utils
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── index.css
│   │   ├── index.js
│   ├──package.json
│   ├──package-lock.json
│
├── .env
├── package.json
├── package-lock.json
├── README.md
```

## Installation

### Node.js Environment

To run this project, you need to install Node.js and npm on your computer. You can download Node.js
from [here](https://nodejs.org/en/download/).

### MongoDB

This project uses MongoDB as the database.
To use MongoDB Atlas, you need to create a free MongoDB account. Here's how to do it:

1. Go to the MongoDB Atlas website at https://www.mongodb.com/atlas/database.
2. Click on the "Try Free" button.
3. You can register with your email or log in directly with your Google account.
4. On the following page, you'll be asked to fill out a survey based on your situation. Answer the questions
   accordingly.
5. You will then see a "Deploy Your Database" page. Select the "M0 Free" option.
6. If you're using AWS, Google, or Azure, choose the closest available region. (Right now, I chose Toronto for Azure.)
7. Now, navigate to the "Security Quickstart" section on the dashboard. You can create a user by providing a username
   and password, or you can use a certificate for authentication.
8. To access your database from a specific IP address, add the address to the IP Access List. (If you want to allow
   access from anywhere, you can add 0.0.0.0/0, but this is not recommended as it is less secure.)
9. In the .env file on the root directory, replace the username and password of `PETSTARZ_DB_URL` with your own.

### Running on Development Mode

To run the project on development mode, you need to run the following commands in the root directory:

```bash
npm install --force
cd frontend
npm install --force
cd ../admin-frontend
npm install --force
cd ..
npm run dev-all
```

Run these commands in sequence. When using the npm install command, the installation process will be executed. Wait for
it to complete before entering the next command.

## Deployment

### Frontend

To deploy the project, you need to run the following commands in the root directory:

```bash
npm install --force
cd admin-frontend
npm install --force
cd ../frontend
npm install --force
npm run build
```

After running these commands, you will see a `build` folder in the `frontend` directory. You can then deploy the
`build` folder to your server. There are many tools that can be used to deploy a React app, such as Ngnix, Apache, and
Heroku.

### Backend

You can upload the backend folder to your server. You can use any Node.js server to run the backend. I recommend using
PM2 to run the server.

### Admin Frontend

We do not suggest deploying the admin frontend to a public server. You can run the admin frontend on your local machine
and access it through your browser. This is for security reasons.

## Authors

Hoa Le - [Github](https://github.com/HoaLeCA)

Weilong Mao - [Github](https://github.com/WaylonMao)

Hu Peng - [Github](https://github.com/philippenghu)

Chris Wang - [Github](https://github.com/ChrisWangCA)

Bennet Xia - [Github](https://github.com/HeisenbergXXX)
