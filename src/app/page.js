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
import { BookCopy, BookOpen, CheckCircle, Clock, Facebook, HelpCircle, Info, Instagram, Pointer, Sparkles, Store, Twitter, X } from 'lucide-react';
import { bookshelf, dailyGoal, dic, recap, scaninghands } from '@/assets';
import Image from 'next/image';
import requestNotificationPermission from '@/requestPermission';


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
        <Title level={3} style={{textAlign: 'center', marginTop: '38px', marginBottom: '0px', marginLeft: '-38px',
        width: '100vw', backgroundColor: priColor,
        color: 'white', 
        padding: '30px',
        fontWeight: '300',
        position: 'sticky',
        top: '0px',
      display: 'flex',
      
      }}>
           <div align="center" style={{width: '100vw'}}> 
           {/* <Sparkles size={30} style={{color: 'white'}} /> */}
            Revolutionizing<br/> Reading Experiences </div>
           
        </Title>    
        <Title level={5} style={{textAlign: 'center', marginBottom: '40px', marginTop :'0px', marginLeft: '-38px',
        width: '100vw', backgroundColor: '#909090',
        color: 'white', 
        padding: '7px',
        fontWeight: '400',
      display: 'flex',
      
      }}>
           <div align="center" style={{width: '100vw'}}>
            &nbsp; One page at a time  </div>
           
        </Title>   

        <br/>
        <div align="left">
      <SignInWithGoogle router={router} /> 
</div>
      <div> 


{/* 
     <Title level={4} style={{ padding: '0px', color: priTextColor,
        fontWeight: '300',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
      }}>
         &nbsp; Revolutionizing<br/> Reading Experiences <br/>
          
      </Title>  */}

      <div 
      style={{
        width: '100vw',
        marginLeft: '-40px',
        padding: '10px 0px'
      }}
      >









      


<div style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}>


<div align="center"
style={{height: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}
>
      <Title level={4} style={{ paddingLeft: '10px', color: priTextColor,
        fontWeight: '300',
      display: 'flex',
      alignItems: 'center',
      }}>
         Set goals &nbsp; 
         <Popover 
        placement='topLeft'
        title="Recap"
        content={
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <Clock size={20} /> &nbsp; Need to read with an aim?
            </span>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <CheckCircle size={20} /> &nbsp; Set daily target for reading
            </span>
            {/* <span style={{display: 'flex', alignItems: 'center'}}>
              <HelpCircle size={20} /> &nbsp; 
            </span> */}
          </div>
        }
        >
         <Info style={{color: priColor ,
         transform: 'translate(-3px, 2px)',
        }} size={18} />
         </Popover>
        </Title>
</div>



<Image src={dailyGoal} alt=" " style={{
        width: '55%',
        height: 'auto',
        marginTop: '37px'
      }} />

      </div>



<br/>
<br/>


<div style={{
        display: 'flex',
       
        justifyContent: 'space-around',
      }}>
<Image src={bookshelf} alt=" " style={{
        width: '50%',
        height: 'auto',
      }} />

<div align="center"
style={{height: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}
>
<Title level={4} style={{ paddingRight: '10px', color: priTextColor,
        fontWeight: '300',
      display: 'flex',
      alignItems: 'flex-end',
      }}>
         Digital
         <br/>
         Bookshelf&nbsp; 
         <Popover 
        placement='topRight'
        title="In-Page Dictionary"
        content={
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <BookCopy size={20} /> &nbsp; Add multiple books
            </span>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <CheckCircle size={20} /> &nbsp; Track Progress
            </span>
            {/* <span style={{display: 'flex', alignItems: 'center'}}>
              <HelpCircle size={20} /> &nbsp; 
            </span> */}
          </div>
        }
        >
         <Info style={{color: priColor,
          transform: 'translateY(-4px)',
        
        }} size={18} />
        </Popover>
        </Title>
</div>

      </div>




      <br/>
      <br/>





      


<div style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}>


<div align="center"
style={{height: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}
>
      <Title level={4} style={{ paddingLeft: '10px', color: priTextColor,
        fontWeight: '300',
      display: 'flex',
      alignItems: 'center',
      }}>
         Recap &nbsp; 
         <Popover 
        placement='topLeft'
        title="Recap"
        content={
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <Clock size={20} /> &nbsp; Picking a book after a break?
            </span>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <CheckCircle size={20} /> &nbsp; Get recap of what you've read thus far
            </span>
            {/* <span style={{display: 'flex', alignItems: 'center'}}>
              <HelpCircle size={20} /> &nbsp; 
            </span> */}
          </div>
        }
        >
         <Info style={{color: priColor ,
         transform: 'translate(-3px, 2px)',
        }} size={18} />
         </Popover>
        </Title>
</div>



<Image src={recap} alt=" " style={{
        width: '50%',
        height: 'auto',
      }} />

      </div>
  


      
      <br/>
      <br/>
      <br/>





<div style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}>


 <Image src={dic} alt=" " style={{
        width: '50%',
        height: 'auto',
      }} />


<div align="center"
style={{height: 'auto', display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center'}}
>
      <Title level={4} style={{ paddingRight: '10px', color: priTextColor,
        fontWeight: '300',
      display: 'flex',
      alignItems: 'flex-end',
      }}>
         In-Page 
         <br/>
         Dictionary&nbsp; 
         <Popover 
        placement='topRight'
        title="In-Page Dictionary"
        content={
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <Pointer size={20} /> &nbsp; Tap on words for meanings
            </span>
            <span style={{display: 'flex', alignItems: 'center'}}>
              <CheckCircle size={20} /> &nbsp; AI Powered context
            </span>
            {/* <span style={{display: 'flex', alignItems: 'center'}}>
              <HelpCircle size={20} /> &nbsp; 
            </span> */}
          </div>
        }
        >
         <Info style={{color: priColor,
          transform: 'translateY(-3px)',
        
        }} size={18} />
        </Popover>
        </Title>
</div>



      </div>



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
      <div style={{width: '100vw', marginLeft: '-38px', padding: '20px 0px', backgroundColor: '#909090', color: 'white',
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
