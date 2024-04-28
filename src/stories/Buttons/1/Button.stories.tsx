import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Components/Buttons/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  //tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: {
      control: "color",
      description: "The background color of the button",
    },
    borderRadius: {
      control: "number",
      description: "The border radius of the button",
    },
    Title: {
      control: "text",
      description: "The text to display in the button ",
    },
    outline: {
      control: "select",
      options: [
        "none",
        "solid",
        "dashed",
        "dotted",
        "double",
        "groove",
        "ridge",
        "inset",
        "outset",
      ],
      description: "Outline of the button ",
    },
    outlineColor: { control: "color", description: "Color of the outline " },
    outlineWidth: { control: "number", description: "Width of the outline " },
    className: { control: "text", description: "Custom tailwind styling" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    className: "text-red-500 w-auto ",
    Title: "Button",
  },
};
