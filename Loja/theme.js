const accessibilitySettings = JSON.parse(localStorage.getItem("accessibilitySettings")) || {
    theme: localStorage.getItem("tema") || "light",
    contrast: false,
    largeText: false,
    reduceMotion: false
};

function saveAccessibilitySettings(){
    localStorage.setItem("accessibilitySettings", JSON.stringify(accessibilitySettings));
    localStorage.setItem("tema", accessibilitySettings.theme);
}

function applyAccessibilitySettings(){
    document.body.classList.toggle("dark-mode", accessibilitySettings.theme === "dark");
    document.body.classList.toggle("high-contrast", accessibilitySettings.contrast);
    document.body.classList.toggle("large-text", accessibilitySettings.largeText);
    document.body.classList.toggle("reduce-motion", accessibilitySettings.reduceMotion);

    document.querySelectorAll("#darkModeToggle, #a11yThemeToggle").forEach(toggle => {
        toggle.checked = accessibilitySettings.theme === "dark";
    });

    document.querySelectorAll("#a11yContrastToggle").forEach(toggle => {
        toggle.checked = accessibilitySettings.contrast;
    });

    document.querySelectorAll("#a11yTextToggle").forEach(toggle => {
        toggle.checked = accessibilitySettings.largeText;
    });

    document.querySelectorAll("#a11yMotionToggle").forEach(toggle => {
        toggle.checked = accessibilitySettings.reduceMotion;
    });
}

function createAccessibilityPanel(){
    if(document.querySelector(".accessibility-panel")) return;

    const panel = document.createElement("aside");
    panel.className = "accessibility-panel";
    panel.setAttribute("aria-label", "Preferencias de acessibilidade");
    panel.innerHTML = `
        <button class="accessibility-toggle" type="button" aria-expanded="false" aria-controls="accessibility-options">
            <i class="fa-solid fa-universal-access" aria-hidden="true"></i>
            <span>Acessibilidade</span>
        </button>

        <div class="accessibility-options" id="accessibility-options" hidden>
            <label>
                <span>Modo noturno</span>
                <input type="checkbox" id="a11yThemeToggle">
            </label>

            <label>
                <span>Alto contraste</span>
                <input type="checkbox" id="a11yContrastToggle">
            </label>

            <label>
                <span>Texto maior</span>
                <input type="checkbox" id="a11yTextToggle">
            </label>

            <label>
                <span>Reduzir movimento</span>
                <input type="checkbox" id="a11yMotionToggle">
            </label>
        </div>
    `;

    document.body.appendChild(panel);

    const toggleButton = panel.querySelector(".accessibility-toggle");
    const options = panel.querySelector(".accessibility-options");

    toggleButton.addEventListener("click", () => {
        const isOpen = toggleButton.getAttribute("aria-expanded") === "true";
        toggleButton.setAttribute("aria-expanded", String(!isOpen));
        options.hidden = isOpen;
    });
}

function bindAccessibilityControls(){
    const darkModeToggle = document.getElementById("darkModeToggle");

    document.querySelectorAll("#darkModeToggle, #a11yThemeToggle").forEach(toggle => {
        toggle.addEventListener("change", () => {
            accessibilitySettings.theme = toggle.checked ? "dark" : "light";
            saveAccessibilitySettings();
            applyAccessibilitySettings();
        });
    });

    document.querySelectorAll("#a11yContrastToggle").forEach(toggle => {
        toggle.addEventListener("change", () => {
            accessibilitySettings.contrast = toggle.checked;
            saveAccessibilitySettings();
            applyAccessibilitySettings();
        });
    });

    document.querySelectorAll("#a11yTextToggle").forEach(toggle => {
        toggle.addEventListener("change", () => {
            accessibilitySettings.largeText = toggle.checked;
            saveAccessibilitySettings();
            applyAccessibilitySettings();
        });
    });

    document.querySelectorAll("#a11yMotionToggle").forEach(toggle => {
        toggle.addEventListener("change", () => {
            accessibilitySettings.reduceMotion = toggle.checked;
            saveAccessibilitySettings();
            applyAccessibilitySettings();
        });
    });

    if(darkModeToggle){
        darkModeToggle.checked = accessibilitySettings.theme === "dark";
    }
}

function addGlobalAccessibilityStyles(){
    if(document.getElementById("accessibilityStyles")) return;

    const style = document.createElement("style");
    style.id = "accessibilityStyles";
    style.textContent = `
        .skip-link{
            position:fixed;
            left:16px;
            top:16px;
            transform:translateY(-160%);
            background:#0b4ca0;
            color:#fff;
            padding:12px 16px;
            border-radius:10px;
            z-index:10000;
            font-weight:700;
            text-decoration:none;
            box-shadow:0 10px 25px rgba(0,0,0,.25);
        }

        .skip-link:focus{
            transform:translateY(0);
        }

        :focus-visible{
            outline:3px solid #ffbf47;
            outline-offset:3px;
        }

        .sr-only{
            position:absolute;
            width:1px;
            height:1px;
            padding:0;
            margin:-1px;
            overflow:hidden;
            clip:rect(0, 0, 0, 0);
            white-space:nowrap;
            border:0;
        }

        button,
        a,
        input{
            min-height:44px;
        }

        .icon-button,
        .cart-top,
        .cart-bottom{
            border:0;
            background:transparent;
            color:inherit;
            min-width:44px;
            min-height:44px;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            border-radius:12px;
            cursor:pointer;
            text-decoration:none;
        }

        .accessibility-panel{
            position:fixed;
            right:14px;
            bottom:88px;
            z-index:9998;
            max-width:calc(100vw - 28px);
            font-family:Inter, Arial, sans-serif;
        }

        .accessibility-toggle{
            border:0;
            border-radius:999px;
            background:#111;
            color:#fff;
            padding:12px 14px;
            display:flex;
            align-items:center;
            gap:8px;
            box-shadow:0 12px 28px rgba(0,0,0,.22);
            cursor:pointer;
            font-weight:700;
        }

        .accessibility-options{
            width:240px;
            margin-top:10px;
            padding:12px;
            border-radius:14px;
            background:#fff;
            color:#111;
            border:1px solid #d7dce5;
            box-shadow:0 18px 40px rgba(0,0,0,.18);
        }

        .accessibility-options label{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
            padding:10px 4px;
            font-size:14px;
            font-weight:700;
        }

        .accessibility-options input{
            width:22px;
            height:22px;
            accent-color:#0b4ca0;
        }

        body.large-text{
            font-size:125%;
        }

        body.large-text p,
        body.large-text span,
        body.large-text a,
        body.large-text button,
        body.large-text input,
        body.large-text label,
        body.large-text small{
            font-size:clamp(1rem, 1em + 3px, 1.35rem) !important;
            line-height:1.55 !important;
        }

        body.large-text h1{
            font-size:clamp(1.8rem, 1em + 8px, 2.5rem) !important;
            line-height:1.2 !important;
        }

        body.large-text h2{
            font-size:clamp(1.45rem, 1em + 6px, 2rem) !important;
            line-height:1.25 !important;
        }

        body.large-text h3,
        body.large-text h4{
            font-size:clamp(1.1rem, 1em + 4px, 1.55rem) !important;
            line-height:1.35 !important;
        }

        body.large-text .card h3,
        body.large-text .market-card h3,
        body.large-text .related-card h4,
        body.large-text .cart-info h3{
            height:auto;
            min-height:44px;
        }

        body.large-text .accessibility-options{
            width:min(300px, calc(100vw - 28px));
        }

        body.large-text .add-cart{
            font-size:1rem !important;
            line-height:1 !important;
            min-height:40px;
        }

        body.large-text .quantity-box button{
            width:32px !important;
            height:32px !important;
            min-width:32px !important;
            min-height:32px !important;
            flex-basis:32px !important;
            font-size:1rem !important;
            line-height:1 !important;
            padding:0 !important;
            border-radius:50% !important;
        }

        body.large-text .quantity-box span{
            font-size:1rem !important;
            line-height:1 !important;
        }

        body.high-contrast{
            background:#000 !important;
            color:#fff !important;
        }

        body.high-contrast .container,
        body.high-contrast .card,
        body.high-contrast .market-card,
        body.high-contrast .seller-card,
        body.high-contrast .category,
        body.high-contrast .search-box,
        body.high-contrast .bottom-nav,
        body.high-contrast .product-area,
        body.high-contrast .description,
        body.high-contrast .benefits,
        body.high-contrast .related-card,
        body.high-contrast .cart-card,
        body.high-contrast .cart-summary,
        body.high-contrast .checkout-section,
        body.high-contrast .checkout-item,
        body.high-contrast .success-panel,
        body.high-contrast .menu-list,
        body.high-contrast .menu-item,
        body.high-contrast .order-card,
        body.high-contrast .input-box,
        body.high-contrast .social-btn,
        body.high-contrast .logout-btn,
        body.high-contrast .accessibility-options{
            background:#000 !important;
            color:#fff !important;
            border-color:#fff !important;
        }

        body.high-contrast a,
        body.high-contrast i,
        body.high-contrast p,
        body.high-contrast span,
        body.high-contrast h1,
        body.high-contrast h2,
        body.high-contrast h3,
        body.high-contrast h4,
        body.high-contrast strong,
        body.high-contrast input{
            color:#fff !important;
        }

        body.high-contrast .add-cart,
        body.high-contrast .checkout-btn,
        body.high-contrast .confirm-order-btn,
        body.high-contrast .continue-btn,
        body.high-contrast .add-cart-btn,
        body.high-contrast .discount,
        body.high-contrast .cart-count,
        body.high-contrast #toast{
            background:#ffd400 !important;
            color:#000 !important;
        }

        body.high-contrast img{
            background:#fff;
        }

        body.reduce-motion *,
        body.reduce-motion *::before,
        body.reduce-motion *::after{
            animation-duration:.01ms !important;
            animation-iteration-count:1 !important;
            scroll-behavior:auto !important;
            transition-duration:.01ms !important;
        }

        @media (prefers-reduced-motion: reduce){
            *,
            *::before,
            *::after{
                animation-duration:.01ms !important;
                animation-iteration-count:1 !important;
                scroll-behavior:auto !important;
                transition-duration:.01ms !important;
            }
        }
    `;

    document.head.appendChild(style);
}

addGlobalAccessibilityStyles();
createAccessibilityPanel();
bindAccessibilityControls();
applyAccessibilitySettings();
