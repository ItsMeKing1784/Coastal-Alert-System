import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const BannerWrapper = styled.div`
	margin-bottom: 2rem;
`;

const DUMMY_API = 'https://jsonplaceholder.typicode.com/posts/1';

const AlertBanner = ({ type = "warning" }) => {
	const [message, setMessage] = useState("Loading alert...");

	useEffect(() => {
		fetch(DUMMY_API)
			.then(res => res.json())
			.then(data => {
				// Use 'title' as alert message for demo
				setMessage(data.title || "Storm Surge Warning: High tides expected in coastal areas. Stay alert!");
			})
			.catch(() => setMessage("Storm Surge Warning: High tides expected in coastal areas. Stay alert!"));
	}, []);

	return (
		<BannerWrapper>
			<Alert
				icon={<ExclamationCircleOutlined />}
				message={message}
				type={type}
				showIcon
				banner
				style={{ fontSize: '1.1rem', fontWeight: 500, letterSpacing: '0.5px', borderRadius: '12px' }}
			/>
		</BannerWrapper>
	);
};

export default AlertBanner;
