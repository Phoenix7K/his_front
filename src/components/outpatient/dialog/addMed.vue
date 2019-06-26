<template>
  <div id="addMed">
    <el-dialog
      title="Add Medicine"
      :visible.sync="dialogVisible"
      width="65%">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-input v-model="itemcode" style="width:300px" placeholder="Enter PingYin Code"></el-input>
          <el-button icon="el-icon-search" type="primary" @click="searchMedicine()">search</el-button>
        </el-col>
      </el-row>
      <!--medicine form-->
      <el-table :data="medicine"
                style="width: 100%"
                tooltip-effect="dark"
                max-height="600"
                ref="singleTable"
                highlight-current-row
                @current-change="handleCurrentChange">
        <el-table-column
          fixed="left"
          prop="itemname"
          label="Medicine Name"
          width="180">
        </el-table-column>
        <el-table-column
          prop="size"
          label="Size"
          width="130">
        </el-table-column>
        <el-table-column
          prop="price"
          label="Price"
          width="130">
        </el-table-column>

      </el-table>
      <el-row :gutter="20" style="margin-top: 20px" type="flex" justify="space-around">
        <el-col :span="8">
          <el-input-number style="width: 160px" @change="handleChange"
                           size="medium" v-model="number">
          </el-input-number>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" @click="openConfirmDialog">Confirm</el-button>
          <el-button @click="dialogVisible=false">Cancel</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "addMed",
    data() {
      return {
        dialogVisible: false,
        itemcode: '',
        preid: '',
        pretype: "西药",
        medicine: [],
        number: 1,
        tempobject: {},
        currentRow: null,
      }
    },
    methods: {
      searchMedicine: function () {
        var params = new URLSearchParams();
        params.append("itemcode", this.itemcode);
        params.append("pretype", this.pretype);
        var that = this;
        this.$axios.post('/api/outpatient/getMed', params)
          .then(function (response) {
            console.log(response.data);
            that.medicine = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      openConfirmDialog: function () {
        var params = new URLSearchParams();
        params.append("preid", this.preid);
        params.append("itemcode", this.currentRow.itemcode);
        params.append("count", this.number);
        var that = this;
        this.$confirm('Sure to add?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/api/outpatient/addMed', params)
            .then(function (response) {
              that.$parent.refreshItem();
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
      handleChange(value) {
        this.number = value;
      },
      handleCurrentChange(val) {
        this.currentRow = val;
        // console.log(this.currentRow);
      },
    }
  }
</script>

<style scoped>

</style>
