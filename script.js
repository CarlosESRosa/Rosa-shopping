const totalPrice = document.createElement('h3');
const cart = document.querySelector('.cart'); 
const delButton = document.createElement('button');
const cartSection = document.querySelector('.cart__items');
const carregando = document.createElement('p');
let totalValue = Number(localStorage.getItem('price'));

totalPrice.className = 'total-price';
delButton.className = 'empty-cart';
carregando.className = 'loading';

delButton.innerHTML = 'Esvaziar carrinho';
carregando.innerHTML = 'carregando...';

cart.appendChild(totalPrice);
cart.appendChild(delButton);
cart.appendChild(carregando);

delButton.addEventListener('click', () => {
  totalPrice.innerHTML = `Subtotal: R$: ${0.00}`;
  cartSection.innerHTML = '';
  localStorage.price = 0.00;
  totalValue = 0.00;
  localStorage.cartItems = '';
});

function somaValue(price) {
  totalValue += price;
  localStorage.setItem('price', parseFloat(totalValue.toFixed(2)));
  totalPrice.innerHTML = `Subtotal: R$: ${parseFloat(totalValue.toFixed(2))}`;
}

function subtraiValue(price) {
  totalValue -= price;
  localStorage.setItem('price', parseFloat(totalValue.toFixed(2)));
  totalPrice.innerHTML = `Subtotal: R$: ${parseFloat(totalValue.toFixed(2))}`;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const sectionItem = document.createElement('section');
  section.className = 'item';
  sectionItem.className = 'item-section'
  sectionItem.appendChild(createCustomElement('span', 'item__sku', sku));
  sectionItem.appendChild(createProductImageElement(image));
  sectionItem.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(sectionItem);
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener({ target }) {
  const aux = target.innerHTML.split(' ');
  const priceDel = aux[aux.length - 1];
  const priceDelOnlyNumbers = priceDel.substring(1);
  subtraiValue(Number(priceDelOnlyNumbers));
  cartSection.removeChild(target);
  saveCartItems(cartSection.innerHTML);
}

function localStorageUtility() {
  const cartSuns = document.querySelectorAll('.cart__item');  
  cartSuns.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}

async function putElementOnScreen() {
  const data = await fetchProducts('computador');
  const itensFather = document.querySelector('.items');
  data.results.forEach((computer) => {
    itensFather.appendChild(createProductItemElement(computer));
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice, thumbnail }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `${name} | Price: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function putElementOnCart(id) {
  const clickedElement = await fetchItem(id);
  somaValue(parseFloat(clickedElement.price.toFixed(2)));
  cartSection.appendChild(createCartItemElement(clickedElement));
  saveCartItems(cartSection.innerHTML);
}

async function buttonUtility() {
  const myButtons = document.querySelectorAll('.item__add'); 
  const data = await fetchProducts('computador'); 
  myButtons.forEach((element, index) => {
    element.addEventListener('click', () => {
      putElementOnCart(data.results[index].id);
    });
  });
}

window.onload = async () => { 
  await putElementOnScreen();
  const lsValue = Number(localStorage.getItem('price'))
  cartSection.innerHTML = getSavedCartItems('cartItems');
  cart.removeChild(carregando);
  buttonUtility();
  localStorageUtility();
  totalPrice.innerHTML = `Subtotal: R$: ${parseFloat(lsValue.toFixed(2))}`;
};
