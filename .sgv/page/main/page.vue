<template>
  <div class="page-module">
    {{title}}
    <p>{{today}}</p>
    <button type="button" @click="show()">按钮</button>
  </div>
</template>
<script lang="ts" src="./<%= keyword%>.ts">

</script>
<style lang="scss" scoped>
$color: #333;

.page-module {
  color: $color;
  font-size: 0.6rem;
}
</style>
