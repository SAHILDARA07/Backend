

export const getCart = () => {
  try {
    const cart = JSON.parse(localStorage.getItem("cart"));

    if (Array.isArray(cart)) {
      return cart;
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (product, quantity) => {
  const cart = getCart();
  const oldItem = cart.find((item) => item.productId === product._id);

  if (oldItem) {
    oldItem.quantity = oldItem.quantity + quantity;

    oldItem.title = product.title;
    oldItem.price = product.price;
    oldItem.image = product.image;
    oldItem.stock = product.stock;

    // the cart can never have more than the stock
    if (oldItem.quantity > product.stock) {
      oldItem.quantity = product.stock;
    }

    saveCart(cart);
    return oldItem.quantity;
  }

  cart.push({
    productId: product._id,
    title: product.title,
    price: product.price,
    image: product.image,
    stock: product.stock,
    quantity: quantity,
  });

  saveCart(cart);
  return quantity;
};

// total number of items in the cart (for the navbar)
export const getCartCount = () => {
  const cart = getCart();
  let count = 0;

  for (const item of cart) {
    count = count + item.quantity;
  }
  return count;
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};