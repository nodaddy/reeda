"use client";
// pages/profile.js
import { useEffect, useState } from 'react';
import { Form, Input, Button, message, Divider, Popconfirm } from 'antd';
import { getProfile, updateProfile, createProfile } from '../../firebase/services/profileService';
import CustomButton from '@/components/CustomButton';
import { storage } from '../utility';
import { priTextColor } from '@/configs/cssValues';
import { handleDeleteAccount } from '@/firebase';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';
import ReadingMetricsCard from '@/components/ReadingMetricsCard';

const ProfilePage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userId = JSON.parse(storage.getItem('user')).email;

      console.log(userId);
      let profileData;
      try {
        profileData = await getProfile(userId);
      } catch (error) {
        // If profile does not exist, create a new one
        if (error.message === "Profile not found") {
          const defaultProfile = {
            firstName: '',
            lastName: '',
            email: userId,
            phoneNumber: '',
          };
          await createProfile(userId, defaultProfile);
          profileData = defaultProfile;
        } else {
          throw error;
        }
      }
      setProfile(profileData);
      form.setFieldsValue(profileData); // Populate form with profile data
    } catch (error) {
      console.error('Error fetching profile:', error);
      message.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Remove fields with null or undefined values
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(([key, value]) => value != null)
      );

      let userId;
      
      if (typeof window !== 'undefined') {

       userId = JSON.parse(storage.getItem('user')).email; // Replace with the actual user ID
      }
      // Check if the profile exists
      const existingProfile = await getProfile(userId); // Assume you have a function to fetch the profile
      
      if (existingProfile) {
        // Update the existing profile
        await updateProfile(userId, filteredValues);
        message.success('Profile updated successfully');
      } else {
        // Create a new profile if one doesn't exist
        console.log(filteredValues);
        await createProfile(userId, {...filteredValues, streak: {days: 0,
          lastPageScanTimestamp: Date.now()}}); // Assume createProfile is a function to create a new profile
        message.success('Profile created successfully');
      }
    } catch (error) {
      console.error('Error processing profile:', error);
      message.error('Failed to process profile');
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchProfile();
  }, []);

  return ( true ? 
    <div
    style={{
      padding: '30px',
      height: '70vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
    >
      {
        storage.getItem('user') ? 
<>
      <>Hi! {JSON.parse(storage.getItem('user')).displayName}</>
      {/* delete account button */}
      <br/>
      <ReadingMetricsCard />
      <br/>
      <Popconfirm
        title="Are you sure you want to delete your account?"
        onConfirm={handleDeleteAccount}
        placement='topLeft'
      >
      <Button
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '10px'
      }}
      onClick={() => {

        }} type={'danger'}>
          Delete my account
        </Button>
 
      </Popconfirm>
      </>
      :
      <Link style={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none'
      }} href={'/'}> <MoveLeft />&nbsp;&nbsp;&nbsp;Home</Link>
      }
      
      
    </div>
    :
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px', color: priTextColor }}>
      <h2>Profile</h2>
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={profile}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <Input placeholder="Enter your first name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <Input placeholder="Enter your last name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: false, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter your email" disabled />
        </Form.Item>

        {/* <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item> */}

        <Form.Item>
          <CustomButton type="primary" htmlType="submit" loading={loading}>
            Save Changes
          </CustomButton>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePage;