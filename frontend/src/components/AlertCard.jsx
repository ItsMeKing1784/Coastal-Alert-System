import React, { useEffect, useState } from 'react';
import { Card } from 'antd';

const DUMMY_API = 'https://jsonplaceholder.typicode.com/posts/2';

const AlertCard = () => {
	const [alert, setAlert] = useState(null);

	useEffect(() => {
		fetch(DUMMY_API)
			.then(res => res.json())
			.then(data => setAlert(data))
			.catch(() => setAlert({ title: 'No alert', body: 'No alert data available.' }));
	}, []);

	return (
        <>
		<h4>{alert?.title || 'Alert'}</h4>
		<p>{alert?.body || 'No alert data available.'}</p>
        </>

	);
};

export default AlertCard;
