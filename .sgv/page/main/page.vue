<template>
  <div class="page-module">
    {{title}}
    <p>{{tomorrow}}</p>
    <button type="button" @click="show()">按钮</button>
  </div>
</template>
<script lang="ts" src="./<%= keyword%>.ts">

</script>
<style lang="scss" scoped>
$color-red: #f00;

.page-module {
  color: $color-red;
  font-size: 0.6rem;
}
</style>
