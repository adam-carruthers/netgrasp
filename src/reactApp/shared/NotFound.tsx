import React from "react";

const NotFound: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <div className="d-flex flex-column h-100">
    <div className="flex-grow-1" />
    <h3 className="mb-1">{title}</h3>
    <span className="text-secondary">{subtitle}</span>
    <div className="flex-grow-1" />
  </div>
);

export default NotFound;
