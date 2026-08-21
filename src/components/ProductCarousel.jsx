import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductCarousel({ products, intervalMs = 4500 }) {
  const [index, setIndex] = useState(0);

  // Avance automático: cada "intervalMs" pasa a la siguiente slide
  useEffect(() => {
    if (products.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [products.length, intervalMs]);

  if (products.length === 0) return null;

  const goTo = (i) => setIndex(i);
  const goPrev = () => setIndex((prev) => (prev - 1 + products.length) % products.length);
  const goNext = () => setIndex((prev) => (prev + 1) % products.length);

  return (
    <section className="carousel" aria-label="Productos destacados">
      <div className="carousel__viewport">
        <div
          className="carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/producto/${product.id}`}
              className="carousel__slide"
            >
              <img src={product.image} alt={product.name} />
              <div className="carousel__slide-info">
                <span className="carousel__slide-tag">Destacado</span>
                <h3>{product.name}</h3>
                <p>{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>

        {products.length > 1 && (
          <>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--prev"
              onClick={goPrev}
              aria-label="Producto anterior"
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--next"
              onClick={goNext}
              aria-label="Producto siguiente"
            >
              ›
            </button>
          </>
        )}
      </div>

      {products.length > 1 && (
        <div className="carousel__dots" role="tablist" aria-label="Seleccionar slide">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              className={"carousel__dot" + (i === index ? " carousel__dot--active" : "")}
              onClick={() => goTo(i)}
              aria-label={`Ir al producto ${i + 1}`}
              aria-selected={i === index}
              role="tab"
            />
          ))}
        </div>
      )}
    </section>
  );
}
