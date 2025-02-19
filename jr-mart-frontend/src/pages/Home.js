export default function Home() {
    return (
        <div className="container-fluid py-5" style={{ backgroundColor: '#f0f0d5' }}>
            {/* Header Section */}
            <div className="container">
                <div className="row mb-4">
                <div className="col-lg-4">
                        <form className="d-flex">
                            <input 
                                className="form-control me-2" 
                                type="search" 
                                placeholder="Search products..." 
                                aria-label="Search"
                            />
                            <button className="btn btn-primary" type="submit">
                                <i className="bi bi-search"></i> Search
                            </button>
                        </form>
                    </div>
                    <div className="col-lg-8">
                        <div className="alert alert-primary shadow-sm">
                            <h2 className="heading">Welcome to JR Mart! 🛒</h2>
                            <h5 className="alert-heading">Everything in 10 MINUTES </h5>
                            <p> Best prices,and superfast delivery! </p>
                        </div>
                    </div>
                    
                </div>

                {/* Featured Categories */}
                <div className="row g-4 mb-4">
                    {['Fashion', 'Grocery', 'Mobiles', 'Laptop'].map((category) => (
                        <div className="col-md-3" key={category}>
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{category}</h5>
                                    <p className="card-text">Explore our {category} collection</p>
                                    <button className="btn btn-outline-primary">Browse</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}