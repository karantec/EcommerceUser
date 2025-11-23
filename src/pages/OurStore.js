import React, { useEffect, useMemo, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../features/products/productSlilce";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";

const OurStore = () => {
  const [grid, setGrid] = useState(3);
  const [filterOpen, setFilterOpen] = useState(false);
  const productState = useSelector((state) => state?.product?.product) || [];
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  const [search, setSearch] = useState("");
  const [tag, setTag] = useState(null);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState(null);

  const dispatch = useDispatch();

  // Fetch products (initial + when sort/tag/etc change if you want server filtering)
  useEffect(() => {
    // If your backend supports server-side filtering pass the filters here.
    // For robust UI we still do client-side filtering below.
    dispatch(getAllProducts({ sort, tag, brand, category, minPrice: minPrice || null, maxPrice: maxPrice || null, search }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, sort, tag, brand, category, minPrice, maxPrice, search]);

  // Extract unique brands/categories/tags from productState
  useEffect(() => {
    const b = new Set();
    const c = new Set();
    const t = new Set();

    productState.forEach((p) => {
      if (p?.brand) b.add(p.brand);
      if (p?.category) c.add(p.category);
      if (Array.isArray(p?.tags)) {
        p.tags.forEach((x) => x && t.add(x));
      } else if (p?.tags) {
        t.add(p.tags);
      }
    });

    setBrands(Array.from(b));
    setCategories(Array.from(c));
    setTags(Array.from(t));
  }, [productState]);

  // keep page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, tag, category, brand, minPrice, maxPrice, sort]);

  // responsive grid and filter overlay
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 992) {
        setFilterOpen(false);
        setGrid(3);
      } else if (width >= 768) {
        setFilterOpen(false);
        setGrid(6);
      } else {
        setGrid(6);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // prevent body scroll when filter open on mobile
  useEffect(() => {
    document.body.style.overflow = filterOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [filterOpen]);

  const clearFilters = () => {
    setSearch("");
    setTag(null);
    setCategory(null);
    setBrand(null);
    setMinPrice("");
    setMaxPrice("");
    setSort(null);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(search) || tag || category || brand || minPrice || maxPrice;

  // ---------- CLIENT-SIDE FILTERING ----------
  const filteredProducts = useMemo(() => {
    // parse price values safely
    const min = minPrice === "" || minPrice === null ? null : Number(minPrice);
    const max = maxPrice === "" || maxPrice === null ? null : Number(maxPrice);
    const q = (search || "").trim().toLowerCase();

    return productState.filter((p) => {
      if (!p) return false;

      // search: check title/name/description (adjust fields to your product schema)
      if (q) {
        const title = (p.title || p.name || "").toString().toLowerCase();
        const desc = (p.description || "").toString().toLowerCase();
        if (!title.includes(q) && !desc.includes(q)) return false;
      }

      if (tag) {
        if (Array.isArray(p.tags)) {
          if (!p.tags.map(String).some((x) => x.toLowerCase() === String(tag).toLowerCase()))
            return false;
        } else {
          if (!p.tags || String(p.tags).toLowerCase() !== String(tag).toLowerCase())
            return false;
        }
      }

      if (category && String(p.category).toLowerCase() !== String(category).toLowerCase())
        return false;

      if (brand && String(p.brand).toLowerCase() !== String(brand).toLowerCase()) return false;

      // price filter: ensure numeric price field exists; adjust `price` if your field differs
      const price = Number(p.price ?? p?.variantPrice ?? NaN);
      if (!Number.isNaN(price)) {
        if (min !== null && !Number.isNaN(min) && price < min) return false;
        if (max !== null && !Number.isNaN(max) && price > max) return false;
      }

      return true;
    });
  }, [productState, search, tag, category, brand, minPrice, maxPrice]);

  // SORT client-side if needed (simple example)
  const sortedProducts = useMemo(() => {
    if (!sort) return filteredProducts;
    const copy = [...filteredProducts];
    switch (sort) {
      case "title":
        return copy.sort((a, b) => (String(a.title || a.name || "") > String(b.title || b.name || "") ? 1 : -1));
      case "-title":
        return copy.sort((a, b) => (String(a.title || a.name || "") < String(b.title || b.name || "") ? 1 : -1));
      case "price":
        return copy.sort((a, b) => (Number(a.price || 0) - Number(b.price || 0)));
      case "-price":
        return copy.sort((a, b) => (Number(b.price || 0) - Number(a.price || 0)));
      case "createdAt":
        return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "-createdAt":
        return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return copy;
    }
  }, [filteredProducts, sort]);

  // ---------- PAGINATION ----------
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / productsPerPage));
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextPage = () => {
    if (currentPage < totalPages) paginate(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) paginate(currentPage - 1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <>
      <Meta title={"Our Store"} />
      <BreadCrumb title="Our Store" />
      <Container class1="store-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12 d-lg-none mb-3">
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn btn-outline-secondary d-flex align-items-center gap-2 flex-grow-1"
                onClick={() => setFilterOpen(true)}
              >
                <FiFilter /> Filters
                {hasActiveFilters && (
                  <span className="badge bg-primary rounded-pill ms-1">
                    {
                      [search, tag, category, brand, minPrice, maxPrice].filter(
                        Boolean
                      ).length
                    }
                  </span>
                )}
              </button>
              {hasActiveFilters && (
                <button
                  className="btn btn-outline-danger"
                  onClick={clearFilters}
                  title="Clear filters"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          </div>

          {filterOpen && (
            <div
              className="filter-overlay d-lg-none"
              onClick={() => setFilterOpen(false)}
            />
          )}

          <div
            className={`col-lg-3 filter-sidebar ${filterOpen ? "open" : ""}`}
          >
            <div className="filter-sidebar-header d-lg-none d-flex justify-content-between align-items-center p-3 border-bottom sticky-top bg-white">
              <h5 className="mb-0">Filters</h5>
              <button
                className="btn btn-link p-0 text-dark"
                onClick={() => setFilterOpen(false)}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="filter-sidebar-content">
              {hasActiveFilters && (
                <div className="mb-3 px-3 px-lg-0">
                  <button
                    className="btn btn-outline-danger btn-sm w-100"
                    onClick={clearFilters}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              <div className="filter-card mb-3">
                <h3 className="filter-title">Shop By Categories</h3>
                <ul className="ps-0">
                  <li
                    onClick={() => {
                      setCategory(null);
                      setFilterOpen(false);
                    }}
                    className={!category ? "active" : ""}
                  >
                    All Products
                  </li>
                  {categories &&
                    categories.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setCategory(item);
                          setFilterOpen(false);
                        }}
                        className={category === item ? "active" : ""}
                      >
                        {item}
                      </li>
                    ))}
                </ul>
              </div>

              <div className="filter-card mb-3">
                <h3 className="filter-title">Filter By</h3>
                <h5 className="sub-title">Price</h5>
                <div className="d-flex align-items-center gap-2 price-inputs flex-column flex-sm-row">
                  <div className="form-floating flex-grow-1 w-100">
                    <input
                      type="number"
                      className="form-control"
                      id="floatingInput"
                      placeholder="From"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <label htmlFor="floatingInput">From</label>
                  </div>
                  <div className="form-floating flex-grow-1 w-100">
                    <input
                      type="number"
                      className="form-control"
                      id="floatingInput1"
                      placeholder="To"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                    <label htmlFor="floatingInput1">To</label>
                  </div>
                </div>

                <div className="mt-4 mb-3">
                  <h3 className="sub-title">Product Tags</h3>
                  <div className="product-tags d-flex flex-wrap align-items-center gap-2">
                    {tags &&
                      tags.map((item, index) => (
                        <span
                          key={index}
                          onClick={() => {
                            setTag(item === tag ? null : item);
                            setFilterOpen(false);
                          }}
                          className={`text-capitalize badge bg-light text-secondary rounded-3 py-2 px-3 ${
                            tag === item ? "active-tag" : ""
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="mt-4 mb-3">
                  <h3 className="sub-title">Product Brands</h3>
                  <div className="product-tags d-flex flex-wrap align-items-center gap-2">
                    {brands &&
                      brands.map((item, index) => (
                        <span
                          key={index}
                          onClick={() => {
                            setBrand(item === brand ? null : item);
                            setFilterOpen(false);
                          }}
                          className={`text-capitalize badge bg-light text-secondary rounded-3 py-2 px-3 ${
                            brand === item ? "active-tag" : ""
                          }`}
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9 col-12">
            <div className="filter-sort-grid mb-4">
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
                <div className="d-flex align-items-center gap-2 sort-wrapper w-100 w-sm-auto">
                  <p className="mb-0 d-none d-sm-block sort-label text-nowrap">
                    Sort By:
                  </p>
                  <select
                    className="form-control form-select"
                    onChange={(e) => setSort(e.target.value)}
                    defaultValue=""
                  >
                    <option value="">Manual</option>
                    <option value="title">Alphabetically, A-Z</option>
                    <option value="-title">Alphabetically, Z-A</option>
                    <option value="price">Price, low to high</option>
                    <option value="-price">Price, high to low</option>
                    <option value="createdAt">Date, old to new</option>
                    <option value="-createdAt">Date, new to old</option>
                  </select>
                </div>

                {/* --- SEARCH INPUT --- */}
                <div className="d-flex align-items-center gap-2 w-100 w-sm-auto">
                  <div className="input-group" style={{ minWidth: 220 }}>
                    <span className="input-group-text">
                      <FiSearch />
                    </span>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      aria-label="Search products"
                    />
                    {search && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => setSearch("")}
                        title="Clear search"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 gap-sm-3 w-100 w-sm-auto justify-content-between">
                  <p className="totalproducts mb-0">
                    {filteredProducts.length} Product
                    {filteredProducts.length !== 1 ? "s" : ""}
                  </p>
                  <div className="d-none d-lg-flex gap-2 align-items-center grid">
                    <img
                      onClick={() => setGrid(3)}
                      src="images/gr4.svg"
                      className={`d-block img-fluid grid-icon ${grid === 3 ? "active" : ""}`}
                      alt="4 columns"
                      title="4 columns"
                    />
                    <img
                      onClick={() => setGrid(4)}
                      src="images/gr3.svg"
                      className={`d-block img-fluid grid-icon ${grid === 4 ? "active" : ""}`}
                      alt="3 columns"
                      title="3 columns"
                    />
                    <img
                      onClick={() => setGrid(6)}
                      src="images/gr2.svg"
                      className={`d-block img-fluid grid-icon ${grid === 6 ? "active" : ""}`}
                      alt="2 columns"
                      title="2 columns"
                    />
                    <img
                      onClick={() => setGrid(12)}
                      src="images/gr.svg"
                      className={`d-block img-fluid grid-icon ${grid === 12 ? "active" : ""}`}
                      alt="1 column"
                      title="List view"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="products-list pb-3">
              <div className="products-container">
                <ProductCard data={currentProducts} grid={grid} />
              </div>
            </div>

            {totalPages > 1 && (
              <div className="pagination-wrapper">
                <nav aria-label="Product pagination">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={prevPage} disabled={currentPage === 1} aria-label="Previous">
                        <FiChevronLeft />
                      </button>
                    </li>

                    {getPageNumbers().map((number, index) => (
                      <li key={index} className={`page-item ${number === currentPage ? "active" : ""} ${number === "..." ? "disabled" : ""}`}>
                        {number === "..." ? (
                          <span className="page-link">...</span>
                        ) : (
                          <button className="page-link" onClick={() => paginate(number)}>
                            {number}
                          </button>
                        )}
                      </li>
                    ))}

                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={nextPage} disabled={currentPage === totalPages} aria-label="Next">
                        <FiChevronRight />
                      </button>
                    </li>
                  </ul>
                </nav>

                <div className="pagination-info text-center mt-2">
                  <small className="text-muted">
                    Showing {sortedProducts.length === 0 ? 0 : indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} products
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
 <style>{`
        /* ========== PRODUCTS CONTAINER - CRITICAL FIX ========== */
        .products-container {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          margin: 0 -8px;
        }
        
        /* ========== FILTER SIDEBAR ========== */
        .filter-sidebar {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @media (max-width: 991.98px) {
          .filter-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 90%;
            max-width: 360px;
            height: 100vh;
            background: #fff;
            z-index: 1050;
            transform: translateX(-100%);
            overflow-y: auto;
            box-shadow: 2px 0 20px rgba(0,0,0,0.2);
          }
          .filter-sidebar.open {
            transform: translateX(0);
          }
          .filter-sidebar-content {
            padding: 15px;
          }
        }
        
        @media (min-width: 768px) and (max-width: 991.98px) {
          .filter-sidebar {
            max-width: 400px;
          }
          .filter-card {
            padding: 20px;
          }
        }
        
        @media (min-width: 992px) {
          .filter-sidebar-header {
            display: none !important;
          }
          .filter-sidebar-content {
            padding: 0;
          }
        }
        
        .filter-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 1040;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* ========== SORT & FILTER BAR ========== */
        .filter-sort-grid {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 20px;
        }
        
        .sort-wrapper {
          min-width: 0;
        }
        
        .sort-wrapper .form-select {
          min-width: 200px;
          font-size: 14px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 8px 12px;
        }
        
        .sort-label {
          font-weight: 500;
          color: #555;
        }
        
        @media (max-width: 575.98px) {
          .sort-wrapper .form-select {
            width: 100%;
            min-width: 0;
            font-size: 13px;
          }
          
          .filter-sort-grid {
            padding: 12px;
            margin-bottom: 15px;
          }
        }
        
        /* ========== GRID VIEW CONTROLS ========== */
        .grid {
          gap: 10px;
        }
        
        .grid-icon {
          cursor: pointer;
          opacity: 0.4;
          transition: all 0.2s ease;
          width: 22px;
          height: 22px;
          filter: grayscale(100%);
        }
        
        .grid-icon:hover {
          opacity: 0.7;
          transform: scale(1.1);
        }
        
        .grid-icon.active {
          opacity: 1;
          filter: grayscale(0%);
        }
        
        @media (max-width: 991.98px) {
          .grid {
            display: none !important;
          }
        }
        
        /* ========== FILTER TAGS ========== */
        .product-tags {
          gap: 8px;
        }
        
        .product-tags span {
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
          white-space: nowrap;
          border: 1px solid #dee2e6;
        }
        
        .product-tags span:hover {
          background-color: #3a4a5e !important;
          color: #fff !important;
          transform: translateY(-2px);
          border-color: #3a4a5e;
        }
        
        .product-tags span.active-tag {
          background-color: #232f3e !important;
          color: #fff !important;
          font-weight: 500;
          border-color: #232f3e;
        }
        
        /* ========== CATEGORY LIST ========== */
        .filter-card ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .filter-card ul li {
          cursor: pointer;
          padding: 10px 12px;
          margin: 4px 0;
          transition: all 0.2s ease;
          color: #555;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .filter-card ul li:hover {
          background-color: #f0f0f0;
          color: #232f3e;
          padding-left: 16px;
        }
        
        .filter-card ul li.active {
          background-color: #232f3e;
          color: #fff;
          font-weight: 600;
        }
        
        /* ========== PRICE INPUTS ========== */
        .price-inputs {
          gap: 10px;
        }
        
        .price-inputs .form-floating {
          min-width: 0;
        }
        
        .price-inputs .form-control {
          width: 100%;
          font-size: 14px;
          border-radius: 8px;
        }
        
        .price-inputs .form-floating label {
          font-size: 13px;
        }
        
        /* ========== FILTER CARD ========== */
        .filter-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          border: 1px solid #e9ecef;
        }
        
        .filter-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 15px;
          color: #232f3e;
          border-bottom: 2px solid #232f3e;
          padding-bottom: 8px;
        }
        
        .sub-title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #555;
        }
        
        /* ========== PRODUCTS COUNT ========== */
        .totalproducts {
          font-size: 14px;
          font-weight: 600;
          color: #232f3e;
          background: #fff;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid #dee2e6;
        }
        
        /* ========== PAGINATION ========== */
        .pagination-wrapper {
          padding: 30px 0 20px;
        }
        
        .pagination {
          gap: 6px;
          margin-bottom: 10px;
        }
        
        .page-item {
          list-style: none;
        }
        
        .page-link {
          border: 2px solid #dee2e6;
          background: #fff;
          color: #232f3e;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease;
          cursor: pointer;
          min-width: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .page-link:hover:not(.disabled) {
          background: #232f3e;
          color: #fff;
          border-color: #232f3e;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .page-item.active .page-link {
          background: #232f3e;
          color: #fff;
          border-color: #232f3e;
          font-weight: 600;
        }
        
        .page-item.disabled .page-link {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f8f9fa;
        }
        
        .pagination-info {
          font-size: 14px;
        }
        
        @media (max-width: 575.98px) {
          .pagination-wrapper {
            padding: 20px 0 15px;
          }
          
          .pagination {
            gap: 4px;
            flex-wrap: wrap;
          }
          
          .page-link {
            padding: 6px 10px;
            font-size: 13px;
            min-width: 36px;
          }
          
          .pagination-info {
            font-size: 12px;
          }
          
          .store-wrapper {
            padding: 15px 0 !important;
          }
          
          .filter-card {
            padding: 15px;
            margin-bottom: 12px !important;
          }
          
          .filter-title {
            font-size: 16px;
            padding-bottom: 6px;
          }
          
          .sub-title {
            font-size: 14px;
            margin-bottom: 10px;
          }
          
          .product-tags span {
            font-size: 12px;
            padding: 6px 10px !important;
          }
          
          .totalproducts {
            font-size: 12px;
            padding: 5px 10px;
          }
          
          .price-inputs {
            gap: 8px;
          }
          
          .filter-card ul li {
            padding: 8px 10px;
            font-size: 13px;
          }
          
          .products-container {
            margin: 0 -5px;
          }
        }
        
        @media (max-width: 399.98px) {
          .filter-sidebar {
            width: 95%;
          }
          
          .filter-card {
            padding: 12px;
          }
          
          .filter-title {
            font-size: 15px;
          }
          
          .sub-title {
            font-size: 13px;
          }
          
          .product-tags span {
            font-size: 11px;
            padding: 5px 8px !important;
          }
          
          .filter-card ul li {
            font-size: 12px;
            padding: 7px 10px;
          }
          
          .products-container {
            margin: 0 -4px;
          }
        }
        
        @media (min-width: 768px) and (max-width: 991.98px) {
          .filter-sort-grid {
            padding: 15px 18px;
          }
          
          .sort-wrapper .form-select {
            min-width: 180px;
          }
          
          .products-container {
            margin: 0 -6px;
          }
        }
        
        @media (min-width: 1200px) {
          .filter-card {
            padding: 25px;
          }
          
          .filter-title {
            font-size: 20px;
          }
          
          .sub-title {
            font-size: 16px;
          }
          
          .filter-card ul li {
            padding: 12px 14px;
            font-size: 15px;
          }
        }
        
        .filter-sidebar {
          scroll-behavior: smooth;
        }
        
        .filter-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        
        .filter-sidebar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .filter-sidebar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        
        .filter-sidebar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        .filter-card ul li:focus,
        .product-tags span:focus,
        .grid-icon:focus,
        .page-link:focus {
          outline: 2px solid #232f3e;
          outline-offset: 2px;
        }
        
        .btn {
          transition: all 0.2s ease;
          font-weight: 500;
        }
        
        .btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .btn:active {
          transform: translateY(0);
        }
        
        .btn-outline-secondary {
          border-width: 2px;
        }
        
        .btn-outline-danger {
          border-width: 2px;
        }
      `}</style>
      {/* --- keep your styles (omitted here for brevity in this paste) --- */}
    </>
  );
};

export default OurStore;
