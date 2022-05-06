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
  <div class="comment comment-ofsset-y cursor-pointer">
    <div v-if="comment.isDeleted" class="d-flex justify-content-between delete-comment" >
      <div class="d-flex justify-content-between">
        <div>
            <v-icon color="#6D758A" size="16px" class="mr-2">fa fa-trash-alt theme--light</v-icon>
            {{i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_DELETE_INFO}}
        </div>
      </div>
    </div> 
    <comment-edit v-else-if="canEdit && editCommentId == comment.id"
      v-click-outside="closeEdit"
      :comment="comment"
      @editComment="editComment"  
    >
    </comment-edit>
    
    <template v-else>
      <div class="d-flex justify-content-between comment-head" >
        <div class="d-flex justify-content-between">
          <div class="mr-5 avatar">
            <img
              :src="comment.author.avatar"
              alt=""
              class="persone-avatar">
          </div>

          <div>
            <p class="mb-0">
              <span class="persone-name">{{ comment.author.name }}</span>
              <span class="date ml-2">- {{ AmetysUtils.toMomentDate(comment.creationDate) }}</span>
            </p>
            <p class="mb-0" v-if="comment.author.function || comment.author.organisationAcronym">
              <span class="persone-status">{{ comment.author.function }}</span>
              <span v-bind:class="[comment.author.function ? 'ml-1' : '', 'tag']">{{ comment.author.organisationAcronym }}</span>
            </p>
          </div>
        </div>

        <comment-menu
          :canWrite="canWrite"
          :canDeleteCommentTask="canDeleteCommentTask"
          :comment="comment"
          isSubComment="false"
          @deleteComment="deleteComment"
          @editComment="startEditComment"
        >
        </comment-menu>
      </div>

      <div class="comment-body" v-html="commentText(comment)">
      </div>

    </template>

    <div class="comment-footer">
      <p class="d-flex align-items-center mb-0" v-if="!comment.isDeleted && (!canEdit || editCommentId != comment.id)">
          <span v-if="canAnswer && canWrite"
              class="repondre-like mt-2 mr-1"
              @click="answer()">{{i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_ANSWER}}
          </span>

          <span v-if="canLike"
              class="like">
              <v-icon v-if="canWrite" size="18" @click="liked(comment)" :data-ametys-tooltip="likersTooltip(comment)">
                {{comment.isLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'}}
              </v-icon>
              <v-icon v-else size="18" :data-ametys-tooltip="likersTooltip(comment)">
                {{comment.isLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'}}
              </v-icon>
          </span>

          <span v-if="canLike && comment.nbLike > 0" class="like-count mt-2">{{ comment.nbLike }}</span>
      </p>

      <div v-for="(subComment, index) in comment.subComments" :key="subComment.id"
           class="pt-5 pb-1 comment cursor-pointer" :class="{'pb-6': index < comment.subComments.length - 1}"
      >
        <comment-edit v-if="canEdit && editCommentId == subComment.id"
         v-click-outside="closeEdit"
         :comment="subComment"
         :parentCommentId="comment.id"
         @editComment="editComment"  
        >
        </comment-edit>
      
        <template v-else>
          <div v-if="subComment.isDeleted" class="d-flex justify-content-between delete-comment" >
            <div class="d-flex justify-content-between">
                <div>
                    <v-icon color="#6D758A" size="16px" class="mr-2">fa fa-trash-alt theme--light</v-icon>
                    {{i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_DELETE_INFO}}
                </div>
            </div>
          </div>
          <template v-else> 
            <div class="d-flex justify-content-between comment-head">
              <div class="d-flex justify-content-between">
                <div class="mr-5 avatar">
                  <img
                    :src="subComment.author.avatar"
                    alt=""
                    class="persone-avatar">
                </div>

                <div>
                  <p class="mb-0" >
                    <span class="persone-name">{{ subComment.author.name }}</span>
                    <span class="date ml-2">- {{ AmetysUtils.toMomentDate(subComment.creationDate) }}</span>
                  </p>
                  <p class="mb-0" v-if="subComment.author.function || subComment.author.organisationAcronym">
                    <span class="persone-status">{{ subComment.author.function }}</span>
                    <span class="tag ml-1">{{ subComment.author.organisationAcronym }}</span>
                  </p>
                </div>
              </div>

              <comment-menu
                :canWrite="canWrite"
                :canDeleteCommentTask="canDeleteCommentTask"
                :comment="subComment"
                isSubComment="true"
                @deleteComment="deleteComment"
                @editComment="startEditComment"
              >
              </comment-menu>
            </div>

            <div class="comment-body" v-html="commentText(subComment)">
            </div>

            <div class="comment-body">
              <div class="d-flex align-items-center mt-2">
                <span v-if="canWrite" class="like ml-0 mt-1" @click="liked(subComment)" :data-ametys-tooltip="likersTooltip(subComment)">
                  <v-icon size="18">
                    {{subComment.isLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'}}
                  </v-icon>
                </span>
                <span v-else class="like ml-0 mt-1" :data-ametys-tooltip="likersTooltip(subComment)">
                  <v-icon size="18">
                    {{subComment.isLiked ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'}}
                  </v-icon>
                </span>

                <span v-if="subComment.nbLike > 0" class="like-count ml-2 mt-3">{{ subComment.nbLike }}</span>
              </div>
            </div>
          </template>
        </template>
      </div>
      <v-textarea v-if="isSubComment"
                  v-model="subComment"
                  auto-grow
                  rows="1"
                  ref="subCommentField"
                  row-height="15"
                  class="comment-input mt-3 mb-5"
                  id="subComment-field"
                  :placeholder="i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_ADD"
      >
        <template class="add-comment" slot="prepend-inner">
          <img class="d-inline-flex justify-content-center align-items-center mr-3 name" :src="AmetysUtils.getCurrentUserImgUrl(30)" width="30px" alt="">
        </template>

        <template class="add-comment" slot="append">
          <img
              @click="addSubComment(comment)"
              class="send-icon cursor-pointer"
              :src="AmetysFront.getPluginResourcesPrefix('workspaces') + '/img/icons/send-icon.svg'" 
              :alt="i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_SEND">
        </template>
      </v-textarea>
    </div>
  </div>
</template>

<script>
  import AmetysFront from 'AmetysFront';
  import AmetysUtils from 'AmetysUtils';
  import i18n from 'i18n';
  import CommentMenu from './CommentMenu';
  import CommentEdit from './CommentEdit';
  
  export default {
    name: "Comment",
    components: {CommentMenu, CommentEdit},
    props: {
      comment: {
        default: () => {},
        required: true
      },
      allUsers: {
        default: () => {},
        required: true
      },
      nbLikersForToolip: {
        default: () => 5
      },
      canLike: {
        type: Boolean,
        default: () => true
      },
      canWrite: {
        type: Boolean,
        default: () => true
      },
      canAnswer: {
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
      ametysObjectId: {
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
        AmetysFront,
        AmetysUtils,
        i18n,
        isSubComment: false,
        subComment: '',
        canEdit: false,
        editCommentId: null
      }
    },
    methods: {
      closeEdit() {
        this.canEdit = false;
      },
      commentText(comment) {
        let text = comment.text;
        text = text.replaceAll("<", "&lt;").replace(/\r?\n|\r/g, '<br/>');

        if (comment.isEdited)
        {
            text += " <i class='comment-edited-hint'>(" + i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_EDIT_HINT + ")</i>"
        }
        
        return text;
      },
      
      async liked(comment) {
        let data = await this.$store.dispatch(this.storeName + '/likeOrUnlikeComment', {
            ametysObjectId: this.ametysObjectId,
            commentId: comment.id,
            liked: !comment.isLiked
        })

        this.$emit('updateComments', data.comments);
      },

      deleteComment(commentObj) {
        let commentId = commentObj.commentId;
        let isSubComment = commentObj.isSubComment;
        
        this.$emit('deleteComment', isSubComment === "true" ? {parent: this.comment, commentId: commentId} : {commentId: commentId})
      },

      startEditComment(commentObj)
      {
        this.isSubComment = false;
        
        this.canEdit = true;
        this.editCommentId = commentObj.commentId;
        
        setTimeout(() => {
            let doc = document.querySelector("#edit-" + commentObj.commentId);
            doc.focus();
        }, 100);
      },
      
      async editComment(newCommentObj) {
        let commentId = newCommentObj.commentId;
        let commentText = newCommentObj.commentText;
        let subCommentId = newCommentObj.subCommentId;
        
        if (commentText != this.comment.text)
        {
            let data = await this.$store.dispatch(this.storeName + '/editComment', {
                ametysObjectId: this.ametysObjectId,
                commentId: subCommentId ? subCommentId : commentId,
                text: commentText
            });
            
            this.$emit('updateComments', data.comments);
        }
        this.canEdit = false;
      },

      async addSubComment(comment) {
        this.isSubComment = false

        let data = await this.$store.dispatch(this.storeName + '/addSubComment', {
            ametysObjectId: this.ametysObjectId,
            commentId: comment.id,
            text: this.subComment,
            authorURL: AmetysUtils.getUserImgUrl(window.ametysUser, 30)
        })

        this.$emit('updateComments', data.comments);

        this.subComment = ''
      },

      likersTooltip(comment) {
          let userNames = {};
          for (let user of this.allUsers)
          {
              userNames[user.id] = user.name;
          }
          
          let maxLikersForDisplay = this.nbLikersForToolip;
          let userLikes = comment.userLikes;
          if (userLikes.length > 0)
          {
              let html = "<ul>";
              for (let i = 0; i < Math.min(maxLikersForDisplay, userLikes.length); i++)
              {
                  html += "<li>" + userNames[userLikes[i]] + "</li>";
              }
              
              if (userLikes.length > maxLikersForDisplay)
              {
                  let diff = userLikes.length - maxLikersForDisplay;
                  if (diff == 1)
                  {
                     html += "<li>" + i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_LIKERS_ONE_OTHER + "</li>";
                  }
                  else
                  {
                     html += "<li>" + i18n.PLUGINS_WORKSPACES_PROJECT_COMMENT_LIKERS_SEVERAL_OTHER.replace(/\{0\}/g, diff) + "</li>";
                  }
              }
              html += "</ul>";
              return html;
          }
          return null;
      },
      
      answer() {
        this.canEdit = false;
        this.editCommentId = null;
        
        this.isSubComment = !this.isSubComment

        if (!this.isSubComment) return false

        setTimeout(() => {
          const container = document.querySelector("#" + this.commentsContainerId)

          this.$smoothScroll({
            scrollTo: this.$refs.subCommentField.$el,
            container: container,
            offset: -container.clientHeight + 200
          })
          
          this.$refs.subCommentField.focus()
        }, 100)
      }
    }
  }
</script>

<style lang="scss">
  .like {
    margin-bottom: 5px;
    margin-left: 10px;
    height: 18px;
  }

  .like i {
    font-size: 18px;
    color: #7F8182;
  }

  .like-count {
    margin-left: 10px;
  }

  .comment .comment-edited-hint {
    font-size:12px; 
    color:#7F8182
  }

  .comment-input .v-input__slot {
    min-height: 85px;
    margin-bottom: 0;
    padding: 0 90px 0 110px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px dashed #D6D6D6;
  }

  .comment-input .v-input__slot:before {
    border: none !important;
  }

  .comment .comment-head .v-btn {
    display: none;
  }

  .comment-head {
    margin-bottom: 10px;
  }

  .comment .comment-head:hover .v-btn {
    display: flex !important;
  }

  .comment-title-inner-icon {
    position: absolute !important;
    top: 18px;
    right: 20px;
  }
  
  .comment .delete-comment {
    font-family: Poppins Medium;
    font-size: 14px;
    font-weight: normal;
    background-color: #F4F1FA;
    padding: 15px;
  }
</style>
