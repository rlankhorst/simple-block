import * as api from './api';
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { SelectControl } = wp.components;
const { PanelBody, PanelRow } = wp.components;
import {useState, useEffect} from "@wordpress/element";
import {getDocument} from "./api";

const selectDocument = ({ className, isSelected, attributes, setAttributes }) => {
    const [options, setOptions] = useState([]);
    const [optionsLoaded, setOptionsLoaded] = useState(false);
    const [documentHtml, setDocumentHtml] = useState('');
    const [selectedDocument, setSelectedDocument] = useState(attributes.selectedDocument);

    /**
     * Get the document data on load of the block, and set the state
     *
     */
    useEffect(() => {
        api.getDocuments().then( ( response ) => {
            let documents = response.data;
            let o = [{value: 0, label: __('Select a document', 'complianz-gdpr')}];
            documents.forEach((item) => {
                o.push({value: item.id, label: item.title});
            });
            setOptions(o);
            setOptionsLoaded(true);
        });
    }, [])


    useEffect(() => {
        //If a document is selected in the block attributes, we get the corresponding html.
        if ( optionsLoaded && selectedDocument!==0 && selectedDocument.length>0 ) {
            setDocumentHtml(__("loading...", "complianz-gdpr"));
            api.getDocument(selectedDocument).then( ( response ) => {
                setDocumentHtml(response);
            });
        }

    }, [selectedDocument, optionsLoaded]) //this ensures the useEffect re-renders when selectedDocument changes


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

    //This shows a preview image in the block editor, when selecting blocks
    if ( attributes.preview ) {
        return(
            <img alt="preview" src={complianz.cmplz_preview} />
        );
    }
    let output = documentHtml;
    //when data is loaded, build a list of options for the sidebar dropdown.
    if ( optionsLoaded && output.length === 0 ) {
        output = isSelected ? __("Choose a document type from the dropdown list", 'complianz-gdpr') : __('Click this block to show the options', 'complianz-gdpr');
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