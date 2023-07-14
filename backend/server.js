const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const authRoute = require('./routers/authRouter');
const categoryRoute = require('./routers/petCategoryRoute');
const petRoute = require('./routers/petRoute');
const supplierRoute = require('./routers/supplierRoute');
const imgRoute = require('./routers/imgRoute');
const docsRoute = require('./routers/docsRoute');
const uploadRoute = require('./routers/uploadRoute');
const enquiryRoute = require('./routers/enquiryRoute');
const requestPetRoute = require('./routers/requestPetRoute');
const subscriptionRoute = require('./routers/subscriptionRoute');
const paymentRoute = require('./routers/paymentRoute');
const reviewRoute = require('./routers/reviewRouter');
const avatarRoute = require('./routers/avatarRoute');
const cookieParser = require('cookie-parser'); // for refresh token
const session = require('express-session');
const path = require('path');
// const bodyParser = require('')
const cors = require('cors');
const petController = require('./controller/petController');

// connect to MongoDB
connectDB();

const port = process.env.PORT || 3000;

// require('./config/passport')(passport);

const app = express();
app.use(express.static('public'));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(cors());

// add plugs in to read information from user input
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, './public')));

// set route for all auth
app.use('/api/users', authRoute);

// set route for creating new pet category
app.use('/api/species', categoryRoute);

// set route for review
app.use('/api/review', reviewRoute);

// set route for pet
app.use('/api/pets', petRoute);
// app.put('/api/pets/:petId/contacts', petController.updatePetContacts);
//app.put('/api/pets',(req,res) =>{
  // mongo.update(req.body.petId,'petcontacts', req.body)
  // console.log('/api/pets'. req.body.petid)
  // console.log(JSON.stringify(req.body))
  // res.send("ok")
//})


// set route for supplier
app.use('/api/supplier', supplierRoute);

// img route
app.use('/api/img', imgRoute);
app.use('/api/avatar', avatarRoute);
app.use('/api/upload', uploadRoute);

// documents route
app.use('/api/docs', docsRoute);

// enquiry route
app.use('/api/enquiry', enquiryRoute);

// request route
app.use('/api/request-pet', requestPetRoute);

// subscription router
app.use('/api/subscription', subscriptionRoute);

// payment router
app.use('/api/payment', paymentRoute);

// user to debug a code when a program got errors
app.use(errorHandler);
app.use(notFound);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
