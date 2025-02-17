"use client"

import { Input, Card, Typography, Layout, Space, Button } from 'antd';
import { SearchOutlined, BookOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { getMeaning, getMeaningStream } from '@/openAI';
import { Loader, Search } from 'lucide-react';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const Dictionary = ({incomingWords}) => {
    const [meaning, setMeaning] = useState('');
    const [word, setWord] = useState(incomingWords);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
  
    const prevWordRef = useRef();

    useEffect(() => {
        // Update the word if incomingWords changes
        setWord(incomingWords);
        setMeaning('');
      }, [incomingWords]);
  
    useEffect(() => {
      if (word !== prevWordRef.current) {
        setLoading(true);
        getMeaningStream(word, (chunk) => {
          setMeaning((prev) => prev + chunk);
          setLoading(false);
        });
      }
      prevWordRef.current = word;
    }, [word]); // Only depend on 'word'
  
    const handleSubmit = () => {
      setWord(inputValue);
    };

  return (
    <Layout style={{  marginTop: '0px', backgroundColor: 'white', minHeight: '23vh' }}> 
    {!incomingWords && <>
      <br/>
      <br/>
      </>}
     {!incomingWords && <Title level={4} style={{ color: '#555555', margin: 0, fontWeight: '300' }}>
        <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<BookOutlined style={{ marginRight: 10 }} />Dictionary
      </Title> }

     {!incomingWords && <Content style={{ padding: '0px', margin: 'auto' }}>
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
      </Content>}
      {!incomingWords && <>
      <br/>
      <br/>
      </>}
      {
        loading ? (
          <div style={{ width: '100%', height: '23vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader className='loader' />
          </div>
        ) : meaning && (
            <Card
              bodyStyle={{padding: `0px ${incomingWords ? '10px': '24px'}`}}
              style={{ borderRadius: '10px', boxShadow: !incomingWords && '0 4px 12px rgba(0,0,0,0.1)', width: !incomingWords ? '90%' : '100%', margin: 'auto', border: '0px'}} 
            >
              {!incomingWords && <Title level={4} style={{ color: '#1890ff', marginTop: '0px' }}>{word}</Title>}
              <div style={{padding: incomingWords && '25px 0px 35px 0px'}}><Text style={{ fontSize: '16px', lineHeight: '1.6' }}>{meaning}</Text></div>
              {!incomingWords && <>
      <br/>
      <br/>
      </>}
            </Card>
          )
      }
    </Layout>
  );
};

export default Dictionary;
 