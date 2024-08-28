import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/header_styles.css';
import Swal from 'sweetalert2';

const Header = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );
  const [userName, setUserName] = useState(() => {
    return sessionStorage.getItem("userName") || "";
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const storedUserName = sessionStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }

      // Alerta de bienvenida
      Swal.fire({
        title: '¡Bienvenido!',
        text: `Hola, ${userName}. ¡Has iniciado sesión exitosamente!`,
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6', // Color del botón
      });
    } else {
      setUserName("");
    }
  }, [isAuthenticated, userName]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:4000/Users", {
        params: {
          correo_electronico: email,
          contrasena: password,
        },
      });
  
      const user = response.data.find(
        (u) => u.correo_electronico === email && u.contrasena === password
      );
  
      if (user) {
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userRole", user.rol);
        sessionStorage.setItem("userName", user.nombres);
        sessionStorage.setItem("userId", user.id); // Guardar el ID del usuario
        setIsAuthenticated(true);
        setUserName(user.nombres);
  
        switch (user.rol.toLowerCase()) {
          case "cliente":
            navigate("/");
            break;
          case "jefe de producción":
            navigate("/jf_produccion.js");
            break;
          case "domiciliario":
            navigate("/domiciliario.js");
            break;
          case "gerente":
            navigate("/usuarios_admin.js");
            break;
          default:
            navigate("/");
        }
      } else {
        Swal.fire({
          title: 'Error de inicio de sesión',
          text: 'Correo o contraseña incorrectos.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Color del botón
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema durante el inicio de sesión. Por favor, intente de nuevo.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6', // Color del botón
      });
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: '¿Está seguro de que desea cerrar sesión?',
      icon: 'warning',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Cerrar sesión',
      denyButtonText: `Mantener sesión`,
      cancelButtonText: 'Cancelar', // Texto del botón de cancelar
      confirmButtonColor: '#3085d6', // Color azul para el botón de cerrar sesión
    }).then((result) => {
      if (result.isConfirmed) {
        // Limpiar el almacenamiento de sesión y redirigir
        sessionStorage.clear();
        setIsAuthenticated(false);
        setUserName("");
        navigate("/"); // Redirigir a la página de inicio
        Swal.fire({
          title: '¡Sesión cerrada!',
          icon: 'success',
          text: 'Has cerrado sesión exitosamente.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Color del botón en la alerta de éxito
        }).then(() => {
          Swal.close(); // Cierra la ventana de alerta de éxito
        });
      } else if (result.isDenied) {
        Swal.fire({
          title: 'Sesión no cerrada',
          text: 'Tu sesión continúa activa.',
          icon: 'info',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6', // Color del botón en el mensaje de "Mantener sesión"
        }).then(() => {
          Swal.close(); // Cierra la ventana de alerta de información
        });
      }
    });
  };
  return (
    <div>
      <header className="bg-light border-bottom sticky-header">
        <div className="container d-flex justify-content-between align-items-center py-3">
          {/* Logo */}
          <div className="header-logo-container">
            <a href="/">
              <img
                src="/img/LOGO_JEFE_DE_PRODUCCIÓN-Photoroom.png"
                alt="Logo"
                className="header-logo me-4"
              />
            </a>
          </div>
          {/* Botón de categorías */}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary me-3"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasCategorias"
              aria-controls="offcanvasCategorias"
            >
              <i className="bi bi-list" />
            </button>
            <span>Categorías</span>
          </div>
          {/* Barra de búsqueda */}
          <div className="mx-3 flex-grow-1">
            <form className="d-flex justify-content-center">
              <input
                className="form-control search-bar"
                type="search"
                placeholder="Buscar productos"
                aria-label="Buscar"
              />
              <button
                className="btn btn-outline-success search-button ms-2"
                type="submit"
              >
                <i className="bi bi-search" />
              </button>
            </form>
          </div>
          {/* Login Dropdown */}
          <div className="dropdown">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person" /> {userName || "Usuario"}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <button onClick={handleLogout} className="dropdown-item">
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-outline-success dropdown-toggle"
                  id="loginDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person" /> Iniciar sesión
                </button>
                <div
                  className="dropdown-menu dropdown-menu-end dropdown-menu-login"
                  aria-labelledby="loginDropdown"
                >
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Ingresa tu correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Ingresa tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <Link to="#">¿Olvidaste tu contraseña?</Link>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Ingresar
                    </button>
                  </form>
                  <div className="text-center mt-3">
                    <Link to="/registro_clientes.js">
                      Quiero crear mi cuenta
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Carrito de compras */}
          <Link to="/carrito.js" className="text-success ms-3">
            <i className="bi bi-cart3 fs-4" />
          </Link>
        </div>
      </header>
 {/* Sidebar interactivo */}
 <div className="offcanvas offcanvas-start offcanvas-categorias" tabIndex={-1} id="offcanvasCategorias" aria-labelledby="offcanvasCategoriasLabel">
    <div className="offcanvas-header">
      <h5 className="offcanvas-title" id="offcanvasCategoriasLabel">Categorías</h5>
      <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
    </div>
    <div className="offcanvas-body">
      <ul className="list-group">
        <li className="list-group-item">
          <Link to="#" className="d-flex justify-content-between align-items-center text-decoration-none text-dark" data-bs-toggle="collapse" data-bs-target="#ofertasCollapse" aria-expanded="false" aria-controls="ofertasCollapse">
            Ofertas
            <i className="bi bi-chevron-down" />
          </Link>
          <div className="collapse" id="ofertasCollapse">
            <ul className="list-group">
              <li className="list-group-item"><Link to="#" className="text-decoration-none text-dark">Oferta 1</Link></li>
              <li className="list-group-item"><Link to="#" className="text-decoration-none text-dark">Oferta 2</Link></li>
            </ul>
          </div>
        </li>
        <li className="list-group-item">
          <Link to="#" className="d-flex justify-content-between align-items-center text-decoration-none text-dark" data-bs-toggle="collapse" data-bs-target="#ropaCollapse" aria-expanded="false" aria-controls="ropaCollapse">
            Cuidado de Ropa
            <i className="bi bi-chevron-down" />
          </Link>
          <div className="collapse" id="ropaCollapse">
            <ul className="list-group">
              <li className="list-group-item"><Link to="#" className="text-decoration-none text-dark">Detergentes</Link></li>
              <li className="list-group-item"><Link to="#" className="text-decoration-none text-dark">Suavizantes</Link></li>
              <li className="list-group-item"><Link to="#" className="text-decoration-none text-dark">Blanqueadores</Link></li>
            </ul>
          </div>
        </li>
        <li className="list-group-item">
          <Link to="#" className="d-flex justify-content-between align-items-center text-decoration-none text-dark" data-bs-toggle="collapse" data-bs-target="#hogarCollapse" aria-expanded="false" aria-controls="hogarCollapse">
            Hogar y Limpieza
            <i className="bi bi-chevron-down" />
          </Link>
          <div className="collapse" id="hogarCollapse">
            <ul className="list-group">
              <li className="list-group-item"><Link to="#" className="text-decoration-none text-dark">Limpiadores Multiusos</Link></li>
              <li className="list-group-item"><Link to="#" className="text-decoration-none text-dark">Desinfectantes</Link></li>
              <li className="list-group-item"><Link to="#" className="text-decoration-none text-dark">Ambientadores</Link></li>
            </ul>
          </div>
        </li>
        <li className="list-group-item">
          <Link to="#" className="d-flex justify-content-between align-items-center text-decoration-none text-dark" data-bs-toggle="collapse" data-bs-target="#desinfectantesCollapse" aria-expanded="false" aria-controls="desinfectantesCollapse">
            Desinfectantes
            <i className="bi bi-chevron-down" />
          </Link>
          <div className="collapse" id="desinfectantesCollapse">
            <ul className="list-group">
              <li className="list-group-item"><Link to="#" className="text-decoration-none text-dark">Desinfectante 1</Link></li>
              <li className="list-group-item"><Link to="#" className="text-decoration-none text-dark">Desinfectante 2</Link></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>    </div>
  );
};

export default Header;
