import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
export default function ProductList() {
    const [products, setProducts] = useState([]);

    function getProducts() {
        fetch('http://localhost:3000/products')
        .then(response => {
            if(response.ok){
                return response.json();
            }

            throw new Error()
            
        })
        .then(data => {
            setProducts(data)
        })
        .catch(error => {
            alert("Unable to fetch data")
         })
}

useEffect(getProducts, []);

  return (
    <div className="container my-4">

      <h2 className="text-center mb-4">Products</h2>

      <div className="row mb-3">
        <div className="col">
            <Link className="btn btn-primary me-1" to="/admin/products/create" role="button">Create Product</Link>
            <button type="button" className="btn btn-outline-primary"
            onClick={getProducts}>Refresh</button>
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
                    return(
                        <tr key={index}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{product.price}$</td>
                            <td>
                                <img 
                                    src={"http://localhost:3000/images/" + product.imageFilename}
                                    width="80" alt="..."
                                />
                            </td>
                            <td>{product.createdAt.slice(0,10)}</td>
                            <td style={{width: "10px",whiteSpace: "nowrap"}}>
                                <Link className='btn btn-primary btn-sm me-1'
                                    to={"/admin/products/edit/" + product.id}>Edit</Link>
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