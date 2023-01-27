import axios from 'axios';
/**
 * Makes a get request to get an array of documents for the block optins
 *
 * @param {string|boolean} restBase - rest base for the query.
 * @param {object} args
 * @returns {AxiosPromise<any>}
 */
export const getDocuments = () => {
    return axios.get(complianz.site_url+`complianz/v1/documents`);
};
