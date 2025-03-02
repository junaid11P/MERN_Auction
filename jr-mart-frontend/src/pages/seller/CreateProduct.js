import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateProduct() {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError(null);
        setLoading(true);
        
        const formData = new FormData(event.target);
        const product = Object.fromEntries(formData.entries());

        // Validation
        if(!product.name || !product.category || !product.price || !product.description || !product.image.size) {
            setError("Please fill all fields");
            setLoading(false);
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?._id) {
                throw new Error('User not authenticated');
            }

            formData.append('sellerId', user._id);

            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if(response.ok) {
                alert("Product created successfully!");
                // Changed navigation to ProductList
                navigate('/seller/ProductList', { 
                    state: { 
                        success: true,
                        message: 'Product created successfully!'
                    }
                });
            } else {
                throw new Error(data.message || 'Failed to create product');
            }
        } catch(error) {
            console.error('Error:', error);
            setError(error.message || "Unable to create product. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleImageChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-8 rounded border p-4">
                    <h2 className="text-center mb-4">Create Product</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="name" 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <select className="form-control" name="category" required>
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
                                accept="image/*"
                                onChange={handleImageChange}
                                required 
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
                            <button className="btn btn-primary" type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Product'}
                            </button>
                            <Link 
                                className="btn btn-secondary" 
                                to="/seller/dashboard"
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