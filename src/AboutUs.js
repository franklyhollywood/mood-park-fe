import React from 'react';
import { creators } from './CreatorsData.js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Box } from '@mui/material';
import Stack from '@mui/material/Stack';
import lake from './images/lake.jpeg';

export default function AboutUs() {
	return (
		<>
			<Box
				style={{
					backgroundImage: `url(${lake})`,
					backgroundSize: 'cover',
					height: '100vh',
				}}
			>
				<h1 style={{ textAlign: 'center', margin: '5' }}>TEAM PARKS</h1>

				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					gap={2}
					sx={{ flexWrap: 'wrap' }}
					justifyContent='center'
					alignItems='center'
				>
					{creators.map((creator) => (
						<Card
							sx={{
								maxWidth: 345,
								minWidth: 345,
								minHeight: 525,
							}}
						>
							<CardActionArea>
								<CardMedia
									component='img'
									height='280'
									image={creator.image}
									alt={creator.name}
								/>
								<CardContent>
									<Typography gutterBottom variant='h5' component='div'>
										{creator.name}
									</Typography>
									<Typography variant='body2' color='text.secondary'>
										<p>{creator.bio}</p>
										<p>{creator.park}</p>
									</Typography>
								</CardContent>
							</CardActionArea>
						</Card>
					))}
				</Stack>
			</Box>
		</>
	);
}
