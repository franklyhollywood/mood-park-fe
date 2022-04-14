import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import park from './images/park.jpg';

export default function LandingPage() {
	return (
		<Box
			style={{
				backgroundImage: `url(${park})`,
				backgroundSize: 'cover',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				opacity: 0.9,
			}}
		>
			<Box
				sx={{
					maxWidth: '40vw',
					color: 'white',
				}}
				witdh='13vw'
			>
				<Typography sx={{ textShadow: '#000 1px 0 10px' }}>
					<Typography variant='h2'>Parks 4ME</Typography>
					<Typography fontWeight='bold' sx={{ fontSize: '1.75em' }}>
						<br />
						Browse through the comprehensive list of parks and historical sites.
						<br />
						See details about each park, and reviews that others have shared.
						<br />
						<Typography fontWeight={'bold'} sx={{ fontSize: '1.00em' }}>
							Sign up for an account to bookmark your favorite National Parks
							and share your park reviews with others.
						</Typography>
					</Typography>
				</Typography>
			</Box>
		</Box>
	);
}
