import { Box, ButtonGroup, TextField, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import request from 'superagent';
import { Dropdown } from './Dropdown.jsx';

const states = [
	{ name: 'Alabama', id: 'AL' },
	{ name: 'Alaska', id: 'AK' },
	{ name: 'Arizona', id: 'AZ' },
	{ name: 'Arkansas', id: 'AR' },
	{ name: 'California', id: 'CA' },
	{ name: 'Colorado', id: 'CO' },
	{ name: 'Connecticut', id: 'CT' },
	{ name: 'Delaware', id: 'DE' },
	{ name: 'Florida', id: 'FL' },
	{ name: 'Georgia', id: 'GA' },
	{ name: 'Hawaii', id: 'HI' },
	{ name: 'Idaho', id: 'ID' },
	{ name: 'Illinois', id: 'IL' },
	{ name: 'Indiana', id: 'IN' },
	{ name: 'Iowa', id: 'IA' },
	{ name: 'Kansas', id: 'KS' },
	{ name: 'Kentucky', id: 'KY' },
	{ name: 'Louisiana', id: 'LA' },
	{ name: 'Maine', id: 'ME' },
	{ name: 'Maryland', id: 'MD' },
	{ name: 'Massachusetts', id: 'MA' },
	{ name: 'Michigan', id: 'MI' },
	{ name: 'Minnesota', id: 'MN' },
	{ name: 'Mississippi', id: 'MS' },
	{ name: 'Missouri', id: 'MO' },
	{ name: 'Montana', id: 'MT' },
	{ name: 'Nebraska', id: 'NE' },
	{ name: 'Nevada', id: 'NV' },
	{ name: 'New Hampshire', id: 'NH' },
	{ name: 'New Jersey', id: 'NJ' },
	{ name: 'New Mexico', id: 'NM' },
	{ name: 'New York', id: 'NY' },
	{ name: 'North Carolina', id: 'NC' },
	{ name: 'North Dakota', id: 'ND' },
	{ name: 'Ohio', id: 'OH' },
	{ name: 'Oklahoma', id: 'OK' },
	{ name: 'Oregon', id: 'OR' },
	{ name: 'Pennsylvania', id: 'PA' },
	{ name: 'Rhode Island', id: 'RI' },
	{ name: 'South Carolina', id: 'SC' },
	{ name: 'South Dakota', id: 'SD' },
	{ name: 'Tennessee', id: 'TN' },
	{ name: 'Texas', id: 'TX' },
	{ name: 'Utah', id: 'UT' },
	{ name: 'Vermont', id: 'VA' },
	{ name: 'Virginia', id: 'VT' },
	{ name: 'Washington', id: 'WA' },
	{ name: 'West Virginia', id: 'WV' },
	{ name: 'Wisconsin', id: 'WI' },
	{ name: 'Wyoming', id: 'WY' },
];

const pageOptions = [
	{ name: '20 per page', id: '20' },
	{ name: '40 per page', id: '40' },
	{ name: '60 per page', id: '60' },
];

export const ControlPanel = ({
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
	designationValue,
	setDesignationValue,
	pageValue,
	setPageValue,
}) => {
	const [activities, setActivities] = useState([]);
	const [designations, setDesignations] = useState([]);

	const fetchActivities = async () => {
		const response = await request.get(
			`https://developer.nps.gov/api/v1/activities?api_key=FjbYuojCE0MpnrnD7PgAu9duwdWqxbSMT5eaWEGj`
		);
		setActivities(response.body.data);
	};

	const fetchDesignations = async () => {
		const response = await request.get(
			'https://developer.nps.gov/api/v1/parks?limit=500&api_key=FjbYuojCE0MpnrnD7PgAu9duwdWqxbSMT5eaWEGj'
		);
	
		const designationsList = response.body.data
			.reduce((finalArray, park) => {
				if (!finalArray.includes(park.designation))
					finalArray.push(park.designation);
				return finalArray;
			}, [])
			.map((designation) => {
				return { name: designation, id: designation };
			});

		setDesignations(designationsList);
	};

	useEffect(() => {
		fetchActivities();
		fetchDesignations();
	}, []);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'row' }}>
			{!favoriteView && (
				<ButtonGroup style={{ marginBottom: '10px', marginTop: '25px' }}>
					<Button
						variant='contained'
						className='change-results'
						onClick={firstTwenty}
						disabled={page < 1}
					>
						First {pageValue}
					</Button>
					<Button
						variant='contained'
						className='change-results'
						onClick={previousTwenty}
						disabled={page < 1}
					>
						Previous {pageValue}
					</Button>
					<Button
						variant='contained'
						className='change-results'
						onClick={nextTwenty}
						disabled={parks.length < pageValue}
					>
						Next {pageValue}
					</Button>
				</ButtonGroup>
			)}
			<form
				onSubmit={submitPark}
				style={{
					marginBottom: '10px',
					marginTop: '25px',
					marginLeft: '15px',
				}}
			>
				<label>
					<TextField
						id='outlined-basic'
						// label='Search By Name'
						size='small'
						variant='outlined'
						type='text'
						required
						onChange={handleSearch}
					/>
				</label>
				<Button type='submit' variant='contained'>
					Find Park
				</Button>
				{token && (
					<Button
						variant={favoriteView ? 'contained' : 'text'}
						onClick={handleFavoriteView}
					>
						{favoriteView ? 'All Parks' : 'Favorites'}
					</Button>
				)}
			</form>
			<Dropdown
				options={pageOptions}
				value={pageValue}
				onChange={setPageValue}
				placeholder={'parks per page'}
			/>
			<Dropdown
				options={activities}
				value={activityValue}
				onChange={setActivityValue}
				placeholder={'Activity'}
			/>
			<Dropdown
				//an array of options that our component renders into html option tags
				options={states}
				//this is the state variable that keeps track of the value of the dropdown
				value={stateValue}
				//This is the state changing function to change that particular piece of state
				onChange={setStateValue}
				placeholder={'State'}
			/>
			<Dropdown
				options={designations}
				value={designationValue}
				onchange={setDesignationValue}
				placeholder={'Designation'}
			/>
		</Box>
	);
};
