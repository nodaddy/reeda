import React, { useState } from "react";
import { Modal, Button, List, Divider } from "antd";
import { defaultBorderColor, priColor, priTextColor, secTextColor } from "@/configs/cssValues";
import { BookPlus, Calendar, Camera, Check, CheckCircle, CheckSquare, CheckSquare2, Coins, Infinity, Leaf, MoveLeft, ShoppingBag, Sparkle, Sparkles, Star, Target} from "lucide-react";
import { initiatePurchaseFlow } from "@/payments/playstoreBilling";
import { useRouter } from "next/navigation";

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
    { id: "monthly", digitalGoodsId: "monthly_subscription", title: <span style={{display: 'flex', alignItems: 'center'}}> Subscribe Monthly &nbsp; </span>, price: "$9.99/mo", features: ["Feature A", "Feature B", "Feature C"] },
    // { id: "yearly", digitalGoodsId: "yearly_subscription", title: "Yearly", price: "$99.99/yr", features: ["Feature A", "Feature B", "Feature C", "Feature D"] },
    { id: "lifetime", digitalGoodsId: "lifetime_access", title: <span style={{display: 'flex', alignItems: 'center'}}>  Get Lifetime Access</span>, price: "$299.99", features: ["All Features", "Priority Support", "Lifetime Updates"] },
  ];

  const openPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const features = [
    <><BookPlus size={20} /> &nbsp;&nbsp;Add multiple books</>,
    <><Camera size={20} /> &nbsp;&nbsp;No limit on scans</>,
    <><Coins size={20} /> &nbsp;&nbsp;1.5x coin earnings</>,
    <><ShoppingBag size={19} /> &nbsp;&nbsp;Access to Reeda store</>
  ];

  const router = useRouter();
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
                <List.Item key={item} style={{ padding: '6px', border: "none", fontSize: "16px", fontWeight: "400", display: "flex", alignItems: "center", justifyContent: 'flex-start',
                color: priTextColor
                }}>
                <CheckSquare2 size={25} color="#4CAF50" style={{ marginRight: 10 }} />
                &nbsp;
                {item}
               
                </List.Item>
            )}
            />

<br/>
<br/>

        <div align="center">
            {
                plans.map((plan) => (
                    <div key={plan.id} style={{marginBottom: '15px'}}>
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
                            padding: '14px 25px',
                            width: '77%',
                            fontSize: '16px',
                            borderRadius: '8px',
                            color: 'white',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' // Light shadow
                        }}>
                            <span>{plan.title}</span>
                            {/* <span>{plan.price}</span> */}
                        </div>

                    </div>
                ))
            }
 
                        <div 
                        onClick={() => {
                            router.back();
                        }}
                        style={{
                fontFamily: "'Inter', sans-serif",

                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            // backgroundColor: priColor,
                            background: 'transparent',
                            
                            padding: '13px 25px',
                            width: '80%',
                            fontSize: '16px',
                            borderRadius: '999px',
                            color: 'grey',
                        }}>
                           <MoveLeft size={17} /> &nbsp;&nbsp; I will do it later
                            {/* <span>{plan.price}</span> */}
                        </div>

                    </div>
    </div>
    </div>
  );
};

export default Plans;
