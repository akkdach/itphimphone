import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Pages/Home';
import ProfileCard from './Pages/Profile';
import LoginPage from './Pages/Login/Login';
import { UserProvider } from './Context/userContext';
import TopBar from './Component/TopBar';
import { ThemeProvider } from '@emotion/react';
import theme from './theme';
import LoanScreen from './Pages/LoanScreen';
import DownPaymentScreen from './Pages/DownPayment';
import PaymentScreen from './Pages/PaymentScreen';
import RegisternewLoan from './Pages/RegisterNewLoan/RegisternewLoan';
import SettingScreen from './Pages/SettingScreen/SettingScreen';
import UserInfoScreen from './Pages/UserInfoScreen/UserInfoScreen';
import LoanDetail from './Pages/LoanScreen/LoanDetail';
import DownPaymentDetail from './Pages/DownPayment/DownPaymentDetail';
import LineCallback from './Pages/Login/LineCallback';
import CallbackPage from './Pages/CallbackPage';
import RegisterForm from './Pages/Register/RegisterForm';
import ProductDetail from './Component/ProductCatalog/ProductDetail';
import InvoiceScreen from './Pages/Invoice/InvoiceScreen';
import ReviewPage from './Pages/ReviewCoupon/ReviewPage';
import MyCouponsPage from './Pages/ReviewCoupon/MyCouponsPage';
import ApplyCouponPage from './Pages/ReviewCoupon/ApplyCouponPage';
const token = localStorage.getItem('token');
function App() {
  return (

    <ThemeProvider theme={theme}>
      <div className="App">
        {/* <TopBar /> */}
        <div style={{ marginTop: 0, padding: 0 }}>
          {token ? (<UserProvider><Layout ><Routes>
            <Route path="/*" element={<Home />}></Route>
            <Route path="login" element={<LoginPage />}></Route>
            <Route path="RegisterForm" element={<RegisterForm />} />
            <Route path="invoice" element={<InvoiceScreen />} />
            <Route path='callback' element={<CallbackPage />}></Route>
            <Route path="profile" element={<ProfileCard />}></Route>
            <Route path="loan" element={<LoanScreen />}></Route>
            <Route path="loan/LoanDetail" element={<LoanDetail />} />
            <Route path="downPayment/detail" element={<DownPaymentDetail />} />
            <Route path="newLoan" element={<RegisternewLoan />}></Route>
            <Route path="setting" element={<SettingScreen />}></Route>
            <Route path="userInfo" element={<UserInfoScreen />}></Route>
            <Route path="DownPayment" element={<DownPaymentScreen />}></Route>
            <Route path="paid" element={<PaymentScreen />}></Route>
            <Route path="ProductDetail" element={<ProductDetail />} />
            <Route path="review" element={<ReviewPage />} />
            <Route path="my-coupons" element={<MyCouponsPage />} />
            <Route path="apply-coupon" element={<ApplyCouponPage />} />
          </Routes></Layout></UserProvider>) : (<Routes>
            <Route path='/' element={<LoginPage />}></Route>
            <Route path='*' element={<LoginPage />}></Route>
            <Route path='LineCallback' element={<LineCallback />}></Route>
            <Route path='callback' element={<CallbackPage />}></Route>
            <Route path="RegisterForm" element={<RegisterForm />} />

          </Routes>)}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
