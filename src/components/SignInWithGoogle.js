 
// src/app/signin/page.tsx
import { useState } from 'react';
import { Button, Typography } from 'antd';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../firebase/'; // adjust path as needed
import { GoogleOutlined } from '@ant-design/icons';
import { logGAEvent } from '@/firebase/googleAnalytics';
import { createProfile, getProfile } from '@/firebase/services/profileService';

const { Title } = Typography;

const SignInWithGoogle = ({router}) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    logGAEvent('google_sign_in_button_clicked', { method: 'google' });
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;
      console.log('User Info:', user);

      const userId = user.email;

      const existingProfile = await getProfile(userId); // Assume you have a function to fetch the profile
      
      if (!existingProfile) {
        // Create a new profile if one doesn't exist
        await createProfile(userId, {streak: {days: 0,
          lastPageScanTimestamp: Date.now()}}); // Assume createProfile is a function to create a new profile
      
      }

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(user));
      router.push("/");
      window.location.reload();
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
      <Button
        type="ghost"
        icon={<GoogleOutlined />}
        size="large"
        style={{border: '1px solid silver'}}
        onClick={handleSignIn}
      >
        Sign In with Google
      </Button>
  );
};

export default SignInWithGoogle;
