import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
	return (
		<div className='bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-green-500 text-5xl font-black'>
			<Navbar />
			<h1 className='text-center pt-4'>Welcome to Odelabs, Inc.</h1>
			<Footer />
		</div>
	);
};

export default Home;
