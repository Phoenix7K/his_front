<template>
  <el-row
    type="flex"
    align="center"
    :gutter="20"
    style="font-weight: bold;
           margin-top: 15px">
    <el-col style="padding-left:5px; font-size: small" :span="8">
      <div style="margin-top:8px;">
        {{property}}:
      </div>
    </el-col>
    <el-col :span="16">
      <el-tag v-if="val!=null" class="el-tag">{{val}}</el-tag>
    </el-col>
  </el-row>
</template>

<script>
    export default {
      name: "patient_info_line",
      props: ['property','val'],
    }
</script>

<style scoped>
  .el-tag{
    background-color:#ecf5ff;
    border-color:#d9ecff;
    display:inline-block;
    padding:0 10px;
    line-height:30px;
    height: auto;
    font-size:12px;
    color:#409EFF;
    border-width:1px;
    border-style:solid;
    border-radius:4px;
    box-sizing:border-box;
    white-space: pre-line;
  }
</style>
