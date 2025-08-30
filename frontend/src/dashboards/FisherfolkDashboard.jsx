import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import AlertBanner from '../components/AlertBanner';
import AlertCard from '../components/AlertCard';
import MapView from '../components/MapView';
import EmergencyResources from '../components/EmergencyResources';
import ChartSeaLevel from '../components/ChartSeaLevel';
const { Title } = Typography;

const FisherfolkDashboard = () => (
		<div style={{ padding: '2rem', minHeight: '100vh', background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)', overflowX: 'hidden' }}>
		<AlertBanner />
		<Row gutter={[24, 24]}>
			<Col xs={24} md={12}>
				<Card title="Safety Alerts" bordered={false}><AlertCard /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Fishing Advisories" bordered={false}><ChartSeaLevel /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Weather & Tide Info" bordered={false}><MapView /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Emergency Contacts" bordered={false}><EmergencyResources /></Card>
			</Col>
			<Col xs={24}>
				<Card title="Local Resources" bordered={false}>Updates on local resources and support.</Card>
			</Col>
		</Row>
	</div>
);

export default FisherfolkDashboard;
