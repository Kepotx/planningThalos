/*
 *  Copyright 2022 Anyware Services
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
 * Helper used to load media (video, audio, ...) with media element helper
 */
 
import $j from 'jQuery';
import MediaElementPlayer from 'MediaElementPlayer';

/**
 * True if the media is supported for media element player
 * @param {String} media the media 
 */
export function isSupportedMedia(media)
{
    return media.fileType == 'video' || media.fileType == 'audio';
}

/**
 * Create the media html for media element player
 * @param {String} itemId the item id
 * @param {String} uri the uri of the media
 * @param {String} type the type of the media
 */
export function createMediaElementPlayerHtml(itemId, uri, type)
{
    
    let fileMediaDiv = $j("#player-parent-" + itemId);
    if (!fileMediaDiv.length)
    {
        let html = '<div style="width:100%" id="player-parent-' + itemId + '">';
        if (type == 'video')
        {
            html += '<video class="media-element-video" id="player-' + itemId + '"></video>';
        }
        else if (type == 'audio')
        {
            html += '<audio class="media-element-audio" id="player-' + itemId + '"></audio>';
        }
        html += '</div>';
        $j("#player-wrapper-" + itemId).append(html);
            
        new MediaElementPlayer('player-' + itemId, {
            stretching: 'responsive',
            success: function(media) {
                media.setSrc(uri);
                media.load();
            }
        });
    }
}

/**
 * Remove the media html for media element player
 * @param {String} itemId the item id
 */
export function removeMediaElementPlayerHtml(itemId)
{
    let fileMediaDiv = $j("#player-parent-" + itemId);
    if (fileMediaDiv.length)
    {
        fileMediaDiv.remove();
    }
}
