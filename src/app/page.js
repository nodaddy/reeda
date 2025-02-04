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
import ContinueReading from '@/components/ContinueReading';
import { storage } from './utility';


const { Title } = Typography;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const [goodsDetails, setGoodsDetails] = useState(null);

  // differnece in seconds
  const [lastPageScanDifference, setLastPageScanDifference] = useState(0);

  useEffect(()=> {
    const getGoodsDetails = async () => {
      if (typeof window !== 'undefined') {
        alert('in window');
        if('getDigitalGoodsService' in window){
        alert('in goods service');
          const service  = await window.getDigitalGoodsService('https://play.google.com/billing');
          if(service){
        alert('service');
          const goodsDetails = service.getDetails(['base-plan']).then(async (response) => {
            alert(JSON.stringify(response));
            setGoodsDetails(goodsDetails); 

            const itemId = response[0].itemId;

            const paymentMethods = [ {
              supportedMethods: 'https://play.google.com/billing',
              data: {
              sku: itemId,
              }
              }];
              const request = new PaymentRequest (paymentMethods);
              const paymentResponse = await request.show();
              alert(JSON.stringify(paymentResponse));
              const {purchaseToken} = paymentResponse.details;
              alert(JSON.stringify(purchaseToken));
              const paymentComplete = await paymentResponse.complete();
              alert(JSON.stringify(paymentComplete));
              // Here, you should grant appropriate entitlements for the purchase
              await service.acknowledge(purchaseToken, getPurchaseType(item.itemId));
            }).catch(error => {
              alert(JSON.stringify("error"));
            });
        }else {
          // alert('no');
        }
      }
    }
  }
  getGoodsDetails();
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

  return ( !storage.getItem('user') ?
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
