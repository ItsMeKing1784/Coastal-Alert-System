import React, { useEffect, useState } from 'react';

const DUMMY_API = 'https://jsonplaceholder.typicode.com/posts/5';

const EmergencyResources = () => {
	const [resources, setResources] = useState(null);

	useEffect(() => {
		fetch(DUMMY_API)
			.then(res => res.json())
			.then(data => setResources(data))
			.catch(() => setResources({ title: 'No resources', body: 'No emergency resources available.' }));
	}, []);

	return (
		<div>
			<h4>{resources?.title || 'Emergency Resources'}</h4>
			<p>{resources?.body || 'No emergency resources available.'}</p>
		</div>
	);
};

export default EmergencyResources;
