class BookForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.container = document.createElement("div");
        this.estilo = document.createElement("style");
        this.estilo.textContent = `
            .form-container {
                padding: 20px;
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto; /* Centrado del contenedor en la página */
                border: 1px solid #ccc;
                border-radius: 8px;
                background-color: #f9f9f9;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Agregado para darle más estilo */
            }

            .form-container h2 {
                text-align: center;
                margin-bottom: 20px;
                color: #333; /* Color más oscuro para el título */
            }

            .form-container form {
                display: grid;
                gap: 15px;
            }

            .form-container label {
                font-weight: bold;
                margin-bottom: 5px; /* Espacio entre el label y el input */
            }

            .form-container input {
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 16px; /* Aumentado el tamaño de fuente para mejor legibilidad */
                box-sizing: border-box; /* Para asegurarse que el padding no afecte el ancho */
            }

            .form-container button {
                padding: 12px 20px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 16px;
                cursor: pointer;
                transition: background-color 0.3s ease;
            }

            .form-container button:hover {
                background-color: #45a049;
            }

            .error-alert {
                color: red;
                font-weight: bold;
                text-align: center;
            }
        `;

        this.shadowRoot.appendChild(this.estilo);
        this.shadowRoot.appendChild(this.container);
    }

    connectedCallback() {
        this.render();
    }

    render = () => {
        this.container.innerHTML = `
            <div class="form-container">
                <h2>Registro de Libros</h2>
                <form id="book-form">
                    <label for="titulo">Título</label>
                    <input type="text" name="titulo" id="titulo" required>

                    <label for="genero">Género</label>
                    <input type="text" name="genero" id="genero" required>

                    <label for="fecha_publicacion">Fecha de Publicación</label>
                    <input type="date" name="fecha_publicacion" id="fecha_publicacion" required>

                    <button type="submit">Registrar</button>
                </form>
            </div>
        `;

        this.shadowRoot.querySelector("#book-form").addEventListener('submit', this.handleSubmit);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const titulo = this.shadowRoot.querySelector('#titulo').value;
        const genero = this.shadowRoot.querySelector('#genero').value;
        const fecha_publicacion = this.shadowRoot.querySelector('#fecha_publicacion').value;

        const newBook = { titulo, genero, fecha_publicacion };

        try {
            const response = await fetch('http://localhost:8000/libros', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(newBook)
            });

            if (response.ok) {
                alert('Libro registrado');
                this.shadowRoot.querySelector('#book-form').reset();
            } else {
                alert('Error al registrar');
            }
        } catch (error) {
            console.log(`Error al realizar fetch ${error}`);
            this.container.innerHTML = `
                <p class="error-alert">Error con la API</p>
            `;
        }
    }
}

window.customElements.define('book-form', BookForm);
