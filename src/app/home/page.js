"use client"

// src/app/signin/page.tsx
import { useEffect, useState } from 'react';
import SignInWithGoogle from '@/components/SignInWithGoogle';
import { useRouter } from 'next/navigation';
import { Alert, Badge, Divider, Popover, Tag, Typography } from 'antd';
import BookList from '@/components/BookList';
import { getProfile, updateProfile } from '@/firebase/services/profileService';
import StreakCard from '@/components/StreakCard';
import { storage } from '@/app/utility';
import { isUserPremium } from '@/payments/playstoreBilling';
import { useAppContext } from '@/context/AppContext';
import { Bolt, BookCopy, BookOpen, Brain, Camera, ClipboardList, Info, Lightbulb, Play, PlayCircle, Pointer, ShoppingBag, Sparkles, TriangleRight, Zap } from 'lucide-react';
import { scaninghands } from '@/assets';
import Image from 'next/image';
import { streakMaintenanceIntervalInSeconds } from '@/configs/variables';
import Link from 'next/link';
import { searchByTitle } from '@/googleBooks';
import { priColor } from '@/configs/cssValues';
import ScanRead from '@/components/ScanRead';


const { Title } = Typography;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { profile, setProfile, isPremium, setIsPremium, summaryOrFullText, setSummaryOrFullText } = useAppContext();

  // differnece in seconds
  const [lastPageScanDifference, setLastPageScanDifference] = useState(0)

  useEffect(()=>{
    searchByTitle('harry potter').then((res) => {
      console.log(res);
    });
    if(typeof navigator !== "undefined") {
      if("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log("Service Worker registered:", registration);
          })
          .catch((err) => console.log("Service Worker registration failed:", err));
      } 
    }
  }, []);

  useEffect(() => {
    if (profile?.streak?.lastPageScanTimestamp) {
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

  return ( !loading &&
    <div style={{
      overflow: 'auto',
    }}>
      <StreakCard isPremium={false} streak={profile?.streak} isActive={lastPageScanDifference < streakMaintenanceIntervalInSeconds*2} /> 
      {/* {!isPremium && <Alert style={{
        border: '0px',
        padding: '15px 20px',
        width: '93%',
        margin: 'auto'
      }} message={<> <Lightbulb size={20} /> 
      &nbsp;
      Using free version,
      you can add upto 1 book! 
      Click <Link href="/premium">here</Link> to unlock Reeda premium.
      </>} type="warning" />} */}
     <ScanRead />
<br/>
      <BookList />
      {/* <ContinueReading /> */}
    </div>
  );
};

export default Home;
