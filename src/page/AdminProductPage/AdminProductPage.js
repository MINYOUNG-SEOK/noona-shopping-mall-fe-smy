import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SearchBox from "../../common/component/SearchBox";
import NewItemDialog from "./component/NewItemDialog";
import ProductTable from "./component/ProductTable";
import {
  getProductList,
  deleteProduct,
  setSelectedProduct,
} from "../../features/product/productSlice";

const AdminProductPage = () => {
  const navigate = useNavigate();
  const { productList} = useSelector((state) => state.product);
  const [query, setQuery] = useSearchParams();
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  });

  const [mode, setMode] = useState("new");

  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "Created At",
    "",
  ];

  // 검색어가 변경될 때마다 URL과 상태를 업데이트
  useEffect(() => {
    if (searchQuery.name === "") delete searchQuery.name;
    const params = new URLSearchParams(searchQuery);
    console.log("Updated URL Params:", params.toString());
    navigate(`?${params.toString()}`, { replace: true });
  }, [searchQuery, navigate]);

  useEffect(() => {
    console.log("Dispatching getProductList with Query:", searchQuery);
    dispatch(getProductList({ ...searchQuery }));
  }, [searchQuery, dispatch]);

  const deleteItem = (id) => {
    // 아이템 삭제 처리
    dispatch(deleteProduct(id));
  };

  const openEditForm = (product) => {
    // edit 모드로 설정 후 아이템 수정 다이얼로그 열기
    setMode("edit");
    dispatch(setSelectedProduct(product));
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    // new 모드로 설정 후 다이얼로그 열기
    setMode("new");
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    // 페이지 번호가 변경될 때 현재 페이지 상태 업데이트
  };

  // searchbox에서 검색어를 읽어온다 => 엔터를 치면 => searchQuery 객체가 업데이트 됨 name : 스트레이트 팬츠
  // => searchQuery 객체 안에 아이템 기준으로 url을 새로 생성해서 호출 & NAME=스트레이트+팬츠
  // => URL 쿼리 읽어오기 => URL 쿼리 기준으로 BE에 검색조건과 함께 호출한다

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="제품명으로 검색"
            field="name"
          />
        </div>
        <Button
          className="mt-2 mb-2 add-new-item-btn"
          onClick={handleClickNewItem}
        >
          Add New Item +
        </Button>

        <ProductTable
          header={tableHeader}
          data={productList}
          deleteItem={deleteItem}
          openEditForm={openEditForm}
        />
        <ReactPaginate
          nextLabel=">"
          previousLabel="<"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          pageCount={30}
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
        />
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />
    </div>
  );
};

export default AdminProductPage;
