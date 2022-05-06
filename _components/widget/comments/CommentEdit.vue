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
    <v-textarea
        auto-grow
        v-model="commentText"
        rows="1"
        :value="comment.text"
        :ref="'edit-' + comment.id"
        row-height="15"
        class="comment-input mt-3 mb-5"
        :id="'edit-' + comment.id"
        :placeholder="i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_ADD"
    >
        <template class="add-comment" slot="prepend-inner">
            <img class="d-inline-flex justify-content-center align-items-center mr-3 name" :src="AmetysUtils.getCurrentUserImgUrl(30)" width="30px" alt="">
        </template>

        <template class="add-comment" slot="append">
            <img
                @click="editComment(comment.id)"
                class="send-icon cursor-pointer"
                :src="AmetysFront.getPluginResourcesPrefix('workspaces') + '/img/icons/send-icon.svg'"
                :alt="i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_SEND">
        </template>
    </v-textarea>
</template>

<script>
import i18n from '../../../src/components/MessageFrench';
  import AmetysFront from 'AmetysFront';
  import AmetysUtils from 'AmetysUtils';

  export default {
    name: "CommentEdit",
    props: {
      comment: {
        default: () => {},
        required: true
      },
      parentCommentId: {
        type: String,
        required: null
      }
    },
    data() {
      return {
        i18n,
        AmetysFront,
        AmetysUtils,
        commentText: this.comment.text,
      }
    },
    methods: {
      editComment(commentId)
      {
        if (this.parentCommentId)
        {
          this.$emit('editComment', {commentId: this.parentCommentId, subCommentId: commentId, commentText: this.commentText});
        }
        else
        {
          this.$emit('editComment', {commentId: commentId, commentText: this.commentText});
        }
      }
    }
  }
</script>
