
import React from 'react';
import Sidebar from '../components/Sidebar';

export default {
  title: 'Components/Sidebar',
  component: Sidebar,
  argTypes: {
    isSidebarOpen: { control: 'boolean' },
  },
};

const Template = (args) => <Sidebar {...args} />;

export const Open = Template.bind({});
Open.args = {
  isSidebarOpen: true,
};

export const Closed = Template.bind({});
Closed.args = {
  isSidebarOpen: false,
};
