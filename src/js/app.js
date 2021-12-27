import Notiflix from 'notiflix';
import FetchImageApi from './apiService';
import imageCardTemplate from '../templates/galleryTemplate.hbs';
import appendModalImage from './basicLightBox';
import refs from './refs';

refs.search.addEventListener('submit', onSearch);
refs.gallery.addEventListener('click', openModal);

const imgSearch = new FetchImageApi();

function onSearch(event) {
  event.preventDefault();
  const query = event.currentTarget.elements.query.value;
  imgSearch.query = query;
  if (query === '') {
    Notiflix.Notify.info('Enter picture name!!!');
    return;
  }
  imgSearch.resetPage();
  refs.gallery.innerHTML = '';
  fetchImages();
}
async function fetchImages() {
  try {
    const fetchResult = await imgSearch.fetchImage();
    if (fetchResult.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    } else {
      imagesMarkUp(fetchResult.hits);
      lazyLoad();
      Notiflix.Notify.success(`Hooray! We found ${fetchResult.total} images.`);
      observer.observe(refs.observer);
    }
  } catch (error) {
    Notiflix.Notify.warning('Something wrong!');
  }
}
function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && imgSearch.query !== '') {
      imgSearch.fetchImage().then(images => {
        if (images.length < 1) {
          Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
          observer.unobserve(refs.observer);
          return;
        }
        imagesMarkUp(images.hits);
        lazyLoad();
      });
    }
  });
}
function imagesMarkUp(images) {
  refs.gallery.insertAdjacentHTML('beforeend', imageCardTemplate(images));
}
function openModal(e) {
  const target = e.target.tagName;
  const modalImage = e.target.dataset.source;
  if (target !== 'IMG') {
    return;
  }
  appendModalImage(modalImage);
}
function lazyLoad() {
  const cardImages = document.querySelectorAll('.fetch');
  cardImages.forEach(image => {
    image.src = image.dataset.src;
    image.classList.remove('fetch');

    image.addEventListener('load', () => {
      image.classList.add('is-loaded');
    });
  });
}
const observer = new IntersectionObserver(onEntry, {
  rootMargin: '50px',
});
