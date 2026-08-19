import { Link, useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct } = useProducts();
  const product = getProduct(id);

  if (!product) {
    return (
      <div className="page page--detail">
        <div className="empty-state">
          <p>No encontramos ese producto. Puede que haya sido eliminado.</p>
          <Link to="/" className="btn btn--primary">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  return (
    <div className="page page--detail">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="detail">
        <div className="detail__image-wrap">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail__info">
          <span className="product-card__category">{product.category}</span>
          <h1 className="detail__name">{product.name}</h1>
          <p className="detail__price">{formatPrice(product.price)}</p>

          <p
            className={
              "stock-indicator " +
              (outOfStock
                ? "stock-indicator--out"
                : product.stock <= 5
                ? "stock-indicator--low"
                : "stock-indicator--ok")
            }
          >
            {outOfStock
              ? "Sin stock disponible"
              : `${product.stock} unidades disponibles`}
          </p>

          <p className="detail__description">{product.description}</p>

          <button className="btn btn--primary btn--wide" disabled={outOfStock}>
            {outOfStock ? "No disponible" : "Comprar ahora"}
          </button>
        </div>
      </div>
    </div>
  );
}