import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './Parks.js';
import DetailPage2 from './DetailPage2.js';
import Favorites from './Favorites.js';
import LogIn from './LogIn.js';
import SignUp from './SignUp.js';
import AboutUs from './AboutUs.js';
import { Redirect } from 'react-router-dom';
import Menu3 from './Menu3.js';
import DetailPage from './DetailPage.jsx';
import LandingPage from './LandingPage.jsx';
import Parks from './Parks.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { green, red } from '@mui/material/colors';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { PaginationContextProvider } from './PaginationContext.jsx';

const TOKEN_KEY = 'TOKEN';
const USER_ID_KEY = 'USER_ID';

const theme = createTheme({
	palette: {
		primary: {
			main: green[700],
		},
		secondary: {
			main: red[500],
		},
	},
});

export default function App() {
	const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '');
	// state = {
	// 	token: localStorage.getItem(TOKEN_KEY) || '',
	// };

	const tokenToLocalStorage = (token) => {
		localStorage.setItem(TOKEN_KEY, token);
		//this.setState({token: token})
		setToken(token);
	};

	const userIdToLocalStorage = (userId) => {
		localStorage.setItem(USER_ID_KEY, userId);
	};

	const logout = () => {
		localStorage.clear();
		//this.setState({token: ''})
		setToken('');
		window.location.assign('/');
	};
	return (
		<ThemeProvider theme={theme}>
			<PaginationContextProvider>
				<Router>
					{/* <Navigation token={this.state.token} logout={this.logout} /> */}
					<Menu3 token={token} logout={logout} />
					<Switch>
						<Route
							path='/'
							exact
							render={(routerProps) => (
								<LandingPage token={token} {...routerProps} />
							)}
						/>
						<Route
							path='/parks'
							exact
							render={(routerProps) => <Parks token={token} {...routerProps} />}
						/>
						<Route
							path='/park/:parkCode'
							exact
							render={(routerProps) => (
								<DetailPage token={token} {...routerProps} />
							)}
						/>
						<Route
							path='/login'
							exact
							render={(routerProps) => (
								<LogIn
									tokenToLocalStorage={tokenToLocalStorage}
									{...routerProps}
								/>
							)}
						/>
						<Route
							path='/sign-up'
							exact
							render={(routerProps) => (
								<SignUp
									tokenToLocalStorage={tokenToLocalStorage}
									userIdToLocalStorage={userIdToLocalStorage}
									{...routerProps}
								/>
							)}
						/>
						<Route
							path='/favorites'
							exact
							render={(routerProps) =>
								token ? (
									<Favorites token={token} {...routerProps} />
								) : (
									<Redirect to='/' />
								)
							}
						/>
						<Route
							path='/aboutus'
							exact
							render={(routerProps) => <AboutUs {...routerProps} />}
						/>
					</Switch>
				</Router>
			</PaginationContextProvider>
		</ThemeProvider>
	);
}
