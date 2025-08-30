
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import 'antd/dist/reset.css';
import { loginUser } from './api';

const backgroundUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80';

const LoginWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, rgba(137,247,254,0.7) 0%, rgba(102,166,255,0.7) 100%),
    url(${backgroundUrl}) center/cover no-repeat;
`;

const StyledCard = styled(Card)`
  && {
    min-width: 350px;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    border-radius: 18px;
    border: none;
    padding: 2rem 2.5rem;
    background: rgba(255,255,255,0.95);
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



const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      const res = await loginUser({ email, password });
      console.log('Login response:', res);
      if (res.message && res.user_id) {
        message.success(res.message);
        navigate(`/dashboard/${res.role.toLowerCase()}`);
      } else {
        message.error(res.error || 'Invalid credentials');
      }
    } catch (err) {
      message.error('Server error. Please try again later.');
    }
  };

  return (
    <LoginWrapper>
      <StyledCard>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 700, letterSpacing: '1px', color: '#222' }}>Login</Title>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <StyledFormItem label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}> 
            <Input type="email" placeholder="Email" size="large" />
          </StyledFormItem>
          <StyledFormItem label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}> 
            <Input.Password placeholder="Password" size="large" />
          </StyledFormItem>
          <StyledFormItem>
            <StyledButton type="primary" htmlType="submit" block>Login</StyledButton>
          </StyledFormItem>
        </Form>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Button type="link" onClick={() => navigate('/register')}>New user? Register here</Button>
        </div>
      </StyledCard>
    </LoginWrapper>
  );
};

export default Login;
