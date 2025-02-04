'use client'
import ScanResults from "@/components/ScanResults";
import ImageUpload from "../../../components/imageUpload";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createScan, getLatestScanByBookTitleAndUserId } from "@/firebase/services/scanService";
import { getBookByTitleAndUserId } from "@/firebase/services/bookService";
import { Book, BookOpen, Loader } from "lucide-react";

export default function ScanWithBookTitle() {
  const [data, setData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);

  const { bookTitle } = useParams();

  const title = decodeURIComponent(bookTitle);

  useEffect(() => {
    const loadData = async () => {
      await getLatestScanByBookTitleAndUserId(title).then((scan) => {
        setData(scan);
        console.log(scan);
        setModalOpen(true);
      });
      const getBook = async () => {
        const book = await getBookByTitleAndUserId(title);
        setBook(book);
        setLoading(false);
      }
      getBook();
    }
    
    loadData().then(res => {
    setLoading(false);

    });
    
  }, []);

  return (
    <div>
      <>
      <br/>
      <div style={{
      textAlign: 'center',
      // background: `linear-gradient(145deg,  ${'#a1c7f7'}, #f0f4ff, #f0f4ff, ${'#a1c7f7'}, #f0f4ff, #f0f4ff)`, 
      background: `#555555`, 
      borderRadius: '999px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      margin: '0px 10px',
      padding: '5px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      
    }}>
      <div style={{
        fontSize: '16px',
        fontWeight: '400',
        color: 'silver',
      margin: 0,
        padding: '4px 14px',
        display: 'flex',
        alignItems: 'center',
      }}>

      <BookOpen color="silver" size={20} /> &nbsp; {title.toUpperCase()}
      </div>

      {book?.pagesRead && <p style={{
        fontSize: '14px',
        fontWeight: '500',
        color: 'silver',
        margin: 0,
        display: 'inline-block',
        padding: '4px 12px'
      }}>
        Page {book?.pagesRead} 
      </p>}
</div>

      {
        loading ? <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', width: '100%'}}>
          <Loader className="loader" size={35} />
        </div> :  <>
        
        {data && <ScanResults
          setBook={setBook}
          scans={data} 
        />}
        {!data && !loading && <>
          <br/>
        <br/>
        <br/>
        <br/>
        <div>Animation to show how to scan or simple scan process simple</div>
        <ImageUpload bookTitle={title} setBook={setBook} setData={setData} setModalOpen={setModalOpen} /></>}
        </>
      }
      </>
    </div>
  );
}
