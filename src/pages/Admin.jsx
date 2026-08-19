import { useState } from "react";
import { useProducts } from "../context/ProductsContext";
import ProductForm from "../components/ProductForm";

const formatPrice = (value) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleCreateClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleSubmit = (data) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
    } else {
      addProduct(data);
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const confirmDelete = (id) => setPendingDeleteId(id);
  const cancelDelete = () => setPendingDeleteId(null);
  const executeDelete = (id) => {
    deleteProduct(id);
    setPendingDeleteId(null);
    if (editingProduct?.id === id) {
      setEditingProduct(null);
      setShowForm(false);
    }
  };

  return (
    <div className="page page--admin">
      <div className="admin-header">
        <div>
          <h1>Panel de administración</h1>
          <p className="admin-header__subtitle">
            Gestioná el catálogo que se muestra en el inicio. Los cambios se
            guardan automáticamente en este navegador.
          </p>
        </div>
        {!showForm && (
          <button className="btn btn--primary" onClick={handleCreateClick}>
            + Nuevo producto
          </button>
        )}
      </div>

      {showForm && (
        <section className="admin-form-card">
          <h2>{editingProduct ? "Editar producto" : "Crear producto"}</h2>
          <ProductForm
            key={editingProduct?.id ?? "new"}
            initialProduct={editingProduct}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </section>
      )}

      <section className="admin-table-card">
        <h2>Productos ({products.length})</h2>
        {products.length === 0 ? (
          <p className="empty-state">Todavía no hay productos cargados.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th aria-label="Acciones"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="admin-table__product">
                      <img src={product.image} alt="" />
                      <span>{product.name}</span>
                    </td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <span
                        className={
                          product.stock === 0
                            ? "stock-pill stock-pill--out"
                            : product.stock <= 5
                            ? "stock-pill stock-pill--low"
                            : "stock-pill stock-pill--ok"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="admin-table__actions">
                      {pendingDeleteId === product.id ? (
                        <div className="confirm-delete">
                          <span>¿Eliminar?</span>
                          <button
                            className="btn btn--danger btn--small"
                            onClick={() => executeDelete(product.id)}
                          >
                            Sí
                          </button>
                          <button
                            className="btn btn--ghost btn--small"
                            onClick={cancelDelete}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            className="btn btn--ghost btn--small"
                            onClick={() => handleEditClick(product)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn--danger btn--small"
                            onClick={() => confirmDelete(product.id)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}