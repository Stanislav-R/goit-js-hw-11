const BASE_URL = 'https://pixabay.com/api';
const KEY = '24897128-6d86d50f9f43e3f1b4adef6ad';
const axios = require('axios');

export default class FetchImageApi {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async fetchImage() {
    try {
      const res = await axios.get(
        `${BASE_URL}/?image_type=photo&orientation=horizontal&safesearch=true&q=${this.searchQuery}&page=${this.page}&per_page=40&key=${KEY}`,
      );
      const hits = res.data;
      this.incrPage();
      return hits;
    } catch (error) {
      console.error(error.message);
    }
  }

  get query() {
    return this.page;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
