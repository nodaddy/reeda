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
  CheckCircle,
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
  Compass,
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
import { generateRandomColourForString, storage } from "@/app/utility";
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
import PremiumSlideIn from "./PremiumSlideIn";

const BookList = () => {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [form] = Form.useForm();
  const {
    setSlideIn,
    setSlideInContent,
    isPremium,
    books,
    setBooks,
    profile,
    setProfile,
    isAddBookModalVisible,
    setIsAddBookModalVisible,
  } = useAppContext();

  const [searchQueryGoogleBooks, setSearchQueryGoogleBooks] = useState("");
  const [searchResultsGoogleBooks, setSearchResultsGoogleBooks] = useState([]);

  const [loadingGoogleBooks, setLoadingGoogleBooks] = useState(false);

  const handleSearchGoogleBooks = async () => {
    setLoadingGoogleBooks(true);
    try {
      const results = await searchByTitle(searchQueryGoogleBooks);
      setSearchResultsGoogleBooks(results.items);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
    setLoadingGoogleBooks(false);
  };

  const [messageApi, contextHolder] = message.useMessage();

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

  const router = useRouter();

  const ref = useRef(null);

  const [imageBase64, setImageBase64] = useState(null);
  const [showManuallyAddBookModal, setShowManuallyAddBookModal] =
    useState(false);

  const [addingToBookshelf, setAddingToBookshelf] = useState({});
  const [addingToWishlist, setAddingToWishlist] = useState({});

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
        setFilteredBooks(res.filter((book) => !book.inWishlist));
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
          (book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)) &&
          !book.inWishlist
      );
      setFilteredBooks(filtered);
    }
  };

  const handleAddBook = (newBook) => {
    setUploadingBook(true);
    if (books?.length == freeBooks && !isPremium) {
      // Show premium slide-in instead of redirecting

      setSlideInContent(<PremiumSlideIn />);
      setSlideIn(true);
    } else {
      if (
        filteredBooks.find(
          (book) => book.title + book.author === newBook.title + book.author
        )
      ) {
        messageApi.error("Book exists in bookshelf");
      } else if (
        books.find(
          (book) => book.title + book.author === newBook.title + book.author
        )
      ) {
        messageApi.error("Book exists in wishlist");
      } else {
        if (newBook.inWishlist) {
          createbook(newBook).then(() =>
            getBooks().then(async (res) => {
              // add coins to the profile
              await updateProfile(profile?.userId, {
                ...profile,
                coins: (profile?.coins || 0) + addCoinsPerNewBookAdded,
              });

              // fetch and set profile again
              const nProfile = await getProfile(
                JSON.parse(storage.getItem("user")).email
              );
              setProfile(nProfile);

              setBooks(res);
              setFilteredBooks(res.filter((book) => !book.inWishlist));
              messageApi.info("Book added to wishlist!");
            })
          );
        } else {
          createbook(newBook).then(() =>
            getBooks().then(async (res) => {
              const profile = await getProfile(
                JSON.parse(storage.getItem("user")).email
              );

              // add coins to the profile
              await updateProfile(profile?.userId, {
                ...profile,
                coins: (profile?.coins || 0) + addCoinsPerNewBookAdded,
              });

              setBooks(res);
              setFilteredBooks(res.filter((book) => !book.inWishlist));
              setUploadingBook(false);
              setIsAddBookModalVisible(false);
              form.resetFields();
              setImageBase64(null);
              setSearchQueryGoogleBooks(null);
              setSearchResultsGoogleBooks([]);
              messageApi.success("Book added to bookshelf");
              setShowManuallyAddBookModal(false);
              setUploadingBook(false);
            })
          );
        }
      }
    }
  };

  const handleDeleteBook = (bookId) => {
    deleteBook(bookId)
      .then(() => {
        messageApi.success("Book deleted successfully!");
        getBooks().then((res) => {
          setBooks(res);
          setFilteredBooks(res.filter((book) => !book.inWishlist));
        });
      })
      .catch(() => messageApi.error("Failed to delete the book."));
  };

  // Sort books to show those with thumbnails first
  const sortedSearchResults = [...searchResultsGoogleBooks].sort((a, b) => {
    const aHasThumbnail = a.volumeInfo.imageLinks?.thumbnail;
    const bHasThumbnail = b.volumeInfo.imageLinks?.thumbnail;
    if (aHasThumbnail && !bHasThumbnail) return -1;
    if (!aHasThumbnail && bHasThumbnail) return 1;
    return 0;
  });

  return (
    !loading && (
      <div
        style={{
          margin: "auto",
          position: "relative",
          overflowX: "hidden",
          // background: 'linear-gradient(to bottom, #fafafa, #fafafa, #fafafa, #fafafa, #fafafa, white)'
        }}
      >
        {contextHolder}
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
              padding: "0px 0px 5px 0px",
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
                  <Link href={"/bookshelf"}>
                    <Expand size={18} color={priTextColor} />
                  </Link>
                )}
              </span>

              {/* </BadgeAnt> */}
              <div style={{ height: "5px" }}></div>
              {/* <sup style={{fontFamily: "'Inter', sans-serif", fontSize: '14px', color: secTextColor, paddingLeft: '2px',

      }}>
          Collection of your physical books </sup> */}
            </div>
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
            gap: "15px",
            margin: "auto",
            overflowX: "scroll",
            marginTop: "5px",
            borderRadius: "10px",
            padding: "13px 10px 13px 1px",
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
            !loading &&
            filteredBooks.filter((b) => !b.inWishlist).length == 0 && (
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
            .filter((b) => !b.inWishlist)
            .map((item) => (
              <div
                style={{
                  flex: "0 0 auto",
                }}
              >
                {/* Front Side */}
                <div style={{ position: "relative" }}>
                  <Popover
                    open={openPopOver == item.title}
                    onOpenChange={(open) =>
                      setOpenPopOver(open ? item.title : null)
                    }
                    content={
                      <span style={{ padding: "0px" }}>
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
                  >
                    <MoreVertical
                      size={17}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenPopOver(
                          item.title == openPopOver ? null : item.title
                        );
                        logGAEvent("click_more_options_on_book_card");
                      }}
                      style={{
                        display: "block",
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        width: "15px",
                        cursor: "pointer",
                        zIndex: "10",
                        color: "black",
                        backgroundColor: "white",
                        borderRadius: "4px",
                      }}
                    />
                  </Popover>

                  {/* Delete button overlay */}
                  <div
                    className="delete-overlay"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteBook(item.id);
                    }}
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "50%",
                      padding: "5px",
                      cursor: "pointer",
                      zIndex: "10",
                      display: "none", // Initially hidden, will show on hover
                    }}
                  >
                    <Trash2 size={18} color="red" />
                  </div>

                  <Link href={`/book/${item.id}`}>
                    <Card
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
                      {item.inProgress && (
                        <Bookmark
                          size={25}
                          color={"white"}
                          fill={priColor}
                          style={{
                            position: "absolute",
                            top: "-2px",
                            left: "7px",
                            zIndex: "9",
                          }}
                        />
                      )}
                      {item.completedReading && (
                        <CheckCircle
                          size={30}
                          fill={"green"}
                          color={"white"}
                          style={{
                            position: "absolute",
                            top: "50%",
                            right: "50%",
                            transform: "translate(50%, -50%)",
                            zIndex: "9",
                          }}
                        />
                      )}
                      <div
                        style={{
                          position: "relative",
                          width: "17vw",
                        }}
                      >
                        <img
                          src={item.cover}
                          style={{
                            width: "17vw",
                            opacity: item.completedReading ? 0.5 : 1,
                            height: "26vw",
                            border: "2px solid white",
                            objectFit: "cover",
                            flex: "0 0 auto",
                            borderRadius: "7px", // Optional: Slight rounding for a premium look
                            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.28)", // Soft shadow
                            transition:
                              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out", // Smooth hover effect
                          }}
                          onMouseEnter={(e) => {
                            // Show delete button on hover
                            const deleteOverlay = e.currentTarget
                              .closest('div[style*="position: relative"]')
                              .querySelector(".delete-overlay");
                            if (deleteOverlay)
                              deleteOverlay.style.display = "block";
                          }}
                          onMouseLeave={(e) => {
                            // Hide delete button when not hovering
                            const deleteOverlay = e.currentTarget
                              .closest('div[style*="position: relative"]')
                              .querySelector(".delete-overlay");
                            if (deleteOverlay)
                              deleteOverlay.style.display = "none";
                          }}
                        />
                      </div>
                    </Card>
                  </Link>
                </div>
              </div>
            ))}
        </div>

        <Modal
          title="Add New Book"
          centered
          open={showManuallyAddBookModal}
          onCancel={() => {
            setShowManuallyAddBookModal(false);
            setIsAddBookModalVisible(true);
            form.resetFields();
          }}
          footer={null}
          width={"80vw"}
          style={{ zIndex: "999999" }}
        >
          <br />
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              handleAddBook({
                title: values.title,
                author: values.author || "",
                totalPages: values.totalPages || 243,
                cover: imageBase64 || "",
              });
            }}
          >
            <Form.Item
              name="title"
              label="Book Title"
              rules={[
                { required: true, message: "Please enter the book title" },
              ]}
            >
              <Input placeholder="Enter book title" />
            </Form.Item>
            <Form.Item
              name="author"
              label="Author (optional)"
              rules={[{ required: true, message: "Please enter the author" }]}
            >
              <Input placeholder="Enter author name" />
            </Form.Item>
            <Form.Item
              name="totalPages"
              label="Total number of pages"
              rules={[
                {
                  required: true,
                  message: "Please enter the total number of pages",
                },
              ]}
            >
              <Input type="number" placeholder="Number of pages e.g 348" />
            </Form.Item>
            <Form.Item label="Book Cover Photo (optional)">
              <CameraUpload
                forBookCover={true}
                handleImage={handleImageUpload}
              />
            </Form.Item>
            <Form.Item>
              <Button
                disabled={processingImageUplaod}
                style={{
                  backgroundColor: "black",
                  color: "white",
                }}
                type="primary"
                htmlType="submit"
                block
              >
                {uploadingBook ? (
                  <Loader className="loader" size={20} />
                ) : (
                  "Add to Bookshelf"
                )}
              </Button>
            </Form.Item>
          </Form>
        </Modal>

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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchGoogleBooks(); // Call your search function
                }
              }}
              style={{ width: "-webkit-fill-available" }}
            />
            {loadingGoogleBooks ? (
              <Loader
                style={{
                  padding: "10px 13px",
                  borderRadius: "999px",
                  marginLeft: "15px",
                }}
                className="loader"
              />
            ) : (
              <SearchIcon
                size={23}
                style={{
                  padding: "10px 13px",
                  borderRadius: "999px",
                  backgroundColor: priColor,
                  color: "white",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.28)",
                  marginLeft: "15px",
                }}
                onClick={() => handleSearchGoogleBooks()}
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
            {false ? (
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
                      <p> Build your bookshelf </p>
                    </div>
                  ),
                }}
                itemLayout="horizontal"
                dataSource={sortedSearchResults}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      width: "100%",
                    }}
                  >
                    <List.Item.Meta
                      description={
                        <div
                          style={{
                            lineHeight: "normal",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            padding: "10px",
                            borderRadius: "8px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}
                        >
                          {/* Book Header */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                            }}
                          >
                            <img
                              src={item.volumeInfo.imageLinks?.thumbnail}
                              alt={item.volumeInfo.title}
                              style={{
                                width: "50px",
                                height: "75px",
                                objectFit: "cover",
                                marginRight: "10px",
                                transition: "transform 0.3s ease",
                                border: "1px solid silver",
                                borderRadius: "4px",
                              }}
                            />
                            <div
                              style={{
                                textDecoration: "none",
                                color: priTextColor,
                                fontSize: "14px",
                                width: "100%",
                              }}
                            >
                              <strong>{item.volumeInfo.title}</strong>
                              <br />
                              <sup>
                                by{" "}
                                {item.volumeInfo.authors
                                  ?.join(", ")
                                  .substring(0, 30)}
                              </sup>
                              <br />
                              <br />
                              <Button
                                size="small"
                                type="ghost"
                                disabled={addingToBookshelf[item.id]}
                                style={{
                                  gap: "3px",
                                  color: addingToBookshelf[item.id]
                                    ? "silver"
                                    : priColor,
                                }}
                                onClick={() => {
                                  setAddingToBookshelf((prev) => ({
                                    ...prev,
                                    [item.id]: true,
                                  }));
                                  handleAddBook({
                                    title: item.volumeInfo.title,
                                    author:
                                      item.volumeInfo.authors?.join(", ") || "",
                                    totalPages:
                                      item.volumeInfo.pageCount || 243,
                                    cover:
                                      item.volumeInfo.imageLinks?.thumbnail ||
                                      "",
                                  }).finally(() => {
                                    setAddingToBookshelf((prev) => ({
                                      ...prev,
                                      [item.id]: false,
                                    }));
                                  });
                                }}
                              >
                                <Plus size={14} /> Bookshelf
                              </Button>{" "}
                              &nbsp; &nbsp;
                              <Button
                                size="small"
                                type="ghost"
                                disabled={addingToWishlist[item.id]}
                                style={{
                                  gap: "3px",
                                  color: addingToWishlist[item.id]
                                    ? "silver"
                                    : "",
                                }}
                                onClick={() => {
                                  setAddingToWishlist((prev) => ({
                                    ...prev,
                                    [item.id]: true,
                                  }));
                                  handleAddBook({
                                    title: item.volumeInfo.title,
                                    author:
                                      item.volumeInfo.authors?.join(", ") || "",
                                    totalPages:
                                      item.volumeInfo.pageCount || 243,
                                    cover:
                                      item.volumeInfo.imageLinks?.thumbnail ||
                                      "",
                                    inWishlist: true,
                                  }).finally(() => {
                                    setAddingToWishlist((prev) => ({
                                      ...prev,
                                      [item.id]: false,
                                    }));
                                  });
                                }}
                              >
                                <Plus size={14} /> Wishlist
                              </Button>
                            </div>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
            <br />
            <div
              align="right"
              style={{ fontSize: "12px", color: priColor }}
              onClick={() => {
                setIsAddBookModalVisible(false);
                setShowManuallyAddBookModal(true);
              }}
            >
              or add manually
            </div>
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
    )
  );
};

export default BookList;
