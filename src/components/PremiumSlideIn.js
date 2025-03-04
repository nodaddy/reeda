import React from "react";
import Plans from "@/components/Plans";
import { useAppContext } from "@/context/AppContext";

const PremiumSlideIn = () => {
  const { setSlideIn } = useAppContext();

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <Plans />
    </div>
  );
};

export default PremiumSlideIn;
