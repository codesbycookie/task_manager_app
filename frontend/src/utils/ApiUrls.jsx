const baseUrl = import.meta.env.VITE_BASE_URL;

// Endpoints
const urls = {
   addProductUrl: `${baseUrl}${import.meta.env.VITE_ADD_PRODUCT}`,
   fetchOrdersUrl: `${baseUrl}${import.meta.env.VITE_FETCH_ORDERS}`,
   fetchProducts: `${baseUrl}${import.meta.env.VITE_FETCH_PRODUCTS}`,
   deleteProductUrl: `${baseUrl}${import.meta.env.VITE_DELETE_PRODUCT_URL}`,
fetchAdminUrl: `${baseUrl}${import.meta.env.VITE_ADMIN_FETCH}`,
};

export default urls;

