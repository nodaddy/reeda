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
            message={<>Upgrade to premium to add <Tag> <BookPlus size={11} /> More Books</Tag> unlock <Tag><Camera size={12} /> Unlimited Scans</Tag>and get access to the <Tag> <ShoppingBag size={11} /> Reeda Store</Tag></>}
            style={{
                width: '80%',
                margin: 'auto',
                marginTop: '5px',
                color: priTextColor,
                paddingLeft: '20px',
                lineHeight: '2',
                fontFamily: "'Inter', sans-serif",
            }}
            />
            <br/>
            <Plans />
        </div>
    );
}

export default Page;