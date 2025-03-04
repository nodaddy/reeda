"use client";
import Plans from "@/components/Plans";
import { priColor, priTextColor, secTextColor } from "@/configs/cssValues";
import { isUserPremium } from "@/payments/playstoreBilling";
import { Alert, Card, Tag } from "antd";
import {
  Book,
  BookPlus,
  Camera,
  ShoppingBag,
  Sparkle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const Page = () => {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    isUserPremium()
      .then((result) => {
        // alert(result);
        setIsPremium(result);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    !isPremium && (
      <div align="center">
        <Plans />
      </div>
    )
  );
};

export default Page;
