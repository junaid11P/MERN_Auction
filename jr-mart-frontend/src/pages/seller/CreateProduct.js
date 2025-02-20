import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateProduct() {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);

    async function handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const product = Object.fromEntries(formData.entries());

        // Validate form data
        if(!product.name || !product.category || !product.price || !product.description || !product.image.size) {
            alert("Please fill all fields");
            return;
        }

        try {
            // Send form data directly to server
            const response = await fetch('http://localhost:3001/products', {
                method: 'POST',
                body: formData // Send FormData directly
            });

            if(response.ok){
                alert("Product created successfully!");
                navigate('/seller/ProductList');
            } else {
                throw new Error('Failed to create product');
            }
        } catch(error) {
            console.error('Error creating product:', error);
            alert("Unable to create product. Please try again.");
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
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" type="submit">
                                Create Product
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