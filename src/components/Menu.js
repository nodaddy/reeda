"use client";

import { useState } from "react";
import {
  Home,
  Camera,
  BookOpen,
  Library,
  WholeWord,
  Search,
  ChartBarBig,
  Scan,
  Users2,
  UsersIcon,
  FileQuestion,
  Info,
  PlaySquare,
} from "lucide-react";
import styles from "./Menu.module.css"; // Import CSS for styling
import Link from "next/link";
import { Badge, Button, Popover } from "antd";
import { priColor, secColor } from "@/configs/cssValues";
import { bookTitleForAdHocAISession } from "@/configs/variables";

export default function BottomNav() {
  const [active, setActive] = useState("home");

  const handleMenuClick = (key) => {
    setActive(key);
  };

  return (
    <div className={styles.bottomNav}>
      <div className={styles.menu}>
        {/* <Link href="/"
          className={`${styles.menuItem} ${active === "home" ? styles.active : ""}`}
          onClick={() => handleMenuClick("home")}
        >
          <UsersIcon size={23} className={styles.icon} />
          <Badge className={styles.menuItem} count={0} showZero={false} color={'silver'} size="small" offset={[-20, -2]}>
            <span>Community</span>
          </Badge>
        </Link> */}

        <span
          style={{
            display: "flex",
            color: priColor,
            alignItems: "center",
            fontWeight: "400",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Start an AI Scans Session &nbsp;
          <Popover
            placement="top"
            overlayStyle={{ width: "57%" }}
            content={
              <div style={{ padding: "5px" }}>
                <b>When to use an AI session? </b>
                <br />
                - Skim through a book: Scan pages - read summaries - finish the
                book
                <br /> - Encoutered tough words: Scan pages - get text - tap on
                words to see meaningS (AI in-page dictionary)
                <br />
              </div>
            }
          >
            <Info size={18} />
          </Popover>
        </span>

        <Link href={`scan/${bookTitleForAdHocAISession}`}>
          <Button
            type="primary"
            style={{
              borderRadius: "999px",
            }}
          >
            Start
          </Button>
        </Link>

        {/* <Link 
          href="/stats"
          className={`${styles.menuItem} ${active === "stats" ? styles.active : ""}`}
          onClick={() => handleMenuClick("stats")}
        >
          <FileQuestion size={24} className={styles.icon} />
          <Badge className={styles.menuItem} count={0} showZero={false} color={'silver'} size="small" offset={[-20, -2]}>
            <span>Next Read</span>
          </Badge>
        </Link> */}
      </div>
    </div>
  );
}
