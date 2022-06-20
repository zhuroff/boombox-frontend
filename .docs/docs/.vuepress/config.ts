import { defineConfig } from 'vuepress/config';

export default defineConfig({
  title: 'BoomBox',
  description: 'Документация приложения BoomBox',
  port: 4200,
  themeConfig: {
    sidebar: [
      {
        title: 'Frontend',
        path: '/frontend/',
        collapsable: true,
        sidebarDepth: 1,
        children: [
          '/frontend/components',
          '/frontend/pages'
        ]
      },
      {
        title: 'Backend',
        path: '/backend/',
        collapsable: true,
        sidebarDepth: 1,
        children: [
          '/backend/controllers',
          '/backend/dtos'
        ]
      }
    ]
  }
});
