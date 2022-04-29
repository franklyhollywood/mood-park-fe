import React, { Fragment, useState } from 'react';

export const Dropdown = ({ options, onChange, value, placeholder }) => {
	return (
		<Fragment>
			<select value={value} onChange={(e) => onChange(e.target.value)}>
				<option value=''>{placeholder}</option>
				{options.map((option) => {
					return (
						<option key={option.id} value={option.id}>
							{option.name}
						</option>
					);
				})}
			</select>
		</Fragment>
	);
};
