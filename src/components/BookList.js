import React, { useEffect, useState } from 'react';
import { List, Card, Button, Title, Modal, Form, Input, Progress, Badge as BadgeAnt, message, Typography, Empty } from 'antd';
import { ArrowRightLeft, Badge, Book, BookMarked, BookPlus, Delete, Loader, PlusCircle, Search, Trash2 } from 'lucide-react';
import { priColor, secColor } from '@/configs/cssValues';
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
    <div style={{ padding: '35px 16px', maringBottom: '20px', position: 'relative', 
    backgroundColor: '#fafafa',
    }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px' }}>
       {/* <BadgeAnt count={books?.length} showZero={false} color={secColor} offset={[5, 3]} > */}
        <Typography.Title level={4} style={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: '300',
            margin: '0px'
        }}>&nbsp;&nbsp;My Books</Typography.Title>
        {/* </BadgeAnt> */}

        <PlusCircle size={28} color={secColor} style={{ cursor: 'pointer' }} onClick={showModal} />
</div>
      {/* <h5 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', fontWeight: '400', color: '#555555', marginBottom: '15px', paddingBottom: '10px' }}>
        My Bookshelf &nbsp;
      </h5> */}
 <br/>
 <Input.Search
          placeholder=" Search a book in your collection"
          value={searchQuery}
          onChange={handleSearch}
          prefix={<Search size={18} />}
          allowClear
          style={{ borderRadius: '20px', outline: 'none' }}
        />
<br/>
<br/>
      {filteredBooks && (
        <div>
        <div
        style={{
            display: 'flex',
            flexWrap: 'nowrap',
            overflowX: 'scroll',
            scrollbarWidth: '0px',
            marginTop: '15px',
            gap: '11px'
        }}>
          {filteredBooks?.sort((a,b) => a.title.localeCompare(b.title)).map(item => (
            <div style={{
                minWidth: '175px',
            }}>
              <motion.div onClick={() => handleCardClick(item)} style={{ perspective: '1000px', width: '100%' }}>
                <motion.div
                  animate={{ rotateY: flippedBook === item ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  style={{ transformStyle: 'preserve-3d', position: 'relative', width: '100%', height: '100px' }}
                > 
                  {/* Front Side */}
                  <Card
                    style={{ backfaceVisibility: 'hidden', borderRadius: '5px 0px 5px 5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)', position: 'absolute', width: '95%' }}
                    bodyStyle={{ padding: '10px 16px' }}
                  >
                    <div style={{ fontSize: '15px', color: '#333', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                    <BookMarked size={20} color={'gray'} />&nbsp;{item.title.toUpperCase()}
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
                  </Card>

                  {/* Back Side */}
                  <Card
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    border: '0px',
                    backgroundColor: '#555555',
                    color: '#555555',
                    height: '90px',
                    width: '100%'
                  }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        top: '0px',
                        height: '100%',
                        width :'100%',
                        left: '0px'
                    }}>
                  <Link href={'/scan/'+item.title}> <Button type="ghost" style={{ color: 'white' }} onClick={() => alert('Recap clicked')}><span>Quick <br/>recap</span></Button>
                 </Link>

                  <Link href={'/scan/'+item.title}> <Button type="ghost" style={{ color: 'white' }}><span>Continue <br/> reading</span></Button>
                  </Link>
                
                    </div>
                </Card>
                </motion.div>
              </motion.div>
            </div>)
          )}
        </div>
        <div align="right">
       {filteredBooks?.length > 2 && <ArrowRightLeft size={16} color="silver" />} 
        </div>
        </div>
      )}

      {
        (!filteredBooks || filteredBooks.length === 0) && !loading && (
            <Empty  />
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
