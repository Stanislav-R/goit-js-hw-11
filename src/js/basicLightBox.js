import * as basicLightbox from 'basiclightbox';

export default function appendModalImage(modalImage) {
  const instance = basicLightbox.create(`
      <img src=${modalImage} class="is-loaded" width="800" height="600" style="opacity: 1">
  `);
  instance.show();
}
