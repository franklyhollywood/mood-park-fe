import React, { useState } from 'react';
import { login } from './Utils.js';
import { Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

export default function Signin({ tokenToLocalStorage, history }) {
	// state = {
	// 	password: '',
	// 	email: '',
	// };
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		// const user = await login(this.state.email, this.state.password);
		const user = await login(email, password);

		if (user) {
			tokenToLocalStorage(user.token);
			localStorage.setItem('USER_ID', user.id);
			history.goBack();
		} else {
			// this.setState({ password: '' });
			setPassword('');
		}
	};

	return (
		<div>
			<Container component='main' maxWidth='xs'>
				<Box
					sx={{
						marginTop: 8,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					<Box
						component='form'
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin='normal'
							required
							fullWidth
							id='email'
							label='Email Address'
							name='email'
							autoComplete='email'
							autoFocus
							value={email}
							// onChange={(e) => this.setState({ email: e.target.value })}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<TextField
							margin='normal'
							required
							fullWidth
							name='password'
							label='Password'
							type='password'
							id='password'
							autoComplete='current-password'
							value={password}
							// onChange={(e) => this.setState({ password: e.target.value })}
							onChange={(e) => setPassword(e.target.value)}
						/>

						<Button
							type='submit'
							fullWidth
							variant='contained'
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs></Grid>
							<Grid item>
								<Link to='/sign-up' variant='body2'>
									{"Don't have an account? Sign Up"}
								</Link>
							</Grid>
						</Grid>
					</Box>
				</Box>
				{/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
			</Container>
		</div>
	);
}
