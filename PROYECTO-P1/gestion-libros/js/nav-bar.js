class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const container = document.createElement("div");
        container.classList.add("nav-bar");

        const title = document.createElement("h1");
        title.textContent = "Sistema de Biblioteca";
        title.classList.add("title");
        container.appendChild(title);

        const navMenu = document.createElement("ul");
        navMenu.classList.add("menu");

        const opciones = [
            { item: "Inicio", link: "index.html" },
            { item: "Libros", link: "libros.html" },
            { item: "Autores", link: "autores.html" },
            { item: "LibrosAutores", link: "LibrosAutoress.html" },
            { item: "Acerca de", link: "AcercaDe.html" }
        ];

        opciones.forEach(op => {
            const itemList = document.createElement("li");
            const enlace = document.createElement("a");
            enlace.textContent = op.item;
            enlace.href = op.link;
            itemList.appendChild(enlace);
            navMenu.appendChild(itemList);
        });

        const estilo = document.createElement("style");
        estilo.textContent = `
            .nav-bar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: black;
                color: white;
                padding: 1rem;
                flex-wrap: wrap;
            }

            .title {
                font-size: 1.5rem;
                color: white;
            }

            .menu {
                display: flex;
                list-style: none;
                padding: 0;
                margin: 0;
                gap: 1rem;
            }

            .menu li {
                padding: 0.5rem;
            }

            .menu a {
                text-decoration: none;
                color: white;
                font-size: 1rem;
                font-weight: bold;
            }

            .menu li:hover {
                background-color: cyan;
            }

            /* Media Queries para pantallas pequeñas */
            @media (max-width: 768px) {
                .menu {
                    display: none;
                    flex-direction: column;
                    width: 100%;
                    background-color: black;
                    position: absolute;
                    top: 4rem;
                    left: 0;
                    right: 0;
                    text-align: center;
                    padding: 1rem 0;
                }

                .menu li {
                    padding: 1rem;
                }

                .menu.show {
                    display: flex;
                }

                /* Mostrar el ícono hamburguesa solo en pantallas pequeñas */
                .nav-bar .hamburger {
                    display: block;
                    font-size: 2rem;
                    cursor: pointer;
                    color: white;
                }
            }

            @media (max-width: 480px) {
                .title {
                    font-size: 1.2rem;
                }

                .menu a {
                    font-size: 0.9rem;
                }
            }

            /* En pantallas grandes, ocultar el ícono hamburguesa */
            @media (min-width: 769px) {
                .nav-bar .hamburger {
                    display: none;
                }
            }
        `;

        const hamburger = document.createElement("span");
        hamburger.classList.add("hamburger");
        hamburger.textContent = "☰";
        hamburger.addEventListener('click', this.toggleMenu);

        this.shadowRoot.innerHTML = ''; // Limpia cualquier contenido previo
        this.shadowRoot.appendChild(estilo);
        this.shadowRoot.appendChild(container);
        container.appendChild(hamburger);
        container.appendChild(navMenu);
    }

    toggleMenu = () => {
        const menu = this.shadowRoot.querySelector('.menu');
        menu.classList.toggle('show');
    }
}

window.customElements.define("nav-bar", NavBar);
