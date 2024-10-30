import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { currencyFormat } from "../../../utils/number";

function formatDate(dateString) {
  const date = new Date(dateString);
  // 날짜가 유효하지 않은 경우, "Invalid Date" 메시지 반환
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
}

const ProductTable = ({ header, data, deleteItem, openEditForm }) => {
  // 인덱스 역순으로 정렬
  const sortedData = [...data].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="overflow-x product-table-container">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th
                key={index}
                style={{ verticalAlign: "middle", textAlign: "center" }}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <tr key={index}>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {sortedData.length - index}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.sku}
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    minWidth: "100px",
                  }}
                >
                  {item.name}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {currencyFormat(item.price)}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {Object.keys(item.stock).map((size, idx) => (
                    <div key={idx}>
                      {size}: {item.stock[size]}
                    </div>
                  ))}
                </td>
                <td
                  style={{
                    padding: 0,
                    verticalAlign: "middle",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={item.image}
                    alt="product"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      height: "70px",
                      objectFit: "cover",
                    }} // 동일한 높이로 설정
                  />
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.status}
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    maxWidth: "100px",
                  }}
                >
                  {formatDate(item.createdAt)}
                </td>
                <td
                  style={{
                    verticalAlign: "middle",
                    textAlign: "center",
                    maxWidth: "70px",
                  }}
                >
                  <div className="responsive-btn-container">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteItem(item._id)}
                      style={{ width: "70px" }} // Delete 버튼의 너비 설정
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openEditForm(item)}
                      style={{
                        backgroundColor: "#5d90ed",
                        borderColor: "#5d90ed",
                        width: "70px", // Edit 버튼의 너비를 Delete와 동일하게 설정
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length} style={{ textAlign: "center" }}>
                No Data to show
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ProductTable;
