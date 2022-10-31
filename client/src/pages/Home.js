import React from 'react';
import Options from '../components/Options';
import VideoPlayer from '../components/VideoPlayer';
import Notifications from '../components/Notifications';

const Home = () => {
	return (
		<div className='bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-green-500 text-5xl font-black'>
			<h1 className='text-center pt-4'>Welcome to Odelabs, Inc.</h1>
			<VideoPlayer />
			<Options>
				<Notifications />
			</Options>
		</div>
	);
};

export default Home;
