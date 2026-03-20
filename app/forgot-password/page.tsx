'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useRef } from 'react';
import { auth } from '../../lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';

export default function ForgotPasswordPage() {

  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState(1);
  const [confirmPassword, setConfirmPassword] = useState('');
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  // 🔹 Initialize reCAPTCHA once
  useEffect(() => {

    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
        }
      );
    }
    return () => {
      recaptchaRef.current?.clear();
      recaptchaRef.current = null;
    };

  }, []);

  // 🔹 SEND OTP
  const sendOtp = async () => {

    try {

      const formattedPhone = `+91${phone}`;

      if (!recaptchaRef.current) {
        throw new Error('Recaptcha not initialized');
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        // recaptchaVerifier
        recaptchaRef.current!
      );

      setConfirmation(confirmationResult);
      setStep(2);

      alert('OTP sent successfully');

    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // verfiy otp
  const verifyOtp = async () => {
    try {
      if (!confirmation) throw new Error('OTP confirmation missing');

      if (otp.length !== 6) {
        alert('Enter the valid otp!!');
        return;
      }

      const result = await confirmation.confirm(otp);

      const idToken = await result.user.getIdToken();

      // store temporarily
      localStorage.setItem('resetToken', idToken);

      setStep(3); // ✅ move to password step
    } catch (err: any) {
      alert(err.message);
    }
  };

  // reset password
  const resetPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const idToken = localStorage.getItem('resetToken');

      await axios.post('http://localhost:3002/auth/reset-password', {
        idToken,
        newPassword,
      });

      alert('Password reset successfully');
      localStorage.removeItem('resetToken');
      router.push('/');

    } catch (err: any) {
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

            <button onClick={verifyOtp} className="w-full bg-black text-white p-2 rounded">
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 border p-2 rounded"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 border p-2 rounded"
            />

            <button onClick={resetPassword} className="w-full bg-black text-white p-2 rounded">
              Reset Password
            </button>
          </>
        )}

      </div>

    </div>
  );
}