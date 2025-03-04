import React, { useState } from "react";
import { Modal, Button, List, Divider } from "antd";
import {
  defaultBorderColor,
  priColor,
  priTextColor,
  secTextColor,
} from "@/configs/cssValues";
import {
  BookPlus,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  CheckSquare,
  CheckSquare2,
  Coins,
  Infinity,
  Leaf,
  MoveLeft,
  Shield,
  Sparkles,
  Star,
  Target,
} from "lucide-react";
import { initiatePurchaseFlow } from "@/payments/playstoreBilling";
import { useRouter } from "next/navigation";
import { logGAEvent } from "@/firebase/googleAnalytics";
import { logo } from "@/assets";
import Image from "next/image";

const Plans = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const colors = {
    primary: "#4A90E2",
    secondary: "#D0021B",
    background: "#F5F5F5",
    text: "#333",
  };

  const plans = [
    {
      id: "monthly",
      digitalGoodsId: "monthly_subscription",
      title: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <Sparkles
            size={18}
            style={{ color: "#FFD700", marginRight: "8px" }}
          />
          Subscribe Monthly
        </span>
      ),
      price: "$9.99/mo",
      features: ["Feature A", "Feature B", "Feature C"],
    },
    {
      id: "lifetime",
      digitalGoodsId: "lifetime_access",
      title: (
        <span style={{ display: "flex", alignItems: "center" }}>
          <Infinity
            size={18}
            style={{ color: "#FFD700", marginRight: "8px" }}
          />
          Get Lifetime Access
        </span>
      ),
      price: "$299.99",
      features: ["All Features", "Priority Support", "Lifetime Updates"],
    },
  ];

  const openPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const features = [
    <>
      <BookPlus size={20} /> &nbsp;&nbsp;Add unlimited books
    </>,
    <>
      <Camera size={20} /> &nbsp;&nbsp;No limit on AI scans
    </>,
    // <>
    //   <Coins size={20} /> &nbsp;&nbsp;1.5x coin earnings
    // </>,
    // <>
    //   <ShoppingBag size={19} /> &nbsp;&nbsp;Access to Reeda store
    // </>,
  ];

  const router = useRouter();
  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(135deg, #1a237e 0%, #311b92 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <br />
      <br />
      {/* Decorative background elements */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(103, 58, 183, 0.3) 0%, rgba(103, 58, 183, 0) 70%)",
          top: "-100px",
          right: "-100px",
          zIndex: "0",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(33, 150, 243, 0.3) 0%, rgba(33, 150, 243, 0) 70%)",
          bottom: "50px",
          left: "-50px",
          zIndex: "0",
        }}
      ></div>

      {/* Main content container */}
      <div
        style={{
          position: "relative",
          zIndex: "1",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px 0",
        }}
      >
        {/* Premium header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
            width: "90%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
            <Image src={logo} width={55} height={55} alt="logo" />
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "white",
              margin: "0 0 8px 0",
              textShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Unlock Premium
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.8)",
              margin: "0",
              fontWeight: "400",
            }}
          >
            Join thousands of readers enjoying premium benefits
          </p>
        </div>

        {/* Benefits card */}
        <div
          style={{
            width: "75%",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "25px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "white",
              margin: "0 0 15px 0",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Target
              size={24}
              style={{ color: "#FFD700", marginRight: "10px" }}
            />
            Premium Benefits
          </h2>

          <List
            style={{ width: "100%" }}
            dataSource={features}
            renderItem={(item) => (
              <List.Item
                key={item}
                style={{
                  padding: "12px 0",
                  border: "none",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "16px",
                  fontWeight: "400",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  color: "white",
                }}
              >
                <CheckCircle
                  size={22}
                  style={{
                    color: "#4ade80",
                    marginRight: 15,
                    filter: "drop-shadow(0 0 3px rgba(74, 222, 128, 0.4))",
                  }}
                />
                {item}
              </List.Item>
            )}
          />
        </div>
        <br />
        <br />

        {/* Subscription plans */}
        <div style={{ margin: "0 auto" }}>
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              style={{ marginBottom: "15px", position: "relative" }}
            >
              {index === 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-5px",
                    background: "#FFD700",
                    color: "#000",
                    fontSize: "12px",
                    fontWeight: "700",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    zIndex: "2",
                  }}
                >
                  POPULAR
                </div>
              )}
              <div
                onClick={() => {
                  initiatePurchaseFlow([plan.digitalGoodsId]);
                  logGAEvent("click_purchase_button", { plan: plan.title });
                }}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background:
                    index === 0
                      ? "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
                      : "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                  padding: "16px 25px",
                  fontSize: "17px",
                  fontWeight: "600",
                  borderRadius: "12px",
                  color: "white",
                  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                {/* Shiny effect overlay */}
                <div
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "-10px",
                    right: "-10px",
                    bottom: "-10px",
                    background:
                      "linear-gradient(45deg, transparent 0%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 100%)",
                    transform: "translateX(-100%)",
                    animation: "shine 2.5s infinite",
                  }}
                ></div>
                <style>
                  {`
                    @keyframes shine {
                      0% { transform: translateX(-100%); }
                      20% { transform: translateX(100%); }
                      100% { transform: translateX(100%); }
                    }
                  `}
                </style>
                <span style={{ zIndex: "1" }}>{plan.title}</span>
                {/* Price badge */}
                {/* <span
                  style={{
                    position: "absolute",
                    right: "20px",
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  {plan.price}
                </span> */}
              </div>
            </div>
          ))}

          <div
            onClick={() => {
              logGAEvent("click_i_will_do_it_later_plans_page");
              router.back();
            }}
            style={{
              fontFamily: "'Inter', sans-serif",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "transparent",
              padding: "15px 25px",
              fontSize: "16px",
              borderRadius: "999px",
              color: "rgba(255, 255, 255, 0.6)",
              marginTop: "15px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              transition: "all 0.2s ease",
            }}
          >
            <MoveLeft size={17} style={{ marginRight: "8px" }} /> I'll decide
            later
          </div>
        </div>

        {/* Security badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "30px",
            color: "rgba(255, 255, 255, 0.5)",
            fontSize: "14px",
          }}
        >
          <Shield size={14} style={{ marginRight: "6px" }} />
          Secure payments
        </div>
      </div>
    </div>
  );
};

export default Plans;
