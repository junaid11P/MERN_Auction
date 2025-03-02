import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [product, setProduct] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        image: ''
    });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/products/${id}`);
            if (!response.ok) {
                throw new Error('Product not found');
            }
            const data = await response.json();
            setProduct(data.product);
            setImagePreview(`http://localhost:3001${data.product.image}`);
        } catch (error) {
            console.error('Error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        
        const formData = new FormData(event.target);
        
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?._id) {
                throw new Error('User not authenticated');
            }

            formData.append('sellerId', user._id);

            const response = await fetch(`http://localhost:3001/api/products/${id}`, {
                method: 'PATCH',
                body: formData
            });

            const data = await response.json();

            if(response.ok) {
                navigate('/seller/ProductList', {
                    state: { 
                        success: true,
                        message: 'Product updated successfully!'
                    }
                });
            } else {
                throw new Error(data.message || 'Failed to update product');
            }
        } catch(error) {
            console.error('Error:', error);
            setError(error.message || "Unable to update product. Please try again.");
        }
    }

    if (loading) return <div className="container my-4">Loading...</div>;
    if (error) return <div className="container my-4 alert alert-danger">{error}</div>;

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-8 rounded border p-4">
                    <h2 className="text-center mb-4">Edit Product</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input 
                                type="text"
                                className="form-control"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <select 
                                className="form-control"
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Mobiles">Mobiles</option>
                                <option value="Grocery">Grocery</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Price</label>
                            <input 
                                type="number"
                                className="form-control"
                                name="price"
                                value={product.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <textarea 
                                className="form-control"
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                rows="3"
                                required
                            ></textarea>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Image</label>
                            <input 
                                type="file"
                                className="form-control"
                                name="image"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                            {imagePreview && (
                                <img 
                                    src={imagePreview}
                                    alt="Preview"
                                    className="mt-2"
                                    style={{ maxWidth: '200px' }}
                                />
                            )}
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="d-flex gap-2">
                            <button 
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update Product'}
                            </button>
                            <Link 
                                to="/seller/ProductList"
                                className="btn btn-secondary"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}