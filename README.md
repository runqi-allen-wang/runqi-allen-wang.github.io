# Runqi Academic Homepage

A configuration-driven academic homepage for GitHub Pages. It keeps the simplicity of a static site—no framework, package manager, or build step—while adding dark mode, responsive project cards, Markdown content, LaTeX rendering, and configurable navigation.

The repository currently uses [Runqi Wang's homepage](https://runqi-allen-wang.github.io/) as its live demo. Fork it, replace the personal content, and publish from the root of your repository.

> 中文说明：这是一个可直接部署到 GitHub Pages 的学术主页模板。个人信息集中在 `contents/` 和 `static/assets/`；发布自己的版本前，请替换示例中的头像、简历、文字与项目图片。

## What is included

- Markdown-based sections with optional MathJax/LaTeX
- One YAML file for identity, metadata, links, colors, navigation, and section order
- Responsive light and dark themes with a saved preference
- Reusable publication, project, note, experience, and award sections
- No build process: GitHub Pages can serve the repository directly
- Accessible navigation, keyboard skip link, readable mobile layouts, and reduced-motion support
- Explicit upstream attribution and third-party notices

## Use the template

1. Click **Use this template** when that button is enabled, or fork the repository to preserve the ancestry automatically.
2. Name the repository `<your-username>.github.io` for a user site, or use any repository name for a project site.
3. Edit [`contents/config.yml`](contents/config.yml) with your name, metadata, links, images, accent color, and section order.
4. Replace the Markdown files in [`contents/`](contents/) with your own biography, publications, projects, notes, experience, and awards.
5. Replace the portrait, background, CV, and project images under [`static/assets/`](static/assets/).
6. In GitHub, open **Settings → Pages**, choose **Deploy from a branch**, and publish the repository root from `main`.

GitHub Pages can take several minutes to update after a push.

## Preview locally

The page loads YAML and Markdown with `fetch`, so opening `index.html` directly from the file system will not work in most browsers. Start a small local server from the repository root:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Customize the site

Most changes belong in these locations:

| What to change | File or directory |
| --- | --- |
| Name, metadata, hero, light/dark accent colors, links | `contents/config.yml` |
| Biography and social badges | `contents/home.md` |
| Publications, projects, notes, experience, awards | `contents/*.md` |
| Portrait, background, CV, project images | `static/assets/` |
| Visual theme and card layout | `static/css/main.css` |
| Page shell and footer credit | `index.html` |

Sections are driven by the `sections` list in `contents/config.yml`. Each `id` loads `contents/<id>.md`:

```yaml
sections:
  - id: home
    nav: Home
    title: Your Name
    href: "#page-top"
    tone: light
  - id: publications
    nav: Publications
    title: Publications
    icon: bi-file-text
    tone: muted
```

To add a section, add one item to this list and create the matching Markdown file. To hide the CV button, remove `cv-path` from the configuration.

## Publishing this as your own derivative

You are welcome to make substantial changes and publish a derivative under your name. The cleanest approach is:

- describe your version and original work accurately in the README;
- keep the upstream copyright and MIT license notice;
- keep [`NOTICE.md`](NOTICE.md), updating its “Modifications” section with your own changes;
- do not imply that the original author endorses your derivative; and
- replace this repository's personal text and media before presenting the result as a reusable template.

If you preserve the GitHub fork relationship, GitHub displays the upstream link automatically. If you publish a new standalone repository, the `LICENSE`, `NOTICE.md`, and README attribution become especially important.

## Attribution

This project is a derivative of [senli1073/academic-homepage-template](https://github.com/senli1073/academic-homepage-template) by Sen Li, used under the MIT License. The original template is based on [Start Bootstrap — New Age](https://github.com/StartBootstrap/startbootstrap-new-age). See [`NOTICE.md`](NOTICE.md) for details and bundled-library notices.

The visible footer credit is intentionally retained as a concise acknowledgement. The MIT License does not require prominent advertising, but it does require preserving the copyright and permission notice in copies or substantial portions of the software.

## Content and media

The MIT License in this repository applies to the template source code and documentation. Unless a file says otherwise, Runqi Wang's biography, CV, portrait, publication figures, project images, and other personal media are demonstration content and are **not licensed for reuse**. Replace them before publishing your own site. Third-party names, logos, papers, and linked works remain the property of their respective owners.

## License

Template code is available under the [MIT License](LICENSE). The original and modification copyright notices are both retained.
