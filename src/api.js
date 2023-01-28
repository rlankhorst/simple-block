import axios from 'axios';
/**
 * Makes a get request to get an array of documents for the block optins
 *
 * @param {string|boolean} restBase - rest base for the query.
 * @param {object} args
 * @returns {AxiosPromise<any>}
 */
export const getDocuments = () => {
    let config = {
        headers: {
            'X-WP-Nonce': complianz.nonce,
        }
    }
    return axios.get(complianz.site_url+`complianz/v1/documents`, config);
};

export const getDocument = (type) => {
    let config = {
        headers: {
            'X-WP-Nonce': complianz.nonce,
        }
    }
    let data = {};
    data.type = type;
    return axios.post(complianz.site_url+'complianz/v1/document', data, config ).then( ( response ) => {return response.data;});
};