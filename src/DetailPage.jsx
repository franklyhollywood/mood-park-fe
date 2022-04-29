import React, { useState, useEffect, Fragment } from 'react';
import request from 'superagent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// import { InputLabel } from '@material-ui/core';
import Paper from '@mui/material/Paper';
import { Divider, Grid, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
// import { experimentalStyled as styled } from '@mui/material/styles';
import { makeStyles } from '@material-ui/core/styles';
// import clsx from 'clsx';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
// import { Input } from '@material-ui/core';

// const testComments = [
// 	{
// 		comment: 'This is a comment to add to this.',
// 		parkcode: 'abli',
// 		owner_id: 7,
// 		rating: 5,
// 		park_timestamp: Date.now(),
// 		id: 3,
// 	},
// 	{
// 		comment: 'Here is yet another comment to have in the comments',
// 		parkcode: 'acad',
// 		owner_id: 5,
// 		rating: null,
// 		park_timestamp: Date.now(),
// 		id: 2,
// 	},
// 	{
// 		comment: 'What comments are you talking about?',
// 		parkcode: 'adam',
// 		owner_id: 3,
// 		rating: 4.5,
// 		park_timestamp: Date.now(),
// 		id: 1,
// 	},
// ];

//const URL = 'https://cryptic-dusk-44349.herokuapp.com';
const URL = 'http://localhost:7890';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 725,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export default function DetailPage({ match, token }) {
	const [park, setPark] = useState({
		images: [{ url: '' }],
		activities: [{ name: '' }],
		entranceFees: [{ cost: '' }],
		operatingHours: [{ standardHours: { monday: '' } }],
		states: '',
	});
	const [comment, setComment] = useState('');
	const [comments, setComments] = useState([]);
	const [userId, setUserId] = useState('');
	// const [editing, setEditing] = useState(false);
	const [commentId, setCommentId] = useState('');
	const [editedComment, setEditedComment] = useState('');
	const [ratingValue, setRatingValue] = useState(0);
	const [ratingHover, setRatingHover] = useState(-1);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const labels = {
		0.5: 'Icky',
		1: 'Icky+',
		1.5: 'Bad',
		2: 'Bad+',
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
			const allComments = await request
				.get(`${URL}/api/comments/${parkCode}`)
				.set('Authorization', token);
			setComments(allComments.body);
			// setComments(testComments);
			const totalRatings = allComments.body.reduce((prevValue, currValue) => {
				return prevValue + +currValue.rating;
			}, 0);
			const averageRating =
				Math.round(
					(totalRatings /
						allComments.body.filter((comment) => comment.rating).length) *
						2
				) / 2;
			setRatingValue(averageRating);
			const userID = localStorage.getItem('USER_ID');
			setUserId(userID);
		}
	};

	useEffect(() => {
		fetchPark();
	}, []);

	// const handleFavorite = async () => {
	// 	await request
	// 		.post(`${URL}/api/favorites`)
	// 		.send(park)
	// 		.set('Authorization', token);
	// };

	const handleCommentSubmit = async (e) => {
		e.preventDefault();

		await request
			.post(`${URL}/api/comments`)
			.send({ comment, parkcode: parkCode, ratingValue: +ratingValue })
			.set('Authorization', token);
		setComment('');
		setRatingValue(0);
		await fetchPark();
	};

	// const useStyles = makeStyles({
	// 	container: {
	// 		height: '100vh', // So that grids 1 & 4 go all the way down
	// 		minHeight: 150, // Give minimum height to a div
	// 		border: '1px solid black',
	// 		fontSize: 16,
	// 		textAlign: 'center',
	// 	},
	// 	containerTall: {
	// 		minHeight: 250, // This div has higher minimum height
	// 	},
	// });

	// const classes = useStyles();

	const handlePostEdit = (commentId) => {
		const comment = comments.find((comment) => commentId === comment.id);

		setEditedComment(comment.comment);
		// setEditing(true);
		setCommentId(commentId);
	};

	const handleEditSubmit = async (e) => {
		e.preventDefault();

		await request
			.put(`${URL}/api/comments/${commentId}`)
			.send({ comment: editedComment })
			.set('Authorization', token);

		// setEditing(false);
		await fetchPark();
		handleClose();
	};

	const handleDeletePost = async (commentId) => {
		await request
			.delete(`${URL}/api/comments/${commentId}`)
			.set('Authorization', token);
		// setTimeout(() => fetchPark(), 1500);
		await fetchPark();
	};

	return (
		<Fragment>
			<Box
				sx={{
					backgroundImage: `url(${
						park.name?.includes('Chaco')
							? park.images[0].url + '?width=1800'
							: park.images[0].url
					})`,
					backgroundSize: `cover`,
					height: '100vh',
					// opacity: '.8',
					zIndex: '-1',
					overflow: 'hidden',
				}}
			>
				<Grid container direction='column' ml={1}>
					<Box
						flexDirection='row'
						sx={{
							display: 'inline-flex',
							// alignItems: 'baseLine',
							alignItems: 'center',
							flexWrap: 'wrap',
						}}
					>
						<Typography variant='h1' mr={5}>
							{park.name}
						</Typography>
						<Paper
							ml={2}
							elevation={5}
							style={{
								// maxWidth: '200px',
								padding: '10px',
								borderRadius: '3px',
							}}
						>
							<Typography>
								{park.states.length > 2 ? 'STATES: ' : 'STATE: '}
								{park.states?.split(',').join(', ')}
							</Typography>
						</Paper>
					</Box>

					<Box maxWidth='300px' ml={5}>
						<Paper elevation={5}>
							<Typography mb='10px'>
								National Parks site:{' '}
								<Link href={park.url} underline='hover'>
									{park.url}
								</Link>
							</Typography>
						</Paper>
					</Box>
				</Grid>
				<Grid container direction='row' spacing={2}>
					<Grid item xs>
						<Box ml={6} mr={2}>
							<Paper elevation={3}>
								<Typography>{park.description}</Typography>
							</Paper>
						</Box>
					</Grid>
					<Grid container direction='column' item xs spacing={2} height='100vh'>
						<Grid item xs>
							<Box overflow='auto' maxHeight='85%'>
								<Paper elevation={3}>
									<h2>Activities:</h2>
									{park.activities.map((activity) => (
										<Box ml='25px' key={activity.name}>
											{/* <Grid
												container
												direction='row'
												alignItems='center'
												justifyContent='center' */}

											{activity.name}
										</Box>
									))}
								</Paper>
							</Box>
						</Grid>
					</Grid>
					<Grid item xs>
						<Box overflow='auto' maxHeight='85%'>
							<Box>
								{token && (
									<form onSubmit={handleCommentSubmit}>
										<Grid
											container
											direction='row'
											alignItems='center'
											justifyContent='center'
										></Grid>
										<Paper elevation={6}>
											<br />
											{/* BEGINNING OF STAR RATING BOX */}

											<Grid
												container
												direction='row'
												alignItems='center'
												justifyContent='center'
											>
												<Box
													sx={{
														width: 200,
														display: 'flex',
														alignItems: 'center',
													}}
												>
													<Rating
														name='hover-feedback'
														defaultValue={3.5}
														value={ratingValue}
														precision={0.5}
														onChange={(event, newValue) => {
															setRatingValue(newValue);
														}}
														onChangeActive={(event, newHover) => {
															setRatingHover(newHover);
														}}
														emptyIcon={
															<StarIcon
																style={{ opacity: 0.55 }}
																fontSize='inherit'
															/>
														}
													/>
													{ratingValue !== null && (
														<Box sx={{ ml: 2 }}>
															{
																labels[
																	ratingHover !== -1 ? ratingHover : ratingValue
																]
															}
														</Box>
													)}
												</Box>
											</Grid>
											{/* END of STAR RATING BOX */}
											<Grid
												container
												direction='row'
												alignItems='center'
												justifyContent='center'
											>
												<TextField
													style={{ width: '650px' }}
													multiline={true}
													rows={3}
													label='Post Comment Here'
													id='Comment'
													variant='outlined'
													value={comment}
													onChange={(e) => setComment(e.target.value)}
												/>
												<br />
											</Grid>
											<Grid
												container
												direction='row'
												alignItems='center'
												justifyContent='center'
											>
												{/* {editing ? (
													<Button
														variant='contained'
														type='submit'
														sx={{ marginTop: '15px' }}
													>
														Edit
													</Button>
												) : ( */}
												<Button
													variant='contained'
													type='submit'
													sx={{ marginTop: '15px' }}
												>
													Post
												</Button>
												{/* )} */}
											</Grid>
										</Paper>
									</form>
								)}
							</Box>
							<Box justifyContent='left'>
								<Paper>
									{comments
										.sort((a, b) => b.park_timestamp - a.park_timestamp)
										.map((comment) => {
											return (
												<Box sx={{ marginLeft: '10px' }} key={comment.id}>
													<Typography>
														'{comment.comment}' <br />
													</Typography>
													{comment.rating > 0 && (
														<Rating
															name='hover-feedback'
															readOnly
															value={Number(comment.rating)}
															precision={0.5}
															emptyIcon={
																<StarIcon
																	style={{ opacity: 0.55 }}
																	fontSize='inherit'
																/>
															}
														/>
													)}
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
													{comment.owner_id === Number(userId) && (
														<>
															<Button
																size='small'
																onClick={function () {
																	handlePostEdit(comment.id);
																	handleOpen();
																}}
															>
																Edit post
															</Button>
															<Button
																size='small'
																onClick={function () {
																	handleDeletePost(comment.id);
																}}
															>
																Delete
															</Button>
														</>
													)}
													<Divider />
												</Box>
											);
										})}
									<div>
										{/* <Button onClick={handleOpen}>Open modal</Button> */}
										<Modal
											open={open}
											onClose={handleClose}
											aria-labelledby='modal-modal-title'
											aria-describedby='modal-modal-description'
										>
											<Box sx={style}>
												<Typography
													id='modal-modal-title'
													variant='h6'
													component='h2'
												>
													Edit post:
												</Typography>
												<TextField
													style={{ width: '650px' }}
													multiline={true}
													rows={3}
													id='Comment'
													variant='outlined'
													value={editedComment}
													onChange={(e) => setEditedComment(e.target.value)}
												/>

												{/* <Typography id='modal-modal-description' sx={{ mt: 2 }}>
													Duis mollis, est non commodo luctus, nisi erat
													porttitor ligula.
												</Typography> */}

												<br />
												<br />
												<Button onClick={handleEditSubmit}>Ok</Button>
												<Button onClick={handleClose}>Cancel</Button>
											</Box>
										</Modal>
									</div>
								</Paper>
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Fragment>
	);
}
