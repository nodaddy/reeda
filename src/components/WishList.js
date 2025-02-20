import { priTextColor } from "@/configs/cssValues";
import { useAppContext } from "@/context/AppContext";

import { Plus } from "lucide-react";

export const bookIconCircleCss = {
  height: "70px",
  display: "inline-block",
  width: "70px",
  flex: "0 0 auto",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const WishList = () => {
  const { books } = useAppContext();
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
            overflowX: "auto", // Enables horizontal scrolling
            whiteSpace: "nowrap", // Prevents content from wrapping
            width: "100%",
            gap: "15px",
          }}
        >
          <span
            style={{
              ...bookIconCircleCss,
              border: "1px dashed grey",
            }}
          >
            <Plus color="grey" />
          </span>

          {books?.filter((book) => book.wishlist).length === 0 &&
            [1, 1, 1, 1].map((a) => (
              <span
                style={{
                  ...bookIconCircleCss,
                  border: "1px dashed silver",
                }}
              ></span>
            ))}
        </div>
      </div>
    </>
  );
};

export default WishList;
