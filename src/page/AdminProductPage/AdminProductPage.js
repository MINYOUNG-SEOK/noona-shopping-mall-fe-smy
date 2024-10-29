.card-area {
    margin-top: 20px;
}

.admin-product-card {
    border: 1px solid red;
}

.tag {
    margin-left: 10px;
}

.display-flex {
    display: flex;
    align-items: center;
}

.locate-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.stock {
    margin-right: 10px;
}

.mt-2 {
    margin-top: 20px;
}

.form-container {
    padding: 20px;
}

.mr-1 {
    margin-right: 10px;
}

.upload-image {
    max-width: 458px;
    width: 100%;
}

.display-center {
    display: flex;
    justify-content: center;
}

.error-message {
    color: red;
    font-size: 10pt;
    padding-right: 10px;
}

.add-new-item-btn {
    background-color: #5d90ed;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 15px;
}

.add-new-item-btn:hover {
    background-color: #3c5c97;
}

.create-new-product-btn {
    background-color: #5d90ed;
    color: white;
    border: none;
    padding: 8px 10px;
    font-size: 15px;
    margin-right: 10px;
    border-radius: 4px;
    cursor: pointer;
}

.create-new-product-btn:hover {
    background-color: #3c5c97;
}

.form-label {
    font-weight: bold;
    display: block;
    margin-bottom: 8px;
}

.form-control {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.form-control:focus {
    outline: none;
    border: none;
}

.form-select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;
}

.container {
    width: 100%;
    max-width: 1200px;
    padding: 0 15px;
    margin: 0 auto;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin: 1.5rem 0;
    padding: 0;
    list-style: none;
}

.page-item {
    margin: 0;
    padding: 0;
}

.page-link,
.page-link:focus,
.page-link:hover,
.page-item.active .page-link,
.page-item.active .page-link:hover,
.page-item.active .page-link:focus {
    min-width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    color: #9CA3AF;
    font-size: 16px;
    border: none;
    background: none;
    box-shadow: none;
    outline: none;
    text-decoration: none;
    transition: color 0.2s ease;
    cursor: pointer;
}

.page-item.active .page-link {
    color: #000;
    font-weight: 700;
    font-size: 16px;
    background: none;
}

.page-link.arrow {
    color: #9CA3AF;
    font-size: 16px;
}

.page-link.break {
    color: #9CA3AF;
    cursor: default;
}

.page-link:hover:not(.break) {
    color: #000;
}


.create-new-product-btn {
    background-color: #5d90ed !important; 
    border: none;
}

.create-new-product-btn:hover {
    background-color: #4267aa !important; 
    border: none; 
}


.create-new-product-btn:focus,
.create-new-product-btn:active {
    background-color: #5d90ed !important;
    box-shadow: none; 
}

.add-new-item-btn {
    background-color: #5d90ed !important; 
    border: none;
}

.add-new-item-btn:hover {
    background-color: #4267aa !important; 
    border: none; 
}

.add-new-item-btn:focus,
.add-new-item-btn:active {
    background-color: #5d90ed !important; 
    box-shadow: none;
}

.gray-button {
    margin-top: 4px;
    background-color: grey;
    color: white; 
    border: none; 
}

.gray-button:hover {
    background-color: #5a6268; 
}



@media screen and (max-width: 768px) {
    .page-link,
    .page-item.active .page-link {
        min-width: 28px;
        height: 28px;
        font-size: 14px;
    }
    
    .container {
        padding: 0 10px;
    }
}
