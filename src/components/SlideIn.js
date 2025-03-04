import { useAppContext } from "@/context/AppContext";
import { MoveLeft } from "lucide-react";

const SlideIn = () => {
  const { slideIn, setSlideIn, slideInContent } = useAppContext();
  return (
    <div
      style={{
        position: "fixed",
        left: slideIn ? "0px" : "100vw",
        backgroundColor: "white",
        zIndex: "9999",
        top: "0px",
        margin: "auto",
        fontFamily: "'Inter', sans-serif",
        transition: "left 0.3s ease-in-out",
      }}
    >
      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "scroll",
        }}
      >
        {slideInContent}
      </div>
    </div>
  );
};

export default SlideIn;
