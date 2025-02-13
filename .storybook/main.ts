import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  refs: {
    'my-slider-library': {
      title: 'My Slider Library',
      url: 'https://your-slider-library-storybook-url', // URL, де розгорнуто Storybook для бібліотеки
    },
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};
export default config;
