import React from 'react';

export default function Card({ ref, name }) {
	return (
		<div className='overflow-hidden bg-white shadow sm:rounded-lg'>
			<div className='px-4 py-4 sm:px-6'>
				<h3 className='text-lg font-medium leading-6 text-gray-900'>{name}</h3>
				<p className='mt-1 max-w-2xl text-sm text-gray-500'>id</p>
			</div>
			<div className='border-t border-gray-200 px-4 py-5 sm:px-6'>
				<div>
					<video playsInline muted ref={ref} autoPlay />
				</div>
			</div>
		</div>
	);
}
