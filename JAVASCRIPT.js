async function loadProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error al cargar los productos:', error);
    showAlert('Error', 'No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.', 'error');
  }
}

function displayProducts(products) {
  const productListSection = document.getElementById('productList');
  productListSection.innerHTML = '';
  products.forEach(product => {
    const card = createProductCard(product);
    productListSection.appendChild(card);
  });
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.classList.add('col-lg-4', 'col-md-6', 'mb-4', 'card');
  card.innerHTML = `
    <div class="card h-100">
      <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">Precio: ${product.price}</p>
        <p class="card-text">Categoría: ${product.category}</p>
        <p class="card-text">Marca: ${product.brand}</p>
        <button onclick="addToCart('${product.title}', '${product.price}', '${product.thumbnail}')" class="btn btn-primary">Añadir a carrito</button>
      </div>
    </div>
  `;
  return card;
}

function createCartItemCard(product) {
  const card = document.createElement('div');
  card.classList.add('col-lg-12', 'col-md-12', 'mb-4', 'card');
  card.innerHTML = `
    <div class="card">
      <div class="card-body d-flex align-items-center">
      <img src="${product.thumbnail}" class="img-thumbnail mr-3 cart-item-thumbnail" alt="${product.title}">
      <div>
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">Precio: ${product.price}</p>
        </div>
      </div>
    </div>
  `;
  return card;
}
async function main() {
  try {
    const products = await loadProducts();
    localStorage.setItem('allProducts', JSON.stringify(products));
    displayProducts(products);
    displayFilters(products);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  try {
    const products = await loadProducts();
    localStorage.setItem('allProducts', JSON.stringify(products));
    displayProducts(products);
    displayFilters(products);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayFilters(products) {
  displayCategories(products);
  displayBrands(products);
}

function displayCategories(products) {
  const categorySelect = document.getElementById('category');
  const categories = [...new Set(products.map(product => product.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.textContent = category;
    option.value = category;
    categorySelect.appendChild(option);
  });
}

function displayBrands(products) {
  const brandSelect = document.getElementById('brand');
  const brands = [...new Set(products.map(product => product.brand))];
  brands.forEach(brand => {
    const option = document.createElement('option');
    option.textContent = brand;
    option.value = brand;
    brandSelect.appendChild(option);
  });
}

function filterProducts(products) {
  let filteredProducts = products.slice();
  const category = document.getElementById('category').value;
  const brand = document.getElementById('brand').value;
  const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
  const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }
  if (brand) {
    filteredProducts = filteredProducts.filter(product => product.brand === brand);
  }
  filteredProducts = filteredProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
  return filteredProducts;
}

function applyFilters() {
  const products = JSON.parse(localStorage.getItem('allProducts'));
  const filteredProducts = filterProducts(products);
  displayProducts(filteredProducts);
}


function addToCart(name, price, thumbnail) {
  const cartItems = document.getElementById('cartItems');
  const product = { title: name, price: price, thumbnail: thumbnail};
  const card = createCartItemCard(product);
  
  card.classList.add('added-to-cart-animation');
  
  cartItems.appendChild(card);
}

async function initializeApp() {
  try {
    await main();
  } catch (error) {
    console.error('Error:', error);
  }
}

function showAlert(title, text, icon) {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    timer: 2000,
    timerProgressBar: true,
    showConfirmButton: false
  });
}

document.getElementById('applyFilterBtn').addEventListener('click', applyFilters);
initializeApp();