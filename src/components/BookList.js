'use client'

import React, { useEffect, useRef, useState } from 'react';
import { List, Card, Button, Title, Modal, Form, Input, Progress, Badge as BadgeAnt, message, Typography, Empty, Divider, Upload, Popconfirm, Popover, Alert } from 'antd';
import { BookOpen, BookPlus, Camera, CheckCircle2, Delete, History, LetterText, Loader, MoreVertical, MoveRight, Play, PlayCircle, PlusCircle, RefreshCcw, Search, Text, Trash2, UploadIcon } from 'lucide-react';
import { priColor, priTextColor, secColor, secTextColor } from '@/configs/cssValues';
import { motion } from 'framer-motion';
import { createbook, getBooks, deleteBook, getBookByTitleAndUserId, updateBookByUserIdAndTitle} from '@/firebase/services/bookService';
import Link from 'next/link';
import { getProfile, updateProfile } from '@/firebase/services/profileService';
import { addCoinsPerNewBookAdded, freeBooks } from '@/configs/variables';
import { storage } from '@/app/utility';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import Compressor from 'compressorjs';
import CameraUpload from './CameraUpload';
import { getLatestScansbyBookTitle } from '@/firebase/services/scanService';
import { getSummaryFromText, getSummaryFromTextStream } from '@/openAI';
import { sum } from 'firebase/firestore';
import { logGAEvent } from '@/firebase/googleAnalytics';

const BookList = () => {
  const [books, setBooks] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState('');

  const [loadingRecap, setLoadingRecap] = useState(false);

  const [showBookSummaryTillNowModal, setShowBookSummaryTillNowModal] = useState(false);

  const [selectedBookForSummary, setSelectedBookForSummary] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadingBook, setUploadingBook] = useState(false);
  const [height, setHeight] = useState(0);

  const [openPopOver, setOpenPopOver] = useState(false);

  const [summaryTillNow, setSummaryTillNow] = useState(null);
  
  const { isPremium } = useAppContext();

  const router = useRouter();

  const ref = useRef(null);

  const [imageBase64, setImageBase64] = useState(null);
  
  const handleImageUpload = (file) => {
    new Compressor(file, {
      quality: 0.1, // Compress image to 10%
      success(result) {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          setImageBase64(reader.result);
        };
      },
      error(err) {
        console.error('Image compression error:', err);
      },
    });
  };

  const getRecap = (selectedBook) => {
    setLoadingRecap(true);
    if(selectedBook){
      // get last 5(at max) scans
      getLatestScansbyBookTitle(selectedBook.title, 5).then(async (res) => {
        if(res.length != 0){
          await getSummaryFromTextStream(res.reduce((a, b) => a + b.data[0].summary, ''), (chunk) => {
            setSummaryTillNow((prev) => ((prev || '') + chunk));
            setLoadingRecap(false);
          });
        } else {
          setSummaryTillNow(<><Alert message="Start reading the book to get recap!" type="info" /></>);
    setLoadingRecap(false);

        }
      }).catch(err => {
        alert(JSON.stringify(err));
      }).finally(() => {
      })
      }
  }

  useEffect(() => {
    const updateHeight = () => {
      if (ref.current) {
        const offsetTop = ref.current.offsetTop;
      // alert(offsetTop);

        setHeight(`calc(100vh - ${offsetTop + 11}px)`);
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
    if(books?.length == freeBooks && !isPremium) {
      // route to premium page
      router.push('/premium');
    } else {
      setUploadingBook(true);
      const newBook = { title: values.title, totalPages: values.totalPages,  author: values.author, cover: imageBase64};
      createbook(newBook).then(() => getBooks().then(async (res) => {

        const profile = await getProfile(JSON.parse(storage.getItem('user')).email);
        
        // add coins to the profile
        await updateProfile(profile.userId, {
        ...profile,
        coins: (profile?.coins || 0) + addCoinsPerNewBookAdded
        }); 

        setBooks(res);
        setFilteredBooks(res);
        setUploadingBook(false);
        setIsModalVisible(false);
        form.resetFields();
        setImageBase64(null);
      }));
    }
  };

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
    padding: '0px 19px 0px 19px',
    width: '90%',
    marginTop: '5px',
    maxHeight: height,
    margin: 'auto',
    position: 'relative',
    borderRadius: '15px',
    overflowY: 'scroll',
    overflowX: 'hidden',
    // background: 'linear-gradient(to bottom, #fafafa, #fafafa, #fafafa, #fafafa, #fafafa, white)'
    backgroundColor: 'white'
    }}>
      <div style={{
        position: 'sticky',
        width: '100%',
        top: '0px',
        zIndex: '2',
        paddingLeft: '4px',
        backgroundColor: 'white'
        // backgroundColor: '#fafafa',
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', 
            paddingTop: '18px',
      
      }}>
        <div>
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
        <div style={{height: '5px'}}></div>
        <sup style={{fontFamily: "'Inter', sans-serif", fontSize: '14px', color: secTextColor, paddingLeft: '2px', 
        
      }}>
          Collection of your physical books </sup>
        
       </div>
 
       
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
                  style={{ outline: 'none', width: filteredBooks?.length > 0 ? '75%' : '100%' }}
                />
         {filteredBooks?.length > 0 && <>
         <BookPlus size={35}
         color={priColor} style={{ cursor: 'pointer', marginRight: '6px' }} onClick={() => {
          showModal(true);
          logGAEvent('click_add_book_icon');
         }} />
         </>}

        </div>
        </div>
<br/>
      {filteredBooks && (
        <div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)', // Ensures exactly 2 items per row
            marginTop: '13px',
            width: '100%', // Ensures the grid takes full width
            zIndex: '1'
          }}>
          {filteredBooks?.sort((a,b) => a.title.localeCompare(b.title)).map(item => (
            <div style={{
            }}>
                
                  {/* Front Side */}
                  <Card
                    style={{ backfaceVisibility: 'hidden',
                    borderRadius: '13px', 
                    //padding: '0px 20px',
                   //boxShadow: '0 0px 8px rgba(0, 0, 0, 0.06)',
                    margin: '0px auto 22px auto',
                    width: 'fit-content',
                    
                    border: '0px' }}
                    bodyStyle={{
                      padding: '5px',
                      width: 'fit-content',
                    }}
                  >

                    <div style={{
                       position: 'relative',
                       width: '25vw',
                       borderRadius: '8px'
                    }}>

                <Popover
                    open={openPopOver == item.title}
                    onOpenChange={(open) => setOpenPopOver(open ? item.title : null)}
                          content={
                            <span style={{padding: '0px'}}>
                                <Popconfirm
                                onCancel={() => setOpenPopOver(null)}
                          placement='topLeft'
                          title={ item.pagesRead === item.totalPages ? "Re-read this book?" : "Mark this book as completed?"}
                          onConfirm={async () => {
                            const book1 = await getBookByTitleAndUserId(item.title.trim());
                            if (book1?.pagesRead !== item.totalPages) {
                              await updateBookByUserIdAndTitle({ ...book1, pagesRead: item.totalPages }, book1.title);
                              // message.success('Book marked as completed!');
                              // update in filtered books
                              const filtered = filteredBooks.map((book) => {
                                if (book.title === item.title) {
                                  return { ...book, pagesRead: item.totalPages };
                                }
                                return book;
                              });
                              setFilteredBooks(filtered);
                              setOpenPopOver(null);
                            } else if(book1?.pagesRead == item.totalPages){
                                await updateBookByUserIdAndTitle({ ...book1, pagesRead: 0 }, book1.title);
                                // message.success('Book marked as completed!');
                                // update in filtered books
                                const filtered = filteredBooks.map((book) => {
                                  if (book.title === item.title) {
                                    return { ...book, pagesRead: 0 };
                                  }
                                  return book;
                              });
                              setFilteredBooks(filtered);
                              setOpenPopOver(null);

                            }
                          }}
                          okText="Yes"
                          cancelText="No"
                        >
                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '10px'
                          }}>
                          <CheckCircle2
                            size={20}
                            style={{
                              color: item.pagesRead === item.totalPages ? "#0a0" : "#666",
                              cursor: "pointer",
                              marginRight: '-2px'
                            }}
                          /> 
                          {item.pagesRead === item.totalPages ? "Re-read" : "Mark Completed"}
                          </span>
                          </Popconfirm>


                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '10px'
                          }}
                          onClick={() => {
                            setOpenPopOver(null);
                            setShowBookSummaryTillNowModal(true);
                            setSelectedBookForSummary(item);
                            getRecap(item);
                          }}
                          >
                          <History
                            size={20}
                          /> 
                          <span>Quick Recap</span>
                          </span>

                          <span style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                          onClick={() => {
                            handleDeleteBook(item.id);
                          }}
                          >
                          <Delete
                            size={20}
                          /> 
                          <span>Remove</span>
                          </span>


                                  </span>
                                } 
                                trigger="click" 
                                placement="topRight" 
                                // open={visible} 
                                // onOpenChange={setVisible}
                              >
                                <MoreVertical 
                                  size={17} 
                                  onClick={() => {
                                    setOpenPopOver(item.title == openPopOver ? null : item.title);
                                    logGAEvent('click_more_options_on_book_card');
                                  }}
                                  style={{ 
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    cursor: "pointer", 
                                    zIndex: '1',
                                    color: 'black',
                                    backgroundColor: 'silver',
                                    borderRadius: '5px'
                                  }} 
                                />
                              </Popover>


                    <img src={item.cover} style={{
                      width: '25vw',
                      backgroundColor: '#f5f5f5',
                      height: '38vw',
                      borderRadius: '6px',  
                      objectFit: 'cover',
                      // border: '1px solid silver'
                    }} />

                     <Link href={'/scan/'+item.title} style={{
                      width: '25vw',
                      height: '100%',
                      position: 'absolute',
                      bottom:'0px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      borderRadius: '6px',  
                      zIndex: '0',
                      left: '0px',
                      background: 'linear-gradient(transparent, rgb(0,0,0,0.5), rgb(0,0,0,0.9) )'
                    }}
                    
                    >
                      <span style={{
                      }}>
                    <div style={{ 
                      
                      padding: '0px 7px',
                      fontSize: '13px', color: 'white', overflow: 'hidden', whiteSpace: 'wrap'}}>
                    {/* <BookMarked size={20} color={'gray'} />&nbsp; */}
                    {item.title.toUpperCase()}
                    </div>
                    <span style={{ padding: '0px 9px', marginBottom: '4px', color: 'silver', fontSize: '12px', display: 'block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {item.author}
                    </span>

                    <Progress
                      percent={Math.min(item.pagesRead ? ((item.pagesRead / (item.totalPages || 100)) * 100 + 4).toFixed(0) : 1, 100)}
                      size="large"
                      strokeWidth={8}
                      style={{ marginTop: '3px', width: '25vw', marginBottom: '-90px' }}
                    />
                    </span>
                    </Link>
                    </div>
                  </Card>
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
          <BookPlus size={50} color={secColor} style={{ cursor: 'pointer' }} onClick={() => {
            showModal(true);
            logGAEvent('click_add_book_icon');
          }} />
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

      <Modal title="Add New Book" centered open={isModalVisible} onCancel={handleCancel} footer={null} width={'80vw'}
    style={{zIndex: '999999'}}
    >
       <br/>
        <Form form={form} layout="vertical" onFinish={handleAddBook}>
          <Form.Item name="title" label="Book Title" rules={[{ required: true, message: 'Please enter the book title' }]}>
            <Input placeholder="Enter book title" />
          </Form.Item>
          <Form.Item name="author" label="Author" rules={[{ required: true, message: 'Please enter the author' }]}>
            <Input placeholder="Enter author name" />
          </Form.Item>
          <Form.Item name="totalPages" label="Total number of pages" rules={[{ required: true, message: 'Please enter the total number of pages' }]}>
            <Input type='number' placeholder="Number of pages e.g 348" />
          </Form.Item>
          <Form.Item label="Upload Book Cover Photo">
          <CameraUpload handleImage={handleImageUpload} />
          {/* {imageBase64 && <p>Image uploaded successfully!</p>} */}
        </Form.Item>
        <Form.Item>
          <Button disabled={!imageBase64} style={{
            backgroundColor: !imageBase64 ? '' : 'black'
          }} type="primary" htmlType="submit" block>
            {uploadingBook ? <Loader className='loader' size={20} /> : 'Add Book'}
            </Button>
        </Form.Item>
        </Form>
      </Modal>


      {/* book summary show till now modal */}
      <Modal
        title={" Recap - " + selectedBookForSummary?.title }
        open={showBookSummaryTillNowModal}
        onCancel={() => {
          setShowBookSummaryTillNowModal(false);
          setSummaryTillNow(null);
        }}
        footer={null}
        width={'90vw'}
        style={{ padding: '20px', borderRadius: '20px', zIndex: '9999', minHeight: '20vh' }}
      >
        <div 
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0px'
        }}
        >
        {loadingRecap ? <Loader className='loader' size={27} /> : summaryTillNow}
        </div>
      </Modal>
    </div>
  );
};

export default BookList;
