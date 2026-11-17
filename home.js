const grid = document.querySelector('#product-grid');
const pagination = document.querySelector('#catalog-pagination');
const countLabel = document.querySelector('#catalog-count');
const pageSize = 12;
let activeCategory = 'tous';
let activeMetal = 'tous';
let currentPage = 1;
let searchText = '';

function normalizedText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function productMetal(product) {
  const finish = normalizedText(`${product.metal || ''} ${product.finish || ''}`);
  if (finish.includes('argent') || finish.includes('silver') || finish.includes('925')) return 'silver';
  if (finish.includes('dore') || finish.includes('gold') || finish.includes('or ')) return 'gold';
  return 'unknown';
}

function makeProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.category = product.category;
  card.dataset.metal = productMetal(product);

  const detailUrl = `produit.html?id=${encodeURIComponent(product.id)}`;
  const link = document.createElement('a');
  link.className = 'product-photo';
  link.href = detailUrl;
  link.setAttribute('aria-label', `Voir la fiche en préparation : ${product.name}`);

  const image = document.createElement('img');
  image.src = product.image;
  image.alt = product.imageAuthorized ? product.name : `Illustration temporaire de maquette pour ${product.name}`;
  image.loading = 'lazy';
  const imageBadge = document.createElement('span');
  imageBadge.className = 'photo-metal';
  imageBadge.textContent = product.imageAuthorized ? product.finish : 'Maquette';
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

function filteredProducts() {
  const query = normalizedText(searchText.trim());
  return window.LUEUR_PRODUCTS.filter((product) => {
    const categoryMatches = activeCategory === 'tous' || product.category === activeCategory;
    const metalMatches = activeMetal === 'tous' || productMetal(product) === activeMetal;
    const searchable = normalizedText(`${product.name} ${product.categoryLabel} ${product.short} ${product.finish} ${product.description}`);
    return categoryMatches && metalMatches && (!query || searchable.includes(query));
  });
}

function makePageButton(label, page, { disabled = false, current = false } = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = current ? 'page-button is-current' : 'page-button';
  button.textContent = label;
  button.dataset.page = String(page);
  button.disabled = disabled;
  if (current) button.setAttribute('aria-current', 'page');
  return button;
}

function renderPagination(totalPages) {
  pagination.replaceChildren();
  pagination.hidden = totalPages <= 1;
  if (totalPages <= 1) return;
  pagination.append(makePageButton('Précédent', currentPage - 1, { disabled: currentPage === 1 }));
  for (let page = 1; page <= totalPages; page += 1) {
    pagination.append(makePageButton(String(page), page, { current: page === currentPage }));
  }
  pagination.append(makePageButton('Suivant', currentPage + 1, { disabled: currentPage === totalPages }));
}

function renderCatalog() {
  const results = filteredProducts();
  document.querySelector('#all-count').textContent = String(window.LUEUR_PRODUCTS.length);
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleProducts = results.slice(start, start + pageSize);
  grid.replaceChildren(...visibleProducts.map(makeProductCard));
  countLabel.textContent = results.length
    ? `Affichage de ${start + 1} à ${start + visibleProducts.length} sur ${results.length} bijou${results.length > 1 ? 'x' : ''}`
    : 'Aucun bijou ne correspond à votre recherche.';
  renderPagination(totalPages);
}

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('[data-filter].is-active')?.classList.remove('is-active');
    button.classList.add('is-active');
    activeCategory = button.dataset.filter;
    currentPage = 1;
    renderCatalog();
  });
});

document.querySelectorAll('[data-metal-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('[data-metal-filter].is-active')?.classList.remove('is-active');
    button.classList.add('is-active');
    activeMetal = button.dataset.metalFilter;
    currentPage = 1;
    renderCatalog();
  });
});

document.querySelector('#catalog-search').addEventListener('input', (event) => {
  searchText = event.target.value;
  currentPage = 1;
  renderCatalog();
});

pagination.addEventListener('click', (event) => {
  const button = event.target.closest('[data-page]');
  if (!button || button.disabled) return;
  currentPage = Number(button.dataset.page);
  renderCatalog();
  document.querySelector('#collection').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

renderCatalog();

