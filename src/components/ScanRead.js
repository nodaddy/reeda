import { priColor } from "@/configs/cssValues";
import { bookTitleForAdHocAISession } from "@/configs/variables";
import { useAppContext } from "@/context/AppContext";
import { Modal, Tag, List, Typography, Popover } from "antd";
import { Info, MoveRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

const featureCardStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "'Inter', sans-serif",
  color: priColor,
  backgroundColor: "white",
  padding: "7px 20px",
  width: "-webkit-fill-available",
  borderRadius: "6px",
  fontSize: "15px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Premium feel
};

const ScanRead = () => {
  const { books } = useAppContext();
  return (
    <>
      <div
        style={{
          borderRadius: "12px",
          backgroundColor: priColor,
          padding: "20px",
          width: "82%",
          margin: "auto",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <span
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            fontWeight: "400",
          }}
        >
          AI Assist &nbsp;
          <Popover
           placement="topRight"
            overlayStyle={{width: '56%'}}
            content={
              <div style={{padding: '5px'}}>
                 - Scan pages <br/>
                 - Get summary (AI) <br/> 
                 - In-page dictionary (AI)<br/>
              </div>
          }>
            <Info size={18} />
          </Popover>
        </span>
        <br />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "17px",
          }}
        >
          <Link href={`scan/${bookTitleForAdHocAISession}`} style={{ ...featureCardStyle, textDecoration: 'none' }}>
            <Zap color="orange" size={16} />
            &nbsp;&nbsp;
            <span> Scan pages</span>
            &nbsp;
            &nbsp;
            <MoveRight />
          </Link>

          {/* <div style={{ ...featureCardStyle }}>
            <Sparkles color="purple" size={15} />
            &nbsp;&nbsp;
            <span> Deep Read</span>
          </div> */}
        </div>
      </div>

      {/* Premium Book Selection Modal */}
      {/* <Modal
        title={<Typography.Title level={4} style={{ margin: 0, fontWeight: '400' }}>📚 Scanning which book?</Typography.Title>}
        open={true}
        onCancel={() => {}}
        style={{
          fontFamily: "'Inter', sans-serif",
          borderRadius: "12px",
          padding: "10px",
        }}
        footer={null}
      >
        {books && <List
          style={{
          height: '20vh',
          overflow: 'auto'
          }}
          dataSource={books}
          renderItem={(book) => (
            <List.Item
              style={{
                padding: "12px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.3s",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                background: "#f9f9f9",
                marginBottom: "8px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              }}
              hoverable
            >
              {book.title}
            </List.Item>
          )}
        />}
      </Modal> */}
    </>
  );
};

export default ScanRead;
