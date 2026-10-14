import { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // what the user is typing in the filter form
  const [searchInput, setSearchInput] = useState("");
  const [minInput, setMinInput] = useState("");
  const [maxInput, setMaxInput] = useState("");

  // the filters that are really used to get the products
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("newest");

  const getProducts = async () => {
    try {
      setLoading(true);
      setMsg("");

      // these values go to the backend as query parameters
      // example: /products?page=1&limit=8&search=shoe&sort=price_asc
      const res = await api.get("/products", {
        params: { page, limit: 8, search, category, minPrice, maxPrice, sort },
      });

      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setTotalProducts(res.data.totalProducts);
    } catch (err) {
      console.log("Products not loaded due to an error !", err);
      setMsg("Products could not be loaded, please try again !");
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const res = await api.get("/products/categories");
      setCategories(res.data);
    } catch (err) {
      console.log("Categories not loaded due to an error !", err);
    }
  };

  // categories are loaded one time
  useEffect(() => {
    getCategories();
  }, []);

  // products are loaded again when the page or any filter changes
  useEffect(() => {
    getProducts();
  }, [page, search, category, minPrice, maxPrice, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setMinPrice(minInput);
    setMaxPrice(maxInput);
    setPage(1);
  };

  const handleClear = () => {
    setSearchInput("");
    setMinInput("");
    setMaxInput("");
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("");
    setSort("newest");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        {/* search and filters */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap items-end gap-3"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 min-w-48 px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Min ₹"
            min="0"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            className="w-28 px-3 py-2 border border-gray-300 rounded"
          />
          <input
            type="number"
            placeholder="Max ₹"
            min="0"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            className="w-28 px-3 py-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
          >
            Clear
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded bg-white"
          >
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Name: A to Z</option>
          </select>

          <p className="text-sm text-gray-500">{totalProducts} product(s) found</p>
        </div>

        {msg && (
          <p className="mb-4 px-4 py-3 rounded-lg text-sm font-medium bg-red-50 border border-red-200 text-red-600">
            {msg}
          </p>
        )}

        {/* products */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="bg-white rounded-lg shadow hover:shadow-md overflow-hidden flex flex-col"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-44 w-full object-cover bg-gray-200"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="h-44 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                <div className="p-3">
                  <h3 className="font-bold">{product.title}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <p className="text-lg font-bold text-blue-600">
                    ₹{Number(product.price).toFixed(2)}
                  </p>
                  {product.stock === 0 ? (
                    <p className="text-sm font-medium text-red-500">
                      Out of stock
                    </p>
                  ) : (
                    <p className="text-sm text-green-600">
                      {product.stock} in stock
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* pagination */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}