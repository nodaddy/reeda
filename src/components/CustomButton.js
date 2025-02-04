'use client'
import React from "react";
import { Button } from "antd";
import styles from "./CustomButton.module.css"; // Import custom CSS

export default function CustomButton({ children, ...props }) {
  return (
    <Button {...props} className={styles.customButton}>
      {children}
    </Button>
  );
}
