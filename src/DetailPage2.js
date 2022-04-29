import React, { useState, useEffect, Fragment } from 'react';
import request from 'superagent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Container, Grid, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

const URL = 'https://cryptic-dusk-44349.herokuapp.com';
//  const URL = 'http://localhost:7890'

export default function DetailPage2({ match, token }) {
	const [park, setPark] = useState({
		images: [{ url: '' }],
		activities: [{ name: '' }],
		entranceFees: [{ cost: '' }],
		operatingHours: [{ standardHours: { monday: '' } }],
	});
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);
	const [userId, setUserId] = useState('');
	const [editing, setEditing] = useState(false);
	const [commentId, setCommentId] = useState('');

	const [value, setValue] = React.useState(2);
	const [hover, setHover] = React.useState(-1);

	const labels = {
		0.5: 'Useless',
		1: 'Useless+',
		1.5: 'Poor',
		2: 'Poor+',
		2.5: 'Ok',
		3: 'Ok+',
		3.5: 'Good',
		4: 'Good+',
		4.5: 'Excellent',
		5: 'Excellent+',
	};

	const parkCode = match.params.parkCode;

	const fetchPark = async () => {
		const response = await request.get(`${URL}/parkDetail/${parkCode}`);
		setPark(response.body.data[0]);
		if (token) {
			const comments = await request
				.get(`${URL}/api/comments/${parkCode}`)
				.set('Authorization', token);
			setComments(comments.body);

			const userID = localStorage.getItem('USER_ID');
			setUserId(userID);
		}
	};

	useEffect(() => {
		fetchPark();
	}, []);

	const handleFavorite = async () => {
		// const token = this.props.token;
		await request
			.post(`${URL}/api/favorites`)
			.send(park)
			.set('Authorization', token);
	};

	const handleCommentSubmit = async (e) => {
		e.preventDefault();
		// const token = this.props.token;

		await request
			.post(`${URL}/api/comments`)
			.send({ comment, parkcode: parkCode })
			.set('Authorization', token);

		await fetchPark();
	};

	const handlePostEdit = async (commentId) => {
		const comment = comments.find((comment) => commentId === comment.id);
		// this.setState({
		// 	comment: comment.comment,
		// 	editing: true,
		// 	commentId: commentId,
		// });

		setComment(comment.comment);
		setEditing(true);
		setCommentId(commentId);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();
		// const token = this.props.token;
		await request
			.put(`${URL}/api/comments/${commentId}`)
			.send({ comment })
			.set('Authorization', token);

		setEditing(false);
		await fetchPark();
	};

	return (
		<Fragment>
			<Box
				style={{
					backgroundImage: `url(${park.images[0].url})`,
					backgroundSize: `cover`,
					height: '100%',
					// opacity: '.8',
				}}
			>
				{/* park title and add fav button */}
				{/* <Box> */}
				<Grid
					container
					direction='row'
					alignItems='center'
					justifyContent='center'
				>
					<Typography variant='h1'>{park.name}</Typography>
					{/* {this.props.token &&<button onClick={this.handleFavorite}>Favorite</button>} */}
				</Grid>
				{/* </Box> */}

				{/* park details */}
				{/* <section className='park-detail'> */}
				<Box>
					<Container maxWidth='sm'>
						<Paper elevation={3}>
							<Typography>{park.description}</Typography>
						</Paper>
					</Container>

					<Box>
						<Container>
							<Paper>
								<h3 mb='0'>
									<Grid
										container
										direction='row'
										alignItems='center'
										justifyContent='center'
									>
										Activities:
									</Grid>
								</h3>
								{park.activities.map((activity) => (
									<Box>
										<Grid
											container
											direction='row'
											alignItems='center'
											justifyContent='center'
										>
											{activity.name}
										</Grid>
									</Box>
								))}
							</Paper>
						</Container>
					</Box>
					<Grid
						container
						direction='row'
						alignItems='center'
						justifyContent='center'
					>
						<Paper elevation={9}>
							<Box>
								<b>State:</b> {park.states}
							</Box>
							<Box>
								<b>Hours:</b> {park.operatingHours[0].standardHours.monday}
							</Box>
							<Box>
								<b>Park Fee:</b> ${park.entranceFees[0].cost}
							</Box>
							<Box>
								<a href={park.url}>{park.url}</a>
							</Box>
						</Paper>
					</Grid>
				</Box>
				{/* </section> */}

				{/* comments section */}
				<Box>
					<Grid
						container
						direction='row'
						alignItems='center'
						justifyContent='center'
					>
						{token && (
							<form onSubmit={editing ? handleEditSubmit : handleCommentSubmit}>
								<Paper elevation={3}>
									<br />
									<Grid
										container
										direction='row'
										alignItems='center'
										justifyContent='center'
									>
										<br />
										{/* BEGINNING OF STAR RATING BOX */}
										<Box
											sx={{
												width: 200,
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<Rating
												name='hover-feedback'
												value={value}
												precision={0.5}
												onChange={(event, newValue) => {
													setValue(newValue);
												}}
												onChangeActive={(event, newHover) => {
													setHover(newHover);
												}}
												emptyIcon={
													<StarIcon
														style={{ opacity: 0.55 }}
														fontSize='inherit'
													/>
												}
											/>
											{value !== null && (
												<Box sx={{ ml: 2 }}>
													{labels[hover !== -1 ? hover : value]}
												</Box>
											)}
										</Box>
										{/* END of STAR RATING BOX */}
										<br />
									</Grid>
									<br />
									{/* <InputLabel htmlFor='my-input' style={{ color: 'Blue' }}>
										Post Comment Below:
									</InputLabel> */}
									<TextField
										// fullWidth={true}
										style={{ width: '600px' }}
										multiline={true}
										rows={4}
										label='Post Comment Here'
										id='Comment'
										variant='outlined'
										value={comment}
										onChange={(e) => setComment(e.target.value)}
									/>
									{editing ? (
										<Button variant='contained' type='submit'>
											Edit
										</Button>
									) : (
										<Button variant='contained' type='submit'>
											Post
										</Button>
									)}
								</Paper>
							</form>
						)}
					</Grid>
				</Box>
				<Box>
					<Grid
						container
						direction='column'
						alignItems='center'
						justifyContent='center'
					>
						<Paper>
							{comments
								.sort((a, b) => b.park_timestamp - a.park_timestamp)
								.map((comment) => {
									return (
										<Box className='comments'>
											'{comment.comment}'' <br />
											<Typography
												style={{ fontSize: '.8rem', fontStyle: 'Italic' }}
											>
												{new Date(
													Number(comment.park_timestamp)
												).toLocaleDateString()}
											</Typography>
											<Typography
												style={{ fontSize: '.7rem', fontStyle: 'Italic' }}
												className='user'
											>
												User {comment.owner_id}{' '}
											</Typography>
											{console.log(comment.owner_id, userId)}
											{comment.owner_id === Number(userId) && (
												<Button
													size='small'
													onClick={() => handlePostEdit(comment.id)}
												>
													Edit post
												</Button>
											)}
										</Box>
									);
								})}
						</Paper>
					</Grid>
				</Box>
			</Box>
		</Fragment>
	);
}
