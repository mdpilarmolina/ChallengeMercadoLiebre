import { createContext, useContext, useEffect, useState, useCallback } from "react";
import seedProducts from "../data/seedProducts";

const STORAGE_KEY = "mercadoliebre_products";

const ProductsContext = createContext(null);

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error("No se pudo leer LocalStorage:", err);
  }
  // Primera vez (o error de lectura): sembramos con los productos iniciales
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts));
  return seedProducts;
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(loadFromStorage);

  // Cada vez que products cambia, lo persistimos
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (err) {
      console.error("No se pudo guardar en LocalStorage:", err);
    }
  }, [products]);

  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const getProduct = useCallback(
    (id) => products.find((p) => p.id === id),
    [products]
  );

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error("useProducts debe usarse dentro de <ProductsProvider>");
  }
  return ctx;
}