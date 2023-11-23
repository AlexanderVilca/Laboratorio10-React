import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [recuperado, setRecuperado] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: 0 });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    // Al cargar la página, obtenemos la lista de productos
    fetch('http://127.0.0.1:8000/api/producto')
      .then((response) => response.json())
      .then((prod) => {
        setProductos(prod);
        setRecuperado(true);
      });
  }, []);

  const handleInputChange = (e) => {
    // Manejar cambios en los campos del formulario
    const { name, value } = e.target;
    setNuevoProducto((prevProducto) => ({
      ...prevProducto,
      [name]: value,
    }));
  };

  const agregarProducto = () => {
    // Enviar una solicitud POST para agregar un nuevo producto
    fetch('http://127.0.0.1:8000/api/crear_producto/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoProducto),
    })
      .then((response) => response.json())
      .then((nuevoProd) => {
        setProductos([...productos, nuevoProd]);
        setNuevoProducto({ nombre: '', precio: 0 });
      })
      .catch((error) => {
        console.error('Error al agregar el producto:', error);
      });
  };

  const editarProducto = (id) => {
    // Preparar para editar un producto
    const productoAEditar = productos.find((prod) => prod.id === id);
    setNuevoProducto({ ...productoAEditar });
    setEditando(id);
  };

  const actualizarProducto = () => {
    // Enviar una solicitud PUT para actualizar un producto existente
    fetch(`http://127.0.0.1:8000/api/producto/${editando}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoProducto),
    })
      .then((response) => response.json())
      .then((actualizadoProd) => {
        setProductos((prevProductos) =>
          prevProductos.map((prod) =>
            prod.id === editando ? actualizadoProd : prod
          )
        );
        setNuevoProducto({ nombre: '', precio: 0 });
        setEditando(null);
      });
  };

  const eliminarProducto = (id) => {
    // Enviar una solicitud DELETE para eliminar un producto
    fetch(`http://127.0.0.1:8000/api/producto/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setProductos(productos.filter((prod) => prod.id !== id));
    });
  };

  const mostrarTabla = () => {
    return (
      <div>
        <h1>Lista de Productos</h1>
        <table border="1">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre}</td>
                <td>{prod.precio}</td>
                <td>
                  <button onClick={() => editarProducto(prod.id)}>
                    Editar
                  </button>
                  <button onClick={() => eliminarProducto(prod.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>{editando ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={nuevoProducto.nombre}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Precio:
            <input
              type="number"
              name="precio"
              value={nuevoProducto.precio}
              onChange={handleInputChange}
            />
          </label>
          <br />
          {editando ? (
            <button type="button" onClick={actualizarProducto}>
              Actualizar
            </button>
          ) : (
            <button type="button" onClick={agregarProducto}>
              Agregar
            </button>
          )}
        </form>
      </div>
    );
  };

  return recuperado ? mostrarTabla() : <div>Recuperando datos...</div>;
}

export default App;
