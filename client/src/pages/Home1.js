import React, { useEffect, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Peer from 'simple-peer';
import io from 'socket.io-client';
// import Logo from '../images/odelabs-logo.png';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { GrCopy } from 'react-icons/gr';

// import './App.css';

const socket = io.connect('http://localhost:5000');
function Home1() {
	const [me, setMe] = useState('');
	const [stream, setStream] = useState();
	const [receivingCall, setReceivingCall] = useState(false);
	const [caller, setCaller] = useState('');
	const [callerSignal, setCallerSignal] = useState();
	const [callAccepted, setCallAccepted] = useState(false);
	const [idToCall, setIdToCall] = useState('');
	const [callEnded, setCallEnded] = useState(false);
	const [name, setName] = useState('');
	const myVideo = useRef();
	const userVideo = useRef();
	const connectionRef = useRef();

	useEffect(() => {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				setStream(stream);
				myVideo.current.srcObject = stream;
			});

		socket.on('me', (id) => {
			setMe(id);
		});

		socket.on('callUser', (data) => {
			setReceivingCall(true);
			setCaller(data.from);
			setName(data.name);
			setCallerSignal(data.signal);
		});
	}, []);

	const callUser = (id) => {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream,
		});
		peer.on('signal', (data) => {
			socket.emit('callUser', {
				userToCall: id,
				signalData: data,
				from: me,
				name: name,
			});
		});
		peer.on('stream', (stream) => {
			userVideo.current.srcObject = stream;
		});
		socket.on('callAccepted', (signal) => {
			setCallAccepted(true);
			peer.signal(signal);
		});

		connectionRef.current = peer;
	};

	const answerCall = () => {
		setCallAccepted(true);
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream,
		});
		peer.on('signal', (data) => {
			socket.emit('answerCall', { signal: data, to: caller });
		});
		peer.on('stream', (stream) => {
			userVideo.current.srcObject = stream;
		});

		peer.signal(callerSignal);
		connectionRef.current = peer;
	};

	const leaveCall = () => {
		setCallEnded(true);
		connectionRef.current.destroy();
	};

	return (
		<>
			<h1>Zoomish</h1>
			<div>
				<div>
					<div>
						{stream && (
							<video
								playsInline
								muted
								ref={myVideo}
								autoPlay
								style={{ width: '300px' }}
							/>
						)}
					</div>
					<div>
						{callAccepted && !callEnded ? (
							<video playsInline ref={userVideo} autoPlay />
						) : null}
					</div>
				</div>
				<div>
					<input
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Enter you name...'
						className='p-2 w-[400px] mt-5'
					/>
					<CopyToClipboard text={me}>
						<button className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2'>
							<GrCopy className='text-white text-xl mr-2' />
							Copy ID
						</button>
					</CopyToClipboard>

					<input
						type='text'
						value={idToCall}
						name='idToCall'
						onChange={(e) => setIdToCall(e.target.value)}
						placeholder='Paste host ID here to call them...'
						className='p-2 w-[400px] mt-5'
					/>
					<div>
						{callAccepted && !callEnded ? (
							<button
								className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2'
								onClick={leaveCall}
							>
								<BsFillTelephoneFill className='text-red-700 text-2xl mr-4' />
								End Call
							</button>
						) : (
							<button
								className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2'
								onClick={() => callUser(idToCall)}
							>
								<BsFillTelephoneFill className='text-indigo-700 text-2xl mr-4' />
								Make a Call
							</button>
						)}
						{idToCall}
					</div>
				</div>
				<div>
					{receivingCall && !callAccepted ? (
						<div>
							<h1>{name} is calling...</h1>
							<button
								className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-white py-2 px-4 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2'
								onClick={answerCall}
							>
								<BsFillTelephoneFill className='text-green-700 text-2xl mr-4' />
								Answer
							</button>
						</div>
					) : null}
				</div>
			</div>
		</>
	);
}

export default Home1;
