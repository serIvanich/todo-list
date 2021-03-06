import React from 'react';
import {Meta, Story} from '@storybook/react';
import {HashRouterDecorator, ReduxStoreProviderDecorator} from "../stories/decorators/ReduxStoreProviderDecorator";
import App from './App';

export default {
  title: 'TodoList/AppWithRedux',
  component: App,
 decorators: [ReduxStoreProviderDecorator, HashRouterDecorator],
} as Meta;

const Template: Story = (args) => <App {...args} />;

export const AddItemFormExample = Template.bind({});
AddItemFormExample.args = {};

