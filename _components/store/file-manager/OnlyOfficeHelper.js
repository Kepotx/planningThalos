/*
 *  Copyright 2020 Anyware Services
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

/**
 * Helper used to open document with Only Office server
 */
 
import AmetysFront from 'AmetysFront';
import $j from 'jQuery';

/**
 * Determines if the file is a OnlyOffice document
 * @return {Boolean} true if the document can edited
 */
export function isOnlyOfficeDocument(file)
{
    return _getOnlyOfficeType(file) !== undefined;
}

/**
 * Get the OnlyOffice configuration
 * @param {Object} the OnlyOffice information associated to a file
 * @param {Function} onFailureCb The callback function in case of failure
 * @param {Boolean} isEdition True if is for edition
 * @param {Boolean} isMobile True if is for mobile
 */
export function initOnlyOffice(ooInfos, onFailureCb, isEdition, isMobile)
{
    function onRequestClose() 
    {
        config.docEditor.destroyEditor();
    }

    function onOutdatedVersion() 
    {
        // the document is opened for editing with the old document.key value, which was used to edit the previous document version and was successfully saved.
        try
        {
            onFailureCb(config.docEditor);
        }
        catch (e)
        {
            window.console.error("Failed to invoked callback on a outdated version of document: " + e);
            throw e;
        }
    }
    
    let ametysUser = window.ametysUser; 
    
    var config = {
        "document": {
             "fileType": ooInfos.file.fileExtension,
             "key": ooInfos.file.key,
             "title": ooInfos.file.title,
             "url": ooInfos.file.urlDownload
         },
         "documentType": _getOnlyOfficeType(ooInfos.file),
         "editorConfig": {
            "user": {
                id: ametysUser.login + "#" + ametysUser.populationId,
                name: ametysUser.fullname
            },
            "mode": "view",
            "lang": AmetysFront.getAppParameter("sitemapLanguage"),
            "callbackUrl": ooInfos.callbackUrl,
            "customization": {
                 "forcesave": true,
                 "goback": false,
                 "feedback": false
             }
         },
         "events": {
             "onRequestClose": onRequestClose,
             "onOutdatedVersion": onOutdatedVersion
         }
    }
    
    if (isEdition)
    {
        config.type = "desktop";
        config.width = "95%";
        config.height = "95%";
        config.editorConfig.mode = "edit";
    }
    else
    {
        config.document.permissions = {
            "download": false,
            "print": false
        }
        config.type = isMobile ? "mobile" : "embedded";
        config.editorConfig.customization = {
            "logo": {
                "imageEmbedded": 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', //transparant block to hide onlyoffice icon
            }
        }
        config.width = "100%";
        config.height = "100%";
    }
    
    return config;
}

/**
 * Create the modal with OnlyOffice iframe
 */
export function createOnlyOfficeModal()
{
    $j("#onlyoffice").remove();
    $j(document.body).append("<div id='onlyoffice'>" 
                                    + '<button id="onlyoffice-close-btn"><i width="10px" class="v-icon notranslate cursor-pointer av-dialog-close-icon rounded-circle no-focus material-icons theme--light" style="font-size: 24px;">close</i></button>'
                                    + "<div id='onlyoffice-internal'></div>" 
                            + "</div>");
}

/**
 * Create the preview div for OnlyOffice iframe
 * @param {String} itemId the item id
 */
export function createOnlyOfficePreview(itemId)
{
    let indexId = itemId.lastIndexOf('://');
    let itemNumber = itemId.substring(indexId + 3);

    $j("#onlyoffice-preview-" + itemNumber).remove();
    $j("[data-id='file-" + itemNumber + "']").append("<div id='onlyoffice-preview-" + itemNumber + "' class='file-manager-preview'>" 
                                    + "<div class='px-10 py-10 d-flex flex-column justify-space-between align-center' id='onlyoffice-internal-preview-" + itemNumber + "'></div>" 
                            + "</div>");
}

/**
 * Initialize the OnlyOffice modal
 * @param {Object} docEditor the document editor
 * @param {Function} callback the callback to call after edition closed
 */
export function initOnlyOfficeModal(docEditor, callback)
{                          
    $j("#onlyoffice").on('click', function (event) {
        if (event.target == document.getElementById("onlyoffice")) {
            closeEditor(docEditor, callback);
        }
    });
            
    $j('#onlyoffice-close-btn').on('click', function() {
        closeEditor(docEditor, callback);
    });
    
    // Show iframe
    $j("#onlyoffice").show();
}

/**
 * Close the editor OnlyOffice
 * @param {Object} docEditor the document editor
 * @param {Function} callback the callback to call after edition closed
 */
export function closeEditor(docEditor, callback)
{
    if (docEditor)
    {
        docEditor.destroyEditor();
    }
    // Remove iframe
    $j("#onlyoffice").remove();
    
    if (callback != null)
    {
        callback();
    }
}
    
// private function
function _getOnlyOfficeType(file)
{
    var ONLY_OFFICE_TYPES = {
        // text
        docx: 'text',
        doc: 'text',
        docm: 'text',
        dot: 'text',
        dotm: 'text',
        dotx: 'text',
        odt: 'text', 
        fodt: 'text',
        ott: 'text',
        rtf: 'text',
        txt: 'text',
        html: 'text',
        htm: 'text',
        mht: 'text',
        pdf: 'text',
        djvu: 'text',
        fb2: 'text',
        epub: 'text',
        xp: 'text',
        // presentation
        pps: 'presentation',
        ppsx: 'presentation',
        ppsm: 'presentation',
        ppt: 'presentation',
        pptx: 'presentation',
        pptm: 'presentation',
        pot: 'presentation',
        potx: 'presentation',
        potm: 'presentation',
        odp: 'presentation',
        fodp: 'presentation',
        otp: 'presentation',
        // spreadsheet
        xls: 'spreadsheet',
        xlsx: 'spreadsheet',
        xlsm: 'spreadsheet',
        xlt: 'spreadsheet',
        xltx: 'spreadsheet',
        xltm: 'spreadsheet',
        ods: 'spreadsheet',
        fods: 'spreadsheet',
        ots: 'spreadsheet',
        csv: 'spreadsheet',
    };
    
    return ONLY_OFFICE_TYPES[file.fileExtension];
}