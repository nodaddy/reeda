import React, { useState } from "react";
import { Modal, Button, List, Divider } from "antd";
import { defaultBorderColor, priColor, priTextColor } from "@/configs/cssValues";
import { BookPlus, Camera, Check, CheckCircle, CheckSquare, Coins, ShoppingBag, Sparkle, Sparkles, Star} from "lucide-react";
import { initiatePurchaseFlow } from "@/payments/playstoreBilling";

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
    { id: "monthly", digitalGoodsId: "monthly_subscription", title: "Subscribe Monthly", price: "$9.99/mo", features: ["Feature A", "Feature B", "Feature C"] },
    // { id: "yearly", digitalGoodsId: "yearly_subscription", title: "Yearly", price: "$99.99/yr", features: ["Feature A", "Feature B", "Feature C", "Feature D"] },
    { id: "lifetime", digitalGoodsId: "lifetime_access", title: "Buy Lifetime Access", price: "$299.99", features: ["All Features", "Priority Support", "Lifetime Updates"] },
  ];

  const openPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const features = [
    <><BookPlus size={20} /> &nbsp;Add multiple books</>,
    <><Camera size={20} /> &nbsp;No limit on scans</>,
    <><Coins size={20} /> &nbsp;1.5x coin earnings</>,
    <><ShoppingBag size={20} /> &nbsp;Access to Reeda store</>
  ];

  return (
    <div style={{
        height: '70vh'
    }}>
    <div style={{
        width: '83%',
        fontFamily: 'inherit',
        margin: 'auto',
        borderRadius: '10px',
        // backgroundColor: colors.background,
        // border: '1px solid ' + defaultBorderColor,
        padding: '15px 0px'
    }}>
        {/* // you get the following benefits */}
        <List
            style={{width: '80%', margin: 'auto'}}
            dataSource={features}
            renderItem={(item) => (
                <List.Item key={item} style={{ border: "none", fontSize: "16px", fontWeight: "400", display: "flex", alignItems: "center", justifyContent: 'flex-start',
                color: priTextColor
                }}>
                <CheckSquare size={27} color="#4CAF50" style={{ marginRight: 10 }} />
                {item}
                </List.Item>
            )}
            />

<br/>
<br/>

        <div align="center">
            {
                plans.map((plan) => (
                    <div key={plan.id} style={{marginBottom: '20px'}}>
                        <div 
                        onClick={() => {
                            initiatePurchaseFlow([plan.digitalGoodsId]);
                        }}
                        style={{
                fontFamily: "'Inter', sans-serif",

                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // backgroundColor: priColor,
                            background: 'linear-gradient(135deg, #0070F3 0%, #4D9BFF 100%)',
                            padding: '13px 25px',
                            width: '80%',
                            fontSize: '16px',
                            borderRadius: '999px',
                            color: 'white',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' // Light shadow
                        }}>
                            <span>{plan.title}</span>
                            {/* <span>{plan.price}</span> */}
                        </div>

                    </div>
                ))
            }
        </div>
    </div>
    </div>
  );
};

export default Plans;
