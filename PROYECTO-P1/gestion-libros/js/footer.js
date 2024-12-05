class FooterShadow extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        const container = document.createElement("footer");
        container.classList.add("footer-shadow");

        container.innerHTML = `
            <div class="footer-bottom">
                <p>&copy; Derechos Reservados @espe 2024</p>
            </div>
        `;

        const estilo = document.createElement("style");
        estilo.textContent = `
       
            .footer-shadow {
                width: 100%;
                background-color: #333;
                color: white;
                padding: 10px 0;
                position: absolute;
                bottom: 0;
                left: 0;
                text-align: center;
                box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
            }

            .footer-bottom p {
                margin: 0;
                font-size: 14px;
            }

            html, body {
                height: 100%;
                margin: 0;
                display: flex;
                flex-direction: column;
            }

            body {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
            }
        `;

        shadow.appendChild(estilo);
        shadow.appendChild(container);
    }
}

window.customElements.define("mi-footer", FooterShadow);
