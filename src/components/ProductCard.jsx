import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault(); // evita que el click navegue al detalle (el card entero es un Link)
    addToCart(product.id, 1);
  };

  return (
    <Link to={`/producto/${product.id}`} className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {outOfStock && <span className="badge badge--out">Sin stock</span>}
        {!outOfStock && lowStock && (
          <span className="badge badge--low">¡Últimas {product.stock}!</span>
        )}
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{formatPrice(product.price)}</p>
        <button
          type="button"
          className="btn btn--primary btn--small btn--wide"
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          {outOfStock ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </Link>
  );
}