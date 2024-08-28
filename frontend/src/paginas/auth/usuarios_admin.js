import React, { useEffect, useState } from 'react';
import '../../styles/style_usuarios.css';
import axios from 'axios';
import Header2 from '../../componentes/header2';
import Swal from 'sweetalert2';

const UsuariosAdmin = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    correo_electronico: '',
    tipo_doc: '',
    num_doc: '',
    contrasena: '',
    genero: '',
    rol: ''
  });

  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Función para obtener usuarios de la API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error al obtener los usuarios.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Manejar cambio en los campos de formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  // Función para guardar un nuevo usuario o editar uno existente
  const handleSaveUser = async () => {
    if (isEditing && currentUser) {
      // Modo de edición: actualiza el usuario existente
      Swal.fire({
        title: '¿Desea continuar para guardar los cambios?',
        icon: 'warning',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `No Guardar`,
        cancelButtonText: 'Cancelar', // Cambia el texto del botón de cancelar
        confirmButtonColor: '#3085d6', // Establece el color azul para el botón de guardar
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.put(`http://localhost:4000/Users/${currentUser.id}`, formData);
            fetchUsers(); // Actualiza la lista de usuarios
            resetForm();
            setIsEditing(false);
            Swal.fire({
              title: '¡Éxito!',
              text: 'Usuario actualizado exitosamente.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#3085d6',
            }).then(() => {
              Swal.close(); // Cierra la ventana de alerta de confirmación
              window.location.href = '/usuarios_admin.js'; // Redirige a la lista de usuarios
            });
          } catch (error) {
            console.error('Error updating user:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Error al actualizar el usuario.',
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#d33',
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
            Swal.close(); // Cierra la ventana de alerta de confirmación
            window.location.href = '/usuarios_admin.js'; // Opcional: redirige a la lista de usuarios
          });
        }
      });
    } else {
      // Modo de creación: guarda un nuevo usuario
      try {
        await axios.post('http://localhost:4000/Users', formData);
        Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario guardado exitosamente.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          fetchUsers(); // Actualiza la lista de usuarios
          resetForm(); // Resetea el formulario
          setIsEditing(false);
          window.location.href = '/usuarios_admin.js'; // Redirige a la lista de usuarios
        });
      } catch (error) {
        console.error('Error saving user:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al guardar el usuario.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  // Función para editar un usuario
  const handleEditUser = (user) => {
    setIsEditing(true);
    setCurrentUser(user);
    setFormData(user);
  };

  // Función para eliminar un usuario
  const handleDeleteUser = async (id) => {
    const confirmDelete = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Eliminar este usuario es una acción irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4000/Users/${id}`);
        Swal.fire({
          title: '¡Eliminado!',
          text: 'Usuario eliminado exitosamente.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }).then(() => {
          fetchUsers(); // Actualiza la lista de usuarios
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Error al eliminar el usuario.',
          icon: 'error',
          confirmButtonText: 'OK',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombres: '',
      apellidos: '',
      telefono: '',
      correo_electronico: '',
      tipo_doc: '',
      num_doc: '',
      contrasena: '',
      genero: '',
      rol: ''
    });
    setCurrentUser(null);
  };

  return (
    <div>
      <Header2 />
      <div className="container">
        <section className="container mt-5">
          <h2>Registro de usuarios administrativos</h2>
          <br />
          {/* Botón para abrir el modal */}
          <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#registroUserModal">
            Registrar Usuario
          </button>
          {/* Modal */}
          <div className="modal fade" id="registroUserModal" tabIndex={-1} aria-labelledby="registroUserModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="registroUserModalLabel">Registrar Usuario</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                </div>
                <div className="modal-body">
                  <form>
                    {/* Formulario de registro */}
                    <div className="mb-3">
                      <label htmlFor="tipo_doc" className="form-label">Tipo de Documento</label>
                      <select className="form-select" id="tipo_doc" value={formData.tipo_doc} onChange={handleInputChange} required>
                        <option value="ti">Tarjeta de identidad</option>
                        <option value="cc">Cédula de ciudadanía</option>
                        <option value="ce">Cédula de extranjería</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="num_doc" className="form-label">Nº Identificación</label>
                      <input type="text" className="form-control" id="num_doc" placeholder="Ingrese Nº Identificación" value={formData.num_doc} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="nombres" className="form-label">Nombres</label>
                      <input type="text" className="form-control" id="nombres" placeholder="Ingrese Nombres" value={formData.nombres} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="apellidos" className="form-label">Apellidos</label>
                      <input type="text" className="form-control" id="apellidos" placeholder="Ingrese Apellidos" value={formData.apellidos} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="correo_electronico" className="form-label">Correo Electrónico</label>
                      <input type="email" className="form-control" id="correo_electronico" placeholder="Ingrese Correo Electrónico" value={formData.correo_electronico} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="genero" className="form-label">Género</label>
                      <select className="form-select" id="genero" value={formData.genero} onChange={handleInputChange} required>
                        <option value="femenino">Femenino</option>
                        <option value="masculino">Masculino</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Número Celular</label>
                      <input type="text" className="form-control" id="telefono" placeholder="Ingrese Número Celular" value={formData.telefono} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="contrasena" className="form-label">Contraseña</label>
                      <input type="text" className="form-control" id="contrasena" placeholder="Ingrese Contraseña" value={formData.contrasena} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="rol" className="form-label">Rol</label>
                      <select className="form-select" id="rol" value={formData.rol} onChange={handleInputChange} required>
                        <option value="domiciliario">Domiciliario</option>
                        <option value="jf_produccion">Jefe de Producción</option>
                        <option value="gerente">Gerente</option>
                        <option value="administrador">Administrador</option>
                      </select>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm}>Cerrar</button>
                  <button type="button" className="btn btn-success" onClick={handleSaveUser}>
                    {isEditing ? 'Guardar Cambios' : 'Guardar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Tabla de usuarios */}
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>ID Usuario</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Correo Electrónico</th>
                <th>Teléfono</th>
                <th>Género</th>
                <th>Tipo de Documento</th>
                <th>Nº Identificación</th>
                <th>Rol</th>
                <th>Editar</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user +1}>
                  <td>{user.id}</td>
                  <td>{user.nombres}</td>
                  <td>{user.apellidos}</td>
                  <td>{user.correo_electronico}</td>
                  <td>{user.telefono}</td>
                  <td>{user.genero}</td>
                  <td>{user.tipo_doc}</td>
                  <td>{user.num_doc}</td>
                  <td>{user.rol}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#registroUserModal"
                      onClick={() => handleEditUser(user)}
                    >
                      Editar
                    </button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteUser(user.id)}
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

export default UsuariosAdmin;
