import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

const sourceUrl = 'https://github.com/JeffreySanford/public-sector-federation';
const storybookUrl = 'https://6a57d5b6de2da2591d3236aa-zpjdyybmmw.chromatic.com/';

const themeSyncScript = `
(() => {
  const root = document.documentElement;
  const syncTokenTheme = () => {
    root.classList.toggle('p-dark', root.dataset.theme === 'dark');
  };

  syncTokenTheme();
  new MutationObserver(syncTokenTheme).observe(root, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  document.addEventListener('astro:after-swap', syncTokenTheme);
})();
`;

export default defineConfig({
  base: '/docs',
  outDir: '../../dist/apps/starlight',
  integrations: [
    mermaid({
      autoTheme: true,
      mermaidConfig: {
        fontFamily: 'var(--ps-font-family)',
        securityLevel: 'strict',
      },
    }),
    starlight({
      title: 'Public Sector Design System',
      description:
        'Guidance, component contracts, accessibility evidence, and design-to-code alignment for a governed Angular design system.',
      customCss: ['@public-sector/tokens/tokens.css', './src/styles/custom.css'],
      social: [{ icon: 'github', label: 'GitHub', href: sourceUrl }],
      editLink: {
        baseUrl: `${sourceUrl}/edit/master/apps/starlight/`,
      },
      lastUpdated: true,
      credits: false,
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/svg+xml',
            href: '/docs/favicon.svg',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'theme-color',
            content: '#1d4ed8',
          },
        },
        {
          tag: 'script',
          content: themeSyncScript,
        },
      ],
      sidebar: [
        { label: 'Overview', link: '/' },
        {
          label: 'Foundations',
          items: [{ label: 'Foundations overview', link: '/foundations/' }],
        },
        {
          label: 'Components',
          items: [{ label: 'Component overview', link: '/components/' }],
        },
        {
          label: 'Patterns',
          items: [{ label: 'Pattern overview', link: '/patterns/' }],
        },
        {
          label: 'Accessibility',
          items: [{ label: 'Accessibility overview', link: '/accessibility/' }],
        },
        {
          label: 'Develop',
          items: [{ label: 'Developer overview', link: '/develop/' }],
        },
        {
          label: 'Quality',
          items: [
            { label: 'Quality overview', link: '/quality/' },
            { label: 'Open Storybook', link: storybookUrl, attrs: { target: '_blank' } },
          ],
        },
        {
          label: 'Architecture',
          items: [{ label: 'System architecture', link: '/architecture/' }],
        },
        {
          label: 'Exploration',
          items: [{ label: 'Exploration overview', link: '/exploration/' }],
        },
      ],
    }),
  ],
});
