<template>
  <el-row style="margin-left: 20px; font-size: medium" type="flex" justify="space-between">
    <el-col :span="6">
      {{bill.feename}}
    </el-col>
    <el-col :span="8">

    </el-col>
    <el-col v-if="confirmType === 'Refund'" :span="6">
      {{bill.totalprice}} 元
    </el-col>
    <el-col v-else :span="6">
      {{bill.totalprice}} 元
    </el-col>
  </el-row>
</template>

<script>
    export default {
      name: "entry_line",
      props: ['bill','confirmType'],
    }
</script>

<style scoped>

</style>
