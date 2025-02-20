import { priTextColor } from "@/configs/cssValues";

import { Plus } from "lucide-react";

export const bookIconCircleCss = {
  height: "70px",
  display: "inline-block",
  width: "70px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const WishList = () => {
  return (
    <>
      <div
        style={{
          // marginTop: '13px',
          margin: "auto",
          marginTop: "5px",
          borderRadius: "10px",
          padding: "20px 0px",
          zIndex: "1",
        }}
      >
        <span
          style={{
            fontWeight: "400",
            margin: "0px",
            fontSize: "18px",
            padding: "5px 0px",
            color: priTextColor,
            borderRadius: "6px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {" "}
          Wishlist
        </span>
        <br />
        <br />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            overflowX: "auto",
          }}
        ></div>
        <span
          style={{
            ...bookIconCircleCss,
            border: "1px dashed #ccc",
          }}
        >
          <Plus />
        </span>
      </div>
    </>
  );
};

export default WishList;
