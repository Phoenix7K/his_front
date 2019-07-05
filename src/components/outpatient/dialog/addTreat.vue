<template>
  <div id="addTreat">
    <el-dialog
      title="Add Disposal"
      :visible.sync="dialogVisible"
      width="65%">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-input v-model="itemcode" style="width:300px" placeholder="Enter PingYin Code"></el-input>
          <el-button icon="el-icon-search" type="primary" @click="searchItem">search</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="items"
        style="width: 100%"
        max-height="550"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"

          width="55">
        </el-table-column>
        <el-table-column
          fixed="left"
          prop="itemname"
          label="Item Name"
          width="150">
        </el-table-column>
        <el-table-column
          prop="size"
          label="Size"
          width="200">
        </el-table-column>
        <el-table-column
          prop="deptcode"
          label="Department Code"
          width="150">
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
        name: "addTreat",
      data() {
        return {

          dialogVisible: false,
          itemcode: '',
          items: [],
          multipleSelection: []

        }
      },
      methods: {
        searchItem: function () {
          console.log("search" + this.itemcode);
          var that = this;
          this.$axios.post('/api/outpatient/getNonMedicByPinyin', {itemcode: this.itemcode, nmedtype: 'disposal'})
            .then(function (response) {
              console.log(response.data);
              that.items = response.data;
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

            this.$axios.post('/api/outpatient/addItemToExam', {
              regid: that.$parent.regid,
              extype: 'disposal',
              uRid: that.$parent.uRid,
              addList: this.multipleSelection
            }).then(function () {
              that.$parent.loadDisposal();
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
