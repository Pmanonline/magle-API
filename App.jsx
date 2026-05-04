// // src/App.jsx
// import React from "react";
// import {
//   createBrowserRouter,
//   RouterProvider,
//   Outlet,
//   Navigate,
// } from "react-router-dom";

// // AUTH PAGES
// import LoginPage from "./pages/Authentication/LoginPage";
// import SignupPage from "./pages/Authentication/SignupPage";
// import VerifyEmailPage from "./pages/Authentication/Verifyemailpage";
// import ForgotPasswordPage from "./pages/Authentication/Forgotpasswordpage";
// import ResetPasswordPage from "./pages/Authentication/Resetpasswordpage";
// import ResendVerificationPage from "./pages/Authentication/Resendverificationpage";

// // EXISTING DASHBOARD PAGES (Mediator)
// import Dashboard from "./pages/Dashboard/MediatorDashboard";
// import DisputeDetails from "./pages/Disputes/DisputeDetailsTables";
// import SettleDispute from "./pages/Disputes/SettleDispute";

// // NEW MAGLO DASHBOARD PAGES
// import DashboardLayout from "./pages/Dashboard/DashboardLayout";
// import DashboardPage from "./pages/Dashboard/DashboardPage";
// import InvoicesPage from "./pages/Dashboard/Invoicespage";
// import TransactionsPage from "./pages/Dashboard/TransactionsPage";
// import WalletsPage from "./pages/Dashboard/WalletsPage";
// import HelpPage from "./pages/Dashboard/HelpPage";
// import SettingsPage from "./pages/Dashboard/SettingsPage";

// import ProtectedRoute from "./components/ProtectedRoute";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // ✅ Layout component for Mediator Dashboard with nested outlet
// const DashboardLayout = () => (
//   <ProtectedRoute>
//     <div className="dashboard-layout">
//       {/* Navbar or Sidebar can go here */}
//       <Outlet />
//     </div>
//   </ProtectedRoute>
// );

// // ✅ Layout component for Maglo Dashboard (already has its own sidebar)
// const MagloLayout = () => (
//   <ProtectedRoute>
//     <MagloDashboardLayout>
//       <Outlet />
//     </MagloDashboardLayout>
//   </ProtectedRoute>
// );

// // ✅ Router definition
// const router = createBrowserRouter(
//   [
//     // Auth Routes
//     {
//       path: "/",
//       element: <LoginPage />,
//     },
//     {
//       path: "/signup",
//       element: <SignupPage />,
//     },
//     {
//       path: "/verify-email",
//       element: <VerifyEmailPage />,
//     },
//     {
//       path: "/forgot-password",
//       element: <ForgotPasswordPage />,
//     },
//     {
//       path: "/reset-password",
//       element: <ResetPasswordPage />,
//     },
//     {
//       path: "/resend-verification",
//       element: <ResendVerificationPage />,
//     },

//     // Mediator Dashboard Routes
//     {
//       path: "/mediator-dashboard",
//       element: <DashboardLayout />,
//       children: [
//         {
//           index: true,
//           element: <Dashboard />,
//         },
//         {
//           path: "disputes/:id",
//           element: <DisputeDetails />,
//         },
//         {
//           path: "settle-dispute/:id",
//           element: <SettleDispute />,
//         },
//       ],
//     },

//     // Maglo Financial Dashboard Routes
//     {
//       path: "/dashboard",
//       element: <MagloLayout />,
//       children: [
//         {
//           index: true,
//           element: <MagloDashboardPage />,
//         },
//         {
//           path: "invoices",
//           element: <MagloInvoicesPage />,
//         },
//         {
//           path: "transactions",
//           element: <MagloTransactionsPage />,
//         },
//         {
//           path: "wallets",
//           element: <MagloWalletsPage />,
//         },
//         {
//           path: "settings",
//           element: <MagloSettingsPage />,
//         },
//         {
//           path: "help",
//           element: <MagloHelpPage />,
//         },
//       ],
//     },

//     // Catch all - redirect to login
//     {
//       path: "*",
//       element: <Navigate to="/" replace />,
//     },
//   ],
//   {
//     future: {
//       v7_relativeSplatPath: true,
//     },
//   },
// );

// // ✅ Main App
// function App() {
//   return (
//     <>
//       <RouterProvider router={router} />
//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   );
// }

// export default App;
// src/App.jsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";

// AUTH PAGES
import LoginPage from "./pages/Authentication/LoginPage";
import SignupPage from "./pages/Authentication/SignupPage";
import VerifyEmailPage from "./pages/Authentication/Verifyemailpage";
import ForgotPasswordPage from "./pages/Authentication/Forgotpasswordpage";
import ResetPasswordPage from "./pages/Authentication/Resetpasswordpage";
import ResendVerificationPage from "./pages/Authentication/Resendverificationpage";

// NEW DASHBOARD PAGES (Financial)
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import InvoicesPage from "./pages/Dashboard/Invoicespage";
import TransactionsPage from "./pages/Dashboard/TransactionsPage";
import WalletsPage from "./pages/Dashboard/WalletsPage";
import HelpPage from "./pages/Dashboard/HelpPage";
import SettingsPage from "./pages/Dashboard/SettingsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Layout component for Mediator Dashboard with nested outlet
const MediatorLayout = () => (
  <ProtectedRoute>
    <div className="dashboard-layout">
      <Outlet />
    </div>
  </ProtectedRoute>
);

// ✅ Layout component for Financial Dashboard (already has its own sidebar)
const FinancialLayout = () => (
  <ProtectedRoute>
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  </ProtectedRoute>
);

// ✅ Router definition
const router = createBrowserRouter(
  [
    // Auth Routes
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignupPage />,
    },
    {
      path: "/verify-email",
      element: <VerifyEmailPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
      path: "/reset-password",
      element: <ResetPasswordPage />,
    },
    {
      path: "/resend-verification",
      element: <ResendVerificationPage />,
    },

    // Financial Dashboard Routes
    {
      path: "/dashboard",
      element: <FinancialLayout />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "invoices",
          element: <InvoicesPage />,
        },
        {
          path: "transactions",
          element: <TransactionsPage />,
        },
        {
          path: "wallets",
          element: <WalletsPage />,
        },
        {
          path: "settings",
          element: <SettingsPage />,
        },
        {
          path: "help",
          element: <HelpPage />,
        },
      ],
    },

    // Catch all - redirect to login
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);

// ✅ Main App
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
