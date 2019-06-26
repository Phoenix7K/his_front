<template>
  <div id="addDialog">
    <el-dialog
      title="Add Disease"
      :visible.sync="dialogVisible"
      width="65%">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-input v-model="discode" style="width:300px" placeholder="Enter PingYin Code"></el-input>
          <el-button icon="el-icon-search" type="primary" @click="searchDiseases">search</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="diseases"
        style="width: 100%"
        tooltip-effect="dark"
        max-height="550"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          fixed="left"
          prop="icdcode"
          label="ICD Code"
          width="150">
        </el-table-column>
        <el-table-column
          prop="disname"
          label="Disease Name"
          width="200">
        </el-table-column>
        <el-table-column
          prop="discat"
          label="Disease Category">
        </el-table-column>

      </el-table>
      <el-row :gutter="20" style="margin-top: 20px" type="flex" justify="space-around">
        <el-col :span="8">
          <el-button type="primary" @click="openConfirmDialog">Confirm</el-button>
        </el-col>
        <el-col :span="8">
          <el-button @click="closeDialog">Cancel</el-button>
        </el-col>
      </el-row>

    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "addDisease",
      data() {
        return {

          dialogVisible: false,
          discode: '',
          diseases: [],
          type: '',
          multipleSelection: [],
          regid: null,
        }
      },
      methods: {
        searchDiseases: function () {
          console.log("search" + this.discode);
          var that = this;
          this.$axios.post('/api/outpatient/getDiseasesByPinyin', {discode: this.discode})
            .then(function (response) {
              console.log(response.data);
              that.diseases = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });

        },
        openConfirmDialog: function () {

          var that = this;

          this.$confirm('Sure to add?', 'Notice', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            console.log("add!!!!!!");

            this.$axios.post('/api/outpatient/addDiseaseToDiag', {
              regid: this.regid,
              addList: this.multipleSelection
            }).then(function () {
              that.$parent.loadPartPage();
            })
              .catch(function (error) {
                console.log(error);
              });


            this.dialogVisible = false;
            this.$message({
              type: 'success',
              message: 'Add Succeed!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Cancel Addition.'
            });
          });
        },

        handleSelectionChange(val) {
          this.multipleSelection = val;
          console.log(this.multipleSelection);
        },

        closeDialog() {
          this.dialogVisible = false;
        }
      }
    }
</script>

<style scoped>

</style>
