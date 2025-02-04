'use client'

import { useState } from "react";
import { Home, Camera, BookOpen, Library, WholeWord, Search, ChartBarBig } from "lucide-react";
import styles from "./Menu.module.css"; // Import CSS for styling
import Link from "next/link";
import { Badge } from "antd";
import { priColor, secColor } from "@/configs/cssValues";

export default function BottomNav() {
  const [active, setActive] = useState("home");

  const handleMenuClick = (key) => {
    setActive(key);
  };

  return (
    <div className={styles.bottomNav}>
      <div className={styles.menu}>
        <Link href="/"
          className={`${styles.menuItem} ${active === "home" ? styles.active : ""}`}
          onClick={() => handleMenuClick("home")}
        >
          <Home size={23} className={styles.icon} />
          <Badge className={styles.menuItem} count={0} showZero={false} color={'silver'} size="small" offset={[-20, -2]}>
            <span>Home</span>
          </Badge>
        </Link>

        <Link 
          href="/dictionary"
          className={`${styles.menuItem} ${active === "dictionary" ? styles.active : ""}`}
          onClick={() => handleMenuClick("dictionary")}
        >
          <Search size={24} className={styles.icon} />
          <Badge className={styles.menuItem} count={"AI"} color={secColor} size="small" offset={[-20, -2]}>
            <span>Dictionary</span>
          </Badge>
        </Link>

        <Link 
          href="/stats"
          className={`${styles.menuItem} ${active === "stats" ? styles.active : ""}`}
          onClick={() => handleMenuClick("stats")}
        >
          <ChartBarBig size={24} className={styles.icon} />
          <Badge className={styles.menuItem} count={0} showZero={false} color={'silver'} size="small" offset={[-20, -2]}>
            <span>Stats</span>
          </Badge>
        </Link>
      </div>
    </div>
  );
}
