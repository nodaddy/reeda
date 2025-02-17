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
import { Bell, Book, BookCopy, BookOpen, CheckCircle, Clock, Facebook, Goal, HelpCircle, Hourglass, Info, Instagram, LetterText, Library, Lightbulb, Pointer, Popcorn, RefreshCcw, Sparkles, Store, Twitter, X } from 'lucide-react';
import { bookshelf, dailyGoal, dic, recap, scaninghands } from '@/assets';
import Image from 'next/image';


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
           <div align="center" style={{width: '100vw'}}> 
           {/* <Sparkles size={30} style={{color: 'white'}} /> */}
            Revolutionizing<br/> Reading Experiences </div>
           
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
      <div> 





      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', 
      flexWrap: 'wrap', width: '100vw', 
      padding: '30px 0px',
      fontFamily: "'Inter', sans-serif",
      marginLeft: '-38px'}}>
        <span style={tagStyle(Math.random() * 2)}>
         <Library size={14} />Create Bookshelf
        </span>
        <span style={tagStyle(Math.random() * 2)}>
          <Hourglass size={14} /> Summarize
        </span>
        <span style={tagStyle(Math.random() * 2)}>
          <Goal size={14} /> Track Progress
        </span>
        
        <span style={tagStyle(Math.random() * 2)}>
          <LetterText size={14} /> Build Vocabulary
        </span>
      
        <span style={tagStyle(Math.random() * 2)}>
        <RefreshCcw size={14} /> Recap Previous Readings
        </span>
        <span style={tagStyle(Math.random() * 2)}>
         <Bell size={14} /> Reminders
        </span>
        <span style={tagStyle(Math.random() * 2)}>
         <Lightbulb size={14} /> Night Mode
        </span>
      </div>




 



    


      

   
{/* 
      <Image src={scaninghands} alt=" " style={{
        width: '100vw',
        bottom: '0px',
        left: '0px',
        height: 'auto',
      }} /> */}

        </div>
      </div> 
      <br/>
      <br/>
      <br/>
      <div style={{width: '100vw', position: 'absolute', bottom: '0px', marginLeft: '-38px', padding: '20px 0px', 
      backgroundColor: 'black', color: 'white',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
    }}>
        <span>Reeda</span>
        

        <span>
          <Instagram /> &nbsp; <Twitter /> &nbsp; <Facebook />
        </span>
      </div>
    </div>
  );
};

export default Home;
