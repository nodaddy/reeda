import { priColor } from '@/configs/cssValues';
import { Card, Button, Modal, Tooltip, Spin } from 'antd';
import { time } from 'framer-motion';
import { Flame, Clock, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';

const StreakCard = ({ streak, isActive }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0 });

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
        style={{
          borderRadius: '16px',
          width: '100%',
          margin: 'auto',
          border: '0px',
          backgroundColor: 'transparent',
          marginTop: '30px',
        }}
      > 
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
        {timeLeft.hours < 24 ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <div style={{ textAlign: 'left'}}>
            <Clock color="#1890ff" size={32} />
            <p style={{ margin: 0, fontWeight: 'bold', color: '#1890ff' }}>
              {`${timeLeft.hours}h ${timeLeft.minutes}m`}
            </p>
            <span style={{ color: '#8c8c8c' }}>remaining to reset streak</span>
          </div>
        </div> : <span></span>}

        <div align="right">
          <Flame color={isActive ? '#fa541c' : '#bfbfbf'} size={40} />
          <div align="center">
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#555555' }}>
              <span style={{ display: 'flex', fontWeight: '500', justifyContent: 'flex-end', alignItems: 'center' }}>
                {`${isActive ? streak?.days : 0} ${streak?.days > 1 ? 'Days' : 'Day'}`}
              </span>
            </p>
            <h4 style={{ margin: 0, color: isActive ? '#fa541c' : '#8c8c8c' }}>
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