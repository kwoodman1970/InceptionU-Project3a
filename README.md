# InceptionU Project 3 &ndash; PAWSitive PetStarz

**Status:**  Ended<br />
*Code has been delivered to our client and we are no longer developing it.*

## About This Project

I was on a team with [Pooja](https://github.com/poojamlvy) and one other person (who shall remain nameless because he barely contributed anything and [ghosted](https://en.wikipedia.org/wiki/Ghosting_(behavior)) *absolutely everyone* after the project's first week).  We had the honour of working on [PAWSitive PetStarz](https://www.petstarz.ca/) for Project 3 in the [Full Stack Developer](https://www.inceptionu.com/full-stack-developer-program/) program at [InceptionU](https://www.inceptionu.com/) (we were given three projects to do altogether).

### The Assignment

The goal of Project 3 was to deeply understand a problem/opportunity and build an effective response.

We were given additional features to strive for, such as:

- [React Components](https://react.dev/learn)
- server implementation of a [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) API
- data stored/retrieved from [MongoDB](https://www.mongodb.com/)
- user authentication
- [React Router](https://www.npmjs.com/package/react-router)
- include authorization (roles/permissions)
- "solid" user experience
- [React Context](https://react.dev/reference/react/useContext)
- multiple user types
- [React Native](https://reactnative.dev/)
- [SQL](https://en.wikipedia.org/wiki/SQL)
- [Python](https://www.python.org/)/[Django](https://www.djangoproject.com/) for the server
- second application for administrator
- analytics
- automated testing

### The Result

Watch our [demonstration video](https://www.youtube.com/watch?v=3aLnxrPMmDY).

### Development

[Our client](https://www.petstarz.ca/) provided us with:

- a pre-existing code base that had been developed by a team of students at [SAIT](https://www.sait.ca/)
- a list of pet species, breeds and physical & psychological attributes to be included
- a list of features in [Trello](https://trello.com/) that she wanted us to implement
- a visual guide in [Figma](https://www.figma.com/)

We had the good fortune of having an experienced scrum master &ndash; [Steve](https://www.linkedin.com/in/steve-johnson-35b767199/?lipi=urn%3Ali%3Apage%3Ad_flagship3_people_connections%3BqyNftLSjRxOPUoQ6EsJh2Q%3D%3D) &ndash; to guide us.

**Our main task was to create a form for pet suppliers to input their pets and associated records** (such as medical records and veterinarian contact information) into the application.

We started by getting the pre-existing code up & running and connected to a [MongoDB](https://www.mongodb.com/) database.  We then explored the project's operation to understand how it worked.  Once we had that information, we began modifying the schemas, the back end and the front end piece by piece until we'd implemented the desired set of functioning forms.

We had [scrum](https://en.wikipedia.org/wiki/Scrum_(software_development)) sessions with week-long sprints, and [our client](https://www.petstarz.ca/) was involved at every step offering direction and approval when needed.  She also arranged for a meeting with the original [SAIT](https://www.sait.ca/) team early on so that we could ask them questions about their design and implementation decisions.  [Shane](https://github.com/scfast) and [Tony](https://github.com/acidtone/) did code reviews with us and offered helpful suggestions.

**We coded to the same style and architecture as the original codebase to maintain consistency.**  It was neither possible nor practical to improve on these within the project's timeframe and they were not within the scope of [our client's](https://www.petstarz.ca/) requirements.

## Technologies Worked With

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
  - [useState](https://react.dev/reference/react/useState/)
  - [useEffect](https://react.dev/reference/react/useEffect/)
- [Axios](https://axios-http.com/)
- [Formik](https://formik.org/)
- [React-Toastify](https://github.com/fkhadra/react-toastify#readme)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- [Figma](https://www.figma.com/)
- [Trello](https://trello.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [MongoDB Compass](https://www.mongodb.com/products/tools/compass/)
- [Git](https://git-scm.com/) & [GitHub](https://github.com/) (obviously...)

## About This Repository

[Our client](https://www.petstarz.ca/) has intellectual property in the codebase so **this repository contains *only* the files that we worked on.**  It is *not* functional, but you can watch our [demonstration video](https://www.youtube.com/watch?v=3aLnxrPMmDY) to see the results.

## Copyright Notice

The files in this repository are made available under the [GitHub Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service#5-license-grant-to-other-users).  Beyond that, I [reserve all other rights](https://choosealicense.com/no-permission/).

Copyright &copy; 2023 Kevin Woodman

---

***The rest of this document is the pre-existing README.md file that was written by the [SAIT](https://www.sait.ca/) team:***

---
---

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
