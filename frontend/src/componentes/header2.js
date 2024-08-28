import React from "react";
import '../styles/style_header2.css';
import Swal from 'sweetalert2';

const Header2 = () => {
  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Cerrar sesión terminará tu sesión actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6', // Color azul para el botón de confirmación
      cancelButtonColor: '#d33', // Color rojo para el botón de cancelar
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes agregar la lógica para cerrar sesión, como redirigir al usuario o limpiar el estado de autenticación
        // Ejemplo de redirección:
        // window.location.href = '/login';
        // O ejemplo de llamada a una función de cierre de sesión:
        // logoutUser();
  
        Swal.fire({
          title: '¡Sesión cerrada!',
          text: 'Has cerrado sesión con éxito.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Color azul para el botón de confirmación
        }).then(() => {
          // Realiza una acción después de mostrar la alerta, como redirigir a la página de inicio de sesión
          window.location.href = '/login'; // Redirige al usuario a la página de inicio de sesión
        });
      }
    });
  };

  return (
    <div>
      <header className="py-3 mb-4 border-bottom">
        <div className="d-flex align-items-center">
          <img
            src="https://i.ibb.co/dbTBHkz/LOGO-JEFE-DE-PRODUCCI-N.jpg"
            alt="LOGO-JEFE-DE-PRODUCCI-N"
            className="logo"
          />
        </div>
        <ul className="nav me-auto mb-2 mb-lg-0">
          <li className="nav-item"><a href="usuarios_admin.js" className="nav-link px-2">Usuarios</a></li>
          <li className="nav-item"><a href="productos.js" className="nav-link px-2">Productos</a></li>
          <li className="nav-item"><a href="ventas_admin.js" className="nav-link px-2">Ventas</a></li>
          <li className="nav-item"><a href="domicilios_admin.js" className="nav-link px-2">Domicilios</a></li>
        </ul>
        <div>
          {/* Botón para cerrar sesión */}
          <button
            type="button"
            className="btn btn-primary btn-custom"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header2;
