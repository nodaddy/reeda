'use client'
import Plans from "@/components/Plans";
import { priColor, priTextColor, secTextColor } from "@/configs/cssValues";
import { isUserPremium } from "@/payments/playstoreBilling";
import { Alert, Card, Tag } from "antd";
import { Book, BookPlus, Camera, ShoppingBag, Sparkle, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    isUserPremium().then((result) => {
      // alert(result);
      setIsPremium(result)}).catch((err) => console.log(err));
  }, []);

    return (  isPremium ? 
        <div align="center">
        <br/>
        <br/>
        <br/>
        <br/>
        congratulations
        <br/>
        <br/>
        {/* link to homepage */}
        <Link href="/"> Let's go </Link>
        </div>
        :
        <div style={{marginTop: '0px'}}>
            <br/>
            <div
            style={{
                color: 'white',
                fontFamily: "'Inter', sans-serif",
            }}>
                <div
                style={{
                    borderRadius :'10px',
                    backgroundColor: 'white',
                    color: priColor,
                    width: 'fit-content',
                    fontSize: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                }}>
                {/* <sub style={{
                    color: priTextColor
                }}>Unlock Premium</sub> 
                 */}

               <span style={{
                fontSize: '23px',
                marginTop: '10px',
                marginBottom: '10px',
                color: 'goldenrod'
               }}>
                    <span style={{color: secTextColor, fontWeight:'400'}}>
                      Reeda</span> Premium <Sparkle style={{color: 'goldenrod', strokeWidth: '1.5'}} size={40} />
                    <Sparkle style={{color: 'goldenrod'}} />
                </span>
                </div>
            </div>

            <br/>
            <Alert
            type="success"
            message={<><Sparkles style={{color: 'goldenrod'}} />&nbsp; Upgrade to premium to add multiple books and unlimited scans, get access to the Reeda store, and more.</>}
            style={{
                width: '80%',
                margin: 'auto',
                marginTop: '5px',
                color: priTextColor,
                paddingLeft: '20px',
                fontFamily: "'Inter', sans-serif",
            }}
            />
            <br/>
            <Plans />
        </div>
    );
}

export default Page;