const { description } = require('../package')
const vuepressBar = require('vuepress-bar');

const { sidebar } = vuepressBar({
  addReadMeToFirstGroup: false,
});

module.exports = {
  title: 'Procursus',
  description: 'A new, powerful, cross-compilation *OS bootstrap.',
  head: [
    ['meta', {
      name: 'theme-color',
      content: '#3eaf7c',
    }],
    ['meta', {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    }],
    ['meta', {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'black',
    }],
  ],
  base: '/',
  theme: 'vuepress-theme-succinct',
  globalUIComponents: [
    'ThemeManager',
  ],

  themeConfig: {
    repo: 'https://github.com/ProcursusTeam/Procursus.git',
    docsRepo: 'https://github.com/ProcursusTeam/docs.git',
    lastUpdated: true,
    docsDir: '/',
    editLinkText: '',
    logo: '/images/logo.png',
    sidebar: [
      ['/', 'Home'],
      sidebar.find(x => x.title === 'Installation'),
      sidebar.find(x => x.title === 'Development'),
      ['/Contribution.md', 'Contribution'],
    ],
  },
  plugins: [
    ['vuepress-plugin-code-copy', true],
    ['flexsearch'],
    '@vuepress/plugin-back-to-top',
    'vuepress-plugin-smooth-scroll',
    ['vuepress-plugin-medium-zoom', {
      selector: 'img',
      options: {
        background: 'var(--bodyBgColor)',
      },
    }],
  ],
};
