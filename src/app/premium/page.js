'use client'
import Plans from "@/components/Plans";
import { priColor, priTextColor, secTextColor } from "@/configs/cssValues";
import { isUserPremium } from "@/payments/playstoreBilling";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    isUserPremium().then((result) => {
      // alert(result);
      setIsPremium(result)}).catch((err) => console.log(err));
  }, []);

    return (  true ? 
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
            <br/>
            <br/>
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
                <sub style={{
                    color: priTextColor
                }}>Unlock Premium Features</sub> 
                

               <span style={{
                fontSize: '23px',
                marginTop: '10px',
                marginBottom: '10px',
               }}> UPGRADE TO PREMIUM </span>
                </div>
            </div>
            <Plans />
        </div>
    );
}

export default Page;