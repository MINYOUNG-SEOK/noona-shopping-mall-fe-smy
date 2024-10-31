import React from "react";
import { Spinner as BootstrapSpinner } from "react-bootstrap";
import "../component/Spinner.style.css";

export const TableSpinner = () => (
  <tr>
    <td colSpan="100%" className="table-spinner-cell">
      <BootstrapSpinner animation="border" variant="primary" />
    </td>
  </tr>
);

export const FullPageSpinner = () => (
  <div className="spinner-overlay">
    <BootstrapSpinner animation="border" variant="primary" />
  </div>
);

const Spinner = { TableSpinner, FullPageSpinner };
export default Spinner;
