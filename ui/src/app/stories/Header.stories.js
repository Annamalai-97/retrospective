
import React from 'react';
import Header from '../components/Header';

export default {
  title: 'Components/Header',
  component: Header,
  argTypes: {
    toggleSidebar: { action: 'toggled' },  
  },
};

const Template = (args) => <Header {...args} />;

export const Default = Template.bind({});

Default.args = {
  toggleSidebar: () => {
    console.log('Sidebar toggled!');
  },
};
