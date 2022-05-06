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
<template>
    <v-menu v-if="(canWrite && comment.canHandle) || canDeleteCommentTask" left min-width="190px" nudge-top="11px" nudge-right="13px">
        <template v-slot:activator="{ on }">
            <v-btn color="transparent" elevation="0" fab x-small v-on="on">
                <v-icon class="cursor-pointer" color="#9575CD" size="22px">more_horiz</v-icon>
            </v-btn>
        </template>

        <v-list :flat="true" class="edit-file-menu" @mouseenter="edit = true" @mouseleave="edit = false">
            <div class="d-flex">
                <v-icon color="#9575CD" class="comment-title-inner-icon cursor-pointer ml-auto mb-3" size="22px">
                    more_horiz
                </v-icon>
            </div>

            <v-list-item v-if="comment.canHandle" class="nouveau-item mt-7" @click="editComment(comment.id)">
                <v-list-item-title>
                    <a href="#!" class="link-muted">
                        <v-icon color="#6D758A" size="16px" class="mr-2">fas fa-pencil-alt</v-icon>
                        {{i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_EDIT_TITLE}}
                    </a>
                </v-list-item-title>
            </v-list-item>
            <v-list-item v-if="canDeleteCommentTask || comment.canHandle" :class="['nouveau-item', comment.canHandle ? '' : 'mt-7']" @click="deleteComment(comment.id)">
                <v-list-item-title>
                    <a href="#!" class="link-muted">
                        <v-icon color="#6D758A" size="16px" class="mr-2">fa fa-trash-alt theme--light</v-icon>
                        {{i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_DELETE_TITLE}}
                    </a>
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import i18n from '../../../src/components/MessageFrench';

  export default {
    name: "CommentMenu",
    props: {
      comment: {
        default: () => {},
        required: true
      },
      canWrite: {
        type: Boolean,
        default: () => true
      },
      canDeleteCommentTask: {
        type: Boolean,
        default: () => true
      },
      isSubComment: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        i18n
      }
    },
    methods: {
      deleteComment(commentId)
      {
        this.$emit('deleteComment', {commentId: commentId, isSubComment: this.isSubComment})
      },

      editComment(commentId)
      {
        this.$emit('editComment', {commentId: commentId, isSubComment: this.isSubComment});
      }
    }
  }
</script>
