import axios from 'axios';

// API URL constants
const BASE_API_URL = 'https://www.dnd5eapi.co/api';
const SPELLS_API_URL = `${BASE_API_URL}/spells`;
const WEAPONS_API_URL = `${BASE_API_URL}/equipment-categories/weapon`;
const WEAPON_API_URL = `${BASE_API_URL}/equipment`;

// Spell stub containing the basic information for the dropdown
export type SpellStub = { index: string; name: string; level: number };

// Spell contains the full information for a spell reference
export type Spell = {
	name: string;
	level: number;
	duration: string;
	range: string;
	desc: string[];
}

// Weapon stub containing the basic information for the dropdown
export type WeaponStub = { index: string; name: string };

// Weapon property contains the full information for a weapon property reference
export type WeaponProperty = {
	index: string;
	name: string;
	url: string;
}

// Weapon damage contains the full information for a weapon damage reference
export type WeaponDamage = {
	damage_dice: string;
	damage_type: { name: string };
}

// Weapon contains the full information for a weapon reference
export type Weapon = {
	name: string;
	damage: WeaponDamage;
	weapon_range: string;
	properties: WeaponProperty[];
}

/*
 * Fetch all spells from the D&D 5e API
 * @returns {Promise} A promise that resolves with the spell list
 */
export async function getSpells(): Promise<SpellStub[]> {
	try {
		const response = await axios.get(SPELLS_API_URL);
		return response.data.results;
	} catch (error) {
		console.error('Error fetching spells:', error);
		throw error;
	}
}

/*
 * Fetch a specific spell from the D&D 5e API
 * @param {string} slug The spell slug to fetch
 * @returns {Promise} A promise that resolves with the spell
 */
export async function getSpell(slug: string): Promise<Spell> {
	try {
		const response = await axios.get(`${SPELLS_API_URL}/${slug}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching spell:', error);
		throw error;
	}
}

/*
 * Fetch all weapons from the D&D 5e API
 * @returns {Promise} A promise that resolves with the weapon list
 */
export async function getWeapons() {
	try {
		const response = await axios.get(WEAPONS_API_URL);
		return response.data.equipment;
	} catch (error) {
		console.error('Error fetching weapons:', error);
		throw error;
	}
}

/*
 * Fetch a specific weapon from the D&D 5e API
 * @param {string} slug The weapon slug to fetch
 * @returns {Promise} A promise that resolves with the weapon
 */
export async function getWeapon(slug: string) {
	try {
		const response = await axios.get(`${WEAPON_API_URL}/${slug}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching weapon:', error);
		throw error;
	}
}
