import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const { getProduct } = useProducts();

  // Combinamos cada item del carrito con el producto real (por si cambió precio o stock)
  const rows = items
    .map((item) => ({ item, product: getProduct(item.productId) }))
    .filter((row) => row.product);

  const total = rows.reduce(
    (sum, { item, product }) => sum + product.price * item.quantity,
    0
  );

  if (rows.length === 0) {
    return (
      <div className="page page--cart">
        <h1>Tu carrito</h1>
        <div className="empty-state">
          <p>Todavía no agregaste productos al carrito.</p>
          <Link to="/" className="btn btn--primary">
            Ir a comprar
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page page--cart">
      <div className="admin-header">
        <h1>Tu carrito</h1>
        <button className="btn btn--ghost btn--small" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>

      <div className="cart-list">
        {rows.map(({ item, product }) => {
          const atMaxStock = item.quantity >= product.stock;
          return (
            <div className="cart-row" key={item.productId}>
              <Link to={`/producto/${product.id}`} className="cart-row__image">
                <img src={product.image} alt={product.name} />
              </Link>

              <div className="cart-row__info">
                <Link to={`/producto/${product.id}`} className="cart-row__name">
                  {product.name}
                </Link>
                <span className="product-card__category">{product.category}</span>
                <p className="cart-row__unit-price">
                  {formatPrice(product.price)} c/u
                </p>
              </div>

              <div className="cart-row__quantity">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  aria-label="Restar unidad"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      Math.min(item.quantity + 1, product.stock)
                    )
                  }
                  disabled={atMaxStock}
                  aria-label="Sumar unidad"
                >
                  +
                </button>
              </div>

              <p className="cart-row__subtotal">
                {formatPrice(product.price * item.quantity)}
              </p>

              <button
                type="button"
                className="btn btn--danger btn--small"
                onClick={() => removeFromCart(item.productId)}
              >
                Eliminar
              </button>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <span>Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>

      <button className="btn btn--primary btn--wide">Finalizar compra</button>
    </div>
  );
}