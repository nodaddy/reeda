import { useState } from "react";
import { Modal, Rate, Input, Button, message } from "antd";
import { StarFilled } from "@ant-design/icons";
import { motion } from "framer-motion";
import { updateBookById } from "@/firebase/services/bookService";
import { Star } from "lucide-react";
import { secTextColor } from "@/configs/cssValues";
import {
  generateRandomColourForString,
  getCurrentTimestampInMilliseconds,
} from "@/app/utility";

const { TextArea } = Input;

const FinalReviewModal = ({
  isReviewModalOpen,
  setIsReviewModalOpen,
  bookId,
  book,
  setBook,
}) => {
  const [rating, setRating] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const [savingData, setSavingData] = useState(false);

  const handleSubmit = async () => {
    setSavingData(true);
    if (rating === 0) {
      return alert("Please provide a rating before submitting.");
    }

    await updateBookById(
      {
        completedReading: true,
        completedReadingOn: getCurrentTimestampInMilliseconds(),
        inProgress: false,
        review: { rating, remarks },
      },
      bookId
    );

    setBook({
      ...book,
      completedReading: true,
      completedReadingOn: getCurrentTimestampInMilliseconds(),
      inProgress: false,
      review: { rating, remarks },
    });

    messageApi.success("Wow! You've read it all.");
    setIsReviewModalOpen(false);
    setSavingData(false);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              fontSize: "18px",
              fontWeight: "500",
              textAlign: "center",
              color: "#333",
            }}
          >
            Your Review of the Book
          </motion.div>
        }
        open={isReviewModalOpen}
        onCancel={() => setIsReviewModalOpen(false)}
        footer={null}
        centered
        style={{ borderRadius: "12px", padding: "20px" }}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ margin: "20px auto" }}>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "5px" }}>
              &nbsp;How good was it?
            </p>
            <Rate
              value={rating}
              onChange={(value) => setRating(value)}
              allowHalf
              style={{ fontSize: "24px" }}
            />
          </div>

          <TextArea
            rows={4}
            placeholder="Any additional remarks? For example, your favorite part of the book or what did you learn from it?"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            style={{
              width: "100%",
              borderRadius: "8px",
              padding: "12px",
              fontSize: "14px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
          />

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={savingData}
              style={{
                borderColor: "transparent",
                backgroundColor: "transparent",
                padding: "10px 20px",
                paddingRight: "0px",
                boxShadow: "0px 0px 0px transparent",
                borderRadius: "6px",
                color: generateRandomColourForString(book?.title),
              }}
            >
              Submit
            </Button>
          </div>
          <br />
          <span
            style={{
              color: secTextColor,
            }}
          >
            * This review would be publicly visible on your bookshelf
          </span>
        </motion.div>
      </Modal>
    </>
  );
};

export default FinalReviewModal;
