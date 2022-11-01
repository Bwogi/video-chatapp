import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5100');

const ContextProvider = ({ children }) => {
	const [stream, setStream] = useState(null);
	const [me, setMe] = useState('');
	const [call, setCall] = useState({});
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
			.then((currentStream) => {
				setStream(currentStream);

				myVideo.current.srcObject = currentStream;
			});
		// --End requesting permissions from the user

		// pick up id from server and set it to our state
		socket.on('me', (id) => setMe(id));

		//
		socket.on('calluser', ({ from, name: callerName, signal }) => {
			setCall({ isReceivedCall: true, from, name: callerName, signal });
		});
	}, []); // without an empty dependency array, its always going to run which we dont want

	const answerCall = () => {
		setCallAccepted(true);
		const peer = new Peer({ initiator: false, trickle: false, stream });

		peer.on('signal', (data) => {
			socket.emit('answercall', { signal: data, to: call.from });
		});
		peer.on('stream', (currentStream) => {
			// this is the stream for the other person
			userVideo.current.srcObject = currentStream;
		});
		peer.signal(call.signal);
		connectionRef.current = peer;
	};
	const callUser = (id) => {
		const peer = new Peer({ initiator: true, trickle: false, stream });
		peer.on('signal', (data) => {
			socket.emit('calluser', {
				userToCall: id,
				signalData: data,
				from: me,
				name,
			});
		});
		peer.on('stream', (currentStream) => {
			// this is the stream for the other person
			userVideo.current.srcObject = currentStream;
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
		window.location.reload(); // reloads the page and provides the user with a new id
	};

	return (
		<SocketContext.Provider
			value={{
				call,
				callAccepted,
				myVideo,
				userVideo,
				stream,
				name,
				setName,
				callEnded,
				me,
				callUser,
				leaveCall,
				answerCall,
			}}
		>
			{children}
		</SocketContext.Provider>
	);
};

export { ContextProvider, SocketContext };
