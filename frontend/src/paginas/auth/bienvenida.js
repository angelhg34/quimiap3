import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/style_bienvenida.css';
import Header from "../../componentes/header1";
import Footer from "../../componentes/footer";
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';


const Bienvenida = () => {
  const [productos, setProductos] = useState([]);
  // El estado carrito está declarado pero no se usa actualmente
  // const [carrito, setCarrito] = useState([]);

  // Función para obtener productos de la API
  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Products');
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
    // Puedes descomentar la siguiente línea si decides usar el estado carrito en el futuro
    // const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    // setCarrito(carritoGuardado);
  }, []);

  // Función para agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    Swal.fire({
      title: '¿Desea agregar este producto al carrito?',
      text: `${producto.nombre} será añadido al carrito de compras.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Agregar al carrito',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6', // Color del botón de confirmar
      cancelButtonColor: '#d33', // Color del botón de cancelar
    }).then((result) => {
      if (result.isConfirmed) {
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
        const productoEnCarrito = carritoGuardado.find(p => p.id === producto.id);
  
        let nuevoCarrito;
        if (productoEnCarrito) {
          nuevoCarrito = carritoGuardado.map(p =>
            p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
          );
        } else {
          nuevoCarrito = [...carritoGuardado, { ...producto, cantidad: 1 }];
        }
  
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        // Actualiza el estado del carrito si lo estás usando en el futuro
        // setCarrito(nuevoCarrito);
  
        Swal.fire({
          title: '¡Producto agregado!',
          text: `${producto.nombre} ha sido agregado al carrito.`,
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Color del botón de confirmar
        }).then(() => {
          console.log('Carrito después de agregar:', nuevoCarrito);
        });
      } else {
        Swal.fire({
          title: 'Acción cancelada',
          text: 'El producto no fue agregado al carrito.',
          icon: 'info',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Color del botón de confirmar
        });
      }
    });
  };
  return (
    <div>
      <Header />
      {/* Hero Section */}
      <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/img/carrusel-images/supersale.jpg" className="d-block w-100" alt="Oferta 1" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Hasta 30% de Descuento en Productos de Cuidado de ropa</h5>
              <p>Exclusivo para compras en app, web y domicilios.</p>
              <Link to="#" className="btn btn-danger">Compra Aquí</Link>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/img/carrusel-images/pngtree-sale-promotion-50-off-image_914144.png" className="d-block w-100" alt="Oferta 2" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Hasta 50% de Descuento en Hogar y Limpieza</h5>
              <p>Oferta válida hasta fin de mes.</p>
              <Link to="#" className="btn btn-danger">Compra Aquí</Link>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {/* Categorías */}
      <section className="categories-section">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3">
              <Link to="#" className="category-link">
                <div className="category-icon">
                  <i className="bi bi-person-standing-dress" />
                </div>
                <div className="category-text">
                  Cuidado de la Ropa
                </div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link to="#" className="category-link">
                <div className="category-icon">
                  <i className="bi bi-house-door" />
                </div>
                <div className="category-text">
                  Hogar y Limpieza
                </div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link to="#" className="category-link">
                <div className="category-icon">
                  <i className="bi bi-square" />
                </div>
                <div className="category-text">
                  Cuidado de Pisos
                </div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link to="#" className="category-link">
                <div className="category-icon">
                  <i className="bi bi-shield-check" />
                </div>
                <div className="category-text">
                  Desinfectantes
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Productos destacados */}
      <section className="products-section">
        <div className="container">
          <h2 className="text-center mb-4">Productos Destacados</h2>
          <div className="row">
            {productos.slice(0, 4).map((producto) => (
              <div className="col-md-3" key={producto.id}>
                <div className="card product-card">
                  <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text"><strong>${producto.precio_unitario}</strong></p>
                    <button onClick={() => agregarAlCarrito(producto)} className="btn btn-outline-primary">
                      <i className="bi bi-cart" /> Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Segunda sección de productos */}
      <section className="products-section">
        <div className="container">
          <div className="row">
            {productos.slice(4, 8).map((producto) => (
              <div className="col-md-3" key={producto.id}>
                <div className="card product-card">
                  <div className="card-body">
                    <h5 className="card-title">{producto.nombre}</h5>
                    <p className="card-text"><strong>${producto.precio_unitario}</strong></p>
                    <button onClick={() => agregarAlCarrito(producto)} className="btn btn-outline-primary">
                      <i className="bi bi-cart" /> Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Bienvenida;
