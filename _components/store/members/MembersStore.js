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
import Vue from 'vue';
import AmetysFront from 'AmetysFront';
import { callMethod } from '../../helper/ServerCommHelper';
import { transformToMember } from '../../helper/MemberHelper';
import i18n from 'i18n';

/**
 * Vuex store for current project members, and searching users to add
 */
export const namespaced = true;
export const state = {
    rights: null,
    projectMembers: {}, // key: project, value: members
    profiles: {}, // key: project, value: profiles
    modules: {} // key: project, value: modules
};

function _sort(members)
{
    members.sort(function(c1,c2) {
        if (c1.isManager && !c2.isManager) return -1;
        if (!c1.isManager && c2.isManager) return 1;
        
        if (c1.isGroup && !c2.isGroup) return -1;
        if (!c1.isGroup && c2.isGroup) return 1;
        
        if (c1.name == c2.name) return 0;
        else if (c1.name < c2.name) return -1;
        else return 1;
    });
}

export const mutations = {
    SET_RIGHTS(state, rights) {
        Vue.set(state, 'rights', {
            'view': rights.view || false,
            'add': rights.add || false,
            'edit': rights.edit || false,
            'delete': rights.delete || false
        });
    },

    SET_MEMBERS(state, { projectName, members }) {
        if (projectName)
        {
            _sort(members);
            Vue.set(state.projectMembers, projectName, members);
        }
    },

    ADD_MEMBER(state, { projectName, member }) {
        if (projectName)
        {
            if (state.projectMembers[projectName] === undefined)
            {
                state.projectMembers[projectName] = [];
            }

            state.projectMembers[projectName].push(member);
            _sort(state.projectMembers[projectName]);
        }
    },

    DELETE_MEMBER(state, { projectName, id }) {
        if (projectName && state.projectMembers[projectName])
        {
            const idx = state.projectMembers[projectName].findIndex(member => member.id == id);
            if (idx > -1)
            {
                Vue.delete(state.projectMembers[projectName], idx);
            }
        }
    },

    SET_PROFILES(state, { projectName, profiles }) {
        Vue.set(state.profiles, projectName, profiles);
    },

    SET_MODULES(state, { projectName, modules }) {
        Vue.set(state.modules, projectName, modules);
    },
};

export const getters = {
  getProfiles: state => {
    return state.profiles;
  }
}

export const actions = {
    async getUserRights({ commit, state }) {

        if (state.rights === null)
        {
            try
            {
                let result = await callMethod({
                    role: 'org.ametys.plugins.workspaces.members.ProjectMemberManager',
                    methodName: 'getMemberModuleRights',
                    parameters: [ AmetysFront.getAppParameter('projectName') ]
                });
                if (result.success)
                {
                    commit('SET_RIGHTS', result.rights);
                }
                else
                {
                    if (result["message"] == "unknow-project")
                    {
                        window.VEvent.fire('loaderFail', { 
                            title: i18n.PLUGINS_WORKSPACES_MEMBERS_GET_RIGHTS_ERROR,
                            text : i18n.PLUGINS_WORKSPACES_MEMBERS_UNKNOWN_PROJECT_ERROR_TEXT,
                            details: null
                        });
                    }
                }
            }
            catch (e)
            {
                window.VEvent.fire('loaderFail', { 
                    title: i18n.PLUGINS_WORKSPACES_MEMBERS_GET_RIGHTS_ERROR,
                    text : i18n.PLUGINS_WORKSPACES_MEMBERS_GENERAL_ERROR_TEXT,
                    details: e
                });
            }
        }

        return state.rights;
    },

    async loadProjectMembers({ dispatch, commit }, { projectName }) {
        try 
        {
            const rights = await dispatch('getUserRights');
            if (!rights.view)
            {
                return;
            }
            else
            {
                const result = await callMethod({
                    role: 'org.ametys.plugins.workspaces.members.ProjectMemberManager',
                    methodName: 'getProjectMembers',
                    parameters: [projectName, AmetysFront.getAppParameter('sitemapLanguage')]
                });
                if (result.success)
                {

                    commit('SET_MEMBERS', {
                        projectName: projectName,
                        members: result.members.map(transformToMember)
                    });
                }
                else
                {
                    if (result["message"] == "unknow-project")
                    {
                        window.VEvent.fire('loaderFail', { 
                            title: i18n.PLUGINS_WORKSPACES_MEMBERS_GET_MEMBERS_ERROR,
                            text : i18n.PLUGINS_WORKSPACES_MEMBERS_UNKNOWN_PROJECT_ERROR_TEXT,
                            details: null
                        });
                    }
                }
            }
        }
        catch (e)
        {
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_MEMBERS_GET_MEMBERS_ERROR,
                text : i18n.PLUGINS_WORKSPACES_MEMBERS_GENERAL_ERROR_TEXT,
                details: e
            });
        }
    },

    /**
     * Add multiple members
     */
    async addMembers({ commit }, { members, emails }) {
       const newMembers = [];
       members.forEach(member => {
          newMembers.push({
            id: member.id,
            type: member.isGroup ? 'group' : 'user'
          })
       });
        
       try {
           window.VEvent.fire('loaderStart', {
               text: i18n.PLUGINS_WORKSPACES_MEMBERS_ADD_MEMBERS_START
           });
           
           let result = await callMethod({
                 role: 'org.ametys.plugins.workspaces.members.ProjectMemberManager',
                 methodName: 'addMembers',
                 parameters: [
                     AmetysFront.getAppParameter('projectName'),
                     newMembers,
                     emails
                 ]
            })
            if (result.success)
            {
                members.forEach(member => {
                  commit('ADD_MEMBER', {
                    projectName: AmetysFront.getAppParameter('projectName'),
                    member: { ...member }
                  });
               });

                window.VEvent.fire('loaderEnd', { 
                    text : i18n.PLUGINS_WORKSPACES_MEMBERS_ADD_MEMBERS_SUCCESS
                });
            }
            else
            {
                if (result['invite-error'])
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_ADD_MEMBERS_ERRORINVITE,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_GENERAL_ERROR_TEXT,
                        details: null
                    });
                }
                
                if (result['unknown-project'] || result['unknown-users'].length > 0 || result['unknown-groups'].length > 0)
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_ADD_MEMBERS_ERROR,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_GENERAL_ERROR_TEXT,
                        details: null
                    });
                }
            }
       }
       catch (e)
       {
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_MEMBERS_ADDMEMBERS_ERROR,
                text : i18n.PLUGINS_WORKSPACES_MEMBERS_GENERAL_ERROR_TEXT,
                details: e
            });
        }
        
    },
    
    /**
     * Edit member's rights
     */
    async editMember(_, { profiles, member }) {
        

        try {
            window.VEvent.fire('loaderStart', {
                text: i18n.PLUGINS_WORKSPACES_MEMBERS_EDIT_MEMBERS_START
            });
            
            let result = await callMethod({
                role: 'org.ametys.plugins.workspaces.members.ProjectMemberManager',
                methodName: 'setProjectMemberData',
                parameters: [
                    AmetysFront.getAppParameter('projectName'),
                    member.id,
                    member.isGroup ? 'group' : 'user',
                    profiles,
                    null // No role
                ]
            })
            
            if (result.success)
            {
                window.VEvent.fire('loaderEnd', { 
                    text : i18n.PLUGINS_WORKSPACES_MEMBERS_EDIT_MEMBERS_SUCCESS
                });
            }
            else
            {
                if (result["message"] == "unknow-project")
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_EDIT_MEMBERS_ERROR,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_UNKNOWN_PROJECT_ERROR_TEXT,
                        details: null
                    });
                }
                if (result["message"] == "unknow-group")
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_EDIT_MEMBERS_ERROR,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_UNKNOWN_GROUP_ERROR_TEXT,
                        details: null
                    });
                }
                if (result["message"] == "unknow-user")
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_EDIT_MEMBERS_ERROR,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_UNKNOWN_USER_ERROR_TEXT,
                        details: null
                    });
                }
            }
        }
        catch (e)
        {
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_MEMBERS_EDIT_MEMBERS_ERROR,
                text : i18n.PLUGINS_WORKSPACES_MEMBERS_GENERAL_ERROR_TEXT,
                details: e
            });
        }
    },

    /**
     * Remove a member
     */
    async removeMember({ commit }, { member }) {
        
        try
        {
            
            window.VEvent.fire('loaderStart', {
                text: i18n.PLUGINS_WORKSPACES_FILE_MANAGER_DELETING
            });
    
            let result = await callMethod({
                role: 'org.ametys.plugins.workspaces.members.ProjectMemberManager',
                methodName: 'removeMember',
                parameters: [
                    AmetysFront.getAppParameter('projectName'),
                    member.id,
                    member.isGroup ? 'group' : 'user'
                ]
            })
            if (result.success)
            {
                commit('DELETE_MEMBER', {
                    projectName: AmetysFront.getAppParameter('projectName'),
                    id: member.id
                });
                window.VEvent.fire('loaderEnd', { 
                    text : i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBERS_SUCCESS
                });
            }
            else
            {
                if (result["message"] == "unknow-project")
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBER_ERROR,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_UNKNOWN_PROJECT_ERROR_TEXT,
                        details: null
                    });
                }
                if (result["message"] == "unknown-users")
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBER_ERROR,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_UNKNOWN_USER_ERROR_TEXT,
                        details: null
                    });
                }
                if (result["message"] == "unknown-group")
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBER_ERROR,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_UNKNOWN_GROUP_ERROR_TEXT,
                        details: null
                    });
                }
                if (result["message"] == "current-user")
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBER_ERROR,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBER_CURRENT_USER_ERROR,
                        details: null
                    });
                }
                if (result["message"] == "only-manager")
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBER_ERROR,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBER_ONLY_MANAGER_ERROR,
                        details: null
                    });
                }
                if (result["message"] == "unknow-member")
                {
                    window.VEvent.fire('loaderFail', { 
                        title: i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBER_ERROR,
                        text : i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBER_UNKNOWN_MEMBER_ERROR,
                        details: null
                    });
                }
            }
        }
        catch (e)
        {
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_MEMBERS_DELETE_MEMBER_ERROR,
                text : i18n.PLUGINS_WORKSPACES_MEMBERS_GENERAL_ERROR_TEXT,
                details: e
            });
        }
    },

    async loadProfilesAndModules({ commit }, { projectName }) {
        try
        {
            const { profiles, modules } = await callMethod({ 
                role: 'org.ametys.plugins.workspaces.project.rights.ProjectRightHelper',
                methodName: 'getProjectRightsData',
                parameters: [
                    projectName
                ]
            })
            commit('SET_PROFILES', {
                projectName,
                profiles
            });
            commit('SET_MODULES', {
                projectName,
                modules
            });
            
        }
        catch (e)
        {
            window.VEvent.fire('loaderFail', { 
                title: i18n.PLUGINS_WORKSPACES_MEMBERS_GET_PROJECT_RIGHTS_ERROR,
                text : i18n.PLUGINS_WORKSPACES_MEMBERS_GENERAL_ERROR_TEXT,
                details: e
            });
        }
        
    }
};
