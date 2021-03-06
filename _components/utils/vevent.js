/*
 *  Copyright 2021 Anyware Services
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

if (!window.VEvent)
{
    window.VEvent = {
        _listeners: {},
        
        fire: function(event, data)
        {
            var listeners = window.VEvent._listeners[event] || [];
            for (var i=0; i < listeners.length; i++)
            {
                listeners[i](data);
            }
        },
        
        listen: function(event, listener)
        {
            window.VEvent._listeners[event] = window.VEvent._listeners[event] || [];
            window.VEvent._listeners[event].push(listener);
        }
    };
}
