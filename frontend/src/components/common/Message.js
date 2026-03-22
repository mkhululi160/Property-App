import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const Message = ({ type = 'info', children }) => {
  const types = {
    success: { icon: FaCheckCircle, color: 'text-green-800', bg: 'bg-green-100', border: 'border-green-400' },
    error: { icon: FaTimesCircle, color: 'text-red-800', bg: 'bg-red-100', border: 'border-red-400' },
    warning: { icon: FaExclamationCircle, color: 'text-yellow-800', bg: 'bg-yellow-100', border: 'border-yellow-400' },
    info: { icon: FaInfoCircle, color: 'text-blue-800', bg: 'bg-blue-100', border: 'border-blue-400' },
  };

  const { icon: Icon, color, bg, border } = types[type];

  return (
    <div className={`${bg} border ${border} ${color} px-4 py-3 rounded relative mb-4`}>
      <div className="flex items-center">
        <Icon className="mr-2" />
        <span>{children}</span>
      </div>
    </div>
  );
};

export default Message;