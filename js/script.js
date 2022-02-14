//#region ------------------------------- Data Members -------------------------------

const GET_CATEGORY_LIST_URL = "https://fakestoreapi.com/products/categories";
const GET_PRODUCT_BY_CATEGORY_URL = "https://fakestoreapi.com/products/category/";
const GET_ALL_LIST_OF_PRODUCTS_URL = "https://fakestoreapi.com/products";
const DELETE_PRODUCT_URL = "https://fakestoreapi.com/products/"


const NO_RECORDS_FOUND = "No Records Found";
const ERROR_OCCURED = "An Error Occured";

const navigatioSections = [
    {
        navTab: "product",
        section: "productSection",
        loader: "productLoader"
    },
    {
        navTab: "category",
        section: "categorySection",
        loader: "categoryLoader"
    },
];
const tabActiveClasses = ["active", "btn", "btn-secondary"];
const productByCategorySectionDetils = {
    cardId: "productByCategoryCard",
    titleId: "productTableTittle",
    tableBodyData: "productsByCategoryTableBody"
}
const allProductsPageDetails = {
    allDetailsTableId: "productsTableId",
    sortingOrder: true,
    orderingFieldId: "productTitleWithOrdering",
    productToOperate: null,
    addUpdateModalId: "addUpdateProductModal",
    addUpdateModalTitle: "addEditModalTitle",
    isEdit: false,
    formDetails:
    {
        titleId: "productTitleInForm",
        priceId: "productPriceInForm",
        descriptionId: "descriptionInForm",
        categoryId: "categorySelectionInForm",
        fileId: "productImageInForm"
    }
}
const fileUploadPath = "/upload/image/"

//#endregion

//#region ------------------------------- API Calling ----------------------------------

/**
 * @description To get List of All Categories
 * @returns Array of Categories 
 */
const getListOfCategories = async () => {
    let categoryResponse = await fetch(GET_CATEGORY_LIST_URL, {
        method: "GET",
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }).then((response) => response.json())
        .catch((error) => { alert(ERROR_OCCURED); });
    return categoryResponse;
}

/**
 * @description To fetch list of product for provided category
 * @param categoryName - Name of category of Product : required
 * @returns Array of Products 
 */
const getProductsByCategory = async (categoryName) => {
    if (categoryName) {
        let response = await fetch(GET_PRODUCT_BY_CATEGORY_URL + categoryName, {
            method: "GET",
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then((response) => response.json())
            .catch((error) => { alert(ERROR_OCCURED); });
        return response;
    }
    else {
        return [];
    }
}

/**
 * @description To fetch list of products
 * @returns Array of Products 
 */
const getAllProducts = async () => {
    let response = await fetch(GET_ALL_LIST_OF_PRODUCTS_URL + `?sort=${allProductsPageDetails.sortingOrder ? 'asc' : 'desc'}`, {
        method: "GET",
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }).then((response) => response.json())
        .catch((error) => { alert(ERROR_OCCURED); });
    return response;
}

/**
 * @description To Delete Product
 * @param  productId Id Of Product which you want to delete
 */
const deleteProduct = async () => {
    if (allProductsPageDetails.productToOperate != null) {
        await fetch(DELETE_PRODUCT_URL + allProductsPageDetails.productToOperate, {
            method: 'DELETE',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then((response) => { alert("Product Deleted Successfully") })
            .catch((error) => { alert("An Error Occured While Deleting Product") })
    }
}

/**
 * @description To Update Product Details
 * @param requestBody - Product details which need to pass in rqeuest
 */
const addProduct = async (requestBody) => {
    if (requestBody) {
        await fetch(GET_ALL_LIST_OF_PRODUCTS_URL, {
            method: "POST",
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(requestBody)
        }).then(
            (response) => {
                alert("Product Added Successfully")
            }
        )
        .catch((error) => { alert(ERROR_OCCURED) });
    }

}

/**
 * @description To Update Product Details
 * @param productId - Id Of Product which want to update Product
 * @param requestBody - Product details which need to pass in rqeuest
 */
const editProduct = async (productId, requestBody) => {
    if (productId != null && requestBody) {
        await fetch(GET_ALL_LIST_OF_PRODUCTS_URL + `/${productId}`, {
            method: "PUT",
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        }).then((response) => { alert("Product Updated Successfully") })
            .catch((error) => { 
                console.log(error);
                alert(ERROR_OCCURED) 
            });
    }

}

/**
 * @description To get product by Id
 * @param  productId Id of product which want to get
 * @returns Object of product
 */
const getProductById = async (productId) => {
    if (productId != null) {
        let response = await fetch(GET_ALL_LIST_OF_PRODUCTS_URL + `/${productId}`, {
            method: "GET",
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then((response) => response.json())
            .catch((error) => { alert(ERROR_OCCURED) });
        return response;
    }

}
//#endregion 

//#region ------------------------------- Member Functions -----------------------------

//#region --------- Load, Page load & navigation Change ------------

// Hide or Show Loader
const showHideLoader = (show, loaderName) => {
    let loader = document.getElementById(loaderName);
    if (loader) {
        loader.style.display = show ? "block" : "none";
    }
}

// On Navigation Tab Change
const activeTabChange = (activeTab) => {

    navigatioSections.forEach((section) => {
        document.getElementById(section.navTab).classList.remove(...tabActiveClasses);
        document.getElementById(section.section).style.display = "none";
        showHideLoader(false, section.loader);
    });

    let activeSectionDetails = navigatioSections.find((ele) => ele.navTab === activeTab)

    if (activeSectionDetails) {
        document.getElementById(activeSectionDetails.navTab).classList.add(...tabActiveClasses);
        document.getElementById(activeSectionDetails.section).style.display = "block";
        switch (activeSectionDetails.navTab) {
            case "product": loadProductSection();
                break;
            case "category": loadCategorySection();
                break;
        }
    }

}

// On Page Load
const pageLoad = () => {
    activeTabChange("product");;
}

//#endregion

//#region --------- Product -----------

// Load Category Selection 
const loadCategories = async () => {
    let categories = await getListOfCategories();
    if (categories && Array.isArray(categories) && categories.length > 0) {
        let categorySelection = document.getElementById(allProductsPageDetails.formDetails.categoryId);
        if (categorySelection) {
            let categoryData = `<option value="">Select Category</option>`;
            categories.forEach((ele) => {
                categoryData += `<option value="${ele}">${ele.toString().toUpperCase()}</option>`
            });
            categorySelection.innerHTML = categoryData;
        }
    }
}

//Clear Product Form
const clearProductForm = async () => {
    let productTitle = document.getElementById(allProductsPageDetails.formDetails.titleId);
    let productPrice = document.getElementById(allProductsPageDetails.formDetails.priceId);
    let productDesc = document.getElementById(allProductsPageDetails.formDetails.descriptionId);
    let productCat = document.getElementById(allProductsPageDetails.formDetails.categoryId);
    let productImage = document.getElementById(allProductsPageDetails.formDetails.fileId);
    productTitle ? productTitle.value = "" : null;
    productPrice ? productPrice.value = "" : null;
    productDesc ? productDesc.value = "" : null;
    productCat ? productCat.value = "" : null;
    allProductsPageDetails.isEdit = false;
    //productImage && productImage.files ?  productImage.files = [] :null;
}

// To change sorting order of Products on Click of title
const changeSortingOrderOfProducts = () => {
    let sorterIcon = document.getElementById(allProductsPageDetails.orderingFieldId);
    let oldClass = allProductsPageDetails.sortingOrder ? "fa-sort-asc" : "fa-sort-desc";
    let newClass = allProductsPageDetails.sortingOrder ? "fa-sort-desc" : "fa-sort-asc";
    sorterIcon ? sorterIcon.classList.replace(oldClass, newClass) : null
    allProductsPageDetails.sortingOrder = !allProductsPageDetails.sortingOrder;
    loadProductSection();
}


// Load Product Section Related Data
const loadProductSection = async () => {
    showHideLoader(true, "productLoader");
    try {
        allProductsPageDetails.isEdit = false;
        let modalTitleForAddEdit = document.getElementById(allProductsPageDetails.addUpdateModalTitle);
        modalTitleForAddEdit ? modalTitleForAddEdit.innerHTML = "Add Product" : null;
        let products = await getAllProducts();
        let tableBodyData = document.getElementById(allProductsPageDetails.allDetailsTableId);
        if (products.length) {
            let productData = "";
            products.forEach((product) => {
                productData += `
                        <tr>
                            <td class="text-center bg-light">
                                <img src="${product.image}" alt="product_image" class="img-fluid rounded img-max-size mx-auto block" />    
                            </td>
                            <td class="text-center">
                                <label>${product.title}</label>
                            </td>
                            <td class="text-center">${product.category}</td>
                            <td class="text-center">
                                <div>
                                    ${product.price}
                                </div>
                            </td>   
                            <td class="text-center">
                                <div class="d-flex justify-content-between mt-5">
                                    <i class="fa fa-pencil" style="color:blue" data-toggle="modal" data-target="#addUpdateProductModal" onclick="loadForeditProduct(${product.id})"></i>
                                    <i class="fa fa-trash" style="color:red" data-toggle="modal" data-target="#deleteConfirmation" onclick="confirmDeleteProduct(${product.id})"></i>
                                </div>        
                            </td>                         
                        </tr>
                        `
                tableBodyData ? tableBodyData.innerHTML = productData : null;
            })
        }
        else {
            tableBodyData ? tableBodyData.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-primary text-center">${NO_RECORDS_FOUND}</td>
                    </tr>` : null;
        }
        await loadCategories();
    }
    catch (error) {
        console.log(error);
        alert(ERROR_OCCURED)
    }

    showHideLoader(false, "productLoader");
}

// Save Product Data
const saveProduct = async () => {
    showHideLoader(true, "productLoader");

    try {
        let productTitle = document.getElementById(allProductsPageDetails.formDetails.titleId);
        let productPrice = document.getElementById(allProductsPageDetails.formDetails.priceId);
        let productDesc = document.getElementById(allProductsPageDetails.formDetails.descriptionId);
        let productCat = document.getElementById(allProductsPageDetails.formDetails.categoryId);
        let productImage = document.getElementById(allProductsPageDetails.formDetails.fileId);
        let productDetails = {
            "title": productTitle ? productTitle.value : "",
            "price": productPrice ? productPrice.value : "",
            "description": productDesc ? productDesc.value : "",
            "image": productImage && productImage.files && productImage.files[0] ? fileUploadPath + productImage.files[0].name : "",
            "category": productCat ? productCat.value : "",
        }
        if (productDetails) {
            if (allProductsPageDetails.isEdit) {
                await editProduct(allProductsPageDetails.productToOperate, productDetails);
            }
            else {
                await addProduct(productDetails)
            }
            await loadProductSection();
        }
    }
    catch (error) {
        console.log(error);
        alert(ERROR_OCCURED)
    }
    showHideLoader(false, "productLoader");
}

// Set data for Edit Product
const loadForeditProduct = async (productId) => {
    await clearProductForm().then(async (response) => {
        if (productId != null) {
            let productData = await getProductById(productId);
            if (productData) {
                let productTitle = document.getElementById(allProductsPageDetails.formDetails.titleId);
                let productPrice = document.getElementById(allProductsPageDetails.formDetails.priceId);
                let productDesc = document.getElementById(allProductsPageDetails.formDetails.descriptionId);
                let productCat = document.getElementById(allProductsPageDetails.formDetails.categoryId);
                //let productImage = document.getElementById(allProductsPageDetails.formDetails.fileId);   

                productTitle ? productTitle.value = productData.title : "";
                productPrice ? productPrice.value = productData.price : "";
                productDesc ? productDesc.value = productData.description : "";
                productCat ? productCat.value = productData.category : "";
                console.log(productData.category);
            }
        }
    });
    let modalTitleForAddEdit = document.getElementById(allProductsPageDetails.addUpdateModalTitle);
    modalTitleForAddEdit ? modalTitleForAddEdit.innerHTML = "Edit Product" : null;
    allProductsPageDetails.productToOperate = productId;
    allProductsPageDetails.isEdit = true;

}

// Confirmatio to Delete Product Data
const confirmDeleteProduct = (productId) => {
    allProductsPageDetails.productToOperate = productId;
}

// Delete Data on Confirm
const deleteProductOnConfim = async () => {
    window.scroll(0, 0);
    showHideLoader(true, "productLoader");
    if (allProductsPageDetails.productToOperate != null) {
        await deleteProduct();
        await loadProductSection();
    }
    showHideLoader(false, "productLoader");
}
//#endregion

//#region --------- Category -----------

// To get list of product by category
const productByCategory = async (category) => {
    showHideLoader(true, "categoryLoader");
    try {
        if (category) {
            let products = await getProductsByCategory(category);
            let card = document.getElementById(productByCategorySectionDetils.cardId);
            let title = document.getElementById(productByCategorySectionDetils.titleId);
            let tableBodyData = document.getElementById(productByCategorySectionDetils.tableBodyData);
            if (card) {
                card.style.display = "block";
                title ? title.innerHTML = `Products of <b>${category.toString().toUpperCase()}</b>` : null;
                if (products.length) {
                    let productData = "";
                    products.forEach((product) => {
                        productData += `
                        <tr>
                            <td class="text-center bg-light">
                                <img src="${product.image}" alt="product_image" class="img-fluid rounded img-max-size m-auto block" />    
                            </td>
                            <td class="text-center">
                                <label>${product.title}</label>
                            </td>
                            <td class="text-center">${product.category}</td>
                            <td class="text-center">
                                <div>
                                    ${product.price}
                                </div>
                            </td>
                        </tr>
                        `
                        tableBodyData ? tableBodyData.innerHTML = productData : null;
                    })
                }
                else {
                    tableBodyData ? tableBodyData.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-primary text-center">${NO_RECORDS_FOUND}</td>
                    </tr>` : null;
                }
            }

        }
    }
    catch {
        alert(ERROR_OCCURED)
    }

    showHideLoader(false, "categoryLoader");
}

// Load Category Section
const loadCategorySection = async () => {
    closeProductByCategoryInfo();
    showHideLoader(true, "categoryLoader");
    try {
        let categories = await getListOfCategories();
        let tableBody = document.getElementById("categoryProductBody");
        if (tableBody) {
            if (categories && Array.isArray(categories) && categories.length > 0) {
                let tabeleData = "";
                categories.forEach((ele) => {
                    tabeleData += `
                <tr>
                    <td class="text-center"><label>${ele ? ele.toString().toUpperCase() : '-'}</label></td>
                    <td class="text-center">
                        <i class="fa fa-eye" style="color:blue;" onclick="productByCategory(\`${ele.toString()}\`)"></i>
                    </td>
                </tr>`
                });
                tableBody.innerHTML = tabeleData;
            }
            else {
                tableBody.innerHTML = `
            <tr>
                <td colspan="2" class="text-center text-primary">
                    <label>${NO_RECORDS_FOUND}</label>
                </td>
            </tr>`
            }
        }
    }
    catch
    {
        alert(ERROR_OCCURED)
    }
    showHideLoader(false, "categoryLoader");
}

// To close product details card by category manually
const closeProductByCategoryInfo = () => {
    let card = document.getElementById(productByCategorySectionDetils.cardId);
    if (card) {
        card.style.display = "none";
    }
}

//#endregion

//#endregion ----------------------------------------------


