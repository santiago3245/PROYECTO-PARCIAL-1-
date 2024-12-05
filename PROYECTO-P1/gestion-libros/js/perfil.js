class Perfil extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode:"open"});

        const template = document.createElement("template");
        template.innerHTML = `
<style>
    :host {
        display: block;
        max-width: 100%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .perfil-usuario {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 350px;
        padding: 25px;
        background: linear-gradient(135deg, #6a11cb, #2575fc);
        border-radius: 15px;
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
        text-align: center;
        max-width: 100%;
        margin-top: 30px;
        transition: transform 0.3s ease;
    }

    .perfil-usuario:hover {
        transform: scale(1.05);
    }

    .profile-pic {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        object-fit: cover;
        margin-bottom: 20px;
        border: 4px solid #fff;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }

    .username {
        font-size: 1.5rem;
        font-weight: bold;
        color: #fff;
        margin-bottom: 12px;
        letter-spacing: 1px;
        text-transform: uppercase;
    }

    .bio {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 25px;
        line-height: 1.5;
        max-width: 90%;
        font-style: italic;
    }

    .follow-button, .message-button {
        width: 100%;
        padding: 12px;
        font-size: 1rem;
        margin: 6px 0;
        cursor: pointer;
        border: none;
        border-radius: 8px;
        background-color: #ff4081;
        color: white;
        transition: background-color 0.3s ease, transform 0.2s ease;
        text-transform: uppercase;
    }

    .follow-button:hover, .message-button:hover {
        background-color: #e50057;
        transform: translateY(-3px);
    }

    .follow-button:active, .message-button:active {
        transform: translateY(2px);
    }
</style>
            <div class="perfil-usuario">
                <img src="" alt="Foto del Usuario" class="profile-pic" />
                <div class="username"></div>
                <div class="bio"></div>
                <button class="follow-button">Seguir</button>
                <button class="message-button">Mensaje</button>
            </div>
        `;

        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
    }

    render = () => {
        const profilePic = this.getAttribute("profile-pic") || "https://th.bing.com/th/id/R.02382af7f2365e74f8ac0e861b4dd384?rik=KBByfzC1Gu2vyg&pid=ImgRaw&r=0";
        const username = this.getAttribute("username") || "Santiago Xavier Arroyo Vizuete";
        const bio = this.getAttribute("bio") || "Fan de dragon ball desde pequeño, Actualmente estudiante de Ingenieria en tecnologias de la información";

        this.shadowRoot.querySelector(".profile-pic").src = profilePic;
        this.shadowRoot.querySelector(".username").textContent = username;
        this.shadowRoot.querySelector(".bio").textContent = bio;
    }
}

window.customElements.define("mi-perfil", Perfil);
