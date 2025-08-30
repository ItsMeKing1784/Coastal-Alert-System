import React, { useContext } from 'react';
import styled from 'styled-components';
import { Layout, Typography } from 'antd';
import { AuthContext } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

const StyledHeader = styled(Header)`
	background: linear-gradient(90deg, #66a6ff 0%, #89f7fe 100%);
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 2rem;
	box-shadow: 0 2px 8px rgba(102,166,255,0.15);
	height: 64px;
`;

const LogoButton = styled.button`
	background: none;
	border: none;
	padding: 0;
	margin-right: 1rem;
	cursor: pointer;
	display: flex;
	align-items: center;
`;

const Logo = styled.img`
	height: 40px;
	margin-right: 1rem;
`;

const RoleTag = styled.span`
	background: #222;
	color: #fff;
	padding: 0.4rem 1rem;
	border-radius: 16px;
	font-size: 1rem;
	font-weight: 500;
	margin-left: 1rem;
`;

const Navbar = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogoClick = () => {
		if (user && user.role) {
			navigate(`/dashboard/${user.role.toLowerCase()}`);
		} else {
			navigate('/');
		}
	};

	return (
		<StyledHeader>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<LogoButton onClick={handleLogoClick} title="Go to Dashboard">
					<Logo src="https://cdn-icons-png.flaticon.com/512/616/616494.png" alt="Coastal Alert Logo" />
				</LogoButton>
				<Title level={3} style={{ color: '#222', margin: 0, fontWeight: 700, letterSpacing: '1px' }}>
					Coastal Alert System
				</Title>
			</div>
			{user && user.role && (
				<RoleTag>{user.role}</RoleTag>
			)}
		</StyledHeader>
	);
};

export default Navbar;
