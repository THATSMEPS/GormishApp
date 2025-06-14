// // components/LoginPopup.tsx

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const LoginPopup = ({ isOpen, onClose }: Props) => {
//   const [showRegistration, setShowRegistration] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: ''
//   });
//   const [errors, setErrors] = useState({
//     name: '',
//     phone: ''
//   });

//   const validateForm = () => {
//     const newErrors = {
//       name: '',
//       phone: ''
//     };

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }

//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!/^\d{10}$/.test(formData.phone)) {
//       newErrors.phone = 'Please enter 10 digits';
//     }

//     setErrors(newErrors);
//     return !Object.values(newErrors).some(error => error !== '');
//   };

//   const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, '');
//     if (value.length <= 10) {
//       setFormData({ ...formData, phone: value });
//     }
//   };

//   const handleSubmit = () => {
//     if (validateForm()) {
//       console.log('Form submitted:', {
//         ...formData,
//         phone: '+91' + formData.phone
//       });
//       onClose();
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 flex items-center justify-center z-50 px-4"
//         >
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
//           />
          
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             className="relative bg-[#6552FF]/80 backdrop-blur-xl rounded-[30px] p-8 w-full max-w-md text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
//             style={{
//               WebkitBackdropFilter: 'blur(8px)',
//               backdropFilter: 'blur(8px)',
//             }}
//           >
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               className="text-center"
//             >
//               <h2 className="text-2xl font-bold mb-6">
//                 {showRegistration ? 'Enter your Details' : 'Login To Order'}
//               </h2>

//               {!showRegistration ? (
//                 <div className="space-y-6">
//                   <button
//                     onClick={() => setShowRegistration(true)}
//                     className="w-full bg-white text-gray-700 rounded-full py-3 px-6 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-lg"
//                   >
//                     <img
//                       src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//                       alt="Google"
//                       className="w-5 h-5"
//                     />
//                     <span className="font-medium">Sign In With Google</span>
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Enter Your Name"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                       className={`w-full bg-white/10 rounded-full py-3 px-6 placeholder-white/70 outline-none border ${
//                         errors.name ? 'border-red-400' : 'border-white/20'
//                       } focus:border-white/40 transition-colors`}
//                     />
//                     {errors.name && (
//                       <p className="text-red-200 text-sm mt-1 ml-4">{errors.name}</p>
//                     )}
//                   </div>
                  
//                   <div className="relative">
//                     <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70">
//                       +91
//                     </div>
//                     <input
//                       type="tel"
//                       placeholder="Enter Mobile Number"
//                       value={formData.phone}
//                       onChange={handlePhoneChange}
//                       className={`w-full bg-white/10 rounded-full py-3 pl-16 pr-6 placeholder-white/70 outline-none border ${
//                         errors.phone ? 'border-red-400' : 'border-white/20'
//                       } focus:border-white/40 transition-colors`}
//                     />
//                     {errors.phone && (
//                       <p className="text-red-200 text-sm mt-1 ml-4">{errors.phone}</p>
//                     )}
//                   </div>

//                   <button
//                     onClick={handleSubmit}
//                     className="w-full bg-white text-[#6552FF] rounded-full py-3 px-6 font-semibold hover:bg-opacity-90 transition-colors shadow-lg"
//                   >
//                     Submit
//                   </button>
//                 </div>
//               )}
//             </motion.div>

//             <p className="text-sm text-center mt-6 text-white/70">
//               By Signing In You Are Agreeing Our Terms & Conditions And Privacy Policies
//             </p>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };






// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { GoogleLogin } from '@react-oauth/google'; // ✅ NEW: Import GoogleLogin component

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// // Define your local backend URL here (should match what your app uses)
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
// const CUSTOMER_ID = "b0c7a268-b38b-4d4c-b0f9-fc7606032984"; // Your hardcoded customer ID

// export const LoginPopup = ({ isOpen, onClose }: Props) => {
//   const [isSigningIn, setIsSigningIn] = useState(false); // For managing loading state during Google Sign-In
//   const [authMessage, setAuthMessage] = useState<string | null>(null); // For displaying messages/errors to the user

//   // Removed all states and functions related to manual login (formData, errors, validateForm, etc.)
//   // The component will ONLY deal with Google Sign-In.

//   // Callback function for when Google successfully returns a credential (ID token)
//   // const handleGoogleLoginSuccess = async (credentialResponse: any) => {
//   //   setIsSigningIn(true); // Set loading state to true
//   //   setAuthMessage(null); // Clear any previous messages

//   //   // Check if Google provided a credential (ID token)
//   //   if (!credentialResponse.credential) {
//   //     setAuthMessage("Google authentication failed: No credential received.");
//   //     setIsSigningIn(false); // Reset loading state
//   //     return;
//   //   }

//   //   console.log("Google ID Token received:", credentialResponse.credential); // Log the received ID token

//   //   // Send this Google ID token to your backend's /auth/google endpoint
//   //   try {
//   //     const backendResponse = await fetch(`${API_BASE_URL}/auth/google`, {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({ access_token: credentialResponse.credential }), // Send the ID token as 'access_token' to your backend
//   //     });

//   //     const data = await backendResponse.json(); // Parse the backend's response

//   //     // Check if backend response indicates success and contains necessary session/user data
//   //     if (backendResponse.ok && data.success && data.session && data.user) {
//   //       // Store the tokens received from YOUR backend (Supabase session tokens) in localStorage
//   //       localStorage.setItem('authToken', data.session.access_token);
//   //       localStorage.setItem('refreshToken', data.session.refresh_token || ''); // Store refresh token if provided
//   //       localStorage.setItem('expiresAt', data.session.expires_at ? data.session.expires_at.toString() : ''); // Store token expiry

//   //       // Store customer data received from your backend
//   //       localStorage.setItem('customerData', JSON.stringify({
//   //         id: data.user.id || CUSTOMER_ID, // Use backend's user ID or fallback
//   //         name: data.user.name || 'Google User', // Use backend's user name
//   //         phone: data.user.phone || '', // Use backend's user phone (might be empty initially)
//   //         email: data.user.email || '', // Use backend's user email
//   //         address: data.user.address || '', // Use backend's user address
//   //         area: data.user.area || { // Use backend's area object or fallback
//   //             id: 'acfdc349-00fa-484a-a247-8837ea6a8ffd',
//   //             areaName: 'Navrangpura',
//   //             cityName: 'Ahmedabad',
//   //             stateName: 'Gujarat'
//   //         },
//   //         orders: data.user.orders || [] // Use backend's orders or empty array
//   //       }));

//   //       setAuthMessage("Google Sign-In successful! Redirecting..."); // Success message
//   //       onClose(); // Call onClose prop, which tells App.tsx to re-check authentication and close popup
//   //     } else {
//   //       // If backend response indicates failure
//   //       setAuthMessage(data.message || 'Google sign-in with backend failed. Please try again.');
//   //       console.error("Backend Google Sign-In API error:", data);
//   //     }
//   //   } catch (error) {
//   //     // Handle network errors or other unexpected issues during the API call
//   //     console.error("Error sending Google ID token to backend:", error);
//   //     setAuthMessage('Network error or unexpected issue. Please check console.');
//   //   } finally {
//   //     setIsSigningIn(false); // Reset loading state regardless of success or failure
//   //   }
//   // };


//   const handleGoogleLoginSuccess = async (credentialResponse: any) => {
//   setIsSigningIn(true);
//   setAuthMessage(null);

//   if (!credentialResponse.credential) {
//     setAuthMessage("Google authentication failed: No credential received.");
//     setIsSigningIn(false);
//     return;
//   }

//   console.log("Google ID Token received:", credentialResponse.credential);

//   try {
//     const backendResponse = await fetch(`${API_BASE_URL}/auth/google`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ access_token: credentialResponse.credential }),
//     });

//     const data = await backendResponse.json();

//     if (backendResponse.ok && data.success && data.session && data.user) {
//       // ✅ DEBUG LOG 1: Log the access_token received from your backend
//       console.log("Backend response successful. Access Token received:", data.session.access_token);

//       localStorage.setItem('authToken', data.session.access_token);
//       localStorage.setItem('refreshToken', data.session.refresh_token || '');
//       localStorage.setItem('expiresAt', data.session.expires_at ? data.session.expires_at.toString() : '');
//       localStorage.setItem('customerData', JSON.stringify({
//         id: data.user.id || CUSTOMER_ID,
//         name: data.user.name || 'Google User',
//         phone: data.user.phone || '',
//         email: data.user.email || '',
//         address: data.user.address || '',
//         area: data.user.area || {
//             id: 'acfdc349-00fa-484a-a247-8837ea6a8ffd',
//             areaName: 'Navrangpura',
//             cityName: 'Ahmedabad',
//             stateName: 'Gujarat'
//         },
//         orders: data.user.orders || []
//       }));

//       // ✅ DEBUG LOG 2: Log the authToken AFTER storing it in localStorage
//       console.log("AuthToken after localStorage.setItem (in LoginPopup):", localStorage.getItem('authToken'));

//       setAuthMessage("Google Sign-In successful! Redirecting...");
//       onClose(); // This should trigger the onClose in App.tsx
//     } else {
//       setAuthMessage(data.message || 'Google sign-in with backend failed. Please try again.');
//       console.error("Backend Google Sign-In API error:", data);
//     }
//   } catch (error) {
//     console.error("Error sending Google ID token to backend:", error);
//     setAuthMessage('Network error or unexpected issue. Please check console.');
//   } finally {
//     setIsSigningIn(false);
//   }
// };

//   // Callback function for when Google login fails (e.g., user closes popup, network issue with Google)
//   const handleGoogleLoginError = () => {
//     console.log('Google Login Failed');
//     setAuthMessage("Google Sign-In failed. Please try again.");
//     setIsSigningIn(false); // Reset loading state
//   };

//   // The useEffect hook is no longer directly initializing Google Identity Services (GIS) library
//   // because @react-oauth/google handles that internally when the GoogleOAuthProvider is present.
//   // We keep it empty here as it's not needed for this component's logic anymore.
//   useEffect(() => {
//     // This useEffect can be removed if there are no other side effects needed on mount/unmount
//     // specific to LoginPopup component. @react-oauth/google simplifies this.
//   }, []); // Empty dependency array as no internal GIS initialization is done here

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 flex items-center justify-center z-50 px-4"
//         >
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
//           />
          
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             className="relative bg-[#6552FF]/80 backdrop-blur-xl rounded-[30px] p-8 w-full max-w-md text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
//             style={{
//               WebkitBackdropFilter: 'blur(8px)',
//               backdropFilter: 'blur(8px)',
//             }}
//           >
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               className="text-center"
//             >
//               <h2 className="text-2xl font-bold mb-6">
//                 Login To Order {/* Only one heading now */}
//               </h2>

//               {/* ✅ Directly render the GoogleLogin component */}
//               <div className="space-y-6">
//                 <GoogleLogin
//                   onSuccess={handleGoogleLoginSuccess} // Callback for successful login
//                   onError={handleGoogleLoginError}   // Callback for failed login
//                   // The 'render' prop allows you to create a custom button.
//                   // The 'onClick' and 'disabled' props are provided by GoogleLogin for your custom button.
//                   render={({ onClick, disabled }) => (
//                     <button
//                       onClick={onClick}
//                       disabled={disabled || isSigningIn} // Disable button if Google's own logic disables it, or if our loading state is active
//                       className="w-full bg-white text-gray-700 rounded-full py-3 px-6 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-lg"
//                     >
//                       {isSigningIn ? ( // Show spinner if signing in
//                         <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                       ) : (
//                         // Show Google icon if not signing in
//                         <img
//                           src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//                           alt="Google"
//                           className="w-5 h-5"
//                         />
//                       )}
//                       <span className="font-medium">
//                         {isSigningIn ? 'Signing In...' : 'Sign In With Google'} {/* Button text changes based on loading state */}
//                       </span>
//                     </button>
//                   )}
//                 />
//                 {authMessage && ( // Display messages (success/error)
//                   <p className={`text-sm mt-1 ${authMessage.includes('successful') ? 'text-green-200' : 'text-red-200'}`}>{authMessage}</p>
//                 )}
//               </div>
//             </motion.div>

//             <p className="text-sm text-center mt-6 text-white/70">
//               By Signing In You Are Agreeing Our Terms & Conditions And Privacy Policies
//             </p>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };



// import { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { GoogleLogin } from '@react-oauth/google';

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
// const CUSTOMER_ID = "b0c7a268-b38b-4d4c-b0f9-fc7606032984";

// export const LoginPopup = ({ isOpen, onClose }: Props) => {
//   const [isSigningIn, setIsSigningIn] = useState(false);
//   const [authMessage, setAuthMessage] = useState<string | null>(null);

//   const handleGoogleLoginSuccess = async (credentialResponse: any) => {
//     setIsSigningIn(true);
//     setAuthMessage(null);

//     if (!credentialResponse.credential) {
//       setAuthMessage("Google authentication failed: No credential received.");
//       setIsSigningIn(false);
//       return;
//     }

//     console.log("LoginPopup: Google ID Token received from frontend:", credentialResponse.credential);

//     try {
//       const backendResponse = await fetch(`${API_BASE_URL}/auth/google`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ access_token: credentialResponse.credential }),
//       });

//       const data = await backendResponse.json();

//       if (backendResponse.ok && data.success && data.session && data.user) {
//         // ✅ DEBUG LOG 1: Log the access_token and refresh_token received from your backend
//         console.log("LoginPopup: Backend response successful.");
//         console.log("LoginPopup: Backend access_token:", data.session.access_token);
//         console.log("LoginPopup: Backend refresh_token:", data.session.refresh_token);

//         // Store access_token as 'authToken'
//         localStorage.setItem('authToken', data.session.access_token);
//         localStorage.setItem('refreshToken', data.session.refresh_token || ''); // Store refresh token separately
//         localStorage.setItem('expiresAt', data.session.expires_at ? data.session.expires_at.toString() : '');

//         localStorage.setItem('customerData', JSON.stringify({
//           id: data.user.id || CUSTOMER_ID,
//           name: data.user.name || 'Google User',
//           phone: data.user.phone || '',
//           email: data.user.email || '',
//           address: data.user.address || '',
//           area: data.user.area || {
//               id: 'acfdc349-00fa-484a-a247-8837ea6a8ffd',
//               areaName: 'Navrangpura',
//               cityName: 'Ahmedabad',
//               stateName: 'Gujarat'
//           },
//           orders: data.user.orders || []
//         }));

//         // ✅ DEBUG LOG 2: Verify authToken directly from localStorage AFTER setting it
//         const storedAuthToken = localStorage.getItem('authToken');
//         console.log("LoginPopup: AuthToken read from localStorage IMMEDIATELY after set:", storedAuthToken);

//         setAuthMessage("Google Sign-In successful! Redirecting...");
        
//         // Add a small delay BEFORE calling onClose to ensure localStorage updates propagate
//         // This is a temporary measure for debugging race conditions, if any.
//         await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

//         onClose(); // This calls the onClose prop in App.tsx
//       } else {
//         setAuthMessage(data.message || 'Google sign-in with backend failed. Please try again.');
//         console.error("LoginPopup: Backend Google Sign-In API error:", data);
//       }
//     } catch (error) {
//       console.error("LoginPopup: Error sending Google ID token to backend:", error);
//       setAuthMessage('Network error or unexpected issue. Please check console.');
//     } finally {
//       setIsSigningIn(false);
//     }
//   };

//   const handleGoogleLoginError = () => {
//     console.log('LoginPopup: Google Login Failed via @react-oauth/google.');
//     setAuthMessage("Google Sign-In failed. Please try again.");
//     setIsSigningIn(false);
//   };

//   useEffect(() => {
//     // This useEffect is intentionally left minimal as @react-oauth/google handles GIS initialization.
//     // Ensure GoogleOAuthProvider is correctly wrapping App.tsx for this to work.
//   }, []);

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 flex items-center justify-center z-50 px-4"
//         >
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
//           />
          
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             className="relative bg-[#6552FF]/80 backdrop-blur-xl rounded-[30px] p-8 w-full max-w-md text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
//             style={{
//               WebkitBackdropFilter: 'blur(8px)',
//               backdropFilter: 'blur(8px)',
//             }}
//           >
//             <motion.div
//               initial={{ y: 20, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               className="text-center"
//             >
//               <h2 className="text-2xl font-bold mb-6">
//                 Login To Order
//               </h2>

//               <div className="space-y-6">
//                 <GoogleLogin
//                   onSuccess={handleGoogleLoginSuccess}
//                   onError={handleGoogleLoginError}
//                   render={({ onClick, disabled }) => (
//                     <button
//                       onClick={onClick}
//                       disabled={disabled || isSigningIn}
//                       className="w-full bg-white text-gray-700 rounded-full py-3 px-6 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors shadow-lg"
//                     >
//                       {isSigningIn ? (
//                         <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                       ) : (
//                         <img
//                           src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
//                           alt="Google"
//                           className="w-5 h-5"
//                         />
//                       )}
//                       <span className="font-medium">
//                         {isSigningIn ? 'Signing In...' : 'Sign In With Google'}
//                       </span>
//                     </button>
//                   )}
//                 />
//                 {authMessage && (
//                   <p className={`text-sm mt-1 ${authMessage.includes('successful') ? 'text-green-200' : 'text-red-200'}`}>{authMessage}</p>
//                 )}
//               </div>
//             </motion.div>

//             <p className="text-sm text-center mt-6 text-white/70">
//               By Signing In You Are Agreeing Our Terms & Conditions And Privacy Policies
//             </p>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };


import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
// const CUSTOMER_ID = "b0c7a268-b38b-4d4c-b0f9-fc7606032984";

export const LoginPopup = ({ isOpen, onClose }: Props) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  // components/LoginPopup.tsx ka sirf handleGoogleLoginSuccess function mein badlav:

// In components/LoginPopup.tsx, inside the handleGoogleLoginSuccess function:

const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
  setIsSigningIn(true);
  setAuthMessage(null);

  if (!credentialResponse.credential) {
    setAuthMessage("Google authentication failed: No credential received.");
    setIsSigningIn(false);
    return;
  }

  console.log("LoginPopup: Google ID Token received from frontend:", credentialResponse.credential);

  try {
    const backendResponse = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: credentialResponse.credential }),
    });

    console.log(`LoginPopup: Backend Response Status: ${backendResponse.status} ${backendResponse.statusText}`);
    console.log(`LoginPopup: Backend Response 'ok' property: ${backendResponse.ok}`);

    const data = await backendResponse.json();
    console.log("LoginPopup: Full Backend Response Data:", data);

    // ✅ FIX START: Create a reference to the nested data object
    const responseData = data.data; // This is the object containing 'user' and 'session'

    console.log(`LoginPopup: Check Conditions:`);
    console.log(` - backendResponse.ok: ${backendResponse.ok}`);
    console.log(` - data.success: ${data.success}`);
    console.log(` - responseData.session exists: ${!!responseData.session}`); // Check responseData
    console.log(` - responseData.user exists: ${!!responseData.user}`);     // Check responseData
    
    if (responseData.session) { // Check responseData
      console.log(` - responseData.session.authToken (from backend): ${responseData.session.authToken}`);
      console.log(` - responseData.session.expires_at: ${responseData.session.expires_at}`);
    }
    if (responseData.user) { // Check responseData
      console.log(` - responseData.user.id: ${responseData.user.id}`);
      console.log(` - responseData.user.email: ${responseData.user.email}`);
      console.log(` - responseData.user.name: ${responseData.user.name}`);
    }


    // 🔥🔥🔥 CRITICAL FIX: Use responseData in the if condition 🔥🔥🔥
    if (backendResponse.ok && data.success && responseData.session && responseData.user) {
      console.log("LoginPopup: ALL CONDITIONS MET. Proceeding to store token and close popup.");
      
      const tokenToStore = responseData.session.authToken; // Use responseData
      console.log("LoginPopup: Value of tokenToStore before setting to localStorage:", tokenToStore);

      localStorage.setItem('customerId', responseData.session.userId);
      localStorage.setItem('authToken', tokenToStore);
      localStorage.setItem('expiresAt', responseData.session.expires_at ? responseData.session.expires_at.toString() : ''); // Use responseData

      localStorage.setItem('customerData', JSON.stringify({
        id: responseData.user.id, // Use responseData
        name: responseData.user.name || 'Google User', // Use responseData
        phone: responseData.user.phone || '',
        email: responseData.user.email, // Use responseData
        address: responseData.user.address || null,
        area: responseData.user.area || null,
        orders: responseData.user.orders || []
      }));

      const storedAuthToken = localStorage.getItem('authToken');
      console.log("LoginPopup: AuthToken read from localStorage IMMEDIATELY after set (inside LoginPopup):", storedAuthToken);

      setAuthMessage("Google Sign-In successful! Redirecting...");
      
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for propagation, if needed

      onClose(); // This calls the onClose prop in App.tsx
    } else {
      console.error("LoginPopup: One or more conditions FAILED. Displaying error message.");
      setAuthMessage(data.message || 'Google sign-in with backend failed. Please try again.');
    }
  } catch (error) {
    console.error("LoginPopup: Caught error during backend communication or JSON parsing:", error);
    setAuthMessage('Network error or unexpected issue. Please check console.');
  } finally {
    setIsSigningIn(false);
  }
};

  const handleGoogleLoginError = () => {
    console.log('LoginPopup: Google Login Failed via @react-oauth/google.');
    setAuthMessage("Google Sign-In failed. Please try again.");
    setIsSigningIn(false);
  };

  useEffect(() => {
    // This useEffect is intentionally left minimal as @react-oauth/google handles GIS initialization.
    // Ensure GoogleOAuthProvider is correctly wrapping App.tsx for this to work.
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gray-200 bg-opacity-50 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-[#6552FF]/80 backdrop-blur-xl rounded-[30px] p-8 w-full max-w-md text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20"
            style={{
              WebkitBackdropFilter: 'blur(8px)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold mb-6">
                Login To Order
              </h2>

              <div className="space-y-6 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  // Removed the 'render' prop for now, as it was causing TypeScript errors.
                  // GoogleLogin will render its default button.
                />
                
                {authMessage && (
                  <p className={`text-sm mt-1 ${authMessage.includes('successful') ? 'text-green-200' : 'text-red-200'}`}>{authMessage}</p>
                )}
                {isSigningIn && (
                    <div className="flex justify-center mt-4">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                )}
              </div>
            </motion.div>

            <p className="text-sm text-center mt-6 text-white/70">
              By Signing In You Are Agreeing Our Terms & Conditions And Privacy Policies
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
