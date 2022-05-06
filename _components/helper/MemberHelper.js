/*
 *  Copyright 2019 Anyware Services
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
import AmetysUtils from 'AmetysUtils';

export function transformToMember(member) {
  const isGroup = member.groupDirectory !== undefined;
  const id = isGroup ? 
                (member.groupId ? `${member.groupId}#${member.groupDirectory}` : `${member.id}#${member.groupDirectory}`) 
                : `${member.login}#${member.populationId}`;

  return {
    id,
    name: (isGroup ? member.label : member.fullname) || 'no name',
    sortablename: member.sortablename || member.label,
    subtitle: isGroup ? '': member.function,
    avatar: isGroup ? null : AmetysUtils.getUserImgUrl(member, 76),
    badge: isGroup ? '': member.organisationAcronym,
    inMembers: !isGroup,
    isGroup,
    status: member.status,
    contributions: member.contributions ? member.contributions : 0,
    isManager: member.manager,
    link: member.link
  };
}
