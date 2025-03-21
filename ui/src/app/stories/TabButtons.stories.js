import React, { useState } from "react";
import { FaUser, FaCog, FaUserShield } from "react-icons/fa";
import TabButtons from "../components/TabButtons";

export default {
  title: "Components/TabButtons",
  component: TabButtons,
};

const Template = (args) => {
  const [activeTab, setActiveTab] = useState(0);
  return <TabButtons {...args} onClick={setActiveTab} />;
};

export const Default = Template.bind({});
Default.args = {
  tabs: [
    { label: "Teams" },
    { label: "Admins" },
    { label: "Settings" },
  ],
};

export const WithIcons = Template.bind({});
WithIcons.args = {
  tabs: [
    { label: "Teams", icon: <FaUser /> },
    { label: "Admins", icon: <FaUserShield /> },
    { label: "Settings", icon: <FaCog /> },
  ],
};

export const ClickableTabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <TabButtons
        tabs={[
          { label: "Teams", icon: <FaUser /> },
          { label: "Admins", icon: <FaUserShield /> },
          { label: "Settings", icon: <FaCog /> },
        ]}
        onClick={setActiveTab}
      />
      <p className="mt-4">Active Tab: {activeTab}</p>
    </div>
  );
};
