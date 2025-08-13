import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');

  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);  // new state for preview
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      if (image) formData.append('image', image);

      if (editId) {
        await axios.put(`http://localhost:8080/products/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('http://localhost:8080/products', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      // reset all fields after successful add/update
      setName('');
      setPrice('');
      setImage(null);
      setImagePreview(null);
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = product => {
    setEditId(product._id);
    setName(product.name);
    setPrice(product.price);
    setImage(null);
    setImagePreview(product.imageUrl ? `http://localhost:8080/${product.imageUrl}` : null);
  };

  // When user selects a new image, update image and preview
  const handleImageChange = e => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`http://localhost:8080/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-header">Welcome {userName || 'Guest'} 👋</h1>
      <form className="product-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="product-input"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
          required
          className="product-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="product-file"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, marginTop: 10 }}
          />
        )}
        <button type="submit" className="btn-submit">
          {editId ? 'Update' : 'Add'}
        </button>
      </form>

      {products.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <ul className="product-list">
          {products.map(product => (
            <li key={product._id} className="product-card">
              {product.imageUrl && (
                <img
                  src={`http://localhost:8080/${product.imageUrl}`}
                  alt={product.name}
                  className="product-image"
                />
              )}
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price}</p>
              <div className="product-actions">
                <button onClick={() => handleEdit(product)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(product._id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
