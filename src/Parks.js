import React, { useState, useEffect, Fragment } from 'react';
import request from 'superagent';
// import { Link } from 'react-router-dom'
import { hasActivity, isFavorite } from './Utils.js';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Grid, Link, Tooltip } from '@mui/material';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { removeFavorite } from './Utils.js';
import ButtonGroup from '@mui/material/ButtonGroup';
import Spinner from './Spinner.js';
import { red } from '@mui/material/colors';
import { usePagination } from './PaginationContext.jsx';
import { Link as RouterLink } from 'react-router-dom';
import { Dropdown } from './components/Dropdown.jsx';
import { ControlPanel } from './components/ControlPanel.jsx';
import fallBackImage from './images/lake.jpeg';

// const URL = 'https://cryptic-dusk-44349.herokuapp.com';
const URL = 'http://localhost:7890';

export default function Parks({ token }) {
	// state = {
	// 	parks: [],
	// 	SearchPark: '',
	// 	favorites: [],
	// 	parkCode: '',

	// 	start: 0,
	// 	isLoading: false,
	// };
	const [pageValue, setPageValue] = useState('20');
	const [activityValue, setActivityValue] = useState('');
	const [designation, setDesignation] = useState('');
	const [stateValue, setStateValue] = useState('');
	const [parks, setParks] = useState([]);
	const [searchPark, setSearchPark] = useState('');
	const [favorites, setFavorites] = useState([]);
	//For button view on parks page: favorites or all parks
	const [favoriteView, setFavoriteView] = useState(false);
	const [parkCode, setParkCode] = useState('');
	// const [start, setStart] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const { page, setPage } = usePagination();

	const submitPark = async (e) => {
		e.preventDefault();
		const response = await request.get(`${URL}/park?q=${searchPark}`);
		// this.setState({ parks: response.body.data });
		setParks(response.body.data);
	};

	const handleSearch = async (e) => {
		// this.setState({ SearchPark: e.target.value });
		setSearchPark(e.target.value);
	};

	const handleRemove = async (parkCode) => {
		// const token = this.props.token;
		await removeFavorite(parkCode, token);
		const favs = await request
			.get(`${URL}/api/favorites`)
			.set('Authorization', token);
		// this.setState({ favorites: favs.body });
		setFavorites(favs.body);
	};

	const handleFavorite = async (park) => {
		// const token = this.props.token;
		await request
			.post(`${URL}/api/favorites`)
			.send(park)
			.set('Authorization', token);
		const favs = await request
			.get(`${URL}/api/favorites`)
			.set('Authorization', token);
		// this.setState({ favorites: favs.body });
		setFavorites(favs.body);
	};

	useEffect(() => {
		const getParks = async () => {
			// componentDidMount = async () => {
			// this.setState({ isLoading: true });
			setIsLoading(true);
			// const token = this.props.token;
			const response = await request.get(
				// `${URL}/parks?start=${this.state.start}`
				`${URL}/parks?start=${page * pageValue}&limit=${pageValue}
				&activity=${activityValue}`
				// `https://developer.nps.gov/api/v1/parks?limit=20&start=${
				// 	page * 20
				// }&api_key=FjbYuojCE0MpnrnD7PgAu9duwdWqxbSMT5eaWEGj`
			);
			setParks(response.body.data);
			if (token) {
				const favs = await request
					.get(`${URL}/api/favorites`)
					.set('Authorization', token);
				// this.setState({ favorites: favs.body });
				setFavorites(favs.body);
			}
			// this.setState({ parks: response.body.data, isLoading: false });
			if (favoriteView || activityValue) {
				const allParks = await request.get(
					`https://developer.nps.gov/api/v1/parks?limit=500&api_key=FjbYuojCE0MpnrnD7PgAu9duwdWqxbSMT5eaWEGj`
				);
				if (favoriteView)
					setParks(
						allParks.body.data.filter((park) => isFavorite(park, favorites))
					);
				else
					setParks(
						allParks.body.data.filter((park) =>
							hasActivity(park, response.body.data[0].parks)
						)
					);
			}

			setIsLoading(false);
		};
		getParks();
	}, [page, token, favoriteView, pageValue, activityValue]);

	const nextTwenty = () => {
		// await this.setState({ start: this.state.start + 20 });
		setPage((prevState) => prevState + 1);
		// this.componentDidMount();
		// await getParks();
	};

	const previousTwenty = () => {
		// await this.setState({ start: this.state.start - 20 });
		setPage((prevState) => prevState - 1);
		// this.componentDidMount();
		// await getParks();
	};

	const firstTwenty = () => {
		// await this.setState({ start: (this.state.start = 0) });
		setPage(0);
		// this.componentDidMount();
		// await getParks();
	};

	const handleFavoriteView = () => {
		setFavoriteView((prevState) => !prevState);
	};

	const favoriteHeart = (park) => (
		<Box sx={{ position: 'absolute', right: '-10px', top: '250px' }}>
			<CardActions>
				<Tooltip title='Add/Remove Favorites' placement='right'>
					{isFavorite(park, favorites) ? (
						<IconButton
							size='large'
							color='error'
							aria-label='add to favorites'
							onClick={() => handleRemove(park.parkCode)}
						>
							<FavoriteIcon />
						</IconButton>
					) : (
						<IconButton
							size='large'
							aria-label='add to favorites'
							onClick={() => handleFavorite(park)}
						>
							<FavoriteIcon />
						</IconButton>
					)}
				</Tooltip>
			</CardActions>
		</Box>
	);

	const onMediaFallBack = (e) => (e.target.src = fallBackImage);

	return (
		<Fragment>
			<Grid
				container
				direction='column'
				justifyContent='center'
				alignItems='center'
			>
				<ControlPanel
					{...{
						firstTwenty,
						page,
						previousTwenty,
						nextTwenty,
						parks,
						submitPark,
						handleSearch,
						token,
						favoriteView,
						handleFavoriteView,
						activityValue,
						setActivityValue,
						stateValue,
						setStateValue,
						designation,
						setDesignation,
						pageValue,
						setPageValue,
					}}
				/>
				<br />
				{isLoading ? (
					<Spinner />
				) : (
					<Grid
						container
						direction='row'
						justifyContent='space-evenly'
						alignItems='top'
					>
						{parks.map((park) => (
							/////////////CARD START //////////////////////
							<Card
								key={park.parkCode}
								sx={{
									position: 'relative',
									display: 'flex',
									// justifyContent: 'space-between',
									flexdirection: 'column',
									marginBottom: '40px',
									marginLeft: '5px',
									marginRight: '5px',
									maxHeight: '400px',
									alignItems: 'flex-start',
									width: '350px',
									maxWidth: '350px',
								}}
							>
								<CardActionArea>
									<Link
										component={RouterLink}
										to={`/park/${park.parkCode}`}
										underline='none'
										variant='body2'
									>
										<CardMedia
											component='img'
											height='250px'
											width='350px'
											src={park.images[0].url + '?width=350'}
											alt={park.fullname}
											onError={onMediaFallBack}
											sx={{
												loading: 'lazy',
												objectPosition: 'top',
											}}
										/>
										<CardContent>
											<Typography
												sx={{ width: '90%' }}
												variant='h5'
												component='div'
											>
												{park.fullName}
											</Typography>
										</CardContent>
									</Link>
								</CardActionArea>
								{token && favoriteHeart(park)}
							</Card>
						))}
					</Grid>
				)}
			</Grid>
		</Fragment>
	);
}
