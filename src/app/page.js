"use client"

// src/app/signin/page.tsx
import { useEffect, useState } from 'react';
import SignInWithGoogle from '@/components/SignInWithGoogle';
import { useRouter } from 'next/navigation';
import { Typography } from 'antd';
import SimpleLang from '@/components/OriginalTextWithTooltips';
import { priColor } from '@/configs/cssValues';
import BookList from '@/components/BookList';
import { getProfile, updateProfile } from '@/firebase/services/profileService';
import StreakCard from '@/components/StreakCard';
import ReadingMetricsCard from '@/components/ReadingMetricsCard';
import ContinueReading from '@/components/ContinueReading';


const { Title } = Typography;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  // differnece in seconds
  const [lastPageScanDifference, setLastPageScanDifference] = useState(0);

  useEffect(() => {
    if (profile?.streak?.lastPageScanTimestamp) {
      const now = Date.now();
      const lastPageScanTimestamp = profile.streak.lastPageScanTimestamp;
      const lastPageScanDifference = Math.ceil((now - lastPageScanTimestamp)/1000);
      console.log(lastPageScanDifference);
      if(lastPageScanDifference > 84600){
        if(profile.streak.days > profile.streak.longestStreak){
          updateProfile(JSON.parse(localStorage.getItem('user')).email, {...profile, streak: {
            ...profile.streak,
            longestStreak: profile.streak.days,
            days: 0
          }}) 
        } else {
          updateProfile(JSON.parse(localStorage.getItem('user')).email, {...profile, streak: {
            ...profile.streak,
            days: 0
          }})
        }
      }
      setLastPageScanDifference(lastPageScanDifference);
    }
  }, [profile]);
  
  


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Replace 'userId' with the actual user ID (e.g., from authentication)
        const userId = JSON.parse(localStorage.getItem('user')).email; // You can get this from Firebase Auth or context
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

  return ( !localStorage.getItem('user') ?
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '70vh', alignItems: 'center'}}>
      <SignInWithGoogle router={router} />
    </div> : 
    <div style={{
      overflow: 'auto',
      paddingBottom: '100px'
    }}>
      <StreakCard streak={profile?.streak} isActive={lastPageScanDifference < 86400*2} /> 
      <br/>
      <BookList />

      <br/>
      <ContinueReading />
    <br/>
    <br/>
    <br/>
    </div>
  );
};

export default Home;
