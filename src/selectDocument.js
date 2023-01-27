import * as api from './api';
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { SelectControl } = wp.components;
const { PanelBody, PanelRow } = wp.components;
import {useState, useEffect} from "@wordpress/element";

const selectDocument = ({ className, isSelected, attributes, setAttributes }) => {
    const [documents, setDocuments] = useState([]);
    const [documentDataLoaded, setDocumentDataLoaded] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(attributes.selectedDocument);

    /**
     * Get the document data on load of the block, and set the state
     *
     */
    useEffect(() => {
        api.getDocuments().then( ( response ) => {
            let documents = response.data;
            setDocuments(documents);
            setDocumentDataLoaded(true);
        });
    }, [])


    /**
     * Set our attributes state with a new selected value
     * @param value
     */
    const onChangeSelectDocument = (value) => {
        // Set the state
        setSelectedDocument(value);

        // Set the attributes
        setAttributes({
            selectedDocument: value,
        });
    }

    let options = [{value: 0, label: __('Select a document', 'complianz-gdpr')}];
    let output = __('Loading...', 'complianz-gdpr');

    //This shows a preview image in the block editor, when selecting blocks
    if ( attributes.preview ) {
        return(
            <img alt="preview" src={complianz.cmplz_preview} />
        );
    }

    //when data is loaded, build a list of options for the sidebar dropdown.
    if ( documentDataLoaded ) {
        output = isSelected ? __("Select a document type from the dropdownlist", 'complianz-gdpr') : __('Click this block to show the options', 'complianz-gdpr');
        documents.forEach((item) => {
            options.push({value: item.id, label: item.title});
        });
    }

    //If a document is selected in the block attributes, we get the corresponding html.
    if ( attributes.selectedDocument!==0 && documentDataLoaded && attributes.selectedDocument.length>0 ) {
        const documentData = documents.find((item) => {
            return item.id === attributes.selectedDocument
        });
        if (documentData) output = documentData.content;
    }

    //the inspector controls contains the dropdown with the options
    //the onChangeSelect triggers the switching of arguments.
    //The last div contains the output, and is the actual block content
    return [
        !!isSelected && (
            <InspectorControls key='inspector-document'>
                <PanelBody title={ __('Document settings', 'complianz-gdpr' ) } initialOpen={ true } >
                    <PanelRow key="1">
                        <SelectControl onChange={ (e) => onChangeSelectDocument(e) }
                                       value={ selectedDocument }
                                       label={__('Select a document', 'complianz-gdpr')}
                                       options={options}/>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        ),
        <div key={attributes.selectedDocument} className={className} dangerouslySetInnerHTML={{__html: output}}></div>
    ]
}
export default selectDocument