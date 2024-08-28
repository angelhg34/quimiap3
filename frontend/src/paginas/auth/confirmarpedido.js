import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ConfirmarPedido = () => {
  const [datosPedido, setDatosPedido] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatosPedido({
      ...datosPedido,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías hacer una solicitud para guardar los datos del pedido en el servidor

    Swal.fire({
      title: 'Pedido Confirmado!',
      text: 'Tu pedido ha sido registrado con éxito.',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3085d6', // Color del botón de confirmación
    }).then(() => {
      // Redirige a otra página después de confirmar el pedido
      navigate('/'); // Cambia a la ruta deseada, por ejemplo, la página principal
    });
  };

  return (
    <div className="container mt-5">
      <h2>Confirmar Pedido</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre Completo</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={datosPedido.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="direccion" className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            id="direccion"
            name="direccion"
            value={datosPedido.direccion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input
            type="tel"
            className="form-control"
            id="telefono"
            name="telefono"
            value={datosPedido.telefono}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Registrar Pedido</button>
      </form>
    </div>
  );
};

export default ConfirmarPedido;
