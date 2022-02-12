//#region ------------------------------- Data Members -------------------------------

const GET_CATEGORY_LIST_URL = "https://fakestoreapi.com/products/categories";
const GET_PRODUCT_BY_CATEGORY_URL = "https://fakestoreapi.com/products/category/";
const GET_ALL_LIST_OF_PRODUCTS_URL = "https://fakestoreapi.com/products";
const DELETE_PRODUCT_URL="https://fakestoreapi.com/products/"

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
    addUpdateModalId:"addEditModalTitle",
    isEdit:false
}

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
        .catch((error) => []);
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
            .catch((error) => []);
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
        .catch((error) => []);
    return response;
}

/**
 * @description To Delete Product
 * @param  productId Id Of Product which you want to delete
 */
const deleteProduct = async ()=>{
    if(allProductsPageDetails.productToOperate!=null)
    {
        await fetch(DELETE_PRODUCT_URL+allProductsPageDetails.productToOperate,{
            method: 'DELETE',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }).then((response)=>{alert("Product Deleted Successfully")})
        .catch((error)=>{alert("An Error Occured While Deleting Product")})
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
                                <div class="descriptionMaxSize">
                                    ${product.description}
                                </div>
                            </td>   
                            <td class="text-center">
                                <div class="d-flex justify-content-between mt-5">
                                    <i class="fa fa-pencil" style="color:blue" onclick="editProduct(${product.id})"></i>
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
    }
    catch (error) {
        console.log(error);
        alert(ERROR_OCCURED)
    }

    showHideLoader(false, "productLoader");
}

// Add Product Data
const addProduct = (productId) => {

}

// Edit Product Data
const editProduct = (productId) => {

}

// Confirmatio to Delete Product Data
const confirmDeleteProduct = (productId) => {
    allProductsPageDetails.productToOperate = productId;
}

// Delete Data on Confirm
const deleteProductOnConfim = async () =>{
    window.scroll(0,0);
    showHideLoader(true, "productLoader");
    if(allProductsPageDetails.productToOperate!=null)
    {
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
                                <div class="descriptionMaxSize">
                                    ${product.description}
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


