import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import AlertBanner from '../components/AlertBanner';
import AlertCard from '../components/AlertCard';
import MapView from '../components/MapView';
import EmergencyResources from '../components/EmergencyResources';
import ChartSeaLevel from '../components/ChartSeaLevel';
const { Title } = Typography;

const DisasterMgmtDashboard = () => (
		<div style={{ padding: '2rem', minHeight: '100vh', background: 'linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)', overflowX: 'hidden' }}>
		<AlertBanner />
		<Row gutter={[24, 24]}>
			<Col xs={24} md={12}>
				<Card title="Threat Alerts" bordered={false}><AlertCard /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Sensor Data" bordered={false}><ChartSeaLevel /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Affected Zones Map" bordered={false}><MapView /></Card>
			</Col>
			<Col xs={24} md={12}>
				<Card title="Action Log & Coordination" bordered={false}><EmergencyResources /></Card>
			</Col>
			<Col xs={24}>
				<Card title="Downloadable Reports" bordered={false}>Export incident and response reports.</Card>
			</Col>
		</Row>
	</div>
);

export default DisasterMgmtDashboard;
