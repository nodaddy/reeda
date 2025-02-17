"use client"

import { BookOpen, Coins, File, FileDiff, List, LucideTarget, MessageCircle, MessageCircleCodeIcon, Rocket, Target, X } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Input, Popover, Progress} from "antd";
import { useEffect, useState } from "react";
import { getPagesReadToday, storage } from "@/app/utility";
import { getProfile } from "@/firebase/services/profileService";
import { useAppContext } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { logGAEvent } from "@/firebase/googleAnalytics";
import { priColor } from "@/configs/cssValues";

const { default: SignInWithGoogle } = require("./SignInWithGoogle");

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(null);
  const { isPremium, profile, setProfile, currentBook} = useAppContext();

  const router = useRouter();

  const [showTargetPopover, setShowTargetPopover] = useState(false);

  const pathName = usePathname();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Replace 'userId' with the actual user ID (e.g., from authentication)
        const userId = JSON.parse(storage.getItem('user')).email; // You can get this from Firebase Auth or context
        let profileData;
        if (userId) {
          profileData = await getProfile(userId);
        }
        setProfile(profileData);
      } catch (error) {
      } finally {
      }
    };

    fetchProfile();
  }, []);

  return ( pathName === '/' ? null :
    <>
    <div
      style={{
        position: "fixed",
        width: "100vw",
        top: "0",
        right: "0",
        display: "flex",
        alignItems: "center",
        padding: "5px 0px",
        justifyContent: "space-between",
        zIndex: "999",
        backgroundColor: "white",
        fontWeight: "300",
        color: '#555555',
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
     
      <Link style={{
        textDecoration: 'none',
        color: 'inherit'
      }}
      onClick={() => {
        logGAEvent('click_logo_navbar')
      }}
      href="/">
        <h3 style={{ marginLeft: "20px", fontWeight: "bold", whiteSpace: 'nowrap' }}> <BookOpen style={{
          marginBottom: '-6px'
        }} /> &nbsp;{currentBook ? currentBook.title.substring(0, 16) + (currentBook.title.length > 10 ? '...' : '') : 'Reeda'}
        <br/>   
      {
      isPremium  && !currentBook? <span style={{
        padding: '3px 15px',
        fontSize: 'x-small',
        backgroundColor: 'transparent',
        color: '#fa541c',
        position: 'absolute',
        bottom: '10px',
        left: '38px'
      }}>
        Premium
      </span> 
      :
      ''
    }</h3>
      </Link>

      <span style={{ display: "flex", alignItems: "center", }}>


        {storage.getItem("user") && (
            <div
            onClick={() => {
               logGAEvent('click_coins_navbar', {coins: profile?.coins});
            }}
            style={{
                border: '1px solid '+ 'goldenrod',
                borderRadius: '999px',
                padding: '4px 14px',
                // backgroundColor: 'whitesmoke',
                color: '#555555',
                display: 'flex',
                fontSize: '14px',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                marginRight: currentBook ? '18px' : '14px'
            }}>
            <Badge
              count={profile?.coins || ' '}
              showZero
              offset={[-10, 10]}
              style={{
                backgroundColor: 'goldenrod',
                color: "white",
                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
              }}
            >
              <Coins size={18} color={'white'} style={{ cursor: "pointer" }} />
            </Badge>Coins
            </div>
        )}


{
  storage.getItem("user") &&
  <Popover
  open={currentBook ? false : true && showTargetPopover}
  placement="bottomLeft"
  content={
    <div>
            <Input
              type="number"
              placeholder={storage.getItem('daily-target')}
              onChange={(e)=>{
                storage.setItem('daily-target', e.target.value);
              }}
              style={{
                maxWidth: '58px'
              }}
            />
            &nbsp;
            &nbsp;
            <Button type="link" onClick={() => { 
              window.location.reload(); }} style={{ marginTop: 5, padding: '0px' }}>
              Save
            </Button>
          </div>
  }
  title={<span style={{
    fontWeight: '400'
  }}>Set Daily Goal ( Pages )</span>}
  trigger={'click'}
  >
     <div style={{ display: "flex", alignItems: "center", gap: "10px", marginRight: currentBook ? '20px' : '14px'
 }}
     onClick={() => {
      setShowTargetPopover(!showTargetPopover);
      logGAEvent('click_set_daily_goal');
     }}
     >
      <Progress
        type="circle"
        percent={(Math.min((getPagesReadToday()/(storage.getItem('daily-target') || 1)) * 100, 100)).toFixed(0)}
        strokeWidth={14} // Thicker stroke for a premium feel
        strokeColor={{
          "0%": "#52c41a", // Start color (green)
          "100%": "#52c41a", // End color (blue)
        }}
        format={() => getPagesReadToday() == storage.getItem('daily-target') ? null : `${getPagesReadToday()}`}
        // format={() => } // Hide percentage text inside
        width={28} // Adjust size
      />
    </div>
      
    {/* </Badge> */}
  </Popover>
}

{storage.getItem("user") && (
            <List
              color={"#555555"}
              size={26}
              style={{  cursor: "pointer", marginRight: "20px", display: currentBook ? 'none' : 'block' }}
              onClick={() => {
                setMenuOpen(true);
                logGAEvent('click_options_navbar')
              }}
            />
          )}
        </span>
      </div>

      {/* Sliding Menu */}
      <div
        style={{
          position: "fixed",
          top: "0",
          right: menuOpen ? "0" : "-300px",
          width: "280px",
          height: "100vh",
          backgroundColor: "white",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          transition: "right 0.3s ease-in-out",
          padding: "0px",
          zIndex: "1000000",
        }}
      >
        <X
          size={24}
          color="#555555"
          style={{ cursor: "pointer", position: "absolute", right: "20px", top: "20px" }}
          onClick={() => setMenuOpen(false)}
        />

        <h4 style={{ padding: "0px 20px", fontSize: "19px", color: "#333", fontWeight: "500" }}>
          Menu
        </h4>
        <ul style={{ listStyle: "none", padding: "20px", margin: "20px 0" }}>
        <li style={{ borderBottom: "1px solid #ddd", padding: '18px 0px' }}>
            <Link onClick={() => setMenuOpen(false)} href="/" style={{ color: "#333", textDecoration: "none" }}>Home</Link>
          </li>
          <li style={{ borderBottom: "1px solid #ddd", padding: '18px 0px' }}>
            <Link onClick={() => setMenuOpen(false)} href="/profile" style={{ color: "#333", textDecoration: "none" }}>My Profile</Link>
          </li>
          {!isPremium && <li style={{ borderBottom: "1px solid #ddd", padding: '18px 0px' }}>
            <Link onClick={() => {
              setMenuOpen(false);
              logGAEvent('click_upgrade_to_premium_navbar');
              }} href="/premium" style={{ color: "#333", textDecoration: "none" }}>Upgrade to premium</Link>
          </li>}
          {/* <li style={{ borderBottom: "1px solid #ddd", padding: '18px 0px' }}>
            <Link onClick={() => setMenuOpen(false)} href="/store" style={{ color: "#333", textDecoration: "none" }}>
              The Reeda Store
              
            </Link>
          </li> */}
          {/* <li style={{ borderBottom: "1px solid #ddd", padding: '18px 0px' }}>
            <Link onClick={() => setMenuOpen(false)} href="/settings" style={{ color: "#333", textDecoration: "none" }}>Settings</Link>
          </li> */}
          <li style={{ borderBottom: "1px solid #ddd", padding: '18px 0px' }}>
            <Link onClick={() => setMenuOpen(false)} href="https://wa.me/918126153920" style={{ color: "#333", textDecoration: "none" }}>
              Contact us &nbsp;<MessageCircleCodeIcon /> 
            </Link>
          </li>
          <li style={{  padding: '18px 0px' }}>
            <span onClick={() => {
              storage.removeItem("user");
              setProfile(null);
              router.push('/');
            }} style={{ color: "#e63946", textDecoration: "none" }}>Logout</span>
          </li>
        </ul>
      </div>
      
    {/* Overlay when menu is open */}
    {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            right: "0",
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: "999999",
          }}
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
};



