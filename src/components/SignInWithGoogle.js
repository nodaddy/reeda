 
'use client'

// src/app/signin/page.tsx
import { useContext, useState } from 'react';
import { Button, Spin, Typography } from 'antd';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../firebase/'; // adjust path as needed
import { logGAEvent } from '@/firebase/googleAnalytics';
import { createProfile, getProfile } from '@/firebase/services/profileService';
import { storage } from '@/app/utility';
import { Loading3QuartersOutlined } from '@ant-design/icons';
import { useAppContext } from '@/context/AppContext';

const { Title } = Typography;

const SignInWithGoogle = ({router}) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);

  const {setProfile} = useAppContext();

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
        await createProfile(userId, {
          streak: {days: 0, lastPageScanTimestamp: Date.now()},
          coins: 10
        });
      }

      // Save user data to localStorage
      storage.setItem('user', JSON.stringify(user));
      router.push("/home");
      // window.location.reload();
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
        icon={<img
          style={{width: '26px', marginTop: '3px'}}
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA4CAMAAABuU5ChAAAA+VBMVEX////pQjU0qFNChfT6uwU0f/O4zvs6gfSJr/j6twDoOisjePPoNSXpPjDrWU/oLRr+9vZ7pff/vAAUoUAkpEn0ran619b82pT7wgD+68j947H/+e7//PafvPm/0vuBw5Df7+P63tz3xcPxl5HnJQ7qUEXxj4n4z83zoJzqSz/vgXrucWrsY1r1tbHrSBPoOjbvcSr0kx74rRH80XntZC3xhSPmGRr86+r4sk/936EJcfPS3/yowvnbwVKjsTjx9f5urEjkuBu9tC+ErkJyvoRRpj2az6hWs23j6/0emX2z2btAiuI8k8AyqkE5nZU1pGxCiOxVmtHJ5M+PSt3WAAACGElEQVRIieWSa3fSQBCGk20CJRcW2AWKxgJtqCmieNdatV5SUtFq5f//GJeE7CXJJOT4TZ+PO+c58+7MaNr/SWd60mecTDs1pMFp28dODPZnZw/369TXseXqHNfCblDdte84krTDwUFFwnMnJyXm+bSsmZ/vlcb1+6A2x5C1xYeyPgIyJlhtYDjzjOYyZA3oFighLYxni8UMY6dCG/jy9KzTQfI8DXSnTNN0kcl1lNE9dlxYC8TnnEVmAJ02qHlPllyb58vgmQ2Np0tYgzGMo2ex6IKRihi1mPhcZyYuO8McL4yYl0vrrI6mJZpx9Or1mzqa10rFt8p7o5ArXh+lXutC8d6ZBdiXvH6PeyPFsw8KMBu8fsG9+3t473l9yD1vD+/BX3v1cgqv3lzE/8A9NCUK5sn33vugeN1DQTcVTbG/9M56H+lEAzg2d54t7iW5657xCdEx5PF+B9Lj9oO9z4hBgIZX6YyaXfmZaV9QQkU781h+Hra+7jQaFv6Or8RW3r1rhErES641D9XKigox8jJaQxyAfZOpIQm6kiuT6BvfujqVuEpkkY43u+d1RBBF35v55aVJidKSEBRFiJAk/+0PM3NjgjFFMLc/WVYzlzImLBPprzvzrlBjHUmZSH8DmqatS0QSZtcjTxUBWSlZw1bckhaYlISTcm1rIqKolJJxtRWnXUVscTFsjWFFwoy7WTM2+zX69/gDaLcy7SET9nsAAAAASUVORK5CYII=" alt="Google" />}
        size="large"
        style={{ fontSize: '16px', padding: '20px', border: '1px solid silver', backgroundColor: 'white', borderRadius: '999px'}}
        onClick={handleSignIn}
      >
        { loading ? <Spin indicator={<Loading3QuartersOutlined style={{fontSize: '19px'}} spin />} size="small" /> : <>&nbsp;Sign In</> } 
      </Button>
  );
};

export default SignInWithGoogle;
