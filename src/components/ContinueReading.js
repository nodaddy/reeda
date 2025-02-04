import { priColor, secColor } from '@/configs/cssValues';
import { getLatestScan } from '@/firebase/services/scanService';
import { Card, Typography, Progress, Tooltip } from 'antd';
import { BookMarked, BookOpen, BookOpenCheck, Loader, MoveRight, PlayCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

const ContinueReading = () => {
  const [latestScan, setLatestScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLatestScan()
      .then((res) => {
        setLatestScan(res);
        setLoading(false);
    })
      .catch((err) => {console.log(err);
        setLoading(false);
    });
  }, []);

  return ( latestScan &&
    <Link href={"/scan/" + latestScan?.bookTitle} style={{ textDecoration: 'none' }}>
      <div 
        style={{
          width: '100%',
          border: '0px',
        //   background: 'linear-gradient(135deg, #f9f9f9, #ffffff)',
        //   boxShadow: '8px 8px 24px rgba(0, 0, 0, 0.07)',
          padding: '10px',
          margin: 'auto',
          marginTop: '38px'
        }}
      > 
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
            <div
              style={{
                border: '1px solid gray',
                padding: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BookOpen size={32} color={'gray'} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: '#333', fontWeight:'300' }}>
                {latestScan?.bookTitle || <Loader className="loader" />}
              </Title>
              <Text type="secondary" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: secColor,
                fontSize: '15px'
              }}>
                Continue <MoveRight />
              </Text>
            </div>
          </div>
      </div>
    </Link>
  );
};

export default ContinueReading;