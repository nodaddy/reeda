'use client'
import ScanResults from "@/components/ScanResults";
import ImageUpload from "../../../components/imageUpload";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createScan, getLatestScanByBookTitleAndUserId } from "@/firebase/services/scanService";
import { getBookByTitleAndUserId } from "@/firebase/services/bookService";
import { Book, BookOpen, Loader, MoveLeft } from "lucide-react";
import Link from "next/link";
import { priTextColor, secColor, secTextColor } from "@/configs/cssValues";
import { useAppContext } from "@/context/AppContext";
import { Tag } from "antd";

export default function ScanWithBookTitle() {
  const { bookTitle } = useParams();
  const title = decodeURIComponent(bookTitle);


  const [data, setData] = useState({
    bookTitle: title
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);



  const { setCurrentBook, nightModeOn, showingSummaryOrFullText, setShowingSummaryOrFullText } = useAppContext();

  useEffect(() => {
    const loadData = async () => {
      await getLatestScanByBookTitleAndUserId(title).then((scan) => {
        if(scan) {
          setData(scan);
          if(scan.data[0].summary == ''){
            setShowingSummaryOrFullText('fulltext');
          } else {
            setShowingSummaryOrFullText('summary');
          }
        }
        console.log(scan);
        setModalOpen(true);
      });
      const getBook = async () => {
        const book = await getBookByTitleAndUserId(title);
        setCurrentBook(book);
        setBook(book);
        setLoading(false);
      }
      getBook();
    }
    
    loadData().then(res => {
    setLoading(false);

    });

    return () => {
      // reset currentBook to null
      setCurrentBook(null);
    };
    
  }, []);

  useEffect(() => {
    // Apply theme to root html element
    document.documentElement.style.backgroundColor = nightModeOn ? 'black' : 'white';
    document.documentElement.style.color = nightModeOn ? 'white' : 'black';

    return () => {
      document.documentElement.style.backgroundColor = 'transparent';
      document.documentElement.style.color = priTextColor;
    }
  }, [nightModeOn]);

  return (
    <div>
      <>
      <br/>
      <div style={{
      textAlign: 'center',
      // background: `linear-gradient(145deg,  ${'#a1c7f7'}, #f0f4ff, #f0f4ff, ${'#a1c7f7'}, #f0f4ff, #f0f4ff)`, 
      // background: `#555555`, 
      borderRadius: '7px',
      position: 'relative',
      zIndex: '99999',
      width: '90%',
      marginTop: '8px',
      margin: 'auto',
      // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      
    }}>
      <div style={{
        fontSize: '14px',
        fontWeight: '400',
        color: 'silver',
      margin: 0,
        padding: '4px 0px',
        display: 'flex',
        alignItems: 'center',
        display: 'flex',
        alignItems: 'center',
      }}>

      <Link href="/"
      style={{
        display: 'flex',
        alignItems: 'center',textDecoration :'none',
color: nightModeOn ? 'silver' : priTextColor
      }}
      > <MoveLeft size={19} /> &nbsp; Home
      </Link> 
      
        
      </div>

      {/* <p style={{
        fontSize: '14px',
        fontWeight: '500',
        color: priTextColor,
        margin: 0,
        display: 'inline-block',
        padding: '4px 12px'
      }}>
        <span>&nbsp;&nbsp; {title.toUpperCase()}</span>
      </p> */}
      {showingSummaryOrFullText && <Tag>{showingSummaryOrFullText != 'summary' ? 'Full Text' : 'Summary'}</Tag>}
</div>

      {
        loading ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
          <div> <br/><br/><br/><br/>
          <Loader className="loader" size={35} />
          </div>
        </div> :  <>
        
        {<ScanResults
          setBook={setBook}
          scans={data} 
        />}
        {/* {!data && !loading && <>
          <br/>
        <br/>
        <br/>
        <br/>
        <ImageUpload bookTitle={title} setBook={setBook} setData={setData} setModalOpen={setModalOpen} /></>} */}
        </>
      }
      </>
    </div>
  );
}
