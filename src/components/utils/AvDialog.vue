<!--
   Copyright 2020 Anyware Services

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
   -->
<template>

    <v-dialog
      :fullscreen="fullscreen"
      v-model="dialog"
      max-width="730px"
      scrollable
    >

      <v-card class="av-dialog">

        <v-card-title v-if="fullscreen">
            <v-toolbar dark color="primary">
              <v-toolbar-title>{{title}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="close">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
        </v-card-title>

        <v-card-title v-else class="av-dialog-header">
            {{title}}

            <v-btn large icon text style="position: absolute; right: 20px; top: 20px;" @click="close">
              <v-icon size="24px" class="cursor-pointer av-dialog-close-icon rounded-circle no-focus" width="10px">close</v-icon>
            </v-btn>
        </v-card-title>

        <v-card-text class="av-dialog-text pt-4 px-10">
          <slot></slot>
        </v-card-text>

        <v-card-actions class="av-dialog-footer">
          <v-spacer></v-spacer>

          <v-btn class="btn-cancel btn-hover-opacity-3 mr-3 px-6" x-large text color="primary" @click="cancel">
            <span class="px-2">{{cancelBtnText || 'i18n.PLUGINS_WORKSPACES_MEMBERS_AVDIALOG_CANCEL'}}</span>
          </v-btn>

          <template v-if="submitBtn">
              <v-btn v-if="variant == 'dark'" :class="'px-6 btn-ok btn-ok--' + variant" x-large depressed color="primary" @click="submit">
                <span class="px-2">{{okBtnText || 'i18n.PLUGINS_WORKSPACES_MEMBERS_AVDIALOG_VALIDATE'}}</span>
              </v-btn>
              <v-btn v-else :class="'px-6 btn-ok btn-ok--' + variant" x-large depressed @click="submit" v-ripple="{ class: `primary--text` }">
                <span class="primary--text px-2">{{okBtnText || 'i18n.PLUGINS_WORKSPACES_MEMBERS_AVDIALOG_VALIDATE'}}</span>
              </v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: "AvDialog",
    
    data() {
        return {
            dialog: false
        };
    },
    
    props: {
      title: {
        type: String,
        default: 'Dialog Title'
      },
      closeOnSubmit: {
        type: Boolean,
        default: true
      },
      value: {
        type: Boolean,
        default: false
      },
      variant: {
        type: String,
        default: 'action' // TODO can be action|dark|error
      }, 
      okBtnText: {
        type: String
      },
      cancelBtnText: {
        type: String
      },
      fullscreen: {
        type: Boolean,
        default: false
      },
      submitBtn: {
        type: Boolean,
        default: true
      }
    },
    watch: {
        value(val) {
            this.dialog = val;
            if (!val)
            {
                this.close();
            }
        },
        dialog(val) {
          this.$emit('input', val)
        }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      open() {
        this.dialog = true;
      },
      submit() {
        this.$emit('submit', true);
        if (this.closeOnSubmit)
        {
            this.dialog = false;
        }
      },
      cancel() {
        this.dialog = false;
        this.$emit('cancel', true);
      }
    },
    mounted: function () {
        // closing when escape is pressed
        document.addEventListener("keydown", (e) => {
          if (this.value && e.keyCode == 27) {
            this.close();
          }
        });
     }
  }
</script>

<style lang="scss">

  .av-dialog {
    .av-dialog-header,
    .av-dialog-text,
    .av-dialog-footer {
      padding-right: 40px !important;
      padding-left: 40px !important;
    }
  
    .v-input, .v-input input {
        padding-bottom: 11px !important;
        color: #9475cd !important;
        font-weight: 500;
     }
     
     .v-input--is-focused input::placeholder {
        color: #9575cd !important;
     }
     
     .av-dialog-header {
        color: #7F8182;
        font-family: "Poppins Medium";
        font-size: 22px !important;
        padding-top: 30px !important;
        padding-bottom: 30px !important;
        word-break: break-word;
        .v-btn {
            color: #9575cd;
            caret-color: #9575cd;
            
            .v-icon {
                color: #7F8182;
                caret-color: #7F8182;
                
                &:hover {
                    color: #9575CD !important;
                }
            }
        }
      }
     
     .av-dialog-footer {
        padding-bottom: 35px !important;
        
        .v-btn  {
            &:before {
                display: none !important;
            }
            
            &.btn-cancel {
                transition: .2s;
                
                &:hover {
                    background-color: rgb(240 ,237, 246) !important;
                }
                
            }
            
            &.btn-ok {
                transition: .3s;
                
                &.btn-ok--action {
                    color: rgb(228, 221, 239);
                    background-color: rgb(228, 221, 239) !important;
                    
                    &:hover {
                        background-color: #d7cde8 !important;
                    }
                }
            }
            
            &.btn-hover-opacity-3:hover:before {
                opacity: .3 !important;
            }
        }
     }
     
     .av-dialog-text {
        color: #313131;
        font-family: "Poppins Regular";
        font-size: 16px;
      }
  }

</style>