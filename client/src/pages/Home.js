import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import Logo from '../images/odelabs-logo.png';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { GrCopy } from 'react-icons/gr';

const socket = io.connect('http://localhost:5100');

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

		socket.on('callUser', (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setName(data.name);
			setCallerSignal(data.signal);
		});
	}, []);

	const answerCall = () => {
		setCallAccepted(true);
		const peer = new Peer({ initiator: false, trickle: false, stream });

		peer.on('signal', (data) => {
			socket.emit('answerCall', { signal: data, to: caller });
		});
		peer.on('stream', (stream) => {
			// this is the stream for the other person
			userVideo.current.srcObject = stream;
		});
		peer.signal(callerSignal);
		connectionRef.current = peer;
	};

	const callUser = (id) => {
		const peer = new Peer({ initiator: true, trickle: false, stream });
		peer.on('signal', (data) => {
			socket.emit('callUser', {
				userToCall: id,
				signalData: data,
				from: me,
				name: name,
			});
		});
		peer.on('stream', (stream) => {
			// this is the stream for the other person
			userVideo.current.srcObject = stream;
		});
		socket.on('callAccepted', (signal) => {
			setCallAccepted(true);
			peer.signal(signal);
		});
		connectionRef.current = peer;
	};
	const leaveCall = () => {
		setCallEnded(true);
		// we shall stop receiving input from the user's audio and video
		connectionRef.current.destroy();
		// window.location.reload(); // reloads the page and provides the user with a new id
	};

	return (
		<>
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
			<div className='flex text-center mx-4 mt-5 flex justify-center'>
				{/* my video */}
				{stream && (
					<div className='basis-1/2 bg-gradient-to-r from-indigo-500 to-red-500 border-2 border-indigo-200 border-solid rounded-xl p-2 mb-10 drop-shadow-xl ml-4'>
						{/* <p>{name}</p> */}
						<video
							playsInline
							muted
							ref={myVideo}
							autoPlay
							className='w-[300px]'
						/>
					</div>
				)}
				{/* end my video */}

				{/* user video */}
				{callAccepted && !callEnded ? (
					<div className=' basis-1/2 border-2 border-indigo-200 border-solid rounded-xl p-5 mb-5 drop-shadow-2xl ml-4'>
						{/* <p>{call.name}</p> */}
						<video playsInline ref={userVideo} className='w-[300px]' autoPlay />
					</div>
				) : null}
				{/* end user video */}
			</div>
			{/* end video section  */}
			{/* form */}
			<div className='flex justify-center text-center w-full'>
				<form className=''>
					<div className=''>
						<div className=''>
							<div className=''>
								<h3 className='text-lg font-medium leading-6 text-gray-900'>
									Welcome to Secure Video Chats&reg;
								</h3>
								<p className='mt-1 text-sm text-gray-500'>
									Enter your Name and copy the ID to give it to your guest. Let
									them call you to connect
								</p>
							</div>
							<div>
								<input
									type='text'
									value={name}
									onChange={(e) => {
										setName(e.target.value);
									}}
									placeholder='Enter you name...'
									className='p-2 w-[400px] mt-5'
								/>
								<CopyToClipboard text={me}>
									<button className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-gray-400 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
										<span>
											<GrCopy className='text-white text-xl mr-2' />
										</span>
										Copy ID{' '}
									</button>
								</CopyToClipboard>
							</div>

							<div>
								<input
									type='text'
									value={idToCall}
									onChange={(e) => setIdToCall(e.target.value)}
									placeholder='Paste host ID here to call them...'
									className='p-2 w-[400px] mt-5'
								/>
							</div>
							<div className='pt-5 items-center'>
								<div className='mb-5'>
									{callAccepted && !callEnded ? (
										<button className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
											End Call
										</button>
									) : (
										<span className='flex justify-center'>
											<BsFillTelephoneFill className='text-green-700 text-5xl' />
										</span>
									)}
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>

			{/* end form */}
		</>
	);
};

export default Home;
