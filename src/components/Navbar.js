"use client"

import { MoreVertical, BookMarked, Coins, MoreHorizontal, ArrowDown, TriangleDashed, List } from "lucide-react";
import Link from "next/link";
import { Badge, Tooltip } from "antd";
import { getScanCount } from "@/firebase/services/scanService";
import { useEffect, useState } from "react";
import { storage } from "@/app/utility";

const { default: SignInWithGoogle } = require("./SignInWithGoogle");

export const Navbar = () => {
  const [bookmarks, setBookmarks] = useState(null);

  useEffect(() => {
    getScanCount().then((res) => {
      setBookmarks(res);
    });
  }, []);

  return (
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
        <h3 style={{ marginLeft: "20px", fontWeight: "bold" }}>Reeda</h3>
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
          <Link style={{ marginRight: "20px" }} href="/profile">
            <List color={'#555555'} size={24} style={{
                transform: "translateY(3px)"
            }} />
          </Link>
        )}
      </span>
    </div>
  );
};