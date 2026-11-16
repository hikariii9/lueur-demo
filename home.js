const grid = document.querySelector('#product-grid');

function makeProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.category = product.category;

  const detailUrl = `produit.html?id=${encodeURIComponent(product.id)}`;
  const link = document.createElement('a');
  link.className = 'product-photo';
  link.href = detailUrl;
  link.setAttribute('aria-label', `Voir la fiche en préparation : ${product.name}`);

  const image = document.createElement('img');
  image.src = product.image;
  image.alt = `Illustration temporaire de maquette pour ${product.name}`;
  image.loading = 'lazy';
  const imageBadge = document.createElement('span');
  imageBadge.className = 'photo-metal';
  imageBadge.textContent = 'Maquette';
  link.append(image, imageBadge);

  const content = document.createElement('div');
  content.className = 'product-content';
  const category = document.createElement('span');
  category.className = 'product-category';
  category.textContent = product.categoryLabel;
  const title = document.createElement('h3');
  const titleLink = document.createElement('a');
  titleLink.href = detailUrl;
  titleLink.textContent = product.name;
  title.append(titleLink);
  const description = document.createElement('p');
  description.textContent = product.short;
  const status = document.createElement('div');
  status.className = 'product-meta';
  const price = document.createElement('strong');
  const isReady = window.LUEUR_PRODUCT_READY(product);
  price.textContent = isReady ? window.LUEUR_EURO(product.salePrice) : 'Bientôt disponible';
  const state = document.createElement('span');
  state.textContent = isReady ? 'Fiche vérifiée' : 'Sélection en préparation';
  status.append(price, state);
  const actions = document.createElement('div');
  actions.className = 'product-actions';
  const details = document.createElement('a');
  details.className = 'detail-link';
  details.href = detailUrl;
  details.textContent = 'Voir la fiche ↗';
  actions.append(details);
  content.append(category, title, description, status, actions);
  card.append(link, content);
  return card;
}

grid.replaceChildren(...window.LUEUR_PRODUCTS.map(makeProductCard));

document.querySelectorAll('.category-filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.category-filter.is-active')?.classList.remove('is-active');
    button.classList.add('is-active');
    const filter = button.dataset.filter;
    document.querySelectorAll('.product-card').forEach((card) => {
      card.hidden = filter !== 'tous' && card.dataset.category !== filter;
    });
  });
});
