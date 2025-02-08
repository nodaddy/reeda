"use client"

import { MoreVertical, BookMarked, Coins, MoreHorizontal, ArrowDown, TriangleDashed, List, X } from "lucide-react";
import Link from "next/link";
import { Badge, Tooltip } from "antd";
import { getScanCount } from "@/firebase/services/scanService";
import { useEffect, useState } from "react";
import { storage } from "@/app/utility";

const { default: SignInWithGoogle } = require("./SignInWithGoogle");

export const Navbar = ({isPremium = true}) => {
  const [bookmarks, setBookmarks] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    getScanCount().then((res) => {
      setBookmarks(res);
    });
  }, []);

  return (
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
        zIndex: "999999",
        backgroundColor: "white",
        fontWeight: "300",
        color: '#555555',
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
     
      <span>
        <h3 style={{ marginLeft: "20px", fontWeight: "bold" }}>Reeda 
        
        <br/>   {
      isPremium ? <span style={{
        padding: '3px 15px',
        fontSize: 'x-small',
        backgroundColor: 'transparent',
        color: '#fa541c',
        position: 'absolute',
        bottom: '12px',
        left: '5px'
      }}>
        Premium
      </span> :
      ''
    }</h3>
      </span>

      <span style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {storage.getItem("user") && (
            <div style={{
                border: '1px solid '+ 'goldenrod',
                borderRadius: '999px',
                padding: '4px 16px',
                // backgroundColor: 'whitesmoke',
                color: '#555555',
                display: 'flex',
                fontSize: '14px',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer'
            }}>
            <Badge
              count={bookmarks}
              showZero
              offset={[-10, 10]}
              style={{
                backgroundColor: 'goldenrod',
                color: "white",
                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
              }}
            >
              <Coins size={18} color={'white'} style={{ cursor: "pointer" }} />
            </Badge> 
            Coins
            </div>
        )}

{storage.getItem("user") && (
            <List
              color={"#555555"}
              size={25}
              style={{  cursor: "pointer", marginRight: "20px" }}
              onClick={() => setMenuOpen(true)}
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

        <h3 style={{ padding: "7px 20px", fontSize: "19px", color: "#333", fontWeight: "500" }}>Menu</h3>
        <ul style={{ listStyle: "none", padding: "20px", margin: "20px 0" }}>
          <li style={{ borderBottom: "1px solid #ddd", padding: '18px 0px' }}>
            <Link onClick={() => setMenuOpen(false)} href="/profile" style={{ color: "#333", textDecoration: "none" }}>Profile</Link>
          </li>
          <li style={{ borderBottom: "1px solid #ddd", padding: '18px 0px' }}>
            <Link onClick={() => setMenuOpen(false)} href="/premium" style={{ color: "#333", textDecoration: "none" }}>Upgrade to premium</Link>
          </li>
          <li style={{ borderBottom: "1px solid #ddd", padding: '18px 0px' }}>
            <Link onClick={() => setMenuOpen(false)} href="/settings" style={{ color: "#333", textDecoration: "none" }}>Settings</Link>
          </li>
          <li style={{  padding: '18px 0px' }}>
            <span onClick={() => {
              storage.removeItem("user");
              window.location.reload();
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



