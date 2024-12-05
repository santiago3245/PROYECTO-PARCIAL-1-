class AutorForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.container = document.createElement("div");
        this.estilo = document.createElement("style");
        this.estilo.textContent = `
            .form-container {
                padding: 2rem;
                font-family: Arial, sans-serif;
                max-width: 100%;
                width: 100%;
                margin: 0 auto;
                border: 1px solid #ccc;
                border-radius: 8px;
                background-color: #f9f9f9;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
            }

            .form-container h2 {
                text-align: center;
                margin-bottom: 1.5rem;
                font-size: 1.5rem;
            }

            .form-container label {
                display: block;
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }

            .form-container input {
                width: 100%;
                padding: 1rem;
                margin-bottom: 1rem;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 1rem;
                box-sizing: border-box;
            }

            .form-container button {
                padding: 1rem;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 1rem;
                cursor: pointer;
                box-sizing: border-box;
            }

            .form-container button:hover {
                background-color: #45a049;
            }

            .error-alert {
                color: red;
                font-weight: bold;
                text-align: center;
                margin-top: 1rem;
            }

            @media (max-width: 600px) {
                .form-container {
                    padding: 1rem;
                }

                .form-container h2 {
                    font-size: 1.2rem;
                    margin-bottom: 1rem;
                }

                .form-container input,
                .form-container button {
                    padding: 0.8rem;
                    font-size: 0.9rem;
                }

                .form-container label {
                    font-size: 0.9rem;
                }
            }

            @media (max-width: 400px) {
                .form-container h2 {
                    font-size: 1rem;
                }

                .form-container input,
                .form-container button {
                    padding: 0.8rem;
                    font-size: 0.9rem;
                }

                .form-container label {
                    font-size: 0.8rem;
                }
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
                <h2>Registro de Autor</h2>
                <form id="author-form">
                    <label for="nombre">Nombre</label>
                    <input type="text" name="nombre" id="nombre" required>

                    <label for="nacionalidad">Nacionalidad</label>
                    <input type="text" name="nacionalidad" id="nacionalidad">

                    <label for="fecha_nacimiento">Fecha de Nacimiento</label>
                    <input type="date" name="fecha_nacimiento" id="fecha_nacimiento" required>

                    <button type="submit">Registrar</button>
                </form>
            </div>
        `;
        this.shadowRoot.querySelector("#author-form").addEventListener('submit', this.handleSubmit);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const nombre = this.shadowRoot.querySelector('#nombre').value;
        const nacionalidad = this.shadowRoot.querySelector('#nacionalidad').value;
        const fecha_nacimiento = this.shadowRoot.querySelector('#fecha_nacimiento').value;

        const newAuthor = { nombre, nacionalidad, fecha_nacimiento };

        try {
            const response = await fetch('http://localhost:8000/autores', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(newAuthor)
            });

            if (response.ok) {
                alert('Autor registrado');
                this.shadowRoot.querySelector('#author-form').reset();
            } else {
                alert('Error al registrar el autor');
            }
        } catch (error) {
            console.log(`Error al realizar fetch ${error}`);
            this.container.innerHTML = `
                <p class="error-alert">Error con la API</p>
            `;
        }
    }
}

window.customElements.define('autor-form', AutorForm);
