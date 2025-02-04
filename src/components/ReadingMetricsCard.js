import { secColor } from '@/configs/cssValues';
import { getBooks } from '@/firebase/services/bookService';
import { getScanCount } from '@/firebase/services/scanService';
import { Card, Progress, Row, Col, Typography } from 'antd';
import { Book, FileText, Clock, Library, Loader, ChartArea, ChartBar, ChartBarBig, Share, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography;

const ReadingMetricsCard = ({ metrics }) => {
  const [scanCount, setScanCount] = useState(0);
  const [books, setBooks] = useState(null);

useEffect(() => {
    getScanCount().then((count) => {
      setScanCount(count || '0');
    });

    getBooks().then((books) => { 
      setBooks(books?.length > 0 ? books : []);
    });
}, []);

  return (
    <Card
      style={{
        borderRadius: '16px',
        width: '95%',
        border: '0px',
        // boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
        // backgroundColor: 'grey',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingBottom: '30px'
      }}
      bodyStyle={{padding: '0px 20px'}}
    >

            <div
              style={{
                boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.15)',
                padding: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                bottom: '115px',
                right: '40px'
              }}
            >
              <Share2 size={32} color={secColor} />
            </div>

     <Title level={4} style={{ marginBottom: '10px', fontWeight: '300', borderBottom: '0px solid #ccc', paddingBottom: '16px',
        display: 'flex',
        alignItems: 'center',
     }}>
        My Reading Stats
      </Title> 

      <Row gutter={[16, 16]} style={{ width: '100%' }} justify="space-between">


        {/* Pages Read */}
        <Col xs={24} sm={8} style={{marginBottom: '-8px'}}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <FileText color="#555555" size={28} style={{ marginRight: '16px', opacity: 0.7 }} />
            <div>
              <Text style={{ fontSize: '20px', fontWeight: '500', color: '#555555' }}>
                {scanCount || <Loader size={18} className='loader' />}
              </Text>
              <Text style={{ fontSize: '14px', color: '#888' }}>&nbsp; Pages Read</Text>
            </div>
          </div>
        </Col>

        {/* books finished */}
        <Col xs={24} sm={8}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <Book color="#8D6E63" size={28} style={{ marginRight: '16px', opacity: 0.7 }} />
            <div>
              <Text style={{ fontSize: '20px', fontWeight: '500', color: '#555555' }}>
                {books?.length ? books?.filter((book) => book.totalPages < book.pagesRead).length : '0' || <Loader size={18} className='loader' />}
              </Text>
              <Text style={{ fontSize: '14px', color: '#888' }}>&nbsp; Books Finished</Text>
            </div>
          </div>
        </Col>

        {/* Books in library
        <Col xs={24} sm={8}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
          <Library color="#455A64" size={28} style={{ marginRight: '16px', opacity: 0.7 }} />
            <div>
              <Text style={{ fontSize: '22px', fontWeight: '500', color: '#555555' }}>
                {books?.length ? books.length : 0 || <Loader size={18} className='loader' />}
              </Text>
              <Text style={{ fontSize: '14px', color: '#888' }}>&nbsp; Books in Library</Text>
            </div>
          </div>
        </Col> */}
        
      </Row>

      {/* Total Time Spent Reading */}
      <div align="right" style={{ position: 'absolute', right: '0px', bottom: '28px' }}>
        <Text style={{ fontSize: '14px', color: '#555' }}>Total read time </Text>
        <br/>
        <Text
          style={{
            fontSize: '22px',
            fontWeight: '500',
            color: '#555555',
          }}
        >
          {scanCount ? (scanCount * (1/15)).toFixed(2) : 0 } <span style={{ fontSize: '16px', fontWeight: '400', color: '#888'}}>hrs</span>
        </Text>
      </div>
    </Card>
  );
};

export default ReadingMetricsCard;


 