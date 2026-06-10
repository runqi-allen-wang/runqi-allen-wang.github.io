const content_dir = 'contents/';
const config_file = 'config.yml';
const section_names = ['home', 'publications', 'projects', 'experience', 'awards'];

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        console.log(e);
    }
    updateThemeButton(theme);
}

function updateThemeButton(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    const text = document.getElementById('theme-toggle-text');
    if (!icon || !text) return;

    if (theme === 'dark') {
        icon.className = 'bi bi-sun';
        text.textContent = 'Light';
    } else {
        icon.className = 'bi bi-moon-stars';
        text.textContent = 'Dark';
    }
}

window.addEventListener('DOMContentLoaded', event => {

    // Theme switch
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeButton(currentTheme);

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const oldTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = oldTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log('Unknown id and value: ' + key + ',' + yml[key].toString());
                }
            });
        })
        .catch(error => console.log(error));

    // Marked
    marked.use({ mangle: false, headerIds: false });
    section_names.forEach((name) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            })
            .then(() => {
                // MathJax
                if (window.MathJax && MathJax.typeset) {
                    MathJax.typeset();
                }
            })
            .catch(error => console.log(error));
    });

});
