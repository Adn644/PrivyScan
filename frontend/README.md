# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Template background asset

To enable the site-wide template background (bottom-right grass image) for all pages except the homepage:

- Place your image at `frontend/public/assets/grass.png` (create the `assets` folder if needed).
- The `Template` layout in `frontend/src/components/Template.jsx` uses this asset at `/assets/grass.png`.
- Wrap non-home routes with the `Template` route in `frontend/src/App.jsx` to apply the background.

Example: add routes inside the `<Route element={<Template />}>` block in `frontend/src/App.jsx`.
