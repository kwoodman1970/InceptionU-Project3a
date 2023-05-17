import './App.css';
import './Index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'leaflet/dist/leaflet.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import How from './pages/How';
import Contact from './pages/Contact';
import Research from './pages/Research';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import SignupSuccess from './pages/SignupSuccess';
import TestImg from './pages/testImgUpload';
import PetPublish from './pages/PetPublish';
import Logout from './pages/Logout';
import EmailVerification from './pages/EmailVerification';
import Addpet from './pages/Addpet';
import SearchPets from './pages/SearchPets';
import SearchSupplier from './pages/SearchSupplier';
import SupplierSignup from './pages/SupplierSignup';
import SupplierLogin from './pages/SupplierLogin';
import SupplierLayout from './components/SupplierLayout';
import SupplierDashBoard from './pages/SupplierDashBoard';
import PrivateRoutes from './utils/PrivateRoutes';
import PetList from './pages/PetList';
import Supplier from './pages/Supplier';
import SupplierForgotPassword from './pages/SupplierForgotPassword';
import SupplierResetPassword from './pages/SupplierResetPassword';
import Wishlist from './pages/Wishlist';
import SinglePet from './pages/SinglePet';
import ViewPet from './pages/ViewPet';
import AdoptionForm from './pages/AdoptionForm';
import WriteReview from './pages/WriteReview';
import PetRequest from './pages/PetRequest';
import ViewPetRequest from './pages/ViewPetRequest';
import SinglePetRequest from './pages/SinglePetRequest';
import CheckRequestPet from './pages/CheckRequestPet';
import SubcriptionPlans from './pages/SubscriptionPlans';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentError from './pages/PaymentError';
import PaySubscriptions from './pages/PaySubscriptions';
import SupplierSignupSuccess from './pages/SupplierSignupSuccess';
import SupplierProfile from './pages/SupplierProfile';
import TestSettings from './pages/TestSetting';
import UserSetting from './pages/UserSetting';
import SupplierAvatar from './pages/SupplierAvatar';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* THIS ROUTE USE FOR REGULAR USERS */}
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/petstarz' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/how' element={<How />} />
            <Route path='/research' element={<Research />} />
            <Route path='/login' element={<Login />} />

            <Route path='/setting/:id' element={<UserSetting />} />
            {/* <Route path='/setting' element={<TestSettings />} /> */}
            <Route path='/logout' element={<Logout />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/reset-password/:token' element={<ResetPassword />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/verify-email' element={<EmailVerification />} />
            <Route path='/registration-success' element={<SignupSuccess />} />
            <Route path='/testimg' element={<TestImg />} />
            <Route path='/supplier/signup' element={<SupplierSignup />} />
            <Route
              path='/supplier-registration-success'
              element={<SupplierSignupSuccess />}
            />
            <Route path='/supplier/login' element={<SupplierLogin />} />
            <Route
              path='/supplier/forgot-password'
              element={<SupplierForgotPassword />}
            />
            <Route
              path='/supplier/reset-password/:token'
              element={<SupplierResetPassword />}
            />
            <Route path='/add-pet' element={<Addpet />} />
            <Route path='/find-pet' element={<SearchPets />} />
            <Route path='/find-supplier' element={<SearchSupplier />} />
            <Route path='/wishlist/' element={<Wishlist />} />
            <Route path='/writereview/:supplierId' element={<WriteReview />} />
            <Route path='/editreview/:id' element={<WriteReview />} />
            <Route path='/supplier/:supplierId' element={<Supplier />} />
            <Route path='/pets/:petId' element={<SinglePet />} />
            <Route path='/adoption/:petId' element={<AdoptionForm />} />
            <Route path='/subscription/' element={<SubcriptionPlans />} />
            <Route
              path='/payment/subscription'
              element={<PaySubscriptions />}
            />
            <Route path='/payment/success' element={<PaymentSuccess />} />
            <Route path='/payment/error' element={<PaymentError />} />
          </Route>
          {/* THIS ROUTE USE FOR SUPPLIER */}

          <Route
            path='/supplier'
            element={
              <PrivateRoutes>
                <SupplierLayout />
              </PrivateRoutes>
            }>
            <Route index element={<SupplierDashBoard />} />

            <Route path='/supplier/create-pet' element={<PetPublish />} />
            <Route path='/supplier/all-pets' element={<PetList />} />
            <Route path='/supplier/pets/:id' element={<ViewPet />} />
            <Route path='/supplier/request/:id' element={<ViewPetRequest />} />
            <Route path='/supplier/all-request' element={<PetRequest />} />
            <Route path='/supplier/profile' element={<SupplierProfile />} />
            <Route path='/supplier/avatar' element={<SupplierAvatar />} />

            <Route
              path='/supplier/request-pet/:id'
              element={<CheckRequestPet />}
            />
            <Route
              path='/supplier/request-pet/:petId'
              element={<SinglePetRequest />}
            />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
