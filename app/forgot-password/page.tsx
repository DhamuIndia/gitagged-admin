// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';
// import { auth } from '../../lib/firebase';
// import {
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from 'firebase/auth';

// export default function ForgotPasswordPage() {
//   const router = useRouter();

//   const [phone, setPhone] = useState('');
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmation, setConfirmation] = useState<any>(null);
//   const [step, setStep] = useState(1);

//   // 🔹 SEND OTP
//   const sendOtp = async () => {
//     try {
//       const formattedPhone = `+91${phone}`;
//       const recaptcha = new RecaptchaVerifier(
//         auth,
//         'recaptcha-container',
//         {
//           size: 'invisible',
//         }
//       );

//       const confirmationResult = await signInWithPhoneNumber(
//         auth,
//         formattedPhone,
//         recaptcha
//       );

//       setConfirmation(confirmationResult);
//       setStep(2);
//       alert('OTP sent successfully');
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   // 🔹 VERIFY OTP + RESET PASSWORD
//   const verifyAndReset = async () => {
//     try {
//       const result = await confirmation.confirm(otp);
//       const idToken = await result.user.getIdToken();

//       await axios.post('http://localhost:3002/auth/reset-password', {
//         idToken,
//         newPassword,
//       });

//       alert('Password reset successfully');
//       router.push('/');
//     } catch (err: any) {
//       alert(err.response?.data?.message || err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-black">
//       <div className="bg-white p-8 rounded-xl w-full max-w-md">

//         <h2 className="text-xl font-bold mb-6 text-center">
//           Reset Password
//         </h2>

//         {step === 1 && (
//           <>
//             <input
//               type="text"
//               placeholder="Enter Phone Number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="w-full mb-4 border p-2 rounded"
//             />

//             <div id="recaptcha-container" className="mb-4"></div>

//             <button
//               onClick={sendOtp}
//               className="w-full bg-black text-white p-2 rounded"
//             >
//               Send OTP
//             </button>
//           </>
//         )}

//         {step === 2 && (
//           <>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full mb-4 border p-2 rounded"
//             />

//             <input
//               type="password"
//               placeholder="Enter New Password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="w-full mb-4 border p-2 rounded"
//             />

//             <button
//               onClick={verifyAndReset}
//               className="w-full bg-black text-white p-2 rounded"
//             >
//               Verify & Reset
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { auth } from '../../lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';

let recaptchaVerifier: RecaptchaVerifier | null = null;


export default function ForgotPasswordPage() {

  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState(1);

  // 🔹 Initialize reCAPTCHA once
  useEffect(() => {

    if (!recaptchaVerifier) {
      recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
        }
      );
    }

    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        recaptchaVerifier = null;
      }
      const recaptcha = document.getElementById('recaptcha-container');
      if (recaptcha) {
        recaptcha.innerHTML = '';
      }
    };

  }, []);

  // 🔹 SEND OTP
  const sendOtp = async () => {

    try {

      const formattedPhone = `+91${phone}`;

      if (!recaptchaVerifier) {
        throw new Error('Recaptcha not initialized');
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier
      );

      setConfirmation(confirmationResult);
      setStep(2);

      alert('OTP sent successfully');

    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // 🔹 VERIFY OTP + RESET PASSWORD
  const verifyAndReset = async () => {

    try {

      if (!confirmation) {
        throw new Error('OTP confirmation missing');
      }

      const result = await confirmation.confirm(otp);

      const idToken = await result.user.getIdToken();

      await axios.post(
        'http://localhost:3002/auth/reset-password',
        {
          idToken,
          newPassword,
        },
        {
          timeout: 10000,
        }
      );

      alert('Password reset successfully');

      router.push('/');

    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">

      <div className="bg-white p-8 rounded-xl w-full max-w-md">

        <h2 className="text-xl font-bold mb-6 text-center">
          Reset Password
        </h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-4 border p-2 rounded"
            />

            <div id="recaptcha-container"></div>

            <button
              onClick={sendOtp}
              className="w-full bg-black text-white p-2 rounded"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 border p-2 rounded"
            />

            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 border p-2 rounded"
            />

            <button
              onClick={verifyAndReset}
              className="w-full bg-black text-white p-2 rounded"
            >
              Verify & Reset
            </button>
          </>
        )}

      </div>

    </div>
  );
}