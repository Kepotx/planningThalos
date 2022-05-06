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
export function getByIndex(arr, index, def = false) {
  if (!arr || !arr.length || !index) return def;
  return arr[index]
}

export function find(arr, condition, def = false) {
  if (!arr || !arr.length) return def;

  const result = arr.filter(o => condition(o))

  if (result.length) {
    return result[0]
  } else {
    return def
  }
}