import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import AlertBanner from '../components/AlertBanner';
import AlertCard from '../components/AlertCard';
import MapView from '../components/MapView';
import EmergencyResources from '../components/EmergencyResources';
import ChartSeaLevel from '../components/ChartSeaLevel';
const { Title } = Typography;

const NGODashboard = () => (
		<div style={{ padding: '2rem', minHeight: '100vh', background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)', overflowX: 'hidden' }}>
		<AlertBanner />
		<Row gutter={[24, 24]}>
			<Col xs={24} md={12}>
				<Card title="Environmental Alerts" bordered={false}><AlertCard /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Habitat Monitoring" bordered={false}><ChartSeaLevel /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Community Outreach" bordered={false}><EmergencyResources /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Incident Reporting" bordered={false}>Report and track environmental incidents.</Card>
			</Col>
			<Col xs={24}>
				<Card title="Collaboration" bordered={false}><MapView /></Card>
			</Col>
		</Row>
	</div>
);

export default NGODashboard;
