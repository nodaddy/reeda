import React, { useEffect, useRef, useState } from 'react';
import { List, Card, Button, Title, Modal, Form, Input, Progress, Badge as BadgeAnt, message, Typography, Empty, Divider } from 'antd';
import { ArrowRightLeft, Badge, Book, BookMarked, BookOpen, BookPlus, Camera, Delete, Loader, MoveRight, Play, PlayCircle, PlusCircle, Search, Text, Trash2 } from 'lucide-react';
import { defaultBorderColor, priColor, priTextColor, secColor, secTextColor } from '@/configs/cssValues';
import { motion } from 'framer-motion';
import { createbook, getBooks, deleteBook} from '@/firebase/services/bookService';
import Link from 'next/link';

const BookList = () => {
  const [books, setBooks] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [flippedBook, setFlippedBook] = useState(null);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const offsetTop = ref.current.offsetTop;
      // alert(offsetTop);

        setHeight(`calc(100vh - ${offsetTop + 40}px)`);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  useEffect(() => {
    setLoading(true);
    getBooks().then(res => {
        setBooks(res); 
      setFilteredBooks(res);
    setLoading(false);
    }).catch(console.log);
  }, []);



  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === '') {
      setFilteredBooks(books);
    } else {
      const filtered = filteredBooks.filter(
        (book) => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
      );
      setFilteredBooks(filtered);
    }
  };


  const handleAddBook = (values) => {
    const newBook = { title: values.title, author: values.author, totalPages: values.totalPages };
    createbook(newBook).then(() => getBooks().then((res) => {
      setBooks(res);
      setFilteredBooks(res);
    }));
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCardClick = (book) => setFlippedBook(flippedBook === book ? null : book);

  const handleDeleteBook = (bookId) => {
    deleteBook(bookId).then(() => {
      message.success('Book deleted successfully!');
      getBooks().then(setBooks);
    }).catch(() => message.error('Failed to delete the book.'));
  };

  return (
    <div 
    ref={ref}
    style={{ 
    padding: '3px 19px 34px 19px',
    width: '87%',
    maxHeight: height,
    margin: 'auto',
    position: 'relative',
    borderRadius: '15px',
    overflowY: 'scroll',
    // background: 'linear-gradient(to bottom, #fafafa, #fafafa, #fafafa, #fafafa, #fafafa, white)'
    backgroundColor: 'white'
    }}>
      <div style={{
        position: 'sticky',
        width: '100%',
        top: '0px',
        zIndex: '2',
        backgroundColor: 'white'
        // backgroundColor: '#fafafa',
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', 
            paddingTop: '18px',
      
      }}>
       {/* <BadgeAnt count={books?.length} showZero={false} color={secColor} offset={[5, 3]} > */}
        <BadgeAnt count={books?.length} showZero={true} color={secColor}  offset={[4, -3]}>
        <span style={{
            
            fontWeight: '300',
            margin: '0px',
            fontSize: '18px', 
            padding: '5px 3px',
            color: priTextColor,
            borderRadius: '6px'

        }}>My Books</span>
        </BadgeAnt>
        {/* </BadgeAnt> */}
 
       
        </div>
              {/* <h5 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', fontWeight: '400', color: '#555555', marginBottom: '15px', paddingBottom: '10px' }}>
                My Bookshelf &nbsp;
              </h5> */}
        <br/>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <Input.Search
                  placeholder=" Search your collection"
                  value={searchQuery}
                  onChange={handleSearch}
                  prefix={<Search size={18} />}
                  allowClear
                  style={{ outline: 'none', width: '75%' }}
                />
         {filteredBooks?.length > 0 && <BookPlus size={29} color={secColor} style={{ cursor: 'pointer' }} onClick={showModal} />}

        </div>
        </div>
<br/>
      {filteredBooks && (
        <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(1, 1fr)', // Ensures exactly 2 items per row
            marginTop: '15px',
            width: '100%', // Ensures the grid takes full width
            zIndex: '1'
          }}>
          {filteredBooks?.sort((a,b) => a.title.localeCompare(b.title)).map(item => (
            <div style={{
            }}>
                
                  {/* Front Side */}
                  <Card
                    style={{ backfaceVisibility: 'hidden',
                    marginBottom: '11px', 
                    borderRadius: '8px', 
                    
                    borderColor: 'white',
                    // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                     
                    width: '100%' }}
                    bodyStyle={{ padding: '10px 0px' }}
                  >

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between', 
                      width: '100%',
                      alignItems: 'center'
                    }}>


                    <img src='' style={{
                      width: '40px',
                      backgroundColor: '#f5f5f5',
                      height: '59px',
                      borderRadius: '2px',  
                      marginRight: '15px',
                      objectFit: 'cover',
                      // border: '1px solid silver'
                    }} />
                     <div style={{
                      width: '155px'
                    }}>
                    <div style={{ fontSize: '15px', color: '#333', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                    {/* <BookMarked size={20} color={'gray'} />&nbsp; */}
                    {item.title.toUpperCase()}
                    </div>
                    <span style={{ color: '#666', fontSize: '12px', display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {item.author}
                    </span>

                    <Progress
                      percent={Math.min(item.pagesRead ? ((item.pagesRead / (item.totalPages || 100)) * 100 + 4) : 3, 100)}
                      size="small"
                      showInfo={false}
                      style={{ marginTop: '4px' }}
                    />

                    {/* Delete Button */}
                    {/* <Popconfirm
                      title="Are you sure to delete this book?"
                      onConfirm={() => handleDeleteBook(item.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button 
                        type="text" 
                        icon={<div style={{ color: 'red', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4d9d9', borderRadius: '999px 0px 0px 999px', padding: '4px'}}>Remove</div>} 
                        style={{ position: 'absolute', top: '-26px', right: '-4px'}} 
                        onClick={(e) => e.stopPropagation()} 
                      />
                    </Popconfirm> */}
                    </div>
                    {/* a vertical divider */}
                    <div style={{
                      width: '1px',
                      height: '100%',
                      backgroundColor: '#ccc',
                      margin: '0 10px',
                      display: 'inline-block'
                    }}></div>

                    <div style={{
                      color: secTextColor,
                      fontSize :'14px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      flexDirection: 'column',
                    }}>
                    
                      {item.lastReadDate || (Math.random() * (63)).toFixed(0)} reads

                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        marginTop: '9px',
                        gap: '12px'
                      }}>

<Link href={'/scan/'+item.title}>

                        <Text 
                        size={19}
                        style={{
                          color: priTextColor,
                          // border: '1px solid '+ defaultBorderColor,
                          borderRadius: '50%',
                        }} />
</Link>
<Link href={'/scan/'+item.title}>
<BookOpen
                        size={25}
                        style={{
                          padding: '2px',
                          color: priTextColor,
                        }} />
                  </Link>
                    
                           
                      </span>
                   
                    </div>
                    </div>
                  </Card>


                  {/* Back Side */}
                  {/* <Card
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    border: '0px',
                    backgroundColor: 'grey',
                    height: '90px',
                  }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: '0px',
                        height: '100%',
                        left: '0px'
                    }}>
                  <Link href={'/scan/'+item.title}> <Button type="ghost" style={{ color: 'white' }} onClick={() => alert('Recap')}><span>Recap</span></Button>
                 </Link>

                  <Link href={'/scan/'+item.title}> <Button type="ghost" style={{ color: 'white' }}><span>Read</span></Button>
                  </Link>
                
                    </div>
                </Card>  */}
                
                <Divider style={{ margin: '10px 0px' }} />
            </div>)
          )}
        </div> 
        </div>
      )}

      {
        (!filteredBooks || filteredBooks.length === 0) && !loading && (
          <div style={{
            height: '160px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: secTextColor,
            fontFamily: "'Inter', sans-serif",
          }}>
          <BookPlus size={50} color={secColor} style={{ cursor: 'pointer' }} onClick={showModal} />
          <br/>
          Add a book
          </div>
        )
      }

      {
        loading && (
            <div style={{ height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
              <Loader className='loader' size={27} />
            </div>
        )
}

      <Modal title="Add New Book" open={isModalVisible} onCancel={handleCancel} footer={null} width={'80vw'}>
        <Form form={form} layout="vertical" onFinish={handleAddBook}>
          <Form.Item name="title" label="Book Title" rules={[{ required: true, message: 'Please enter the book title' }]}>
            <Input placeholder="Enter book title" />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true, message: 'Please enter the author' }]}>
            <Input placeholder="Enter author name" />
          </Form.Item>
          <Form.Item name="totalPages" label="Total Pages" rules={[{ required: true, message: 'Please enter the total number of pages' }]}>
            <Input placeholder="Total number of pages" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Add Book</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BookList;
