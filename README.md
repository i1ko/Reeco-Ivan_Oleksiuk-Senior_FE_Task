# React Best Slider

This repository contains a React-based slider library built with TypeScript. The library is designed to be compatible with both Webpack and Vite projects, ensuring broad integration possibilities. The slider component supports various modes of movement (by pixels or by item) and orientations (horizontal or vertical).

**To test, I recommend to install project and run storybook!**  

### Introduction
This slider library (referred to as "React-Best-Slider") is designed to provide a robust, flexible, and modern approach to implementing sliders in React applications. It offers:

- Render Prop approach for rendering items (i.e., passing items via props and using a renderItem function).
- Optionally supporting "move by pixel" or "move by item".
- Configurable orientation (horizontal or vertical).
- Different centering strategies (e.g., edge alignment vs. center alignment).
- A built-in Storybook environment to showcase and test the slider in isolation.


### A typical top-level directory layout (todo!)

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

### Storybook Integration
Storybook is included to demonstrate and test the slider in an isolated environment. Advantages:

You can open Storybook to see live examples of the slider (horizontal/vertical orientation, move-by-item vs. move-by-pixel, etc.).
It allows front-end developers to quickly test edge cases, verify styling, and prototype new features.
The isolation helps ensure that changes to the slider logic don’t unexpectedly affect the rest of your app.
You can integrate the slider’s Storybook with a larger project’s Storybook using the composition feature, making it easy to showcase or reuse.

### Render Prop vs. Children
**Why do we use render prop with an items array?**
1. Data-driven approach: It’s common in real-world scenarios to have an array of data items (e.g., from an API). The slider can iterate over these items internally, rendering each one via a "renderItem" callback.
2. Clear contract: By passing an array of items plus a rendering function, you centralize data handling while giving full control over how each item is displayed.
3. Predictable and testable: This pattern ensures the slider’s logic is testable, and the rendering function can be altered without affecting the slider’s internal structure.

**Why not just children?**

- A children-based approach offers more flexibility in placing arbitrary JSX elements inside the slider. However, that flexibility can complicate indexing, measuring the size of each child, etc.
- By providing a render prop, we ensure the slider code only needs to focus on the logic of sliding, while the caller is responsible for the shape of each item.

## Potential Bugs and Ongoing Improvements
- Image Loading / Resizing Issue: A common challenge is ensuring that the slider offsets are recalculated after images are loaded (since the total width or height may increase). We use a ResizeObserver to mitigate this, but further refinements might be necessary if you encounter timing-related or pixel-perfect alignment issues.
- Move-by-Pixel vs. Move-by-Item Logic: If you need an exact number of clicks equal to the items in your array, consider using the move-by-item approach or adjusting moveValue to match your use case. Move-by-pixel can result in more or fewer clicks than the item count if items have variable sizes.

#### Issues to fix and Improvements to be done that we've already known:
- [IMPROVEMENT]: added ability to set initialSlide
- [BUG]: rollup cause the problems where install the packages need to be provided with
```--legacy-peer-deps```
- [EXAMPLE]: example with vertical alignment is not working because we need to change a wrapper 

## Building and Publishing
**To build the library:**

1. Ensure you have a rollup.config.js with input set to your main entry file (e.g., src/index.ts).
2. Run npm run build to generate the dist folder with both CommonJS and ES modules.
Update your package.json to point "main", "module", and "types" to the files inside dist.
3. Increment the version, then run npm publish if you want to publish to npm.

## Testing the Library in a New Project
**To verify the library in a realistic environment:**

1. Create a new React project (e.g., create-react-app or Vite).
2. Install the published library: npm install react-best-slider
3. Import and utilize the slider inside your project’s code to confirm it behaves as expected.

## Conclusion
React-Best-Slider is intended to be a straightforward yet powerful slider solution. By focusing on a render prop approach, we keep data handling simple and testable while allowing flexible rendering of individual items. Storybook integration helps front-end developers validate styles and interactions in an isolated environment.

If you have any questions, encounter any bugs, or want to propose new features, feel free to open issues in the repository or submit pull requests. Thank you for checking out React-Best-Slider, and we hope it meets your needs for building rich, data-driven sliders in React!
