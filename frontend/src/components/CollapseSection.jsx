import React, { useState } from "react";
import "./CollapseSection.css";

const CollapseSection = ({ title, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="collapse-section">
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="collapse-header"
      >
        {title} {isCollapsed ? "+" : "-"}
      </div>
      {!isCollapsed && <div className="collapse-content">{children}</div>}
    </div>
  );
};

export default CollapseSection;
