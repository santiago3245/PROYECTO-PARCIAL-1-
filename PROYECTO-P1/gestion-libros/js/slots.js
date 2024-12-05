class ComponentSlot extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: 'open' })
        this.container = document.createElement('div')
        this.container.classList.add('slot-container')

        this.estilo = document.createElement('style');
        this.estilo.textContent = `
            .slot-container{
            }
        `;

        this.template = document.createElement('template')
        this.template.innerHTML = `
            <div class="card-image">
                <slot name="imagen">
                    <img src="https://placehold.co/300x200.png" alt="Titulo por defecto"></img>
                </slot>
            </div>
            <div class="image-header">
                <slot name="titulo">Default title</slot>
            </div>
            <div class="image-description">
                <slot name="descripcion">Default description</slot>
            </div>
            <div class="more-options">
                <slot name="opciones">More options</slot>
            </div>
        `;

        this.shadow.appendChild(this.estilo);
        this.shadow.appendChild(this.container);
        this.templateClone = this.template.content.cloneNode(true);
        this.shadow.appendChild(this.templateClone);
    }
}

window.customElements.define('component-slot', ComponentSlot);