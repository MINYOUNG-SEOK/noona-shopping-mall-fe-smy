import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";

const ToastMessage = () => {
  const { toastMessage } = useSelector((state) => state.ui);
  useEffect(() => {
    if (toastMessage) {
      const { message, status } = toastMessage;
      if (
        message !== "" &&
        ["success", "error", "info", "warn"].includes(status)
      ) {
        toast[status](message, { theme: "colored" });
      } else {
        console.warn("올바르지 않은 toast 상태 값:", status);
      }
    }
  }, [toastMessage]);

  return (
    <ToastContainer
      className="custom-toast-container"
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ToastMessage;
