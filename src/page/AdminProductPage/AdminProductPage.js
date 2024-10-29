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
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { productList, totalPageNum } = useSelector((state) => state.product);
  const [currentPage, setCurrentPage] = useState(parseInt(query.get("page") || 1));
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: currentPage,
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
    "",
  ];

  useEffect(() => {
    // 검색어나 페이지가 바뀌면 url을 바꿔줌 => URL 쿼리를 읽어옴 => 상품 리스트 가져오기
    navigate(`?page=${currentPage}&name=${searchQuery.name}`);
    // 상품 리스트를 서버에서 가져오기 (API 호출 등)
    // dispatch(getProductList(searchQuery)); // 여기에 실제 API 호출
  }, [currentPage, searchQuery.name]);

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
    setCurrentPage(selected + 1);
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder=" 검색"
            field="name"
          />
        </div>
        <Button className="mt-2 mb-2 add-new-item-btn" onClick={handleClickNewItem}>
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
          forcePage={currentPage - 1}  
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
