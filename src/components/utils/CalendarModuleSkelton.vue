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
<template>
  <v-row>
    <v-col cols="12" md="4" lg="3" order="2" order-md="1">
      <div aria-busy="true" aria-live="polite" role="alert" class="v-skeleton-loader v-skeleton-loader--is-loading theme--light">
        <div class="v-skeleton-loader__article v-skeleton-loader__bone">
          <div class="v-skeleton-loader__heading v-skeleton-loader__bone"></div>
          <div class="v-skeleton-loader__paragraph v-skeleton-loader__bone">
            <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
            <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
            <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
          </div>
          <div class="v-skeleton-loader__paragraph v-skeleton-loader__bone">
            <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
            <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
            <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
          </div>
          <div class="v-skeleton-loader__paragraph v-skeleton-loader__bone">
            <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
            <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
            <div class="v-skeleton-loader__text v-skeleton-loader__bone"></div>
          </div>
          <div class="v-skeleton-loader__heading v-skeleton-loader__bone"></div>
        </div>
      </div>
    </v-col>
    <v-col md="8" lg="9" order="1" order-md="2">
      <div aria-busy="true" aria-live="polite" role="alert" class="v-skeleton-loader v-skeleton-loader--is-loading theme--light">
        <div class="v-skeleton-loader__card-heading v-skeleton-loader__bone">
          <div class="d-flex">
            <div class="v-skeleton-loader__actions v-skeleton-loader__bone">
              <div class="v-skeleton-loader__button v-skeleton-loader__bone"></div>
              <div class="v-skeleton-loader__button v-skeleton-loader__bone" style="margin-right: 12px"></div>
              <div class="v-skeleton-loader__button v-skeleton-loader__bone"></div>
            </div>
            <div class="flex-fill d-flex align-center justify-center">
              <div class="v-skeleton-loader__heading v-skeleton-loader__bone"></div>
            </div>
            <div class="v-skeleton-loader__actions v-skeleton-loader__bone">
              <div class="v-skeleton-loader__button v-skeleton-loader__bone"></div>
              <div class="v-skeleton-loader__button v-skeleton-loader__bone"></div>
            </div>
          </div>
          <div class="v-skeleton-loader__date-picker-days v-skeleton-loader__bone" style="padding: 12px">
            <template v-for="n in 42">
              <div :key="n" style="width: 13%; padding-bottom: 8%" class="v-skeleton-loader__avatar v-skeleton-loader__bone"></div>
            </template>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
