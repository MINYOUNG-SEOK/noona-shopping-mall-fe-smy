import React from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { FadeLoader } from "react-spinners";
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

const ProductTable = ({
  header,
  data,
  deleteItem,
  openEditForm,
  currentPage,
  pageSize,
  totalProducts,
  loading,
}) => {
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
          {loading ? (
            <tr>
              <td colSpan={header.length} style={{ padding: "2rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FadeLoader color="#333333" height={15} width={5} />
                </div>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {totalProducts - ((currentPage - 1) * pageSize + index)}
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
                  {item.stock &&
                    Object.keys(item.stock).map((size, idx) => (
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
                    width: "120px",
                    height: "120px",
                  }}
                >
                  <img
                    src={item.image}
                    alt="product"
                    style={{
                      display: "block",
                      margin: "10px",
                      height: "100px",
                      width: "100px",
                      objectFit: "cover",
                    }}
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
                    Width: "50px",
                  }}
                >
                  <div className="responsive-btn-container">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => deleteItem(item._id)}
                      style={{
                        width: "60px",
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openEditForm(item)}
                      style={{
                        backgroundColor: "#5d90ed",
                        borderColor: "#5d90ed",
                        width: "60px",
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
