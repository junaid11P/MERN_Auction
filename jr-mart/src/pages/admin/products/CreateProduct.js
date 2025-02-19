import { Link, useNavigate } from "react-router-dom";

export default function CreateProduct() {

    const navigate = useNavigate()

    async function handleSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const product = Object.fromEntries(formData.entries());
        if(!product.name || !product.category || !product.price || !product.description || !product.image.name) {
            alert("Please fill all fields");
            return;
        }

        try{
            const response = await fetch('http://localhost:3000/products', {
                method: 'POST',
                body: formData
            })

            const data = await response.json();
            if(response.ok){
                //Product created successfully
                navigate('/admin/products');
            }
            else if(response.status === 400){
                alert("Validation error");
            }
            else{
                alert("Unable to create product");
            }

        }
        catch(error){
            alert("Unable to connect to server");
        }

    }

    return (
        <div className="container my-4">
            <div className="row">
                <div claaName="col-md-8-auto rounded border p-4">
                    <h2 className="text-center mb-5">Create Product</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <label className="col-s-4 col-form-label">Name</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="name" />
                                <span className="text-danger"></span>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-s-4 col-form-label">Category</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="category" />
                                <span className="text-danger"></span>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-s-4 col-form-label">Price</label>
                            <div className="col-sm-8">
                                <input className="form-control" name="price" />
                                <span className="text-danger"></span>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-s-4 col-form-label">Description</label>
                            <div className="col-sm-8">
                                <textarea className="form-control" name="description"></textarea>
                                <span className="text-danger"></span>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <label className="col-s-4 col-form-label">Image</label>
                            <div className="col-sm-8">
                                <input type="file" className="form-control" name="image" />
                                <span className="text-danger"></span>
                            </div>
                        </div>
                        <div className="col-sm-4 d-grid">
                            <button className="btn btn-primary" type="submit">Submit</button>
                        </div>
                        <div className="col-sm-4 d-grid">
                            <Link className="btn btn-secondary" to="/admin/products" role="button">Cancel</Link>
                        </div>
                    </form>
            </div>
        </div>
    </div>
    )
}