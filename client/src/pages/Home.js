import React, { useContext } from 'react';
import Options from '../components/Options';
import Notifications from '../components/Notifications';
import Card from '../components/Card';
import { SocketContext } from '../SocketContext';

const Home = () => {
	const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
		useContext(SocketContext);
	return (
		<div>
			{/* heading  */}
			<div className='text-center'>
				<h1 className='bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-green-500 text-5xl font-black pt-4'>
					Secure Video Chats
				</h1>
				<p className='text-base leading-4 text-gray-600 mt-4 mb-8'>
					Encrypted Video Connections
				</p>
			</div>
			{/* end heading  */}

			{/* video section  */}
			<div className='grid grid-cols-2 gap-2 text-center mx-4 mt-5'>
				{/* my video */}
				{stream && (
					<div className=''>
						<Card ref={myVideo} name={name} />
						{/* <video playsInline ref={myVideo} autoPlay /> */}
					</div>
				)}
				{/* end my video */}

				{/* user video */}
				{callAccepted && !callEnded && (
					<div className=''>
						<p>{call.name}</p>
						{/* <video playsInline ref={userVideo} autoPlay /> */}
					</div>
				)}
				{/* end user video */}
			</div>
			{/* end video section  */}
			<Card />

			<Options>
				<Notifications />
			</Options>
		</div>
	);
};

export default Home;
