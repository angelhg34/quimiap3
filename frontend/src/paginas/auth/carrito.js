import React, { useState, useEffect } from 'react';
import Header from '../../componentes/header1';
import Footer from '../../componentes/footer';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Swal from 'sweetalert2';

const CarritoPage = () => {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    // Obtener el carrito desde el almacenamiento local
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  // Función para aumentar la cantidad del producto
  const aumentarCantidad = (id) => {
    const nuevoCarrito = carrito.map(p =>
      p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Actualiza el almacenamiento local
  };

  // Función para disminuir la cantidad del producto
  const disminuirCantidad = (id) => {
    const nuevoCarrito = carrito.map(p =>
      p.id === id ? { ...p, cantidad: p.cantidad > 1 ? p.cantidad - 1 : 1 } : p
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Actualiza el almacenamiento local
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter(p => p.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Actualiza el almacenamiento local
  };

  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    Swal.fire({
      title: '¿Está seguro de que desea vaciar el carrito?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Vaciar carrito',
      denyButtonText: 'No vaciar',
      cancelButtonText: 'Cancelar', // Texto del botón de cancelar
      confirmButtonColor: '#3085d6', // Color azul para el botón de vaciar carrito
    }).then((result) => {
      if (result.isConfirmed) {
        // Vaciar el carrito y eliminar del localStorage
        setCarrito([]);
        localStorage.removeItem('carrito');
        Swal.fire({
          title: '¡Carrito vacío!',
          icon: 'success',
          text: 'El carrito se ha vaciado exitosamente.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Color del botón en la alerta de éxito
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Carrito no vaciado',
          text: 'El carrito no ha sido modificado.',
          icon: 'info',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Color del botón en la alerta de "No vaciar"
        });
      }
    });
  };
  // Función para calcular el subtotal
  const calcularSubtotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio_unitario * producto.cantidad), 0);
  };

  // Función para calcular la cantidad total
  const calcularCantidadTotal = () => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  };
  const confirmarPedido = () => {
    Swal.fire({
      title: '¿Desea confirmar el pedido?',
      text: 'Una vez confirmado, no podrá realizar cambios.',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirmar Pedido',
      denyButtonText: 'Cancelar Pedido',
      cancelButtonText: 'Cancelar', // Texto del botón de cancelar
      confirmButtonColor: '#3085d6', // Color azul para el botón de confirmar pedido
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para procesar el pedido
        Swal.fire({
          title: 'Pedido Confirmado!',
          text: 'Tu pedido ha sido confirmado exitosamente.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Color del botón en la alerta de éxito
        }).then(() => {
          // Redirige a la página de confirmación o inicio
          navigate('/confirmarpedido.js'); // Cambia a la ruta deseada
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Pedido Cancelado',
          text: 'Tu pedido no ha sido realizado.',
          icon: 'info',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Color del botón en la alerta de "Cancelar Pedido"
        });
      }
    });
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Carrito de Compras</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(carrito) && carrito.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No hay productos en el carrito.</td>
                </tr>
              ) : (
                carrito.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>${producto.precio_unitario}</td>
                    <td>
                      <button onClick={() => disminuirCantidad(producto.id)} className="btn btn-sm btn-danger">-</button>
                      <span className="mx-2">{producto.cantidad}</span>
                      <button onClick={() => aumentarCantidad(producto.id)} className="btn btn-sm btn-success">+</button>
                    </td>
                    <td>
                      <button onClick={() => eliminarProducto(producto.id)} className="btn btn-sm btn-danger">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <h4>Subtotal: ${calcularSubtotal()}</h4>
              <h4>Cantidad Total: {calcularCantidadTotal()}</h4> {/* Cantidad Total agregada aquí */}
              <button onClick={vaciarCarrito} className="btn btn-danger mt-2">Vaciar Carrito</button>
            </div>
            <button onClick={() => navigate('/')} className="btn btn-success mt-2">Seguir Comprando</button>
            <button onClick={confirmarPedido} className="btn btn-primary mt-2">Confirmar Pedido</button>
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default CarritoPage;
