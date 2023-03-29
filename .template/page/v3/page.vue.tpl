<template>
  <div class="page-<%=parentKebabKeyword%>">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
import { useBasePage } from "@/app/pages/base-page";

useBasePage(getCurrentInstance());
// todo
</script>
<style lang="scss" scoped src="./<%= kebabKeyword%>.scss">

</style>
