import React, { Component, useState, useEffect } from 'react';
import request from 'superagent';
// import './Favorites.css';
import { Button } from '@mui/material';
import { removeFavorite } from './Utils.js';

//const URL = 'https://cryptic-dusk-44349.herokuapp.com';
const URL = 'http://localhost:7890';

export default function Favorites({ token }) {
	// state = {
	//     favorites: []

	// }
	const [favorites, setFavorites] = useState([]);

	async function getFavorites() {
		// componentDidMount = async () => {
		// const token = this.props.token
		//I'm going to get back more than one, and because it's restFUL
		//I know I'm going to get back an array of favorites....
		const response = await request
			.get(`${URL}/api/favorites`)
			.set('Authorization', token);
		//this response.body is going to be an array of favorites
		setFavorites(response.body);
	}
	useEffect(() => {
		getFavorites();
	}, []);

	const handleRemove = async (parkCode) => {
		//const token = this.props.token
		await removeFavorite(parkCode, token);
		const response = await request
			.get(`${URL}/api/favorites`)
			.set('Authorization', token);
		setFavorites(response.body);
	};

	return (
		<div className='favorites-page'>
			<h1>FAVORITE PARKS</h1>
			{favorites.map((favs) => (
				<section key={favs.fullname} className='favorite'>
					<span>{favs.fullname}</span>
					<span>State: {favs.states}</span>
					<a href={favs.url}> {favs.fullname} Website</a>
					<a href={`/park/${favs.parkcode}`}>
						<Button color='success'>Details</Button>
					</a>
					<Button onClick={() => handleRemove(favs.parkcode)} color='success'>
						Remove
					</Button>
				</section>
			))}
			{/* {this.state.favorites.map(favs => 
                <div key={favs.fullname}> 
                <h1>{favs.fullname}</h1>
                <p> {favs.description}</p>
                <img src={favs.images} alt={favs.fullname} />
                <br />
                <a href={favs.url}> {favs.fullname} Website</a>
                <br />
                State: {favs.states}
                </div>)} */}
		</div>
	);
}
