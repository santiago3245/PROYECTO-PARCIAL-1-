class HomePage extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        this.homeContainer = document.createElement("div");
        this.homeContainer.classList.add("home-container");

        this.estilo = document.createElement("style");
        this.estilo.textContent = `
            .home-container {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 90vh;
                margin: 0;
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                color: #333;
            }

            h1 {
                font-size: 3rem;
                color: teal;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
            }
        `;

        const template = document.createElement("template");
        template.innerHTML = `
            <div class="home-container">
                <h1>Bienvenidos</h1>
            </div>
        `;


        shadow.appendChild(this.estilo);
        shadow.appendChild(template.content.cloneNode(true));
    }
}

window.customElements.define("mi-home", HomePage);
