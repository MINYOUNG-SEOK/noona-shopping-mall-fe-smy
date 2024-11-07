import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { useSearchParams, useNavigate } from "react-router-dom";
import OrderDetailDialog from "./component/OrderDetailDialog";
import OrderTable from "./component/OrderTable";
import SearchBox from "../../common/component/SearchBox";
import {
  getOrderList,
  setSelectedOrder,
} from "../../features/order/orderSlice";
import "./style/adminOrder.style.css";

const PAGE_SIZE = 3;

const AdminOrderPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { orderList, totalPageNum, loading, totalItemNum } = useSelector(
    (state) => state.order
  );
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    orderNum: query.get("orderNum") || "",
  });
  const [open, setOpen] = useState(false);

  const tableHeader = [
    "#",
    "Order#",
    "Order Date",
    "User",
    "Order Item",
    "Address",
    "Total Price",
    "Status",
  ];

  useEffect(() => {
    dispatch(getOrderList({ ...searchQuery }));
  }, [query]);

  useEffect(() => {
    if (searchQuery.orderNum === "") {
      delete searchQuery.orderNum;
    }
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();

    navigate("?" + queryString);
  }, [searchQuery]);

  const openEditForm = (order) => {
    setOpen(true);
    dispatch(setSelectedOrder(order));
  };

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2 display-center mb-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="오더번호"
            field="orderNum"
          />
        </div>
        <OrderTable
          header={tableHeader}
          data={orderList}
          openEditForm={openEditForm}
          totalOrders={totalItemNum}
          currentPage={parseInt(searchQuery.page)}
          pageSize={PAGE_SIZE}
          loading={loading}
        />

        <ReactPaginate
          nextLabel=">"
          previousLabel="<"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          pageCount={totalPageNum}
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link arrow"
          nextClassName="page-item"
          nextLinkClassName="page-link arrow"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link break"
          activeClassName="active"
          disableInitialCallback={true}
          forcePage={searchQuery.page - 1}
        />
      </Container>

      {open && <OrderDetailDialog open={open} handleClose={handleClose} />}
    </div>
  );
};

export default AdminOrderPage;
