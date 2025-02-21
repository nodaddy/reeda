"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  List,
  Card,
  Button,
  Title,
  Modal,
  Form,
  Input,
  Progress,
  Badge as BadgeAnt,
  message,
  Popconfirm,
  Popover,
  Alert,
} from "antd";
import {
  BookOpen,
  BookPlus,
  Bookmark,
  Camera,
  CheckCircle2,
  Delete,
  Expand,
  History,
  LetterText,
  LibraryBig,
  Loader,
  MoreHorizontal,
  MoreVertical,
  MoveRight,
  Play,
  PlayCircle,
  Plus,
  PlusCircle,
  RefreshCcw,
  Search,
  SearchIcon,
  Share,
  Share2,
  Text,
  Trash2,
  UploadIcon,
} from "lucide-react";
import {
  defaultBorderColor,
  priColor,
  priTextColor,
  secColor,
  secTextColor,
} from "@/configs/cssValues";
import { motion } from "framer-motion";
import {
  createbook,
  getBooks,
  deleteBook,
  getBookByTitleAndUserId,
  updateBookByUserIdAndTitle,
} from "@/firebase/services/bookService";
import Link from "next/link";
import { getProfile, updateProfile } from "@/firebase/services/profileService";
import { addCoinsPerNewBookAdded, freeBooks } from "@/configs/variables";
import { storage } from "@/app/utility";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import Compressor from "compressorjs";
import CameraUpload from "./CameraUpload";
import { getLatestScansbyBookTitle } from "@/firebase/services/scanService";
import { getSummaryFromText, getSummaryFromTextStream } from "@/openAI";
import { sum } from "firebase/firestore";
import { logGAEvent } from "@/firebase/googleAnalytics";
import { Avatar } from "antd";
import { searchByTitle } from "@/googleBooks";
import Loading from "./Loading";

const BookList = () => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [form] = Form.useForm();

  const [searchQueryGoogleBooks, setSearchQueryGoogleBooks] = useState("");
  const [searchResultsGoogleBooks, setSearchResultsGoogleBooks] = useState([]);
  const [loadingGoogleBooks, setLoadingGoogleBooks] = useState(false);

  const handleSearchGoogleBooks = async (value) => {
    setSearchQueryGoogleBooks(value);
    if (!value) {
      setSearchResultsGoogleBooks([]);
      return;
    }
    setLoadingGoogleBooks(true);
    try {
      const results = await searchByTitle(value);
      setSearchResultsGoogleBooks(results.items);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoadingGoogleBooks(false);
  };

  const [processingImageUplaod, setProcessingImageUplaod] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [loadingRecap, setLoadingRecap] = useState(false);

  const [showBookSummaryTillNowModal, setShowBookSummaryTillNowModal] =
    useState(false);

  const [selectedBookForSummary, setSelectedBookForSummary] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploadingBook, setUploadingBook] = useState(false);

  const [openPopOver, setOpenPopOver] = useState(false);

  const [summaryTillNow, setSummaryTillNow] = useState(null);

  const {
    isPremium,
    books,
    setBooks,
    isAddBookModalVisible,
    setIsAddBookModalVisible,
  } = useAppContext();

  const router = useRouter();

  const ref = useRef(null);

  const [imageBase64, setImageBase64] = useState(null);

  const handleImageUpload = (file) => {
    setProcessingImageUplaod(true);
    new Compressor(file, {
      quality: 0.1, // Compress image to 10%
      success(result) {
        const reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          setImageBase64(reader.result);
          setProcessingImageUplaod(false);
        };
      },
      error(err) {
        console.error("Image compression error:", err);
      },
    });
  };

  const getRecap = (selectedBook) => {
    setLoadingRecap(true);
    if (selectedBook) {
      // get last 5(at max) scans
      getLatestScansbyBookTitle(selectedBook.title, 5)
        .then(async (res) => {
          if (res.length != 0) {
            await getSummaryFromTextStream(
              res.reduce((a, b) => a + b.data[0].summary, ""),
              (chunk) => {
                setSummaryTillNow((prev) => (prev || "") + chunk);
                setLoadingRecap(false);
              }
            );
          } else {
            setSummaryTillNow(
              <>
                <Alert
                  message="Start reading the book to get recap!"
                  type="info"
                />
              </>
            );
            setLoadingRecap(false);
          }
        })
        .catch((err) => {
          alert(JSON.stringify(err));
        })
        .finally(() => {});
    }
  };

  const showModal = () => setIsAddBookModalVisible(true);
  const handleCancel = () => setIsAddBookModalVisible(false);

  useEffect(() => {
    setLoading(true);
    getBooks()
      .then((res) => {
        setBooks(res);
        setFilteredBooks(res);
        setLoading(false);
      })
      .catch(console.log);
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setFilteredBooks(books);
    } else {
      const filtered = filteredBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
      setFilteredBooks(filtered);
    }
  };

  const handleAddBook = (values) => {
    if (books?.length == freeBooks && !isPremium) {
      // route to premium page
      router.push("/premium");
    } else {
      setUploadingBook(true);
      const newBook = {
        title: values.title,
        totalPages: values.totalPages,
        author: values.author ? values.author : "",
        cover: values.cover,
      };
      createbook(newBook).then(() =>
        getBooks().then(async (res) => {
          const profile = await getProfile(
            JSON.parse(storage.getItem("user")).email
          );

          // add coins to the profile
          await updateProfile(profile.userId, {
            ...profile,
            coins: (profile?.coins || 0) + addCoinsPerNewBookAdded,
          });

          setBooks(res);
          setFilteredBooks(res);
          setUploadingBook(false);
          setIsAddBookModalVisible(false);
          form.resetFields();
          setImageBase64(null);
          setSearchQueryGoogleBooks(null);
          setSearchResultsGoogleBooks([]);
          message.success("Book added successfully!");
        })
      );
    }
  };

  const handleDeleteBook = (bookId) => {
    deleteBook(bookId)
      .then(() => {
        message.success("Book deleted successfully!");
        getBooks().then((res) => {
          setBooks(res);
          setFilteredBooks(res);
        });
      })
      .catch(() => message.error("Failed to delete the book."));
  };

  return (
    <div
      ref={ref}
      style={{
        margin: "auto",
        position: "relative",
        overflowX: "hidden",
        // background: 'linear-gradient(to bottom, #fafafa, #fafafa, #fafafa, #fafafa, #fafafa, white)'
      }}
    >
      <div
        style={{
          position: "sticky",
          margin: "auto",
          top: "0px",
          zIndex: "2",
          marginBottom: "10px",
          // backgroundColor: '#fafafa',
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            // background: 'rgba(74, 74, 255, 0.1)',
            justifyContent: "space-between",
            gap: "15px",
            padding: "10px 0px 5px 0px",
          }}
        >
          <div>
            {/* <BadgeAnt count={books?.length} showZero={false} color={secColor} offset={[5, 3]} > */}
            {/* <BadgeAnt count={books?.length} showZero={true} color={secColor}  offset={[4, -3]}> */}
            <span
              style={{
                fontWeight: "400",
                margin: "0px",
                fontSize: "20px",
                padding: "5px 0px",
                display: "flex",
                alignItems: "center",
                color: secTextColor,
                borderRadius: "6px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {" "}
              <LibraryBig />
              &nbsp;My Bookshelf &nbsp;&nbsp;{" "}
              {books && books.length > 0 && (
                <Expand size={18} color={priColor} />
              )}
            </span>

            {/* </BadgeAnt> */}
            <div style={{ height: "5px" }}></div>
            {/* <sup style={{fontFamily: "'Inter', sans-serif", fontSize: '14px', color: secTextColor, paddingLeft: '2px', 
        
      }}>
          Collection of your physical books </sup> */}
          </div>

          <div></div>
        </div>
        {/* <h5 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', fontWeight: '400', color: '#555555', marginBottom: '15px', paddingBottom: '10px' }}>
                My Bookshelf &nbsp;
              </h5> */}
        {/* <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
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

        </div> */}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "nowrap",
          whiteSpace: "nowrap", // Prevents content from wrapping
          width: "100%",
          gap: "15px",
          margin: "auto",
          overflowX: "scroll",
          marginTop: "5px",
          borderRadius: "10px",
          padding: "5px 1px",
          zIndex: "1",
        }}
      >
        <div
          onClick={() => {
            showModal(true);
          }}
          style={{
            width: "17vw",
            height: "26vw",
            borderRadius: "7px",
            border: "1px dashed grey",
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plus size={35} color={"grey"} />
        </div>
        {filteredBooks &&
          filteredBooks.filter((b) => !b.wishlist).length == 0 && (
            <>
              <div
                style={{
                  width: "17vw",
                  height: "26vw",
                  borderRadius: "7px",
                  border: "1px dashed silver",
                  display: "flex",
                  flex: "0 0 auto",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></div>

              <div
                style={{
                  width: "17vw",
                  height: "26vw",
                  borderRadius: "7px",
                  flex: "0 0 auto",
                  border: "1px dashed silver",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></div>

              <div
                style={{
                  width: "17vw",
                  height: "26vw",
                  borderRadius: "7px",
                  border: "1px dashed silver",
                  display: "flex",
                  flex: "0 0 auto",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></div>

              <div
                style={{
                  width: "17vw",
                  height: "26vw",
                  borderRadius: "7px",
                  border: "1px dashed silver",
                  flex: "0 0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></div>
            </>
          )}
        {filteredBooks
          ?.sort((a, b) => a.title.localeCompare(b.title))
          .map((item) => (
            <div
              style={{
                flex: "0 0 auto",
              }}
            >
              {/* Front Side */}
              <Card
                onClick={() => {
                  router.push(`/book/${item.id}`);
                }}
                style={{
                  backfaceVisibility: "hidden",
                  margin: "0px auto 0px auto",
                  width: "fit-content",

                  border: "0px",
                }}
                bodyStyle={{
                  padding: "0px",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "17vw",
                  }}
                >
                  <Popover
                    open={openPopOver == item.title}
                    onOpenChange={(open) =>
                      setOpenPopOver(open ? item.title : null)
                    }
                    content={
                      <span style={{ padding: "0px" }}>
                        <Popconfirm
                          onCancel={() => setOpenPopOver(null)}
                          placement="topLeft"
                          title={
                            item.pagesRead === item.totalPages
                              ? "Re-read this book?"
                              : "Mark this book as completed?"
                          }
                          onConfirm={async () => {
                            const book1 = await getBookByTitleAndUserId(
                              item.title.trim()
                            );
                            if (book1?.pagesRead !== item.totalPages) {
                              await updateBookByUserIdAndTitle(
                                { ...book1, pagesRead: item.totalPages },
                                book1.title
                              );
                              // message.success('Book marked as completed!');
                              // update in filtered books
                              const filtered = filteredBooks
                                .filter((book) => !book.wishlist)
                                .map((book) => {
                                  if (book.title === item.title) {
                                    return {
                                      ...book,
                                      pagesRead: item.totalPages,
                                    };
                                  }
                                  return book;
                                });
                              setFilteredBooks(filtered);
                              setOpenPopOver(null);
                            } else if (book1?.pagesRead == item.totalPages) {
                              await updateBookByUserIdAndTitle(
                                { ...book1, pagesRead: 0 },
                                book1.title
                              );
                              // message.success('Book marked as completed!');
                              // update in filtered books
                              const filtered = filteredBooks
                                .filter((book) => !book.wishlist)
                                .map((book) => {
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
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "10px",
                            }}
                          >
                            <CheckCircle2
                              size={20}
                              style={{
                                color:
                                  item.pagesRead === item.totalPages
                                    ? "#0a0"
                                    : "#666",
                                cursor: "pointer",
                                marginRight: "-2px",
                              }}
                            />
                            {item.pagesRead === item.totalPages
                              ? "Re-read"
                              : "Mark Completed"}
                          </span>
                        </Popconfirm>

                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "10px",
                          }}
                          onClick={() => {
                            setOpenPopOver(null);
                            setShowBookSummaryTillNowModal(true);
                            setSelectedBookForSummary(item);
                            getRecap(item);
                          }}
                        >
                          <History size={20} />
                          <span>Quick Recap</span>
                        </span>

                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                          onClick={() => {
                            handleDeleteBook(item.id);
                          }}
                        >
                          <Delete size={20} />
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
                        setOpenPopOver(
                          item.title == openPopOver ? null : item.title
                        );
                        logGAEvent("click_more_options_on_book_card");
                      }}
                      style={{
                        display: "none",
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        width: "15px",
                        cursor: "pointer",
                        zIndex: "1",
                        color: "black",
                        backgroundColor: "white",
                        borderRadius: "4px",
                      }}
                    />
                  </Popover>

                  {/* {
                                item.pagesRead !== item.totalPages &&  <Bookmark
                                size={17} 
                                onClick={() => {
                                  setOpenPopOver(item.title == openPopOver ? null : item.title);
                                  logGAEvent('click_more_options_on_book_card');
                                }}
                                style={{ 
                                  position: 'absolute',
                                  top: '0px',
                                  left: '8px',
                                  cursor: "pointer", 
                                  zIndex: '1',
                                  color: 'green',
                                  borderRadius: '5px'
                                }} 
                              />
                              } */}

                  <img
                    src={item.cover}
                    style={{
                      width: "17vw",
                      height: "26vw",
                      objectFit: "cover",
                      flex: "0 0 auto",
                      borderRadius: "7px", // Optional: Slight rounding for a premium look
                      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.2)", // Soft shadow
                      transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out", // Smooth hover effect
                    }}
                  />
                </div>
              </Card>
            </div>
          ))}
      </div>

      {loading && (
        <div
          style={{
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          <Loader className="loader" size={27} />
        </div>
      )}

      {/* <Modal title="Add New Book" centered open={isAddBookModalVisible} onCancel={handleCancel} footer={null} width={'80vw'}
    style={{zIndex: '999999'}}
    >
       <br/>
        <Form form={form} layout="vertical" onFinish={handleAddBook}>
          <Form.Item name="title" label="Book Title" rules={[{ required: true, message: 'Please enter the book title' }]}>
            <Input placeholder="Enter book title" />
          </Form.Item> */}
      {/* <Form.Item name="author" label="Author (optional)" rules={[{ required: false, message: 'Please enter the author' }]}>
            <Input placeholder="Enter author name" />
          </Form.Item> */}
      {/* <Form.Item name="totalPages" label="Total number of pages" rules={[{ required: true, message: 'Please enter the total number of pages' }]}>
            <Input type='number' placeholder="Number of pages e.g 348" />
          </Form.Item>
          <Form.Item label="Book Cover Photo (optional)">
          <CameraUpload forBookCover={true} handleImage={handleImageUpload} />
        </Form.Item>
        <Form.Item>
          <Button disabled={processingImageUplaod} style={{
            backgroundColor: 'black'
          }} type="primary" htmlType="submit" block>
            {uploadingBook ? <Loader className='loader' size={20} /> : 'Add Book'}
            </Button>
        </Form.Item>
        </Form>
      </Modal> */}

      <Modal
        title="Search a book!"
        open={isAddBookModalVisible}
        onCancel={() => {
          setIsAddBookModalVisible(false);
        }}
        footer={null}
        style={{ zIndex: "999999" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <Input
            placeholder="Search..."
            size="large"
            type="search"
            value={searchQueryGoogleBooks}
            onChange={(e) => setSearchQueryGoogleBooks(e.target.value)}
            style={{ width: "-webkit-fill-available" }}
          />
          {loadingGoogleBooks ? (
            <Loader className="loader" />
          ) : (
            <SearchIcon
              size={23}
              style={{
                padding: "10px 13px",
                borderRadius: "999px",
                marginLeft: "15px",
              }}
              onClick={() => handleSearchGoogleBooks(searchQueryGoogleBooks)}
              loading={loadingGoogleBooks}
            />
          )}
        </div>
        <div
          style={{
            maxHeight: "40vh",
            overflowY: "scroll",
            // scrollbarWidth: 'thin',
            width: "100%",
            marginTop: "10px",
            padding: "0px 10px",
          }}
        >
          {uploadingBook ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "40vh",
              }}
            >
              <Loading messages={["Adding book", "Almost there"]} />
            </div>
          ) : (
            <List
              locale={{
                emptyText: (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={
                        "https://media0.giphy.com/media/TdiKel6pexKml8vLIJ/giphy.webp?cid=ecf05e47uom5m5c8qqf5ojb1ntbzund8uadlqttg2ortfblj&ep=v1_gifs_search&rid=giphy.webp&ct=g"
                      }
                      alt="No results found"
                      style={{ width: "140px", margin: "20px 0px" }}
                    />
                    <p>No results found</p>
                  </div>
                ),
              }}
              itemLayout="horizontal"
              dataSource={searchResultsGoogleBooks}
              renderItem={(item) => (
                <List.Item
                  style={{
                    width: "100%",
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        onClick={() => {
                          handleAddBook({
                            title: item.volumeInfo.title,
                            author: item.volumeInfo.authors?.join(", "),
                            totalPages: item.volumeInfo.pageCount || 243,
                            cover: item.volumeInfo.imageLinks?.thumbnail || "",
                            description: item.volumeInfo.description || "",
                          });
                        }}
                        shape="square"
                        src={item.volumeInfo.imageLinks?.thumbnail}
                      />
                    }
                    description={
                      <div
                        onClick={() => {
                          handleAddBook({
                            title: item.volumeInfo.title,
                            author: item.volumeInfo.authors?.join(", "),
                            totalPages: item.volumeInfo.pageCount || 243,
                            cover: item.volumeInfo.imageLinks?.thumbnail,
                          });
                        }}
                        style={{
                          lineHeight: "normal",
                        }}
                      >
                        <div
                          style={{
                            textDecoration: "none",
                            color: priTextColor,
                          }}
                        >
                          {item.volumeInfo.title}
                        </div>
                        <sup>by {item.volumeInfo.authors?.join(", ")}</sup>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Modal>

      {/* book summary show till now modal */}
      <Modal
        title={" Recap - " + selectedBookForSummary?.title}
        open={showBookSummaryTillNowModal}
        onCancel={() => {
          setShowBookSummaryTillNowModal(false);
          setSummaryTillNow(null);
        }}
        footer={null}
        width={"90vw"}
        style={{
          padding: "20px",
          borderRadius: "20px",
          zIndex: "9999",
          minHeight: "20vh",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px 0px",
          }}
        >
          {loadingRecap ? (
            <Loader className="loader" size={27} />
          ) : (
            summaryTillNow
          )}
        </div>
      </Modal>
    </div>
  );
};

export default BookList;
