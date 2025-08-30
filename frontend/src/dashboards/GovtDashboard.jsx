import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import AlertBanner from '../components/AlertBanner';
import AlertCard from '../components/AlertCard';
import MapView from '../components/MapView';
import EmergencyResources from '../components/EmergencyResources';
import ChartThreats from '../components/ChartThreats';
const { Title } = Typography;

const GovtDashboard = () => (
		<div style={{ padding: '2rem', minHeight: '100vh', background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)', overflowX: 'hidden' }}>
		<AlertBanner />
		<Row gutter={[24, 24]}>
			<Col xs={24} md={12}>
				<Card title="Threats & Trends" bordered={false}><AlertCard /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Blue Carbon Status" bordered={false}><ChartThreats /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Policy Recommendations" bordered={false}>AI-driven policy suggestions for coastal management.</Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Resource Allocation" bordered={false}><EmergencyResources /></Card>
			</Col>
			<Col xs={24}>
				<Card title="Community Impact Analytics" bordered={false}><MapView /></Card>
			</Col>
		</Row>
	</div>
);

export default GovtDashboard;
