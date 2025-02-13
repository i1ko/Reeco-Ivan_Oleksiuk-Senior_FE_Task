import React from 'react';
import {Meta, StoryFn} from '@storybook/react';
import {Slider, SliderCentrateBy, SliderMoveBy, SliderOrientation, SliderProps} from './Slider';

interface DummyItem {
  id: number;
  title: string;
  description?: string;
  image?: string;
}
// Test data
const dummyItems: DummyItem[] = [
  {
    id: 1,
    title: 'Product 1',
    description: 'Description of the product 1',
    image: 'https://picsum.photos/200/300?random=1',
  },
  {
    id: 2,
    title: 'Product 2',
    description: 'Description of the product 2',
    image: 'https://picsum.photos/200/300?random=2',
  },
  {
    id: 3,
    title: 'Product 3',
    description: 'Description of the product 3',
    image: 'https://picsum.photos/200/300?random=3',
  },
  {
    id: 4,
    title: 'Product 4',
    description: 'Description of the product 4',
    image: 'https://picsum.photos/200/300?random=4',
  },
  {
    id: 5,
    title: 'Product 5',
    description: 'Description of the product 5',
    image: 'https://picsum.photos/200/300?random=5',
  },
  {
    id: 6,
    title: 'Product 6',
    description: 'Description of the product 6',
    image: 'https://picsum.photos/200/300?random=6',
  },
  {
    id: 7,
    title: 'Product 7',
    description: 'Description of the product 7',
    image: 'https://picsum.photos/200/300?random=7',
  },
  {
    id: 8,
    title: 'Product 8',
    description: 'Description of the product 8',
    image: 'https://picsum.photos/200/300?random=8',
  },
  {
    id: 9,
    title: 'Product 9',
    description: 'Description of the product 9',
    image: 'https://picsum.photos/200/300?random=9',
  },
  {
    id: 10,
    title: 'Product 10',
    description: 'Description of the product 10',
    image: 'https://picsum.photos/200/300?random=10',
  },
  {
    id: 11,
    title: 'Product 11',
    description: 'Description of the product 11',
    image: 'https://picsum.photos/200/300?random=11',
  },
  {
    id: 12,
    title: 'Product 12',
    description: 'Description of the product 12',
    image: 'https://picsum.photos/200/300?random=12',
  },
];

export default {
  title: 'Components/Slider',
  component: Slider,
  argTypes: {
    moveBy: {
      control: {
        type: 'radio',
        options: Object.keys(SliderMoveBy)
      },
      description: 'Choose the mode where either you can move toward with items or with pixels.',
    },
    orientation: {
      control: {
        type: 'radio',
        options: Object.keys(SliderOrientation),
      },
    },
    centrateBy: {
      control: {
        type: 'radio',
        options: Object.keys(SliderCentrateBy),
      },
    },
    moveValue: {
      control: 'number',
      description: 'Count of pixels or elements to move toward per click',
    },
    gap: {
      control: 'number',
      description: 'Gap between items in pixels.',
    },
  },
} as Meta<SliderProps<DummyItem>>;

const Template: StoryFn<SliderProps<DummyItem>> = (args) => {
  const isHorizontalOrientation = args.orientation === SliderOrientation.Horizontal;
  const isVerticalOrientation = args.orientation === SliderOrientation.Vertical;
  return (
    // For the vertical slider, we will set fix height of the container
    <div
      style={{
        margin: '0 auto',
        maxWidth: isHorizontalOrientation ? 600 : 'auto',
        maxHeight: isVerticalOrientation ? '300px' : 'auto',
        height: isVerticalOrientation ? '300px' : 'auto',
        overflow: isVerticalOrientation ? 'hidden' : 'unset',
      }}
    >
      <Slider
        {...args}
        renderItem={(item) => (
          <div
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
                style={{
                  width: isHorizontalOrientation ? '100%' : '20%',
                  height: isHorizontalOrientation ? 'auto' : '20%',
                  marginBottom: 8,
                }}
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
}

export const MoveByPixel = Template.bind({});
MoveByPixel.args = {
  moveBy: SliderMoveBy.Pixel,
  moveValue: 150,  // Count of pixel for 1 step
  gap: 10,         // space beetwen the elements
  orientation: SliderOrientation.Horizontal,
};
export const DefaultSlider = Template.bind({});
DefaultSlider.args = {};

export const MoveByItem = Template.bind({});
MoveByItem.args = {
  moveBy: SliderMoveBy.Item,
  moveValue: 2,
  gap: 10,
  orientation: SliderOrientation.Horizontal,
};

export const VerticalSlider = Template.bind({});
VerticalSlider.args = {
  moveBy: SliderMoveBy.Pixel,
  moveValue: 200,
  gap: 15,
  orientation: SliderOrientation.Vertical,
};
