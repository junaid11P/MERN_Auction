import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="container my-4">Loading...</div>;
    }

    return (
        <div className="container my-4">

            <h2 className="text-center mb-4">Products</h2>

            <div className="row mb-3">
                <div className="col">
                    <Link className="btn btn-primary me-1" to="/seller/CreateProduct" role="button">Create Product</Link>
                    <button type="button" className="btn btn-outline-primary"
                        onClick={() => {
                            setLoading(true);
                            fetch('http://localhost:3001/products')
                                .then(res => res.json())
                                .then(data => {
                                    setProducts(Array.isArray(data) ? data : []);
                                    setLoading(false);
                                })
                                .catch(error => {
                                    console.error('Error fetching products:', error);
                                    setLoading(false);
                                });
                        }}>Refresh</button>
                </div>
                <div className="col">

                </div>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product, index) => {
                            return (
                                <tr key={index}>
                                    <td>{product.id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{product.price}$</td>
                                    <td>
                                        <img
                                            src={"http://localhost:3001/images/" + product.imageFilename}
                                            width="80" alt="..."
                                        />
                                    </td>
                                    <td>{product.createdAt.slice(0, 10)}</td>
                                    <td style={{ width: "10px", whiteSpace: "nowrap" }}>
                                        <Link className='btn btn-primary btn-sm me-1'
                                            to={"/seller/EditProduct1" + product.id}>Edit</Link>
                                        <button type="button" className="btn btn-danger btn-sm">Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>


        </div>
    );
}