<template>
  <div id="returnM">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input type="text" v-model="pid" placeholder="Patient ID" clearable></el-input>
      </el-col>
      <el-col :span="6">
        <el-button icon="el-icon-search" type="primary" @click="getReturnBill">Search</el-button>
      </el-col>
      <el-col :span="6">
        <el-input-number v-model="num" :disabled="disabledState"
                         @change="handleChange" :min="1" :max="count"></el-input-number>
      </el-col>
      <el-col :span="6">
        <el-button icon="el-icon-sold-out" type="primary" :disabled="disabledState"
                   @click="returnMed">Return Medicine</el-button>
      </el-col>
    </el-row>


    <el-table
      ref="singleTable"
      :data="returnM"
      style="width: 100%"
      tooltip-effect="dark"
      highlight-current-row
      @current-change="handleCurrentChange">
      <el-table-column
        prop="itemname"
        label="Medicine Name"
        width="300">
      </el-table-column>
      <el-table-column
        prop="count"
        label="Count"
        width="150">
      </el-table-column>
      <el-table-column
        prop="realname"
        label="Doctor Name"
        width="250">
      </el-table-column>
      <el-table-column
        prop="prename"
        label="Prescription Name"
        width="250">
      </el-table-column>
      <el-table-column
        prop="billdate"
        label="Opened Date">
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="setCurrent()" :disabled="disabledState">Cancel Select</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "returnM",
      data(){
          return{
            pid:null,
            itemname: "",
            count:null,
            realname:"",
            prename:"",
            billdate:"",
            returnM:[],

            disabledState:true,
            num: 1,
            currentRow: null,
          }
      },

      methods: {
        getReturnBill: function () {
          var that = this;
          var params = new URLSearchParams();
          params.append("pid", this.pid);
          this.$axios.post('/api/pharmacy/getReturnBill', params)
            .then(function (response) {
              console.log(response.data);
              that.returnM = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        returnMed: function () {
          var that= this;
          var params = new URLSearchParams();
          params.append("count", this.num);
          params.append("billid", this.currentRow.billid);
          this.$confirm('Are you sure you want to return this?', 'Note', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.$axios.post("/api/pharmacy/returnMed", params)
              .then(function (response) {
                that.getReturnBill();
              })
              .catch(function (error) {
                console.log(error);
              });
            this.$message({
              type: 'success',
              message: 'Return success!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Cancel!'
            });
          });
        },
        handleChange(value) {
          // console.log(value);
          this.num=value;
        },
        setCurrent(row) {
          this.$refs.singleTable.setCurrentRow(row);
          this.disabledState=true;
          this.count=null;
        },
        handleCurrentChange(val) {
          this.currentRow = val;
          // console.log(val);
          this.disabledState=false;
          this.num=1;
          if(val){
            this.count=val.count;
          }
        },
      }
    }
</script>

<style scoped>

</style>
