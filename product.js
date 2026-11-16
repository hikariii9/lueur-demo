const params = new URLSearchParams(window.location.search);
const product = window.LUEUR_PRODUCTS.find((item) => item.id === params.get('id'));
const detail = document.querySelector('#product-detail');

function addTextRow(list, label, value) {
  const row = document.createElement('div');
  const term = document.createElement('dt');
  term.textContent = label;
  const description = document.createElement('dd');
  description.textContent = value;
  row.append(term, description);
  list.append(row);
}

if (!product) {
  document.title = 'Bijou introuvable — Lueur';
  const message = document.createElement('div');
  message.className = 'not-found';
  const heading = document.createElement('h1');
  heading.textContent = 'Cette fiche est introuvable.';
  const back = document.createElement('a');
  back.className = 'button button-gold';
  back.href = 'index.html#collection';
  back.textContent = 'Revenir à la sélection';
  message.append(heading, back);
  detail.append(message);
} else {
  document.title = `${product.name} — Lueur`;
  document.querySelector('#breadcrumb-name').textContent = product.name;

  const imagePanel = document.createElement('div');
  imagePanel.className = 'detail-photo';
  const image = document.createElement('img');
  image.src = product.image;
  image.alt = `Illustration temporaire de maquette pour ${product.name}`;
  const imageNote = document.createElement('span');
  imageNote.textContent = 'Illustration temporaire';
  imagePanel.append(image, imageNote);

  const info = document.createElement('section');
  info.className = 'detail-info';
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  const eyebrowDot = document.createElement('span');
  eyebrowDot.className = 'eyebrow-dot';
  eyebrow.append(eyebrowDot, document.createTextNode(` ${product.categoryLabel.toUpperCase()}`));
  const title = document.createElement('h1');
  title.textContent = product.name;
  const short = document.createElement('p');
  short.className = 'detail-short';
  short.textContent = product.short;
  const availability = document.createElement('div');
  availability.className = 'availability';
  const availabilityTitle = document.createElement('strong');
  availabilityTitle.textContent = 'Fiche produit en préparation';
  const availabilityText = document.createElement('p');
  availabilityText.textContent = 'La commande sera ouverte après confirmation du fournisseur, des caractéristiques, du stock, du tarif et de la livraison en France.';
  availability.append(availabilityTitle, availabilityText);
  const description = document.createElement('p');
  description.className = 'detail-description';
  description.textContent = product.description;
  const specs = document.createElement('dl');
  specs.className = 'spec-list';
  addTextRow(specs, 'Finition envisagée', product.finish);
  addTextRow(specs, 'Matière', 'À confirmer avant publication');
  addTextRow(specs, 'Référence fournisseur', 'Non attribuée');
  addTextRow(specs, 'Prix et livraison', 'À confirmer');
  const back = document.createElement('a');
  back.className = 'button button-gold';
  back.href = 'index.html#collection';
  back.textContent = 'Retour à la sélection';
  info.append(eyebrow, title, short, availability, description, specs, back);
  detail.append(imagePanel, info);
}
