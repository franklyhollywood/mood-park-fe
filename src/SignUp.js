import React, { useState } from 'react';
import { signUp } from './Utils.js';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function Signup({
	tokenToLocalStorage,
	history,
	userIdToLocalStorage,
}) {
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		const user = await signUp(email, password);
		if (user) {
			tokenToLocalStorage(user.token);
			userIdToLocalStorage(user.id);

			history.goBack();
		}
		// else { this.setState({email:'', password:''})
		else {
			setEmail('');
			setPassword('');
		}
		history.replace('/login');
	};

	return (
		<Container component='main' maxWidth='xs'>
			<Box
				sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					flexWrap: 'nowrap',
					alignItems: 'center',
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} display='inline'>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign up
				</Typography>
				<Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id='email'
								label='Email Address'
								name='email'
								autoComplete='email'
								value={email}
								// onChange={(e) => this.setState({email: e.target.value})}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name='password'
								label='Password'
								type='password'
								id='password'
								autoComplete='new-password'
								value={password}
								// onChange={(e) => this.setState({password: e.target.value})}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Grid>
					</Grid>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
					>
						Sign Up
					</Button>
					<Grid container justifyContent='center'>
						{/* <Grid item> */}
						<Link to='login' variant='body2'>
							Already have an account? Sign in
						</Link>
						{/* </Grid> */}
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}
