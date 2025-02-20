import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
    const params= useParams()
    const [validationErrors, setValidationErrors] = useState({});
    const [products, setProducts] = useState([]);

    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const product = Object.fromEntries(formData.entries());

        if(!product.name || !product.category || !product.price || !product.description) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/products/${params.id}`, {
                method: 'PATCH',
                body: formData // Send FormData directly
            });

            if(response.ok){
                alert("Product updated successfully!");
                navigate('/seller/ProductList');
            } else {
                throw new Error('Failed to update product');
            }
        } catch(error) {
            console.error('Error updating product:', error);
            alert("Unable to update product. Please try again.");
        }
    }

    return (
        <div className="container my-4">
            <div className="row">
                <div claaName="col-md-8-auto rounded border p-4">
                    <h2 className="text-center mb-5">Edit Product</h2>
                    <div className="row mb-3">
                            <label className="col-s-4 col-form-label">ID</label>
                            <div className="col-sm-8">
                                <input  readOnly className="form-control-plaintext" defaultValue={params.id} />
                            </div>
                        </div>
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <label className="col-s-4 col-form-label">Name</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="name" />
                                <span className="text-danger">{validationErrors.name}</span>
                            </div>
                        </div>
                        <div className="col-sm-8">
                            <label className="col-s-4 col-form-label">Category</label>
                            <select className="form-control" name="category" required>
                                <option value="">Select Category</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Mobiles">Mobiles</option>
                                <option value="Grocery">Grocery</option>
                            </select>
                        </div>
                        <div className="row mb-3">
                            <label className="col-s-4 col-form-label">Price</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="price" />
                                <span className="text-danger">{validationErrors.price}</span>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-s-4 col-form-label">Description</label>
                            <div className="col-sm-8">
                                <textarea className="form-control" name="description"></textarea>
                                <span className="text-danger">{validationErrors.description}</span>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="offset-sm-4 col-sm-8">
                                <img src={"http://localhost:3001/images/" + "IceCream.jpg"} width="150" alt="..." className="img-thumbnail" />
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-s-4 col-form-label">Created At</label>
                            <div className="col-sm-8">
                                <input readOnly className="form-control-plaintext" defaultValue={"2023-07-13"} />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <label className="col-s-4 col-form-label">Image</label>
                            <div className="col-sm-8">
                                <input type="file" className="form-control" name="image" />
                                <span className="text-danger">{validationErrors.image}</span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="offset-sm-4 col-sm-4 d-grid">
                            <button className="btn btn-primary" type="submit">Submit</button>
                            </div>
                        </div>
                        <div className="col-sm-4 d-grid">
                            <Link className="btn btn-secondary" to="/seller/dashboard" role="button">Cancel</Link>
                        </div>
                    </form>
            </div>
        </div>
    </div>
    )
}