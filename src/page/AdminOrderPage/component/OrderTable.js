import React from "react";
import { Table, Badge, Spinner } from "react-bootstrap";
import { FadeLoader } from "react-spinners";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderTable = ({
  header,
  data,
  openEditForm,
  totalOrders = 0,
  currentPage = 1,
  pageSize = 3,
  loading,
}) => {
  return (
    <div className="overflow-x">
      <div className="mb-2">총 {totalOrders}개의 주문</div>
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
              <tr
                key={item._id}
                onClick={() => openEditForm(item)}
                style={{ cursor: "pointer" }}
              >
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {totalOrders - ((currentPage - 1) * pageSize + index)}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.orderNum}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.createdAt.slice(0, 10)}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.userId.email}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.items.length > 0 ? (
                    <>
                      {item.items[0].productId.name}
                      {item.items.length > 1 &&
                        ` 외 ${item.items.length - 1}개`}
                    </>
                  ) : (
                    "-"
                  )}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {item.shipTo.address + " " + item.shipTo.city}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  {currencyFormat(item.totalPrice)}
                </td>
                <td style={{ verticalAlign: "middle", textAlign: "center" }}>
                  <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length} style={{ textAlign: "center" }}>
                주문 내역이 없습니다
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderTable;
