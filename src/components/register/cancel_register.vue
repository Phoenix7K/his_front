<template>
  <div id="cancel_register">
    <el-row>
      <el-card class="el-card__body">
        <el-row type="flex" justify="space-between" align="middle">
          <el-col :span="8">
            <div style="padding-left:10px; font-weight: bold; font-size: larger">Cancel Registration</div>
          </el-col>
          <el-col :span="10">
            <el-input placeholder="Enter Patient ID" v-model="searchingPid" class="input-with-select">
              <el-button @click="tryCompletePInfo" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </el-card>
    </el-row>

    <el-row :gutter="10" style="margin-top: 5px;">
      <el-col :span="18">
        <el-row>
          <el-card class="box-card" style="min-height: 280px; max-height: 380px;">
            <div slot="header" class="clearfix">
              <span style="font-weight: bold">Registration Information</span>
            </div>
            <el-table
              ref="multipleTable"
              size="small"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column prop="date" label="Date" width="120"></el-table-column>
              <el-table-column prop="username" label="Doctor" width="160"></el-table-column>
              <el-table-column prop="deptname" label="Department" width="180"></el-table-column>
              <el-table-column prop="regLevel" label="Registration level" width="180"></el-table-column>
              <el-table-column prop="strState" label="State" fixed="right" width="120"></el-table-column>
            </el-table>
          </el-card>
        </el-row>

        <!--   Payment Info    -->
        <el-row style="margin-top: 5px;">
          <el-card class="box-card">
            <el-collapse accordion v-model="activeName">
              <el-collapse-item name="1">
                <template slot="title" class="el-collapse-item__header focusing">
                  Payment & Confirmation
                </template>
                <el-row style="margin-top: 20px" type="flex" justify="space-between">
                  <el-col :span="16">
                    <div v-for="reg in multipleSelection">
                      <entry-line :reg="reg"></entry-line>
                    </div>
                  </el-col>
                </el-row>
                <div>
                  <el-divider></el-divider>
                </div>
                <el-row type="flex" justify="space-between">
                  <el-col :span="16">
                    <el-row style="margin-left: 20px; font-size: medium" type="flex" justify="space-between">
                      <el-col :span="6">
                        Total Price
                      </el-col>
                      <el-col :span="8">

                      </el-col>
                      <el-col :span="6">
                        -{{totalPrice}}元
                      </el-col>
                    </el-row>
                  </el-col>
                  <el-col :span="8">
                    <el-row style="margin-right: 30px;" type="flex" justify="end">
                      <el-button round type="danger" size="small" @click="deleteDialogVisible = true">Confirm</el-button>
                    </el-row>
                  </el-col>
                </el-row>

              </el-collapse-item>
            </el-collapse>
          </el-card>
        </el-row>

      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-weight: bold">Patient Information</span>
          </div>
          <div style="padding: 15px;">
            <patient-info-line property="ID" :val="patientInfo.pid"></patient-info-line>
            <patient-info-line property="Name" :val="patientInfo.pname"></patient-info-line>
            <patient-info-line property="Gender" :val="patientInfo.pgender"></patient-info-line>
            <patient-info-line property="Age" :val="patientInfo.page"></patient-info-line>
            <patient-info-line property="Birth Date" :val="patientInfo.pbirth"></patient-info-line>
            <patient-info-line property="Address" :val="patientInfo.paddress"></patient-info-line>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!--    Delete Dialogue -->
    <el-dialog
      title="Confirm Cancelling"
      :visible.sync="deleteDialogVisible"
      width="30%"
    >
      <span>Are you sure you want to cancel these registrations?</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">No</el-button>
            <el-button type="primary" @click="onConfirm">Yes</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
  import entry_line from './components/entry_line';
  import patient_info_line from './components/patient_info_line';
  export default {
    name: "cancel_register",
    components:{
      'entry-line': entry_line,
      'patient-info-line': patient_info_line
    },
    data(){
      return{
        tableData: [
          // {
          // date: "2019-06-08",
          // deptname: "产科",
          // itemcode: "ZJH",
          // newRecord: true,
          // order: 7,
          // pid: 3,
          // price: 50,
          // regLevel: "专家号",
          // regid: 14,
          // shiftid: 58,
          // state: 1,
          // strState: "已挂号",
          // uRid: 0,
          // username: "max",
          // }
        ],
        multipleSelection: [],
        totalPrice: 0,

        searchingPid: "",
        patientInfo: {
          pid: null,
          pname: null,
          page: null,
          pbirth: null,
          paddress: null,
          pgender: null,
        },

        deleteDialogVisible: false,
        activeName: '',
      }
    },

    mounted: function() {
    },

    methods: {
      tryCompletePInfo: function () {
        console.log("Complete PInfo")
        var that = this;
        this.$axios({
          url: '/api/registration/tryCompletePatientInfo',
          method: 'post',
          contentType: 'application/json', // 这句不加出现415错误:Unsupported Media Type
          data: {id: that.searchingPid},
        })
          .then(function (response) {
            console.log("success complete pinfo");
            console.log(response.data);
            if (response.data.exists == "Yes") {
              that.patientInfo = response.data.patient;
              that.patientInfo.pgender = that.patientInfo.pgender?"Male":"Female";
              that.patientExists = true;
              that.$message({
                message: 'Successfully retrieved patient info',
                type: 'success'
              });
              that.getCancellableRegistrationsByPid();

              // if(!response.data.lastRegFinished){
              //     that.$confirm('The patient is still being treated. No registration available.', 'Attention', {
              //         confirmButtonText: 'Confirm',
              //         type: 'warning',
              //         customClass: 'messageBox-prompt'
              //     })
              // }
            } else {
              that.$message('Did not find patient with the ID');
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      getCancellableRegistrationsByPid(){
        var that = this;
        this.$axios({
          url: '/api/registration/getCancellableRegistrationsByPid',
          method: 'post',
          contentType: 'application/json', // 这句不加出现415错误:Unsupported Media Type
          data: {id: that.patientInfo.pid},
        })
          .then(function (response) {
            console.log("success get Registrations");
            console.log(response.data);
            that.tableData = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },


      // // ----------------          IMPORTANT!!!!             --------------------//
      // //---    IF THERE IS A PROBLEM WITH THE SEARCH METHOD, ASK MOMCHIL  -------//
      // //-------------------------------------------------------------------------//
      // searchPatient: function() {
      //     //get data from database
      //     let that = this;
      //     console.log("Search")
      //     this.$axios.post('/registration/tryCompletePatientInfo', {
      //             pid: that.pid
      //         })
      //         .then(function(response) {
      //             that.patient = response.data;
      //             console.log(that.users);
      //         })
      //         .catch(function(error) {
      //             console.log(error);
      //         });
      //
      //     //config Strings
      //     let nameString = `Name: ${that.pname}`;
      //     let ageString = `Age: ${that.page}`;
      //     let bdateString = `Birth date: ${that.pbirth}`;
      //     let genderString = `Gender: ${that.pgender}`;
      //     let addressString = `Address: ${that.paddress}`;
      //     let billcatString = `Billing category: ${that.billcat}`;
      //
      //     document.getElementById("name").setAttribute("placeholder", nameString);
      //     document.getElementById("age").setAttribute("placeholder", ageString);
      //     document.getElementById("bdate").setAttribute("placeholder", bdateString);
      //     document.getElementById("gender").setAttribute("placeholder", genderString);
      //     document.getElementById("address").setAttribute("placeholder", addressString);
      //     document.getElementById("billcat").setAttribute("placeholder", billcatString);
      // },

      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleDelete(index, row) {


      },

      onConfirm(){
        var that = this;
        this.$axios({
          url: '/api/registration/deleteRegs',
          method: 'post',
          contentType: 'application/json', // 这句不加出现415错误:Unsupported Media Type
          data: that.multipleSelection,
        })
          .then(function (response) {
            console.log("success deleteRegs");
            console.log(response.data);
            that.getCancellableRegistrationsByPid();
            console.log("Refreshed")
            that.deleteDialogVisible = false;
          })
          .catch(function (error) {
            console.log(error);
          });

      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log("Handle Selection Change")
        this.activeName = '1';
        this.calculateTotalPrice();
        console.log(this.multipleSelection);
      },

      /**
       * Helper
       * */
      calculateTotalPrice(){
        var i = 0;
        this.totalPrice = 0;
        for(i = 0; i < this.multipleSelection.length; i++){
          this.totalPrice += this.multipleSelection[i].price;
        }
      }
    }
  }
</script>

<style>
  body{
    font-family: Helvetica, sans-serif;
  }
  .el-card__body{
    padding: 5px;
  }
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
  .el-table .used-row {
    background: #8492a6;
  }

  .el-collapse-item__header {

    margin-top: 0;
    font-size: medium;
    font-weight: bold;
    margin-left: 20px;
  }
</style>
