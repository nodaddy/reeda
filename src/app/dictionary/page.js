"use client"

import { Input, Card, Typography, Layout, Space, Button } from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getMeaning } from '@/openAI';
import { Loader, Search } from 'lucide-react';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const App = () => {
  const [meaning, setMeaning] = useState('');
  const [word, setWord] = useState('');
  const [inputValue, setInputValue] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (word) {
    setLoading(true);
        
      getMeaning(word).then((meaning) => {
        setMeaning(meaning);
        setLoading(false);
      });
    }
  }, [word]);

  const handleSubmit = () => {
    setWord(inputValue);
  };

  return (
    <Layout style={{ minHeight: '40vh', marginTop: '0px', backgroundColor: 'white' }}> 
    <br/>
    <br/> 
      <Title level={4} style={{ color: '#555555', margin: 0, fontWeight: '300' }}>
        <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<BookOutlined style={{ marginRight: 10 }} />Dictionary
      </Title> 

      <Content style={{ padding: '0px', margin: 'auto' }}>
        <br/>
        <div direction="vertical" size="large">
          <div style={{ width: '90vw', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <Input
              size="large"
              placeholder=" Type a word or a phrase "
              prefix={<SearchOutlined />}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={handleSubmit}
              allowClear
              style={{ width: '70%' }}
            />
            <Button type="primary" onClick={handleSubmit} style={{ borderRadius: '5px', padding: '18px 20px', backgroundColor: 'gray' }}>
              <Search />
            </Button>
          </div>
        </div>
      </Content>
      <br/>
      <br/>
      {
        loading ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader className='loader' />
          </div>
        ) : meaning && (
            <Card
              bodyStyle={{padding: '10px 24px'}}
              style={{ borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '90%', margin: 'auto'}} 
            >
              <Title level={4} style={{ color: '#1890ff' }}>{word}</Title>
              <Text style={{ fontSize: '16px', lineHeight: '1.6' }}>{meaning}</Text>
              <br/>
              <br/> 
            </Card>
          )
      }
    </Layout>
  );
};

export default App;
