# Online PS

## Introduction

An online image editor that lets you create and edit images using HTML5 technology. No need to buy, download, install, or use outdated Flash plugins. No ads. Key features: Layers, Filters, an open-source Photoshop alternative.

freeps runs directly in the browser. You can create images by pasting from the clipboard (Ctrl+V) or by uploading from your computer (using the menu or drag-and-drop). No operations are sent to any server. Everything stays within your browser.

## Browser Support

- Chrome
- Firefox
- Opera
- Edge
- Safari
- Yandex

## How to Use

1.  **Open or Create a File**: You can open an image from your computer or create a new blank canvas.
2.  **Use the Toolbox**: Like the desktop version of PS, use the toolbox on the left to select tools like brushes, selections, text, erasers, etc.
3.  **Layer Operations**: Manage your layers in the layers panel on the right, including merging, sorting, and adjusting opacity.
4.  **Apply Adjustments and Filters**: Find and apply color balance, brightness/contrast, filters, and other effects from the top menu.
5.  **Export Your Work**: After finishing, use the "File" -> "Export as" menu to save your work as PNG, JPG, etc.

## Features

- **File**: Open images, directories, URLs, Data URLs, drag-and-drop, save (PNG, JPG, BMP, WEBP, animated GIF, TIFF, JSON (layer data)), print.
- **Edit**: Undo, cut, copy, paste, select, paste from clipboard.
- **Image**: Information, EXIF, trim, zoom, resize (Hermite resampling, default resize), rotate, flip, color correction (brightness, contrast, hue, saturation, lightness), auto color adjustment, grid, histogram, invert.
- **Layers**: Multi-layer system, difference, merge, flatten, transparency support.
- **Effects**: Black & White, Blur (Box, Gaussian, Stack, Zoom), Bulge/Pinch, Denoise, Desaturate, Dither, Dot Screen, Edge, Emboss, Enrich, Gamma, Grains, Grayscale, Heatmap, JPG Compression, Mosaic, Oil, Sepia, Sharpen, Solarize, Tilt-shift, Vignette, Vibrance, Vintage, Blueprint, Night Vision, Pencil, and Instagram filters: 1977, Aden, Clarendon, Gingham, Inkwell, Lo-fi, Toaster, Valencia, X-pro II.
- **Tools**: Pencil, Brush, Magic Wand, Eraser, Fill, Color Picker, Letters, Crop, Blur, Sharpen, Desaturate, Clone, Borders, Sprites, Key-points, Color zoom, Replace color, Restore transparency, Content fill.
- **Help**: Keyboard shortcuts, translate.

## Notes

- Since it runs in the browser, you may encounter performance bottlenecks when processing very large or multi-layered files.
- Please remember to save your important work frequently to prevent accidental loss if the browser closes.

This is deployed here only to provide users with an online experience, [Original author's address](https://github.com/viliusle/miniPaint)


## Build Instructions
This project uses webpack and npm. npm can install and update all libraries with a single simple command: `npm update`. Webpack can bundle many different js, css files into a single bundle.js file, which greatly reduces page load time.

### Requirements
- **GIT** - A free and open source distributed version control system.
- **npm** - A package manager, used to manage dependencies. Update it to the latest version using `npm install npm@latest -g`. Please ensure you have at least version 6: `npm run build`

### Build
```bash
git clone https://github.com/viliusle/miniPaint.git
cd miniPaint
npm install
```
This will install all dependencies from the `package.json` file into the `node_modules` folder.

There are two ways to edit files:
1.  Run `npm run server` - It will create a simple local server (webpack-dev-server) with live-reload support. Run the command, edit files, and use the `http://localhost:8080/` URL for debugging. This is the recommended way.
2.  Edit files and run the `npm run dev` command to generate/update `dist/bundle.js`.

To generate minified code for production, run `npm run build`. The code is built using webpack.

### Commands
- `npm update` - It will install all required libraries from the `package.json` file into the `node_modules` folder.
- `npm run` - Lists all possible npm run commands. (aka help)
- `npm run server` - Creates a `http://localhost:8080/` server for easy development (with live reload).
- `npm run dev` - Creates or updates the `dist/bundle.js` file so your changes are visible.
- `npm run build` - Builds for production.