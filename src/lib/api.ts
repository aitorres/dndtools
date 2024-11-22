import axios from 'axios';

const API_URL = 'https://www.dnd5eapi.co/api/spells';

export async function getSpells() {
    try {
        const response = await axios.get(API_URL);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching spells:', error);
        throw error;
    }
}

export async function getSpell(slug: string) {
    try {
        const response = await axios.get(`${API_URL}/${slug}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching spell:', error);
        throw error;
    }
}
