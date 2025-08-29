
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Form, Input, Button, Card, Typography, Select } from 'antd';
import 'antd/dist/reset.css';

const roles = [
  { label: 'Disaster Management Department', value: 'Disaster' },
  { label: 'Govt', value: 'Govt' },
  { label: 'NGO', value: 'NGO' },
  { label: 'Fisher folk', value: 'Fisherfolk' },
  { label: 'Civil Defence Team', value: 'CivilDefence' }
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
    max-width: 400px;
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

  const onFinish = (values) => {
    const { name, email, password, confirmPassword, role } = values;
    if (password !== confirmPassword) {
      // Should not happen due to form validation, but just in case
      return;
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ name, email, password, role });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify({ email, role }));
    navigate(`/dashboard/${role.toLowerCase()}`);
  };

  return (
    <RegisterWrapper>
      <StyledCard>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 700, letterSpacing: '1px', color: '#222' }}>Register</Title>
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
            <StyledButton type="primary" htmlType="submit" block>Register</StyledButton>
          </StyledFormItem>
        </Form>
      </StyledCard>
    </RegisterWrapper>
  );
};

export default Register;
