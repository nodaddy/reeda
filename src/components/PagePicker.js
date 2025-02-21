import { Select, Card } from "antd";
import { useState } from "react";

const PagePicker = ({ totalPages, currentPage, onPageSelect }) => {
  const [selectedPage, setSelectedPage] = useState(currentPage);

  const pageOptions = Array.from({ length: totalPages }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  return (
    <Card
      bodyStyle={{
        padding: "0px",
      }}
      style={{
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        padding: "0px",
        backgroundColor: "transparent",
        border: "0px",
        zIndex: "9999",
        width: "100%",
      }}
    >
      <Select
        value={selectedPage}
        onChange={(e) => {
          setSelectedPage(e);
          onPageSelect(e);
        }}
        options={pageOptions}
        dropdownRender={(menu) => (
          <div style={{ overflowY: "auto" }}>{menu}</div>
        )}
        style={{
          textAlign: "center",
          opacity: "0",
          borderRadius: "8px",
          width: "118px",
          height: "52px",
          fontSize: "16px",
          padding: "0px",
        }}
      />
    </Card>
  );
};

export default PagePicker;
