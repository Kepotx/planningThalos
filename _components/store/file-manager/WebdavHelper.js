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
 * Helper used to open document with MS Office or Libre Office using "ms-word" protocol.
 * To detect and check custom protocols from the browser see
 * https://github.com/ismailhabib/custom-protocol-detection (vanilla js lib)
 * or https://github.com/vireshshah/custom-protocol-check
 */
 
/**
 * Determines if the OS is compatible for MSOffice or LibreOffice edition
 * @return {Boolean} true if OS is compatible
 */
export function isOsCompatible()
{
    return navigator.platform.indexOf('Win') !== -1 || navigator.platform.indexOf('Mac') !== -1;
}

/**
 * Determines if the file is a MSOffice document
 * @return {Boolean} true if the document can edited
 */
export function isMsOfficeDocument(file)
{
    return _getMsOfficeProtocol(file) !== undefined;
}

/**
 * Open a Webdav uri
 * @param {Object} file the file
 * @param {String} uri the file uri with token
 */
export function openWebdavUri(file, webdavUri) {
    
    var fullWebdavUri = buildFullWebdavUri(file, webdavUri);
    
    window.console.debug("Try to open WebDAV uri " + fullWebdavUri);
    
    _openUriWithHiddenFrame(fullWebdavUri);
}

/**
 * Build the Webdav uri for file edition
 * @param {Object} file the file
 * @param {webdavUri} webdavUri the file uri with token
 * @return {String} the full webdav uri
 */
export function buildFullWebdavUri(file, webdavUri)
{
    let protocol = _getMsOfficeProtocol(file);
    let browser = checkBrowser();
  
    let uri = protocol + ':';
    if (!protocol.startsWith("vnd.libreoffice") || !browser.isChrome)   
    {
        // If chrome + libreoffice, we do not add "ofe|u|" because it bugs right now
        uri += encodeURIComponent('ofe|u|');
    }
  
    uri += webdavUri;
    return uri;
}

/**
 * Check current browser
 * @return {Object} the browser
 */
export function checkBrowser() 
{
    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    return {
        isOpera   : isOpera,
        isFirefox : typeof InstallTrigger !== 'undefined',
        isSafari  : Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
        isChrome  : !!window.chrome && !isOpera,
        isIE      : _getInternetExplorerVersion() != -1
    };
}
    
// private function
function _getMsOfficeProtocol(file)
{
    var MS_OFFICE_PROTOCOLS = {
        // ms-word
        docx: 'ms-word',
        doc: 'ms-word',
        docm: 'ms-word',
        dot: 'ms-word',
        dotm: 'ms-word',
        dotx: 'ms-word',
        odt: 'ms-word', //'vnd.libreoffice.command',
        // ms-powerpoint
        pptx: 'ms-powerpoint',
        pptm: 'ms-powerpoint',
        ppt: 'ms-powerpoint',
        ppsx: 'ms-powerpoint',
        ppsm: 'ms-powerpoint',
        pps: 'ms-powerpoint',
        ppam: 'ms-powerpoint',
        ppa: 'ms-powerpoint',
        potx: 'ms-powerpoint',
        potm: 'ms-powerpoint',
        pot: 'ms-powerpoint',
        odp: 'ms-powerpoint', // 'vnd.libreoffice.command',
        // ms-excel
        xltx: 'ms-excel',
        xltm: 'ms-excel',
        xlt: 'ms-excel',
        xlsx: 'ms-excel',
        xlsm: 'ms-excel',
        xlsb: 'ms-excel',
        xls: 'ms-excel',
        xll: 'ms-excel',
        xlam: 'ms-excel',
        xla: 'ms-excel',
        ods: 'ms-excel', // 'vnd.libreoffice.command',
        // ms-visio
        vstx: 'ms-visio',
        vstm: 'ms-visio',
        vst: 'ms-visio',
        vssx: 'ms-visio',
        vssm: 'ms-visio',
        vss: 'ms-visio',
        vsl: 'ms-visio',
        vsdx: 'ms-visio',
        vsdm: 'ms-visio',
        vsd: 'ms-visio',
        vdw: 'ms-visio',
        // ms-access
        accdb: 'ms-access',
        mdb: 'ms-access',
        // ms-project
        mpp: 'ms-project',
        mpt: 'ms-project',
        // ms-publisher
        pub: 'ms-publisher',
        // ms-infopath
        xsn: 'ms-infopath',
        xsf: 'ms-infopath'
    };
    
    return MS_OFFICE_PROTOCOLS[file.fileExtension];
}


function _getInternetExplorerVersion() {
    var rv = -1;
    if (navigator.appName === "Microsoft Internet Explorer") {
        let ua = navigator.userAgent;
        let re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    else if (navigator.appName === "Netscape") {
        let ua = navigator.userAgent;
        let re = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null) {
            rv = parseFloat(RegExp.$1);
        }
    }
    return rv;
}

function _openUriWithHiddenFrame(uri) {

    var iframe = document.querySelector("#msoHiddenIframe");
    if (!iframe) {
        iframe = _createHiddenIframe(document.body, "about:blank");
    }
    iframe.contentWindow.location.href = uri;
}

function _createHiddenIframe(target, uri) {
    var iframe = document.createElement("iframe");
    iframe.src = uri;
    iframe.id = "msoHiddenIframe";
    iframe.style.display = "none";
    target.appendChild(iframe);

    return iframe;
}