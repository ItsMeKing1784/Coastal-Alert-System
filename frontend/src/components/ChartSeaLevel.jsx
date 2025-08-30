import React, { useEffect, useState } from 'react';

const DUMMY_API = 'https://jsonplaceholder.typicode.com/posts/3';

const ChartSeaLevel = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		fetch(DUMMY_API)
			.then(res => res.json())
			.then(data => setData(data))
			.catch(() => setData({ title: 'No data', body: 'No chart data available.' }));
	}, []);

	return (
		<div>
			<h4>{data?.title || 'Sea Level Chart'}</h4>
			<p>{data?.body || 'No chart data available.'}</p>
			{/* Replace with chart library for real data */}
		</div>
	);
};

export default ChartSeaLevel;
