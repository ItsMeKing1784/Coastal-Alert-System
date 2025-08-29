import React, { useEffect, useState } from 'react';

const DUMMY_API = 'https://jsonplaceholder.typicode.com/posts/6';

const MapView = () => {
	const [mapData, setMapData] = useState(null);

	useEffect(() => {
		fetch(DUMMY_API)
			.then(res => res.json())
			.then(data => setMapData(data))
			.catch(() => setMapData({ title: 'No map data', body: 'No map data available.' }));
	}, []);

	return (
		<div>
			<h4>{mapData?.title || 'Map View'}</h4>
			<p>{mapData?.body || 'No map data available.'}</p>
			{/* Replace with map library for real data */}
		</div>
	);
};

export default MapView;
