import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Slider, SliderProps } from './Slider';

interface DummyItem {
  id: number;
  title: string;
  description?: string;
  image?: string;
}

// Демонстраційні дані
const dummyItems: DummyItem[] = [
  {
    id: 1,
    title: 'Product 1',
    description: 'Description of the product 1',
    image: 'https://picsum.photos/200/300?random=4',
  },
  {
    id: 2,
    title: 'Product 2',
    description: 'Description of the product 2',
    image: 'https://picsum.photos/200/300?random=5',
  },
  {
    id: 3,
    title: 'Product 3',
    description: 'Description of the product 3',
    image: 'https://picsum.photos/200/300?random=6',
  },
  {
    id: 4,
    title: 'Product 4',
    description: 'Description of the product 4',
    image: 'https://picsum.photos/200/300?random=7',
  },
  {
    id: 5,
    title: 'Product 5',
    description: 'Description of the product 5',
    image: 'https://picsum.photos/200/300?random=8',
  },
];

export default {
  title: 'Components/Slider',
  component: Slider,
  argTypes: {
    moveBy: {
      control: {
        type: 'radio',
        options: ['pixel', 'item'],
      },
      description: '[IN DEVELOPMENT]: Defines the logic for moving the slider. Currently only affects values for demonstration purposes.',
    },
    orientation: {
      control: {
        type: 'radio',
        options: ['horizontal', 'vertical'],
      },
    },
    moveValue: {
      control: 'number',
      description: 'Count of the pixels for moving toward (only in a PIXEL mode).',
    },
  },
} as Meta<SliderProps<DummyItem>>;

const Template: StoryFn<SliderProps<DummyItem>> = (args) => (
  <div style={{maxWidth: 600, margin: '0 auto'}}>
    <Slider
      {...args}
      renderItem={(item) => (
        <div
          key={item.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: 4,
            padding: 16,
            minWidth: 150,
            textAlign: 'center',
          }}
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.title}
              style={{width: '100%', height: 'auto', marginBottom: 8}}
            />
          )}
          <h3>{item.title}</h3>
          <p style={{fontSize: 12, color: '#666'}}>{item.description}</p>
        </div>
      )}
      items={dummyItems}
    />
  </div>
);

export const MoveByPixel = Template.bind({});
MoveByPixel.args = {
  moveBy: 'pixel', // todo: logic in development
  moveValue: 170,  // Зсув у пікселях (враховуючи розміри елемента + відступи)
  orientation: 'horizontal',
  responsive: false,
};

export const MoveByItem = Template.bind({});
MoveByItem.args = {
  moveBy: 'item', // todo: logic in development
  moveValue: 170,  // Значення зсуву використовується аналогічно, але може бути адаптовано для розрахунку ширини елемента
  orientation: 'horizontal',
  responsive: false,
};

export const VerticalSlider = Template.bind({});
VerticalSlider.args = {
  moveBy: 'pixel',
  moveValue: 250, // Для вертикального слайдера — значення зсуву по осі Y
  orientation: 'vertical',
  responsive: false,
};
