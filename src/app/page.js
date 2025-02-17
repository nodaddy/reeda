"use client"

// src/app/signin/page.tsx
import { useEffect, useState } from 'react';
import SignInWithGoogle from '@/components/SignInWithGoogle';
import { useRouter } from 'next/navigation';
import { Alert, Divider, Popover, Typography } from 'antd';
import BookList from '@/components/BookList';
import { getProfile, updateProfile } from '@/firebase/services/profileService';
import { storage } from './utility';
import { isUserPremium } from '@/payments/playstoreBilling';
import { useAppContext } from '@/context/AppContext';
import { priColor, priTextColor, secTextColor } from '@/configs/cssValues';
import { Bell, Book, BookCopy, BookOpen, CheckCircle, Clock, Dot, Facebook, Goal, HelpCircle, Hourglass, Info, Instagram, LetterText, Library, Lightbulb, Pointer, Popcorn, RefreshCcw, Sparkles, Store, Twitter, X } from 'lucide-react';
import Image from 'next/image';
import FeatureCarousel from '@/components/FeaturedCarousel';


const { Title } = Typography;

const Home = () => {
  const userInStorage = storage.getItem('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [goodsDetails, setGoodsDetails] = useState(null);

  const { profile, setProfile } = useAppContext();

  // differnece in seconds
  const [lastPageScanDifference, setLastPageScanDifference] = useState(0);

  const tagStyle = (delay) => ({
    display: 'flex',
    alignItems: 'center',
    display: 'none',
    gap: '6px',
    padding: '8px 17px',
    backgroundColor: 'black',
    borderRadius: '999px',
    color: 'white',
    fontWeight: '400',
    fontSize: '12px',
  });
  

  useEffect(()=> {

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
      margin: '-30px 30px',
    }}>
      <div
      style={{
      }}>
        <Title level={2} style={{ padding: '0px', color: priTextColor,
        fontWeight: '300',
      display: 'flex',
      alignItems: 'flex-end',
      }}>
        <BookOpen size={32} style={{marginBottom: '2px'}} /> &nbsp;Reeda
        
        </Title>
        <div align="left" style={{
          fontFamily: "'Inter', sans-serif",
          marginTop: '-15px',
          marginLeft: '3px',
          color: secTextColor
        }}>The Reading Assistant</div>
        <Title level={3} style={{textAlign: 'center', marginTop: '38px', marginBottom: '0px', marginLeft: '-38px',
        width: '100vw', backgroundColor: priColor,
        color: 'white', 
        padding: '17px',
        fontWeight: '300',
        position: 'sticky',
        zIndex: '99999',
        top: '0px',
      display: 'flex',
      
      }}>
           <div align="center" style={{width: '100vw',  display :'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '200'}}> 
           {/* <Sparkles size={30} style={{color: 'white'}} /> */}
          Scan <Dot /> Read <Dot /> Repeat </div>
           
        </Title>    
 
        {/* <Title level={5} style={{textAlign: 'center', marginBottom: '0px', marginTop :'0px', marginLeft: '-38px',
        width: '100vw', 
        backgroundColor: '#909090',
        color: 'white', 
        padding: '7px',
        fontWeight: '400',
      display: 'flex',
      
      }}>
           <div align="center" style={{width: '100vw'}}>
            &nbsp; Read books just  </div>
           
        </Title>    */}

        <div align="left">
      <SignInWithGoogle router={router} /> 
</div>
 


      </div> 
       <div style={{
        height: '60vh',
        display: 'flex',
        alignItems: 'center'
       }}>
<FeatureCarousel />

       </div>

      <div style={{width: '100vw', position: 'absolute', bottom: '0px', marginLeft: '-38px', padding: '20px 0px', 
      color: priTextColor,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
    }}>
        <span>Reeda</span>
        

        <span>
          <Instagram /> &nbsp; <Twitter />&nbsp; <Facebook />
        </span>
      </div>
    </div>
  );
};

export default Home;
