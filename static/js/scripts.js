const CONTENT_DIRECTORY = 'contents/';
const CONFIG_FILE = `${CONTENT_DIRECTORY}config.yml`;

const fallbackSections = [
    { id: 'home', nav: 'Home', title: 'Home', href: '#page-top', tone: 'light' },
    { id: 'publications', nav: 'Publications', title: 'Publications', icon: 'bi-file-text', tone: 'muted' },
    { id: 'projects', nav: 'Projects', title: 'Projects', icon: 'bi-folder2-open', tone: 'light' },
    { id: 'notes', nav: 'Notes', title: 'Notes', icon: 'bi-journal-text', tone: 'muted' },
    { id: 'experience', nav: 'Experience', title: 'Experience', icon: 'bi-briefcase', tone: 'light' },
    { id: 'awards', nav: 'Awards', title: 'Awards', icon: 'bi-award', tone: 'muted' }
];

function byId(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = byId(id);
    if (element && value !== undefined && value !== null) {
        element.textContent = String(value);
    }
}

function setTheme(theme, persist = true) {
    document.documentElement.dataset.theme = theme;
    if (persist) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            // The selected theme still applies for this page view.
        }
    }
    updateThemeButton(theme);
}

function updateThemeButton(theme) {
    const icon = byId('theme-toggle-icon');
    const text = byId('theme-toggle-text');
    const button = byId('theme-toggle');
    if (!icon || !text || !button) return;

    const isDark = theme === 'dark';
    icon.className = `bi ${isDark ? 'bi-sun' : 'bi-moon-stars'}`;
    text.textContent = isDark ? 'Light' : 'Dark';
    button.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
}

function configurePage(config) {
    document.documentElement.lang = config.language || 'en';
    document.title = config.title || 'Academic homepage';

    const description = byId('site-description');
    const author = byId('site-author');
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (description && config.description) description.content = config.description;
    if (author && config.author) author.content = config.author;
    if (themeColor && config['accent-color']) themeColor.content = config['accent-color'];

    setText('page-top-title', config['page-top-title'] || config.author);
    setText('top-section-bg-text', config['top-section-bg-text']);
    setText('copyright-text', config['copyright-text']);

    if (config['accent-color']) {
        document.documentElement.style.setProperty('--accent-light', config['accent-color']);
    }
    if (config['accent-color-dark']) {
        document.documentElement.style.setProperty('--accent-dark', config['accent-color-dark']);
    }

    const hero = byId('hero');
    if (hero && config['background-image']) {
        const backgroundPath = String(config['background-image']).replace(/"/g, '%22');
        hero.style.backgroundImage = `url("${backgroundPath}")`;
    }

    const profileImage = byId('profile-image');
    if (profileImage) {
        if (config['profile-image']) profileImage.src = config['profile-image'];
        profileImage.alt = config['profile-image-alt'] || `Portrait of ${config.author || 'the site author'}`;
    }

    configureLink('cv-link', config['cv-path'], true);
    configureLink('github-link', config['repository-url']);
    configureLink('license-link', config['license-url']);
    configureLink('upstream-link', config['upstream-url'], true);
}

function configureLink(id, href, hideWhenMissing = false) {
    const link = byId(id);
    if (!link) return;
    if (href) {
        link.href = href;
        link.hidden = false;
    } else if (hideWhenMissing) {
        link.hidden = true;
    }
}

function buildNavigation(sections) {
    const navigation = byId('navigation-links');
    if (!navigation) return;
    navigation.replaceChildren();

    sections.forEach((section) => {
        if (!section.id || section.nav === false) return;
        const link = document.createElement('a');
        link.className = 'nav-link';
        link.href = section.href || `#${section.id}`;
        link.textContent = section.nav || section.title || section.id;
        navigation.append(link);
    });
}

function buildSections(sections) {
    const root = byId('sections-root');
    if (!root) return;
    root.replaceChildren();

    sections.forEach((section, index) => {
        if (!section.id) return;

        const wrapper = document.createElement('section');
        wrapper.id = section.id;
        wrapper.className = `content-section tone-${section.tone || (index % 2 ? 'muted' : 'light')}`;
        wrapper.setAttribute('aria-labelledby', `${section.id}-title`);

        const container = document.createElement('div');
        container.className = 'container px-4 px-lg-5';

        const header = document.createElement('header');
        header.className = 'section-header';

        const heading = document.createElement('h2');
        heading.id = `${section.id}-title`;
        if (section.icon) {
            const icon = document.createElement('i');
            icon.className = `bi ${section.icon}`;
            icon.setAttribute('aria-hidden', 'true');
            heading.append(icon);
        }
        heading.append(document.createTextNode(section.title || section.id));

        const body = document.createElement('div');
        body.id = `${section.id}-md`;
        body.className = 'main-body';
        body.setAttribute('aria-live', 'polite');

        header.append(heading);
        container.append(header, body);
        wrapper.append(container);
        root.append(wrapper);
    });
}

async function loadMarkdown(section) {
    const target = byId(`${section.id}-md`);
    if (!target) return;

    try {
        const response = await fetch(`${CONTENT_DIRECTORY}${section.id}.md`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const markdown = await response.text();
        target.innerHTML = marked.parse(markdown);

        if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
            await window.MathJax.typesetPromise([target]);
        }
    } catch (error) {
        target.innerHTML = '';
        const notice = document.createElement('p');
        notice.className = 'content-error';
        notice.textContent = `This section could not load. Check contents/${section.id}.md.`;
        target.append(notice);
        console.error(`Unable to load section "${section.id}"`, error);
    }
}

function initializeNavigationBehavior() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = byId('navbarResponsive');

    byId('navigation-links')?.addEventListener('click', (event) => {
        if (event.target.closest('.nav-link') && navbarToggler && navbarCollapse?.classList.contains('show')) {
            navbarToggler.click();
        }
    });

    if (window.bootstrap?.ScrollSpy) {
        new bootstrap.ScrollSpy(document.body, { target: '#mainNav', offset: 86 });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const currentTheme = document.documentElement.dataset.theme || 'light';
    updateThemeButton(currentTheme);

    byId('theme-toggle')?.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
    });

    marked.use({ mangle: false, headerIds: false });

    let config = {};
    try {
        const response = await fetch(CONFIG_FILE);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        config = jsyaml.load(await response.text()) || {};
    } catch (error) {
        console.error('Unable to load contents/config.yml; using fallback settings.', error);
    }

    const sections = Array.isArray(config.sections) && config.sections.length ? config.sections : fallbackSections;
    configurePage(config);
    buildNavigation(sections);
    buildSections(sections);
    initializeNavigationBehavior();
    await Promise.all(sections.map(loadMarkdown));
});
