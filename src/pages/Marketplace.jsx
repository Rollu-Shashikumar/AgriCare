import { useState, useEffect } from 'react';

const Marketplace = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([
    { id: 1, name: "Organic Apples", category: "fruits", description: "Fresh, crisp organic apples picked at peak ripeness.", price: 3.99, quantity: 50, farmer: 1, image: "apples.jpg" },
    { id: 2, name: "Fresh Carrots", category: "vegetables", description: "Sweet and crunchy carrots, perfect for salads or cooking.", price: 2.49, quantity: 30, farmer: 1, image: "carrots.jpg" },
    { id: 3, name: "Raw Honey", category: "honey", description: "Pure, unfiltered honey from local wildflowers.", price: 8.99, quantity: 15, farmer: 2, image: "honey.jpg" },
    { id: 4, name: "Free-Range Eggs", category: "dairy", description: "Farm fresh eggs from free-range chickens.", price: 5.99, quantity: 24, farmer: 3, image: "eggs.jpg" },
    { id: 5, name: "Heirloom Tomatoes", category: "vegetables", description: "Colorful, flavorful heirloom tomatoes.", price: 4.50, quantity: 20, farmer: 2, image: "tomatoes.jpg" },
    { id: 6, name: "Artisan Bread", category: "baked", description: "Handcrafted sourdough bread baked fresh daily.", price: 6.99, quantity: 10, farmer: 3, image: "bread.jpg" }
  ]);

  const farmers = [
    { id: 1, name: "Green Valley Farm", location: "Meadowville" },
    { id: 2, name: "Sunset Orchards", location: "Riverdale" },
    { id: 3, name: "Happy Hens Farm", location: "Hillcrest" }
  ];

  // Show selected page
  const showPage = (pageId) => {
    setCurrentPage(pageId);
  };

  // Add product to cart
  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product && product.quantity > 0) {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.productId === productId);
        if (existingItem) {
          if (existingItem.quantity < product.quantity) {
            return prevCart.map(item =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
            );
          } else {
            alert('Sorry, no more items available in stock.');
            return prevCart;
          }
        } else {
          return [...prevCart, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
        }
      });
    }
  };

  // Increase item quantity in cart
  const increaseQuantity = (productId) => {
    const product = products.find(p => p.id === productId);
    setCart(prevCart => {
      const cartItem = prevCart.find(item => item.productId === productId);
      if (cartItem && cartItem.quantity < product.quantity) {
        return prevCart.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        alert('Sorry, no more items available in stock.');
        return prevCart;
      }
    });
  };

  // Decrease item quantity in cart
  const decreaseQuantity = (productId) => {
    setCart(prevCart => {
      const cartItem = prevCart.find(item => item.productId === productId);
      if (cartItem) {
        if (cartItem.quantity > 1) {
          return prevCart.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
          );
        } else {
          return prevCart.filter(item => item.productId !== productId);
        }
      }
      return prevCart;
    });
  };

  // Calculate cart totals
  const getCartTotals = () => {
    let total = 0;
    let itemCount = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      itemCount += item.quantity;
    });
    return { total: total.toFixed(2), itemCount };
  };

  // Checkout function
  const checkout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Thank you for your order! Your items will be prepared for pickup or delivery.');
    setCart([]);
  };

  // Apply filters (placeholder)
  const applyFilters = () => {
    const category = document.getElementById('categoryFilter')?.value || '';
    const farmer = document.getElementById('farmerFilter')?.value || '';
    const sort = document.getElementById('sortFilter')?.value || '';
    alert(`Filters applied: Category=${category}, Farmer=${farmer}, Sort=${sort}`);
  };

  // Handle form submission for adding products
  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newProduct = {
      id: products.length + 1,
      name: formData.get('productName'),
      category: formData.get('productCategory'),
      description: formData.get('productDescription'),
      price: parseFloat(formData.get('productPrice')),
      quantity: parseInt(formData.get('productQuantity')),
      farmer: 1, // Assuming Green Valley Farm (farmer ID 1)
      image: formData.get('productImage')?.name || 'fallback.jpg'
    };
    alert(`Product added: ${newProduct.name}`);
    setProducts(prev => [...prev, newProduct]);
    e.target.reset();
  };

  // Edit product (placeholder)
  const editProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      alert(`Editing product: ${product.name}`);
    }
  };

  // Delete product (placeholder)
  const deleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== productId));
      alert('Product deleted!');
    }
  };

  // Initialize page
  useEffect(() => {
    showPage('home');
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      {/* <header className="bg-primary text-white shadow-md">
        <nav className="flex justify-between items-center px-8 py-4">
          <div className="text-2xl font-bold">
            Local<span className="text-accent">Harvest</span>
          </div>
          <div className="flex gap-6">
            <a href="#" onClick={() => showPage('home')} className="text-white hover:text-accent transition">Home</a>
            <a href="#" onClick={() => showPage('farmer')} className="text-white hover:text-accent transition">Farmers</a>
            <a href="#" onClick={() => showPage('buyer')} className="text-white hover:text-accent transition">Shop</a>
            <a href="#" className="text-white hover:text-accent transition">About</a>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 border border-white rounded-lg text-white hover:bg-white/10 transition">Login</button>
            <button className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-orange-500 transition">Sign Up</button>
          </div>
        </nav>
      </header> */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Home Page */}
        <div className={`page ${currentPage === 'home' ? 'block' : 'hidden'}`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl text-primary mb-2">Welcome to Local Harvest Market</h1>
            <p className="text-gray-600 text-lg">Connecting local farmers directly with buyers for fresh, sustainable produce</p>
          </div>
          <div className="text-center my-12">
            <h2 className="text-2xl mb-8">Choose Your Path</h2>
            <div className="flex justify-center gap-8">
              <div className="bg-secondary p-8 rounded-lg shadow-md flex-1 max-w-md">
                <h3 className="text-primary text-xl mb-4">I'm a Farmer</h3>
                <p className="mb-8">List your products, manage inventory, and connect with local customers.</p>
                <button onClick={() => showPage('farmer')} className="w-full bg-accent text-white py-3 rounded-lg hover:bg-orange-500 transition">Go to Farmer Dashboard</button>
              </div>
              <div className="bg-secondary p-8 rounded-lg shadow-md flex-1 max-w-md">
                <h3 className="text-primary text-xl mb-4">I'm a Buyer</h3>
                <p className="mb-8">Browse fresh local products and connect directly with farmers in your area.</p>
                <button onClick={() => showPage('buyer')} className="w-full bg-accent text-white py-3 rounded-lg hover:bg-orange-500 transition">Shop Local Products</button>
              </div>
            </div>
          </div>
        </div>

        {/* Farmer Page */}
        <div className={`page ${currentPage === 'farmer' ? 'block' : 'hidden'}`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl text-primary mb-2">Farmer Dashboard</h1>
            <p className="text-gray-600 text-lg">Manage your products and connect with local buyers</p>
          </div>
          <div className="grid lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1 bg-secondary p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Farm Profile</h3>
              <div className="mb-6">
                <div className="flex justify-between border-b py-2">
                  <span>Active Products</span>
                  <span>8</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span>Total Sales</span>
                  <span>$1,245.00</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span>Pending Orders</span>
                  <span>3</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="bg-accent text-white py-3 rounded-lg hover:bg-orange-500 transition">View Orders</button>
                <button className="border border-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-100 transition">Edit Profile</button>
              </div>
            </div>
            <div className="lg:col-span-3 bg-secondary p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
              <form onSubmit={handleAddProduct}>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Product Name</label>
                  <input type="text" name="productName" className="w-full p-3 border rounded-lg" required />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Category</label>
                  <select name="productCategory" className="w-full p-3 border rounded-lg" required>
                    <option value="">Select Category</option>
                    <option value="fruits">Fruits</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="honey">Honey & Preserves</option>
                    <option value="baked">Baked Goods</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Description</label>
                  <textarea name="productDescription" className="w-full p-3 border rounded-lg" rows="3" required></textarea>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block mb-2 font-medium">Price ($)</label>
                    <input type="number" name="productPrice" className="w-full p-3 border rounded-lg" step="0.01" min="0" required />
                  </div>
                  <div className="flex-1">
                    <label className="block mb-2 font-medium">Quantity Available</label>
                    <input type="number" name="productQuantity" className="w-full p-3 border rounded-lg" min="1" required />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">Product Image</label>
                  <input type="file" name="productImage" className="w-full p-3 border rounded-lg" />
                </div>
                <button type="submit" className="w-full bg-accent text-white py-3 rounded-lg hover:bg-orange-500 transition">Add Product</button>
              </form>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter(product => product.farmer === 1) // Assuming Green Valley Farm (farmer ID 1)
                .map(product => (
                  <div key={product.id} className="bg-secondary rounded-lg shadow-md hover:-translate-y-1 transition">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <img src={`/images/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <div className="text-lg font-semibold">{product.name}</div>
                      <div className="text-primary font-semibold">${product.price.toFixed(2)}</div>
                      <div className="text-gray-600">In stock: {product.quantity}</div>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => editProduct(product.id)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100">Edit</button>
                        <button onClick={() => deleteProduct(product.id)} className="flex-1 bg-accent text-white py-2 rounded-lg hover:bg-orange-500">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Buyer Page */}
        <div className={`page ${currentPage === 'buyer' ? 'block' : 'hidden'}`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl text-primary mb-2">Shop Local Products</h1>
            <p className="text-gray-600 text-lg">Fresh produce directly from farmers in your area</p>
          </div>
          <div className="bg-secondary p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-lg font-semibold mb-4">Filter Products</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-2 font-medium">Category</label>
                <select id="categoryFilter" className="w-full p-3 border rounded-lg">
                  <option value="">All Categories</option>
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="honey">Honey & Preserves</option>
                  <option value="baked">Baked Goods</option>
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-2 font-medium">Farmer</label>
                <select id="farmerFilter" className="w-full p-3 border rounded-lg">
                  <option value="">All Farmers</option>
                  {farmers.map(farmer => (
                    <option key={farmer.id} value={farmer.id}>{farmer.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block mb-2 font-medium">Sort By</label>
                <select id="sortFilter" className="w-full p-3 border rounded-lg">
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
            <button onClick={applyFilters} className="bg-accent text-white py-3 rounded-lg hover:bg-orange-500 transition">Apply Filters</button>
          </div>
          <div className="lg:fixed lg:top-20 lg:right-8 lg:w-80 bg-secondary p-6 rounded-lg shadow-md mb-8 lg:mb-0">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-semibold">Your Cart</h3>
              <span>{getCartTotals().itemCount} item{getCartTotals().itemCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="max-h-72 overflow-y-auto mb-4">
              {cart.length === 0 ? (
                <div className="text-gray-600">Your cart is empty</div>
              ) : (
                cart.map(item => (
                  <div key={item.productId} className="flex justify-between items-center py-2 border-b">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-600 text-sm">${item.price.toFixed(2)} each</div>
                    </div>
                    <div className="flex items-center">
                      <button onClick={() => decreaseQuantity(item.productId)} className="text-primary text-lg">-</button>
                      <span className="mx-2">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item.productId)} className="text-primary text-lg">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="flex justify-between font-semibold mt-4 pt-4 border-t">
              <span>Total:</span>
              <span>${getCartTotals().total}</span>
            </div>
            <button onClick={checkout} className="w-full bg-accent text-white py-3 rounded-lg mt-4 hover:bg-orange-500 transition">Checkout</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => {
              const farmer = farmers.find(f => f.id === product.farmer);
              return (
                <div key={product.id} className="bg-secondary rounded-lg shadow-md hover:-translate-y-1 transition">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <img src={`/images/${product.image}`} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="text-lg font-semibold">{product.name}</div>
                    <div className="text-gray-600 text-sm">by {farmer.name}</div>
                    <div className="text-primary font-semibold">${product.price.toFixed(2)}</div>
                    <div className="text-gray-600">{product.quantity > 0 ? `In stock: ${product.quantity}` : 'Out of stock'}</div>
                    <p>{product.description.substring(0, 60)}{product.description.length > 60 ? '...' : ''}</p>
                    <div className="mt-2">
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={product.quantity <= 0}
                        className={`w-full py-2 rounded-lg ${product.quantity <= 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-accent text-white hover:bg-orange-500 transition'}`}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-8 mt-12">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="text-white hover:underline">About Us</a>
          <a href="#" className="text-white hover:underline">Contact</a>
          <a href="#" className="text-white hover:underline">Terms of Service</a>
          <a href="#" className="text-white hover:underline">Privacy Policy</a>
        </div>
        <p>© 2025 Local Harvest Market. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Marketplace;