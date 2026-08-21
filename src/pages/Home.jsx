import { useMemo, useState } from "react";
import { useProducts } from "../context/ProductsContext";
import ProductCard from "../components/ProductCard";
import ProductCarousel from "../components/ProductCarousel";

export default function Home() {
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const featured = useMemo(() => products.slice(0, 5), [products]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["Todas", ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "Todas" || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <div className="page page--home">
      <section className="hero">
        <div className="hero__text">
          <p className="hero__eyebrow">Saltá directo a lo que buscás</p>
          <h1 className="hero__title">
            Comprá rápido. <span>Vendé más rápido todavía.</span>
          </h1>
          <p className="hero__subtitle">
            {products.length} productos disponibles, gestionados en vivo desde
            el panel de administración.
          </p>
        </div>
      </section>
      {featured.length > 0 && <ProductCarousel products={featured} />}
      <section className="filters" aria-label="Filtros de productos">
        <input
          type="search"
          className="filters__search"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar productos"
        />
        <div className="filters__chips" role="group" aria-label="Categorías">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={"chip" + (category === cat ? " chip--active" : "")}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>No encontramos productos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <section className="product-grid" aria-label="Listado de productos">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </div>
  );
}
