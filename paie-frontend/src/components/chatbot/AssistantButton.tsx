
import React from 'react';
import AssistantRH from './AssistantRH';

interface AssistantButtonProps {
  isEmployee?: boolean;
}

const AssistantButton: React.FC<AssistantButtonProps> = ({ isEmployee = false }) => {
  return <AssistantRH isEmployee={isEmployee} />;
};

export default AssistantButton;
