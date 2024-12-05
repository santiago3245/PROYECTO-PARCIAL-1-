class BookList extends HTMLElement {
    constructor() {
        super(); 
        this.attachShadow({ mode: 'open' });

        this.container = document.createElement('div');

        this.estilo = document.createElement('style');
        this.estilo.textContent = `
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 16px;
                text-align: left;
            }
            th, td {
                padding: 10px;
                border: 1px solid #ccc;
            }
            th {
                background-color: #f4f4f4;
            }
            .actions button {
                margin: 0 5px;
                padding: 5px 10px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            .btn-update {
                background-color: #4caf50;
                color: white;
            }
            .btn-delete {
                background-color: #f44336;
                color: white;
            }
            .error-alert {
                color: red;
                font-weight: bold;
            }
            .empty-alert {
                color: gray;
                font-style: italic;
            }
        `;

        this.shadowRoot.appendChild(this.estilo);
        this.shadowRoot.appendChild(this.container);

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.render = this.render.bind(this);
    }

    connectedCallback() {
        const apiUrl = this.getAttribute('api-url');
        this.fetchData(apiUrl);
    }

    fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const books = data || [];
            this.render(books);
        } catch (error) {
            console.error("Error con la API", error);
            this.container.innerHTML = 
                `<p class="error-alert">Error con la API</p>`;
        }
    };

    render(books) {
        if (books.length === 0) {
            this.container.innerHTML = `<p class="empty-alert">No hay libros disponibles</p>`;
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Género</th>
                        <th>Fecha de Publicación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        books.forEach((book) => {
            tableHTML += `
                <tr>
                    <td>${book.id}</td>
                    <td>${book.titulo}</td>
                    <td>${book.genero}</td>
                    <td>${book.fecha_publicacion}</td>
                    <td class="actions">
                        <button class="btn-update" data-id="${book.id}">Actualizar</button>
                        <button class="btn-delete" data-id="${book.id}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `</tbody></table>`;
        this.container.innerHTML = tableHTML;

        this.container.querySelectorAll('.btn-update').forEach((button) => {
            button.addEventListener('click', () => this.handleUpdate(button.dataset.id));
        });

        this.container.querySelectorAll('.btn-delete').forEach((button) => {
            button.addEventListener('click', () => this.handleDelete(button.dataset.id));
        });
    }

    async handleDelete(id) {
        const confirmDelete = confirm(`¿Estás seguro de eliminar el libro con ID: ${id}?`);
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8000/libros/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('Libro eliminado con éxito');
                    const apiUrl = this.getAttribute('api-url');
                    this.fetchData(apiUrl);
                } else {
                    alert('Error al eliminar el libro');
                }
            } catch (error) {
                console.error("Error al eliminar", error);
                alert('Error al conectar con la API');
            }
        }
    }

    async handleUpdate(id) {
        try {
            const response = await fetch(`http://localhost:8000/libros/${id}`);
            if (!response.ok) throw new Error('Error al obtener datos');
            const bookData = await response.json();
            this.showUpdateForm(bookData);
        } catch (error) {
            console.error("Error al actualizar", error);
            alert('Error al obtener los datos del libro');
        }
    }

    showUpdateForm(bookData) {
        const formHTML = `
            <form id="update-form">
                <label for="titulo">Título:</label>
                <input type="text" id="titulo" value="${bookData.titulo}">
                <label for="genero">Género:</label>
                <input type="text" id="genero" value="${bookData.genero}">
                <label for="fecha_publicacion">Fecha de Publicación:</label>
                <input type="date" id="fecha_publicacion" value="${bookData.fecha_publicacion}">
                <button type="submit">Guardar</button>
                <button type="button" id="cancel-update">Cancelar</button>
            </form>
        `;
        this.container.innerHTML = formHTML;

        this.shadowRoot.querySelector('#cancel-update').addEventListener('click', () => this.connectedCallback());
        this.shadowRoot.querySelector('#update-form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.updateBook(bookData.id);
        });
    }

    async updateBook(id) {
        const titulo = this.shadowRoot.querySelector('#titulo').value;
        const genero = this.shadowRoot.querySelector('#genero').value;
        const fecha_publicacion = this.shadowRoot.querySelector('#fecha_publicacion').value;

        const updatedBook = { titulo, genero, fecha_publicacion };

        try {
            const response = await fetch(`http://localhost:8000/libros/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBook),
            });

            if (response.ok) {
                alert('Libro actualizado con éxito');
                const apiUrl = this.getAttribute('api-url');
                this.fetchData(apiUrl);
            } else {
                alert('Error al actualizar');
            }
        } catch (error) {
            console.error("Error al actualizar", error);
            alert('Error al conectar con la API');
        }
    }
}

window.customElements.define('book-list', BookList);
