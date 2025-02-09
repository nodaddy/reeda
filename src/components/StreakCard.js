import { storage } from '@/app/utility';
import { priColor, priTextColor, secColor, secTextColor } from '@/configs/cssValues';
import { Card, Button, Modal, Tooltip, Spin } from 'antd';
import { time } from 'framer-motion';
import { Flame, Clock, Loader, GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const StreakCard = ({ streak, isActive, isPremium = true}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

  const currentHour = new Date().getHours();
let greeting = '';
let Icon = Sun;

if (currentHour >= 5 && currentHour < 12) {
  greeting = 'Good Morning!';
  Icon = Sun;  // Display sun icon for morning
} else if (currentHour >= 12 && currentHour < 18) {
  greeting = 'Good Afternoon!';
  Icon = Sun;  // Display sun icon for afternoon
} else {
  greeting = 'Good Evening!';
  Icon = Moon;  // Display moon icon for evening/night
}

  const handleRevive = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (streak) {
      setLoading(false);

      const updateCountdown = () => {
        const now = Date.now();
        const nextReset = streak.lastPageScanTimestamp + 48 * 60 * 60 * 1000;
        const diff = nextReset - now;

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft({ hours, minutes });
        } else {
          setTimeLeft({ hours: 0, minutes: 0 });
        }
      };

      const interval = setInterval(updateCountdown, 60000);
      updateCountdown();

      return () => clearInterval(interval);
    }
  }, [streak]);

  return (
    loading ? <Card
    style={{
      borderRadius: '16px',
      width: '100%',
      margin: 'auto',
      border: '0px',
      backgroundColor: 'transparent',
      
    }}
  >
    <br/>
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    }}> 
    <div></div>
    <div align="right">
      <Loader className='loader' color={'grey'} size={40} />
      <div align="center">
        <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#555555' }}>
          <span style={{ display: 'flex', color: 'transparent', fontWeight: '500', justifyContent: 'flex-end', alignItems: 'center' }}>
            {`${isActive ? streak?.days : 0} ${streak?.days > 1 ? 'Days' : 'Day'}`}
          </span>
        </p>
        <h4 style={{ margin: 0, color: 'transparent'}}>
          f
        </h4>
      </div>
    </div>
    </div>
    <Modal
      title="Revive Streak"
      visible={isModalVisible}
      onOk={handleRevive}
      onCancel={() => setIsModalVisible(false)}
      okText="Revive"
      style={{ zIndex: 9999 }}
      cancelText="Cancel"
    >
      <p>Are you sure you want to revive your streak?</p>
    </Modal>
  </Card> : (
     <Card
     bodyStyle={{
    

    //  background: isPremium ? 'linear-gradient(135deg, #B08D01, goldenrod, gold,  whitesmoke)' : "linear-gradient(155deg,  silver,  whitesmoke)", // Gold, platinum, and light metallic gradient
    }}
     style={{
      background: 'linear-gradient(11deg, silver, whitesmoke, whitesmoke) 0% 0% / 200% 200%',
       width: '96%',
       margin: 'auto',
     borderRadius: '12px',

       border: '0px',
       backgroundColor: 'transparent',
       backgroundSize: '200% 200%',
      //  animation: 'shine 3s ease-in-out infinite', // Shine animation for glaring effect
       marginTop: '28px',
       marginBottom: '23px',
      //  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Stronger shadow for depth
     }}
   >
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}>
        { <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div style={{ textAlign: 'left'}}> 
  <div style={{ 
             fontSize: '18px', 
             color: isPremium ? 'whitesmoke' : priTextColor,
             display: 'flex', 
             alignItems: 'flex-start' 
          }}>
    
    <span ><sub style={{
      display: 'flex',
      alignItems: 'center',
      fontWeight: '300px'
    }}> <Icon size={25} style={{ marginRight: '10px' }} /> {greeting}</sub>
    <div style={{
      marginTop: '-10px',
      fontSize: '16px',
      fontWeight: '300'
    }}>
      <Icon size={25} style={{ marginRight: '10px', opacity: '0' }} />{JSON.parse(storage.getItem('user')).displayName.split(" ").slice(0, 2).join(" ")}
      </div>
      </span>
  </div> 




          </div>
        </div>}

        <div align="right">
          <Flame color={isActive ? '#fa541c' : '#bfbfbf'} size={30} />
          <div align="center">
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: 'grey' }}>
              <span style={{ display: 'flex', fontWeight: '500', justifyContent: 'flex-end', alignItems: 'center' }}>
                {`${isActive ? streak?.days : 0} ${streak?.days > 1 ? 'Days' : 'Day'}`}
              </span>
            </p>
            <h4 style={{ margin: 0, color: isActive ? '#fa541c' : '#8c8c8c', fontWeight: '400' }}>
              {isActive ? 'Streak Active' : 'Inactive Streak'}
            </h4>
          </div>
        </div>
        </div>
      </Card>
    )
  );
};

export default StreakCard;