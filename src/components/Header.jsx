import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

function HareMark() {
  return (
    <svg
      className="hare-mark"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 20c-2-6-1-11 3-13 1 3 1 6 0 8 3-1 6-1 8 1-1-4-1-8 2-11 2 3 2 7 1 10 3 1 5 4 5 8 0 9-7 16-13 16S8 32 8 24c0-1.5.3-2.8 1-4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17" cy="23" r="1.6" fill="currentColor" />
      <path
        d="M6 33c4 3 9 4 14 4"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <NavLink to="/" className="brand" aria-label="Mercado Liebre — Inicio">
          <HareMark />
          <span className="brand__text">
            Mercado<strong>Liebre</strong>
          </span>
        </NavLink>

        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) => "main-nav__link" + (isActive ? " is-active" : "")}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => "main-nav__link" + (isActive ? " is-active" : "")}
          >
            Panel Admin
          </NavLink>
          <NavLink
            to="/carrito"
            className={({ isActive }) => "main-nav__link main-nav__link--cart" + (isActive ? " is-active" : "")}
            aria-label={`Carrito, ${cartCount} productos`}
          >
            🛒 Carrito
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}