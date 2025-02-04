'use client'
import ScanResults from "@/components/ScanResults";
import ImageUpload from "../../components/imageUpload";
import { useEffect, useState } from "react";
import { getProfile } from "@/firebase/services/profileService";
import BookList from "@/components/BookList";
import ReadingMetricsCard from "@/components/ReadingMetricsCard";

export default function Page() {
  return (
    <div style={{marginTop: '0px'}}>
      <br/>
      <br/>
        <ReadingMetricsCard />
    </div>
  );
}
