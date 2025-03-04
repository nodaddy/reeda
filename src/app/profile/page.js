"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, message, Popconfirm } from "antd";
import {
  getProfile,
  updateProfile,
  createProfile,
} from "../../firebase/services/profileService";
import { storage } from "../utility";
import { priColor, priTextColor, secColor } from "@/configs/cssValues";
import { handleDeleteAccount } from "@/firebase";
import {
  MoveLeft,
  Crown,
  User,
  Mail,
  Calendar,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { profile, setProfile, isPremium } = useAppContext();
  const history = useRouter();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(storage.getItem("user")).email;
      let profileData;
      try {
        profileData = await getProfile(userId);
      } catch (error) {
        if (error.message === "Profile not found") {
          const defaultProfile = {
            firstName: "",
            lastName: "",
            email: userId,
            phoneNumber: "",
          };
          await createProfile(userId, defaultProfile);
          profileData = defaultProfile;
        } else {
          throw error;
        }
      }
      setProfile(profileData);
      form.setFieldsValue(profileData);
    } catch (error) {
      console.error("Error fetching profile:", error);
      message.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div
      style={{
        height: "350px",
        position: "relative",
        borderRadius: "0 0 190px 60px",
      }}
    >
      <div />
      <br />

      <div style={{ padding: "24px 32px" }}>
        <MoveLeft
          style={{ cursor: "pointer" }}
          onClick={() => history.back()}
        />

        <br />
        <br />

        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: "400",
          }}
        >
          Profile
        </h1>

        {storage.getItem("user") ? (
          <div
            style={{
              marginTop: "40px",
              fontFamily: "'Inter', sans-serif",
              position: "relative",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "24px 32px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "24px",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "400",
                      marginBottom: "4px",
                      color: "#1a1a1a",
                    }}
                  >
                    {JSON.parse(storage.getItem("user")).displayName}
                    {isPremium && (
                      <Crown
                        size={20}
                        style={{
                          marginLeft: "8px",
                          display: "inline",
                          verticalAlign: "text-bottom",
                        }}
                        color="#FFD700"
                      />
                    )}
                  </h2>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Mail size={14} />
                    {profile?.userId}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "24px",
                  padding: "24px 0",
                  borderTop: "1px solid #eee",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <Calendar size={16} color="#666" />
                    <span style={{ fontSize: "14px", color: "#666" }}>
                      Member since
                    </span>
                  </div>
                  <span style={{ fontSize: "16px", color: "#1a1a1a" }}>
                    {new Date(profile?.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <CreditCard size={16} color="#666" />
                    <span style={{ fontSize: "14px", color: "#666" }}>
                      Account type
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "16px",
                      color: isPremium ? "#FFD700" : "#1a1a1a",
                      fontWeight: isPremium ? "600" : "normal",
                    }}
                  >
                    {isPremium ? "Premium" : "Basic"}
                  </span>
                </div>
              </div>
            </div>

            <Popconfirm
              title="Are you sure you want to delete your account?"
              onConfirm={handleDeleteAccount}
              placement="topLeft"
            >
              <Button
                danger
                style={{
                  position: "fixed",
                  border: "0px",
                  bottom: "24px",
                  right: "24px",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  height: "auto",
                  backgroundColor: "transparent",
                  boxShadow: "0 2px 8px rgba(0,0,0,0)",
                }}
              >
                Delete my account
              </Button>
            </Popconfirm>
          </div>
        ) : (
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "#1a1a1a",
              fontSize: "16px",
              marginTop: "24px",
            }}
          >
            <MoveLeft style={{ marginRight: "12px" }} />
            Home
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
