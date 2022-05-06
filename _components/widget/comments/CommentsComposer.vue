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
  <div class="commentaires" id="comentaries">
    <p class="commentaires__title">
      <v-icon class="mr-1" size="16" color="#A9A9A9">far fa-comment</v-icon>
      {{i18n.PLUGINS_WORKSPACES_PROJECT_COMMENTS}}
    </p>

    <v-form>
      <div class="commentaires__inner">
        <v-textarea v-model="comment"
                    v-if="canWrite"
                    id="comment-textarea"
                    auto-grow
                    rows="1"
                    row-height="15"
                    class="mb-5 comment-input"
                    :placeholder="i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_ADD"
        >
          <template class="add-comment" slot="prepend-inner">
            <img class="d-inline-flex justify-content-center align-items-center mr-3 name" :src="AmetysUtils.getCurrentUserImgUrl(30)" width="30px" alt="">
          </template>

          <template class="add-comment" slot="append">
            <img
                @click="addComment()"
                class="send-icon cursor-pointer"
                :src="AmetysFront.getPluginResourcesPrefix('workspaces') + '/img/icons/send-icon.svg'"
                :alt="i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_SEND">
          </template>
        </v-textarea>

        <!-- End Delete Confirm Dialog -->
        <av-dialog v-model="deleteConfirmDialog"
                   variant="dark"
                   @close="deleteConfirmDialog = false"
                   :title="i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_DELETE"
                   :okBtnText="i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_DELETE_OK"
                   @submit="confirmDeleteComment">
          {{i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_DELETE_MSG}}
        </av-dialog>
        <!-- End Delete Confirm Dialog -->

        <comment v-for="com in comments"
                      :key="com.id"
                      :comment="com"
                      :allUsers="allUsers"
                      :nbLikersForToolip="nbLikersForToolip"
                      :ametysObjectId="ametysObjectId"
                      :canLike="canLike"
                      :canAnswer="canAnswer"
                      :canWrite="canWrite"
                      :canDeleteCommentTask="canDeleteCommentTask"
                      :storeName="storeName"
                      :commentsContainerId="commentsContainerId"
                      @deleteComment="deleteComment"
                      @updateComments="updateComments"
                      >
        </comment>
      </div>
    </v-form>
  </div>
</template>

<script>
import Comment from './Comment';
import AvDialog from '../../feedback/AvDialog';
import AmetysFront from 'AmetysFront';
import AmetysUtils from 'AmetysUtils';
import i18n from '../../../src/components/MessageFrench';

export default {
  name: "CommentsComposer",
  components: {Comment, AvDialog},
  props: {
    comments: {
      default: () => []
    },
    allUsers: {
      default: () => {}
    },
    nbLikersForToolip: {
      default: () => 5
    },
    ametysObjectId: {
      type: String,
      required: true
    },
    canLike: {
        type: Boolean,
        default: () => true
    },
    canAnswer: {
      type: Boolean,
      default: () => true
    },
    canWrite: {
      type: Boolean,
      default: () => true
    },
    canDeleteCommentTask: {
      type: Boolean,
      default: () => true
    },
    storeName: {
      type: String,
      required: true
    },
    commentsContainerId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      comment: '',
      AmetysFront,
      AmetysUtils,
      i18n,
      deleteConfirmDialog: false,
      deleteConfirm: null
    }
  },
  methods: {
    updateComments(comments) {
      this.$emit('updateComments', comments);
    },
    async addComment() {
      if (!this.comment.length) return false

      let data = await this.$store.dispatch(this.storeName + '/addComment', {
          ametysObjectId: this.ametysObjectId,
          text: this.comment,
          authorURL: AmetysUtils.getUserImgUrl(window.ametysUser, 30)
      })

      this.$emit('updateComments', data.comments);

      setTimeout(() => {
        const container = document.querySelector("#" + this.commentsContainerId)
        const textarea = document.querySelector("#comment-textarea")

        this.$smoothScroll({
          scrollTo: textarea,
          container: container,
          offset: -250
        })
      }, 100)

      this.comment = ''
    },
    deleteComment(comment) {
      this.deleteConfirm = comment
      this.deleteConfirmDialog = true
    },
    async confirmDeleteComment() {
      let data = await this.$store.dispatch(this.storeName + '/deleteComment', {
        ametysObjectId: this.ametysObjectId,
        commentId: this.deleteConfirm.commentId
      });

      this.$emit('updateComments', data.comments);

      this.deleteConfirm = false
    }
  }
}
</script>

<style lang="scss">
.commentaires__title {
  margin-bottom: 15px !important;
  color: #7F8182;
  font-family: Poppins Medium;
  font-size: 16px;
  font-weight: normal;
  line-height: 27.81px;
}

.comment-input .v-input__slot {
  min-height: 85px;
  margin-bottom: 0;
  padding: 0 90px 0 100px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px dashed #D6D6D6;
}

.comment-input .v-input__slot:before {
  border: none !important;
}

.commentaires__inner .v-textarea .v-text-field__slot {
  margin-top: 10px;
}

.commentaires__inner .v-textarea textarea {
  color: #7F8182 !important;
  font-family: Poppins Regular;
  font-weight: normal;
  font-size: 14px !important;
  letter-spacing: 0;
  line-height: 20px !important;
}

.comment-input .v-text-field__details {
  display: none !important;
}

.comment-input {
  .v-input__prepend-inner {
    position: absolute;
    left: 20px;
    top: 20px;
  }

  .v-input__append-inner {
    position: absolute;
    right: 40px;
    top: 25px;
  }

  .name {
    width: 30px;
    height: 30px;
    background: #44A4D5;
    font-family: Poppins Medium;
    font-size: 18px;
    font-weight: normal;
    letter-spacing: 0.14px;
    line-height: 27px;
    text-align: center;
    margin-left: 30px;
    border-radius: 100%;
    color: #fff;
  }

  .send-icon {
    height: 21px;
  }
}

.comment-ofsset-y {
  padding-top: 20px;
  padding-bottom: 20px;
}

.comment + .comment {
  border-top: 1px dashed rgba(149, 117, 205, .2);
}

.comment-head p {
  line-height: 1.2;
}

.comment-head .avatar img {
  box-sizing: border-box;
  height: 41px;
  width: 41px;
  border: 3px solid #FFFFFF;
  border-radius: 100%;
}

.comment-head .persone-name {
  color: #313131;
  font-family: Poppins Semi Bold;
  font-size: 14px;
  font-weight: normal;
  line-height: 21px;
}

.comment-head .date {
  color: #313131;
  font-family: Italic;
  font-weight: normal;
  font-size: 13px;
  font-style: normal;
  line-height: 20px;
}

.comment-head .persone-status {
  color: #767676;
  font-family: Poppins Medium;
  font-size: 12px;
  font-weight: normal;
  line-height: 18px;
}

.comment-head .tag {
  padding: 0 5px;
  background-color: #A9A9A9 !important;
  color: #FFFFFF !important;
  font-family: Poppins Bold;
  font-size: 12px;
  font-style: italic;
  font-weight: normal;
  line-height: 18px;
  text-align: center;
  border-radius: 0;
  text-transform: uppercase;
}

@media (min-width: 720px) {
  .commentaires__inner {
    padding-left: 30px;
  }

  .comment-body {
    padding-left: 60px;
  }

  .comment-footer {
    padding-left: 60px;
  }
}


.comment-body p {
  color: #7F8182;
  font-family: Poppins Regular;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
}

.comment-footer .repondre-like {
  color: #7F8182;
  font-family: Poppins Semi Bold;
  font-size: 12px;
  font-weight: normal;
  line-height: 27.81px;
}

.comment-footer .repondre-like .v-icon {
  color: #A9A9A9;
}

.comment-footer .repondre-like .v-icon.liked {
  color: #9575CD;
}

.comment-footer .like-count {
  color: #9575CD;
  font-family: Poppins Bold;
  font-size: 12px;
  font-weight: normal;
  line-height: 0;
}

@media (max-width: 960px) {
  .comment-input {
    .v-input__slot {
      padding: 10px 60px;
    }

    .name {
      margin-left: 0;
    }
  }
}

.like .fas {
  color: #9575CD !important;
}
</style>
