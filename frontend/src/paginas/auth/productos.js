import React, { useEffect, useState } from 'react';
import Header2 from '../../componentes/header2';
import axios from 'axios';
import Swal from 'sweetalert2';

const Productos = () => {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    composicion: '',
    contenido_neto: '',
    usos: '',
    advertencias: '',
    precio_unitario: '',
  });

  const [productos, setProductos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Función para obtener productos de la API
  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Products');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al obtener los productos. products:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error al obtener los productos.',
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Manejar cambio en los campos de formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Función para registrar un nuevo producto
  const handleRegisterProduct = async () => {
    try {
      await axios.post('http://localhost:4000/Products', formData);
      fetchProductos(); // Actualizar la lista de productos
      resetForm();
      Swal.fire({
        title: 'Producto registrado!',
        text: 'Producto registrado exitosamente.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#28a745'
      }).then(() => {
        window.location.href = '/productos.js';
      });
    } catch (error) {
      console.error('Error al registrar el producto', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error al registrar el producto.',
        icon: 'error',
      });
    }
  };

  // Función para editar un producto
  const handleEditProduct = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData(product);
  };

  // Función para actualizar un producto
  const handleUpdateProduct = async () => {
    Swal.fire({
      title: '¿Desea continuar para guardar los cambios?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      denyButtonText: `No Guardar`,
      cancelButtonText: 'Cancelar',  // Cambia el texto del botón de cancelar
      confirmButtonColor: '#3085d6', // Establece el color azul para el botón de guardar
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:4000/Products/${currentProduct.id}`, formData);
          fetchProductos(); // Actualizar la lista de productos
          resetForm();
          setIsEditing(false);
          Swal.fire({
            title:'Producto actualizado con exito!',
            icon:'success'
          }).then(() => {
            Swal.close(); // Cierra la ventana de alerta de confirmación
            window.location.href = '/productos.js';
          });
        } catch (error) {
          console.error('Error updating product:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Error al actualizar el producto.',
            icon: 'error',
          });
        }
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Cambios no guardados',
          text: 'Los cambios que has hecho no se guardaron.',
          icon: 'info',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Cambia el color del botón en el mensaje de "No guardar"
        }).then(() => {
          // Aquí puedes realizar una acción adicional si es necesario, como redirigir a otra página
          window.location.href = '/productos.js'; // Opcional: redirige a la lista de productos
          Swal.close(); // Cierra la ventana de alerta de confirmación
        });
      }
    });
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (productId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4000/Products/${productId}`);
          fetchProductos(); // Actualizar la lista de productos
          Swal.fire({
            title: 'Eliminado!',
            text: 'Tu producto ha sido eliminado.',
            icon: 'success',
          });
        } catch (error) {
          console.error('Error deleting product:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Error al eliminar el producto.',
            icon: 'error',
          });
        }
      }
    });
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      id: '',
      nombre: '',
      descripcion: '',
      categoria: '',
      composicion: '',
      contenido_neto: '',
      usos: '',
      advertencias: '',
      precio_unitario: '',
    });
    setCurrentProduct(null);
  };

  return (
    <div>
      <Header2 />
      <div className="container">
        <section className="container mt-5">
          <h2>Registro de productos</h2>
          <br />
          {/* Botón para abrir el modal */}
          <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#registroProductoModal">
            Registrar Producto
          </button>
          {/* Modal */}
          <div className="modal fade" id="registroProductoModal" tabIndex={-1} aria-labelledby="registroProductoModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="registroProductoModalLabel">Registrar Producto</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                  <form>
                    {/* Formulario de registro */}
                    <div className="mb-3">
                      <label htmlFor="id" className="form-label">ID Producto</label>
                      <input type="text" className="form-control" id="id" placeholder="Ingrese ID del producto" value={formData.id} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="nombre" className="form-label">Nombre</label>
                      <input type="text" className="form-control" id="nombre" placeholder="Ingrese nombre del producto" value={formData.nombre} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="descripcion" className="form-label">Descripción</label>
                      <input type="text" className="form-control" id="descripcion" placeholder="Ingrese descripción del producto" value={formData.descripcion} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="categoria" className="form-label">Categoría</label>
                      <input type="text" className="form-control" id="categoria" placeholder="Ingrese categoría del producto" value={formData.categoria} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="composicion" className="form-label">Composición</label>
                      <input type="text" className="form-control" id="composicion" placeholder="Ingrese composición del producto" value={formData.composicion} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="contenido_neto" className="form-label">Contenido Neto</label>
                      <input type="text" className="form-control" id="contenido_neto" placeholder="Ingrese contenido neto del producto" value={formData.contenido_neto} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="usos" className="form-label">Usos</label>
                      <input type="text" className="form-control" id="usos" placeholder="Ingrese usos del producto" value={formData.usos} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="advertencias" className="form-label">Advertencias</label>
                      <input type="text" className="form-control" id="advertencias" placeholder="Ingrese advertencias del producto" value={formData.advertencias} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="precio_unitario" className="form-label">Precio Unitario</label>
                      <input type="text" className="form-control" id="precio_unitario" placeholder="Ingrese precio unitario del producto" value={formData.precio_unitario} onChange={handleInputChange} />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm}>Cerrar</button>
                  <button type="button" className="btn btn-success" onClick={isEditing ? handleUpdateProduct : handleRegisterProduct}>
                    {isEditing ? 'Guardar Cambios' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Tabla de productos */}
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>ID Producto</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Categoría</th>
                <th>Composición</th>
                <th>Contenido Neto</th>
                <th>Usos</th>
                <th>Advertencias</th>
                <th>Precio Unitario</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>{producto.descripcion}</td>
                  <td>{producto.categoria}</td>
                  <td>{producto.composicion}</td>
                  <td>{producto.contenido_neto}</td>
                  <td>{producto.usos}</td>
                  <td>{producto.advertencias}</td>
                  <td>{producto.precio_unitario}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#registroProductoModal"
                      onClick={() => handleEditProduct(producto)}
                    >
                      Editar
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduct(producto.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Productos;
