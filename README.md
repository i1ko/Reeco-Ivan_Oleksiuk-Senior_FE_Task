# React Best Slider

This repository contains a React-based slider library built with TypeScript. The library is designed to be compatible with both Webpack and Vite projects, ensuring broad integration possibilities. The slider component supports various modes of movement (by pixels or by item) and orientations (horizontal or vertical).

**To test, I recommend to install project and run storybook!**  

### A typical top-level directory layout (ntbd!)

    .
    ├── src                     # Source code for components
    ├── docs                    # Documentation files (alternatively `doc`)
    ├── src                     # Source files (alternatively `lib` or `app`)
    ├── test                    # Automated tests (alternatively `spec` or `tests`)
    ├── tools                   # Tools and utilities
    ├── LICENSE
    └── README.md

## Prerequisites

- **Node.js:**  
  This project uses a specific Node.js version as specified in the `.nvmrc` file. It is **highly recommended** to use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) to manage your Node versions.

  **To switch to the recommended Node.js version:**
  ```bash
  nvm use
  ```
If you do not have nvm installed, please follow the installation instructions on the nvm repository.

Setup and Installation
Clone the Repository:

```bash
git clone <repository-url>
cd react-best-slider
```
Switch to the Recommended Node Version:

```bash
nvm use
```
Install Dependencies (recommend using npm):

```bash
npm install
```
## Running Storybook

Storybook is set up to provide an isolated environment for developing and testing the slider component.

### Start Storybook:
```bash
npm run storybook
```
This command launches Storybook in your default browser, allowing you to view and interact with the slider component with various configurations (e.g., moving by pixels, moving by item, vertical orientation).

### Storybook Configuration: 
The configuration is located in the .storybook directory. This setup uses Vite as the builder for a fast development experience. If needed, you can switch to Webpack by modifying the builder settings in .storybook/main.js.

## Issues to fix and Improvements to be done:
- <del>[IMPROVEMENT]: to centrate items different modes</del>
- [BUG]: bug that appears due to first load without the images
