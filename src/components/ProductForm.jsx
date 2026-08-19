import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  price: "",
  category: "",
  stock: "",
  image: "",
  description: "",
};

export default function ProductForm({ initialProduct, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialProduct) {
      setForm({
        name: initialProduct.name ?? "",
        price: initialProduct.price ?? "",
        category: initialProduct.category ?? "",
        stock: initialProduct.stock ?? "",
        image: initialProduct.image ?? "",
        description: initialProduct.description ?? "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [initialProduct]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "El nombre es obligatorio.";
    if (!form.price || Number(form.price) <= 0)
      next.price = "Ingresá un precio válido.";
    if (!form.category.trim()) next.category = "La categoría es obligatoria.";
    if (form.stock === "" || Number(form.stock) < 0)
      next.stock = "Ingresá un stock válido.";
    if (!form.description.trim())
      next.description = "Agregá una descripción breve.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      stock: Number(form.stock),
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      description: form.description.trim(),
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <label htmlFor="name">Nombre del producto</label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={handleChange("name")}
          placeholder="Ej: Zapatillas Runner Veloz X3"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-row form-row--split">
        <div>
          <label htmlFor="price">Precio (ARS)</label>
          <input
            id="price"
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={handleChange("price")}
            placeholder="0"
          />
          {errors.price && <span className="form-error">{errors.price}</span>}
        </div>
        <div>
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange("stock")}
            placeholder="0"
          />
          {errors.stock && <span className="form-error">{errors.stock}</span>}
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="category">Categoría</label>
        <input
          id="category"
          type="text"
          value={form.category}
          onChange={handleChange("category")}
          placeholder="Ej: Tecnología"
        />
        {errors.category && (
          <span className="form-error">{errors.category}</span>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="image">URL de imagen (opcional)</label>
        <input
          id="image"
          type="text"
          value={form.image}
          onChange={handleChange("image")}
          placeholder="https://..."
        />
      </div>

      <div className="form-row">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={handleChange("description")}
          placeholder="Describí el producto brevemente..."
        />
        {errors.description && (
          <span className="form-error">{errors.description}</span>
        )}
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn--primary">
          {initialProduct ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}