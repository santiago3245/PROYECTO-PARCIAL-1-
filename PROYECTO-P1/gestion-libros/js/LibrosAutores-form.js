class LibrosAutoresForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.container = document.createElement("div");
        this.styleElement = document.createElement("style");
        this.styleElement.textContent = `
            .form-container {
                padding: 20px;
                font-family: Arial, sans-serif;
                width: 90%;
                max-width: 500px;
                margin: 0 auto;
                border: 1px solid #ccc;
                border-radius: 8px;
                background-color: #f9f9f9;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }

            .form-container h2 {
                text-align: center;
                margin-bottom: 20px;
                font-size: 1.5rem;
            }

            .form-container label {
                display: block;
                margin-bottom: 5px;
                font-size: 0.9rem;
            }

            .form-container select {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 1rem;
            }

            .form-container button {
                width: 100%;
                padding: 12px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 1rem;
            }

            .form-container button:hover {
                background-color: #45a049;
            }

            /* Media Queries para pantallas pequeñas */
            @media (max-width: 600px) {
                .form-container {
                    padding: 15px;
                    border: none;
                    box-shadow: none;
                    background-color: transparent;
                }

                .form-container h2 {
                    font-size: 1.2rem;
                }

                .form-container label {
                    font-size: 0.8rem;
                }

                .form-container select {
                    padding: 8px;
                    font-size: 0.9rem;
                }

                .form-container button {
                    font-size: 0.9rem;
                }
            }

            /* Para pantallas muy pequeñas (menos de 400px) */
            @media (max-width: 400px) {
                .form-container {
                    padding: 10px;
                    max-width: 100%;
                }

                .form-container h2 {
                    font-size: 1rem;
                }

                .form-container button {
                    padding: 10px;
                    font-size: 0.8rem;
                }
            }
        `;
        this.shadowRoot.appendChild(this.styleElement);
        this.shadowRoot.appendChild(this.container);
    }

    connectedCallback() {
        this.render();
        this.loadData();
    }

    render() {
        this.container.innerHTML = `
            <div class="form-container">
                <h2>Registrar Relación Autor-Libro</h2>
                <form id="relation-form">
                    <label for="autor">Autor</label>
                    <select name="autor" id="autor"></select>

                    <label for="libro">Libro</label>
                    <select name="libro" id="libro"></select>

                    <button type="submit">Registrar</button>
                </form>
            </div>
        `;
        this.shadowRoot.querySelector('#relation-form').addEventListener('submit', this.handleSubmit.bind(this));
    }

    async loadData() {
        try {
            const [authorsResponse, booksResponse] = await Promise.all([
                fetch('http://localhost:8000/autores'),
                fetch('http://localhost:8000/libros')
            ]);

            const authors = await authorsResponse.json();
            const books = await booksResponse.json();

            const authorSelect = this.shadowRoot.querySelector('#autor');
            const bookSelect = this.shadowRoot.querySelector('#libro');

            authors.forEach(author => {
                const option = document.createElement('option');
                option.value = author.id_autor;
                option.textContent = author.nombre;
                authorSelect.appendChild(option);
            });

            books.forEach(book => {
                const option = document.createElement('option');
                option.value = book.id;
                option.textContent = book.titulo;
                bookSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();

        const autor = this.shadowRoot.querySelector('#autor').value;
        const libro = this.shadowRoot.querySelector('#libro').value;

        const data = { id_autor: autor, id: libro };

        try {
            const response = await fetch('http://localhost:8000/autoreslibros', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Relación registrada correctamente');
                this.shadowRoot.querySelector('#relation-form').reset();
            } else {
                alert('Error al registrar la relación');
            }
        } catch (error) {
            console.error('Error al registrar relación:', error);
        }
    }
}

customElements.define('libros-autores-form', LibrosAutoresForm);
