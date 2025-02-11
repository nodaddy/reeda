"use client"

// src/app/signin/page.tsx
import { useEffect, useState } from 'react';
import SignInWithGoogle from '@/components/SignInWithGoogle';
import { useRouter } from 'next/navigation';
import { Alert, Typography } from 'antd';
import BookList from '@/components/BookList';
import { getProfile, updateProfile } from '@/firebase/services/profileService';
import { storage } from './utility';
import { isUserPremium } from '@/payments/playstoreBilling';
import { useAppContext } from '@/context/AppContext';
import { priTextColor } from '@/configs/cssValues';
import { BookCopy, BookOpen } from 'lucide-react';
import { scaninghands } from '@/assets';
import Image from 'next/image';


const { Title } = Typography;

const Home = () => {
  const userInStorage = storage.getItem('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [goodsDetails, setGoodsDetails] = useState(null);

  const { profile, setProfile, isPremium, setIsPremium } = useAppContext();

  // differnece in seconds
  const [lastPageScanDifference, setLastPageScanDifference] = useState(0);

  useEffect(()=> {

  async function setDailyAlarm() {
    if ("alarms" in navigator) {
        const alarmTime = new Date();
        alarmTime.setHours(22, 0, 0, 0); // Set to 9:00 PM
        await navigator.alarms.set("dailyReminder", {
            when: alarmTime.getTime(),
            periodInMinutes: 1440, // Repeat every 24 hours
        });
        console.log("Daily alarm set!");
    } else {
        console.log("Alarms API not supported.");
    }
  }

  setDailyAlarm();  

    if(storage.getItem('user')) {
      router.push('/home');
    }
  }, []);

  useEffect(() => {
    if (profile?.streak?.lastPageScanTimestamp && storage.getItem('user')) {
      const now = Date.now();
      const lastPageScanTimestamp = profile.streak.lastPageScanTimestamp;
      const lastPageScanDifference = Math.ceil((now - lastPageScanTimestamp)/1000);
      console.log(lastPageScanDifference);
      if(lastPageScanDifference > 84600){
        if(profile.streak.days > profile.streak.longestStreak){
          updateProfile(JSON.parse(storage.getItem('user')).email, {...profile, streak: {
            ...profile.streak,
            longestStreak: profile.streak.days,
            days: 0
          }}) 
        } else {
          updateProfile(JSON.parse(storage.getItem('user')).email, {...profile, streak: {
            ...profile.streak,
            days: 0
          }})
        }
      }
      setLastPageScanDifference(lastPageScanDifference);
    }
  }, [profile]);

  useEffect(() => {
    isUserPremium().then((result) => setIsPremium(result)).catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Replace 'userId' with the actual user ID (e.g., from authentication)
        const userId = JSON.parse(storage.getItem('user')).email; // You can get this from Firebase Auth or context
        console.log(userId);
        let profileData;
        if (userId) {
          profileData = await getProfile(userId);
        }
        setProfile(profileData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return ( !userInStorage &&
    <div
    align="center"
    style={{
      marginTop: '-10px'
    }}>
      <div
      style={{
        width: '76%',
        borderRadius: '16px',
        padding: '0px 40px'
      }}>
        <Title level={2} style={{ padding: '0px', color: priTextColor,
        fontWeight: '300',
      display: 'flex',
      alignItems: 'flex-end',
      }}>
        <BookOpen size={35} /> &nbsp; Reeda
        </Title>
        <Title level={4} style={{textAlign: 'left', marginTop: '-5px', marginBottom: '20px', color: priTextColor, fontWeight: '300', 
      display: 'flex',
      
      }}>
           Take your reading productivity to the next level!
           One page at a time
        </Title>   
        <br/>
        <div> 
      <br/>
      <br/>
      <Image src={scaninghands} alt=" " style={{
        width: '100vw',
        position: 'absolute',
        bottom: '0px',
        height: 'auto',
        left: '0px'
      }} />
      <br/>
      <br/>
      <SignInWithGoogle router={router} /> 
        </div>
      </div> 
    </div>
  );
};

export default Home;
