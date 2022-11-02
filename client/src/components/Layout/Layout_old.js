import React from 'react';
import Navbar from './Navbar_old';
import Footer from './Footer_old';

const Layout = ({ children }) => {
	return (
		<div>
			<Navbar />
			<div>{children}</div>
			<Footer />
		</div>
	);
};

export default Layout;
