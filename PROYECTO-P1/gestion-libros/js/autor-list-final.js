class AutorList extends HTMLElement {
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
    }

    connectedCallback() {
        const apiUrl = this.getAttribute('api-url');
        this.fetchData(apiUrl);
    }

    fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const authors = data || [];
            this.render(authors);
        } catch (error) {
            console.error("Error con la API", error);
            this.container.innerHTML = `
                <p class="error-alert">Error con la API</p>
            `;
        }
    };

    render = (authors) => {
        if (authors.length === 0) {
            this.container.innerHTML = `<p class="empty-alert">No hay autores disponibles</p>`;
            return;
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Nacionalidad</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

        authors.forEach((author) => {
            tableHTML += `
                <tr>
                    <td>${author.id_autor}</td>
                    <td>${author.nombre}</td>
                    <td>${author.nacionalidad}</td>
                    <td>${author.fecha_nacimiento}</td>
                    <td class="actions">
                        <button class="btn-update" data-id="${author.id_autor}">Actualizar</button>
                        <button class="btn-delete" data-id="${author.id_autor}">Eliminar</button>
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
    };

    handleDelete = async (id) => {
        const confirmDelete = confirm(`¿Estás seguro de eliminar al autor con ID: ${id}?`);
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8000/autores/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('Autor eliminado con éxito');
                    const apiUrl = this.getAttribute('api-url');
                    this.fetchData(apiUrl);
                } else {
                    alert('Error al eliminar el autor');
                }
            } catch (error) {
                console.error("Error al eliminar", error);
                alert('Error al conectar con la API');
            }
        }
    };

    handleUpdate = async (id) => {
        try {
            const response = await fetch(`http://localhost:8000/autores/${id}`);
            if (!response.ok) throw new Error('Error al obtener datos');
            const authorData = await response.json();
            this.showUpdateForm(authorData);
        } catch (error) {
            console.error("Error al actualizar", error);
            alert('Error al obtener los datos del autor');
        }
    };

    showUpdateForm = (authorData) => {
        const formHTML = `
            <form id="update-form">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" value="${authorData.nombre}">
                <label for="nacionalidad">Nacionalidad:</label>
                <input type="text" id="nacionalidad" value="${authorData.nacionalidad}">
                <label for="fecha_nacimiento">Fecha de Nacimiento:</label>
                <input type="date" id="fecha_nacimiento" value="${authorData.fecha_nacimiento}">
                <button type="submit">Guardar</button>
                <button type="button" id="cancel-update">Cancelar</button>
            </form>
        `;

        this.container.innerHTML = formHTML;

        this.shadowRoot.querySelector('#cancel-update').addEventListener('click', () => this.fetchData(this.getAttribute('api-url')));
        this.shadowRoot.querySelector('#update-form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.updateAuthor(authorData.id_autor);
        });
    };

    updateAuthor = async (id) => {
        const nombre = this.shadowRoot.querySelector('#nombre').value;
        const nacionalidad = this.shadowRoot.querySelector('#nacionalidad').value;
        const fecha_nacimiento = this.shadowRoot.querySelector('#fecha_nacimiento').value;

        const updatedAuthor = { nombre, nacionalidad, fecha_nacimiento };

        try {
            const response = await fetch(`http://localhost:8000/autores/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedAuthor),
            });

            if (response.ok) {
                alert('Autor actualizado con éxito');
                const apiUrl = this.getAttribute('api-url');
                this.fetchData(apiUrl);
            } else {
                alert('Error al actualizar el autor');
            }
        } catch (error) {
            console.error("Error al actualizar", error);
            alert('Error al conectar con la API');
        }
    };
}

window.customElements.define('autor-list', AutorList);
