import React, { useEffect, useRef, useState } from 'react';
import { copyToClipboard } from 'react-copy-to-clipboard';
import Peer from 'simple-peer';
import io from 'socket.io';

const socket = io('http://localhost:5100');

// const ContextProvider = ({ children }) => {
//

// 	const answerCall = () => {
// 		setCallAccepted(true);
// 		const peer = new Peer({ initiator: false, trickle: false, stream });

// 		peer.on('signal', (data) => {
// 			socket.emit('answercall', { signal: data, to: call.from });
// 		});
// 		peer.on('stream', (currentStream) => {
// 			// this is the stream for the other person
// 			userVideo.current.srcObject = currentStream;
// 		});
// 		peer.signal(call.signal);
// 		connectionRef.current = peer;
// 	};
// 	const callUser = (id) => {
// 		const peer = new Peer({ initiator: true, trickle: false, stream });
// 		peer.on('signal', (data) => {
// 			socket.emit('calluser', {
// 				userToCall: id,
// 				signalData: data,
// 				from: me,
// 				name,
// 			});
// 		});
// 		peer.on('stream', (currentStream) => {
// 			// this is the stream for the other person
// 			userVideo.current.srcObject = currentStream;
// 		});
// 		socket.on('callAccepted', (signal) => {
// 			setCallAccepted(true);
// 			peer.signal(signal);
// 		});
// 		connectionRef.current = peer;
// 	};
// 	const leaveCall = () => {
// 		setCallEnded(true);
// 		// we shall stop receiving input from the user's audio and video
// 		connectionRef.current.destroy();
// 		window.location.reload(); // reloads the page and provides the user with a new id
// 	};

// 	return (
// 		<SocketContext.Provider
// 			value={{
// 				call,
// 				callAccepted,
// 				myVideo,
// 				userVideo,
// 				stream,
// 				name,
// 				setName,
// 				callEnded,
// 				me,
// 				callUser,
// 				leaveCall,
// 				answerCall,
// 			}}
// 		>
// 			{children}
// 		</SocketContext.Provider>
// 	);
// };

const Home = () => {
	const [stream, setStream] = useState(null);
	const [me, setMe] = useState('');
	const [receivingCall, setReceivingCall] = useState(false);
	const [caller, setCaller] = useState('');
	const [callerSignal, setCallerSignal] = useState();
	const [idToCall, setIdToCall] = useState('');
	const [callAccepted, setCallAccepted] = useState(false);
	const [callEnded, setCallEnded] = useState(false);
	const [name, setName] = useState('');

	const myVideo = useRef();
	const userVideo = useRef();
	const connectionRef = useRef();

	// code runs as soon as this componrnt runs
	// we check the user's audio and camera settings
	useEffect(() => {
		// requesting permissions from the user
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setStream(stream);

				myVideo.current.srcObject = stream;
			});
		// --End requesting permissions from the user

		// pick up id from server and set it to our state
		socket.on('me', (id) => setMe(id));

		//
		socket.on('calluser', ({ from, name: callerName, signal }) => {
			setCall({ isReceivedCall: true, from, name: callerName, signal });
		});
	}, []); // without an empty dependency array, its always going to run which we dont want

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
			<div className='flex text-center mx-4 mt-5'>
				{/* my video */}
				{stream && (
					<div className='basis-1/2 bg-gradient-to-r from-indigo-500 to-red-500 border-2 border-indigo-200 border-solid rounded-xl p-2 mb-10 drop-shadow-xl ml-4'>
						<p>{name}</p>
						<video playsInline muted ref={myVideo} autoPlay />
					</div>
				)}
				{/* end my video */}

				{/* user video */}
				{callAccepted && !callEnded && (
					<div className='basis-1/2 border-2 border-indigo-200 border-solid rounded-xl p-5 mb-5 drop-shadow-2xl ml-4'>
						<p>{call.name}</p>
						<video playsInline ref={userVideo} autoPlay />
					</div>
				)}
				{/* end user video */}
			</div>
			{/* end video section  */}

			{/* <Options>
				<Notifications />
			</Options> */}
		</div>
	);
};

export default Home;
