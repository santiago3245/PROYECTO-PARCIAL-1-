class LibrosAutoresList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = `
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
        `;
        this.shadowRoot.appendChild(this.styleElement);
        this.shadowRoot.appendChild(this.container);
    }

    connectedCallback() {
        this.loadData();
    }

    async loadData() {
        try {
            const response = await fetch('http://localhost:8000/autoreslibros');
            const relations = await response.json();

            this.renderTable(relations);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    }

    renderTable(relations) {
        if (!relations.length) {
            this.container.innerHTML = '<p>No hay relaciones registradas.</p>';
            return;
        }

        this.container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>ID Libro</th>
                        <th>Título Libro</th>
                        <th>Género</th>
                        <th>Fecha de Publicación</th>
                        <th>ID Autor</th>
                        <th>Nombre Autor</th>
                        <th>Nacionalidad Autor</th>
                    </tr>
                </thead>
                <tbody>
                    ${relations.map(rel => `
                        <tr>
                            <td>${rel.id}</td>
                            <td>${rel.libro_titulo}</td>
                            <td>${rel.libro_genero}</td>
                            <td>${rel.libro_fecha_publicacion}</td>
                            <td>${rel.id_autor}</td>
                            <td>${rel.autor_nombre}</td>
                            <td>${rel.nacionalidad}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
}

customElements.define('libros-autores-list', LibrosAutoresList);
