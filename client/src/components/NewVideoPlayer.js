import React, { useContext } from 'react';
import { SocketContext } from '../SocketContext';

export default function NewVideoPlayer() {
	const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
		useContext(SocketContext);
	return (
		<div>
			<div className='flex justify-center items-center flex-col py-12'>
				<div className='flex flex-col justify-center items-center space-y-4'>
					<h1 className='text-xl md:text-2xl lg:text-4xl font-medium leading-5 md:leading-6 xl:leading-9 text-gray-800'>
						Videos
					</h1>
					<p className='text-base leading-4 text-gray-600'>
						Video chat securely with odelabs-secure&reg;.
					</p>
				</div>

				{/* main flex */}

				<div className='flex flex-wrap p-5 items-center'>
					{/* our own video */}
					{stream && (
						<div className='md:w-1/2 w-full pb-6 md:pb-0 md:pr-6'>
							<div className='group cursor-pointer relative flex justify-center '>
								<h1>{name}</h1>
								<video playsInline muted ref={myVideo} autoPlay />
								{/* <div className='absolute opacity-0 transition duration-300 ease-in-out  h-full w-full bg-gray-600 group-hover:opacity-40'></div> */}
							</div>
						</div>
					)}
					{/* end our own video */}

					{/* user's video */}
					{callAccepted && !callEnded && (
						<div className='md:w-1/2 w-full pb-6 md:pb-0 md:pr-6'>
							<div className='group cursor-pointer relative flex justify-center'>
								<h1>{call.name} </h1>
								<video playsInline ref={userVideo} autoPlay />
								{/* <div className='absolute opacity-0 transition duration-300 ease-in-out  h-full w-full bg-gray-600 group-hover:opacity-40'></div> */}
							</div>
						</div>
					)}
				</div>
				{/* user's video */}

				{/* main flex end */}
			</div>
		</div>
	);
}
