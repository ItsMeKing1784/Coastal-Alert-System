import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import 'antd/dist/reset.css';
import { registerUser } from './api';

const roles = [
  { label: 'Disaster Management Department', value: 'Disaster' },
  { label: 'Govt', value: 'Govt' },
  { label: 'NGO', value: 'NGO' },
  { label: 'Fisher folk', value: 'Fisherfolk' },
  { label: 'Civil Defence Team', value: 'CivilDefence' }
];

const alertMethodsOptions = [
  { label: 'SMS', value: 'SMS' },
  { label: 'Email', value: 'Email' },
  { label: 'Push Notification', value: 'Push' },
];

const alertLevelOptions = [
  { label: 'Severe', value: 'Severe' },
  { label: 'Moderate', value: 'Moderate' },
  { label: 'Low', value: 'Low' },
];

const backgroundUrl = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1500&q=80';

const RegisterWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, rgba(57, 82, 83, 0.7) 0%, rgba(102,166,255,0.7) 100%),
    url(${backgroundUrl}) center/cover no-repeat;
  overflow-x: hidden;
`;

const StyledCard = styled(Card)`
  && {
    min-width: 350px;
    max-width: 500px;
    width: 90%;
    margin: 0 auto;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    border-radius: 18px;
    border: none;
    padding: 2rem 2.5rem;
    background: rgba(203, 227, 228, 0.95);
    backdrop-filter: blur(2px);
  }
`;

const StyledButton = styled(Button)`
  && {
    background: linear-gradient(90deg, #66a6ff 0%, #89f7fe 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 1rem;
    box-shadow: 0 2px 8px rgba(102,166,255,0.15);
    transition: background 0.2s;
  }
  &&:hover, &&:focus {
    background: linear-gradient(90deg, #89f7fe 0%, #66a6ff 100%);
    color: #222;
  }
`;

const StyledFormItem = styled(Form.Item)`
  && label {
    font-weight: 500;
    color: #222;
    font-size: 1rem;
  }
`;

const { Title } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setCoords({ latitude: null, longitude: null });
        }
      );
    }
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      phone_number,
      organization,
      preferred_alert_radius,
      zone_id,
      alert_methods,
      alert_level_threshold
    } = values;

    if (password !== confirmPassword) {
      message.error('Passwords do not match!');
      setLoading(false);
      return;
    }

    //  Prepare home_location in GeoJSON format
    let home_location = null;
    if (coords.latitude && coords.longitude) {
      home_location = {
        type: 'Point',
        coordinates: [parseFloat(coords.longitude), parseFloat(coords.latitude)]
      };
    }

    // ✅ Build user data payload expected by backend
    const user_data = {
      full_name: name,
      email,
      password_hash: password,   // backend expects `password_hash`
      role,
      phone_number,
      organization,
      home_location,
      preferred_alert_radius: preferred_alert_radius ? Number(preferred_alert_radius) : 10,
      zone_id,
      alert_methods: alert_methods || ['SMS'],
      alert_level_threshold: alert_level_threshold || 'Severe',
    };

    try {
      const res = await registerUser(user_data);
      console.log('Raw backend response:', res);
      // If the response is not an object, try to parse it
      if (typeof res === 'string') {
        try {
          const parsed = JSON.parse(res);
          console.log('Parsed backend response:', parsed);
        } catch (e) {
          console.log('Response is not JSON:', res);
        }
      }
      // Accept success if res.message, res.success, or res[0] === true
      if (res && (res.message || res.success || res[0] === true)) {
        message.success(res.message || res.success || 'Registration successful!');
        navigate(`/dashboard/${role.toLowerCase()}`);
      } else if (res && (res.error || res[1])) {
        message.error(res.error || res[1]);
      } else {
        message.error('Unexpected server response.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      message.error('Server error. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <RegisterWrapper>
      <StyledCard>
        <Title
          level={2}
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            fontWeight: 700,
            letterSpacing: '1px',
            color: '#222'
          }}
        >
          Register
        </Title>
        <Form
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <StyledFormItem label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}> 
            <Input placeholder="Name" size="large" />
          </StyledFormItem>
          <StyledFormItem label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}> 
            <Input type="email" placeholder="Email" size="large" />
          </StyledFormItem>
          <StyledFormItem label="Phone Number" name="phone_number" rules={[{ required: true, message: 'Please input your phone number!' }]}> 
            <Input placeholder="Phone Number" size="large" />
          </StyledFormItem>
          <StyledFormItem label="Organization" name="organization"> 
            <Input placeholder="Organization (optional)" size="large" />
          </StyledFormItem>
          <StyledFormItem label="Preferred Alert Radius (km)" name="preferred_alert_radius" rules={[{ required: true, message: 'Please input preferred alert radius!' }]}> 
            <Input placeholder="Alert Radius" size="large" type="number" min={1} />
          </StyledFormItem>
          <StyledFormItem label="Zone ID" name="zone_id"> 
            <Input placeholder="Zone ID (optional)" size="large" />
          </StyledFormItem>
          <StyledFormItem label="Alert Methods" name="alert_methods" rules={[{ required: true, message: 'Please select at least one alert method!' }]}> 
            <Select mode="multiple" options={alertMethodsOptions} size="large" placeholder="Select alert methods" />
          </StyledFormItem>
          <StyledFormItem label="Alert Level Threshold" name="alert_level_threshold" rules={[{ required: true, message: 'Please select alert level threshold!' }]}> 
            <Select options={alertLevelOptions} size="large" placeholder="Select alert level" />
          </StyledFormItem>
          <StyledFormItem label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}> 
            <Input.Password placeholder="Password" size="large" />
          </StyledFormItem>
          <StyledFormItem
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" size="large" />
          </StyledFormItem>
          <StyledFormItem label="Role" name="role" rules={[{ required: true, message: 'Please select your role!' }]}> 
            <Select options={roles} size="large" placeholder="Select role" />
          </StyledFormItem>
          <StyledFormItem>
            <StyledButton type="primary" htmlType="submit" block loading={loading}>Register</StyledButton>
          </StyledFormItem>
        </Form>
      </StyledCard>
    </RegisterWrapper>
  );
};

export default Register;
