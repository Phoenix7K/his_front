<template>
  <div id="patentmed">
    <el-container>
      <!--up operation-->
      <el-header>
        <el-card class="box-card">
          <el-row type="flex" justify="space-between">
            <el-col :span="4">
              <el-tag size="medium" effect="plain">Pre-Diagnosis</el-tag>
            </el-col>
            <el-col :span="20">
              <el-button size="small" icon="el-icon-circle-plus-outline" type="primary"
                         @click="newPreVisible = true"
                         round>Add
              </el-button>
              <el-button size="small" :disabled="currentStated"
                         icon="el-icon-remove-outline" type="primary" @click="delPre" round>Delete
              </el-button>
              <el-button size="small" :disabled="currentStateo"
                         icon="el-icon-circle-check" type="primary" @click="changeState('Opened')" round>Open
              </el-button>
              <el-button size="small" :disabled="currentStater"
                         icon="el-icon-delete" type="primary" @click="changeState('Revoked')" round>Revoke
              </el-button>
              <el-popover
                placement="bottom"
                width="200"
                v-model="visible">
                <div style="text-align: right; margin: 0">
                  <el-row>
                    <el-input size="medium" v-model="tempname" placeholder="Template Name"></el-input>
                  </el-row>
                  <el-row type="flex" justify="space-between" style="margin-top: 10px">
                    <el-button size="mini" @click="visible = false">cancel</el-button>
                    <el-button type="primary" size="mini" @click="saveToTemplate">confirm</el-button>
                  </el-row>
                </div>
                <el-button slot="reference" size="small" icon="el-icon-edit-outline" type="primary"
                           :disabled="currentStates" round>Save
                </el-button>
              </el-popover>
              <el-button size="small" icon="el-icon-refresh" type="primary" @click="refreshPre" round>Refresh
              </el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-header>

      <el-container style="margin-top: 30px">
        <!--left prescription info-->
        <el-aside width="250px">
          <el-row>
            <el-tag type="success" size="medium" effect="plain">Prescription</el-tag>

            <el-dropdown trigger="click" :hide-on-click="false">

              <el-button size="mini" icon="el-icon-arrow-down" type="primary" plain>
                <i class="el-icon-s-order"></i>Template
              </el-button>
              <el-dropdown-menu slot="dropdown" style="width: 300px">
                <el-dropdown-item v-for="(item, index) in template"
                                  :key="item.tempid">
                  <el-row type="flex" justify="space-between">
                    <el-col :span="12">{{item.tempname}}</el-col>
                    <el-col :span="6">
                      <el-link :underline="false" icon="el-icon-circle-plus"
                               @click="useTemplate(index)"></el-link>
                      <el-link :underline="false" icon="el-icon-eleme"
                               @click="templateDetail(index)"></el-link>
                    </el-col>
                  </el-row>

                </el-dropdown-item>
              </el-dropdown-menu>

            </el-dropdown>
          </el-row>
          <!--prescription table-->
          <el-table :data="prescription"
                    highlight-current-row
                    ref="singleTable"
                    @current-change="handleCurrentChange">
            <el-table-column width="100" property="prename" label="Name"></el-table-column>
            <el-table-column width="100" property="state" label="State"></el-table-column>
          </el-table>
        </el-aside>
        <!--prescription details-->
        <el-main style="padding: 0">
          <el-card class="box-card">
            <el-row type="flex" justify="space-between">
              <el-col :span="6">
                <el-input size="small" prefix-icon="el-icon-coin" v-model="totalprice"
                          :disabled="true"></el-input>
              </el-col>
              <el-col :span="6">
                <el-button size="small" icon="el-icon-circle-plus-outline" type="primary"
                           :disabled="currentStatea"
                           @click="addMedicineDialog">
                  Add Medicine
                </el-button>
              </el-col>
            </el-row>
            <!--details table-->
            <el-table :data="medicine">
              <el-table-column width="150" property="itemname" label="Name"></el-table-column>
              <el-table-column width="100" property="size" label="Size"></el-table-column>
              <el-table-column width="100" property="price" label="Price"></el-table-column>
              <el-table-column width="100" property="count" label="Count"></el-table-column>
              <el-table-column
                fixed="right"
                label="Operation"
                width="150">
                            <span slot-scope="scope">
                                <el-button icon="el-icon-remove-outline" size="medium" type="text"
                                           @click="delMed(scope.$index, scope.row)">Delete</el-button>
                            </span>
              </el-table-column>
            </el-table>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
    <!--add new prescription-->
    <el-dialog
      title="New Prescription"
      :visible.sync="newPreVisible"
      width="65%">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-input v-model="prename" style="width:300px" placeholder="Enter Name"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="space-between" style="margin-top: 20px">
        <el-button type="primary" @click="createConfirmDialog">Create</el-button>
        <el-button @click="newPreVisible=false">Cancel</el-button>
      </el-row>
    </el-dialog>

    <el-dialog
      title="Template Details"
      :visible.sync="detailDialogVisible"
      width="65%">
      <el-table :data="medicineList">
        <el-table-column width="150" property="itemname"
                         label="MedicineName"></el-table-column>
        <el-table-column width="150" property="size"
                         label="Size"></el-table-column>
        <el-table-column width="100" property="price" label="Price">
        </el-table-column>
        <el-table-column
          prop="count"
          label="Count"
          width="100">
        </el-table-column>
      </el-table>

    </el-dialog>
    <add-med ref="addMed"></add-med>
  </div>
</template>

<script>
  //局部注册组件
  import addMed from '../dialog/addMed'

    export default {
        name: "patentmed",
      data() {
          return{
            newPreVisible: false,
            visible: false,

            totalprice: '',
            number: 1,
            preid: '',
            uRid: 1,
            regid: 0,
            pretype: "西药",
            prename: "",
            state: "",
            currentRow: {},
            currentStated: false,
            currentStateo: false,
            currentStater: false,
            currentStatea: true,
            currentStates: false,
            prescription: [],
            template: [],
            medicine: [],
            tempname: '',

            medicineList: [],
            detailDialogVisible: false,
          }
      },

      components:{
        "addMed":addMed,
      },

      mounted: function () {
        /*var params = new URLSearchParams();
        params.append("uRid",this.uRid);
        params.append("regid",parent.patient.regid);*/
        //用上面方法会报错415，应该将数据重新组装成JSON

        this.regid = this.$route.query.regid;
        this.pid = this.$route.query.pid;
        var that = this;
        this.$axios.post('/api/outpatient/getPre', {
          uRid: this.uRid,
          regid: this.regid,
        })
          .then(function (response) {
            console.log(response.data);
            that.prescription = response.data;

          })
          .catch(function (error) {
            console.log(error);
          });
        this.loadTemplate();
      },
      methods: {
        stateTrans: function (judgestate) {
          if (judgestate) {
            if (judgestate === 'Opened') {
              this.currentStated = true;
              this.currentStateo = true;
              this.currentStater = false;
              this.currentStatea = true;
              this.currentStates = false;
            } else if (judgestate === 'Revoked' || judgestate === 'Executed') {
              this.currentStated = true;
              this.currentStateo = true;
              this.currentStater = true;
              this.currentStatea = true;
              this.currentStates = false;
            } else if (judgestate === 'Saved') {
              this.currentStated = false;
              this.currentStateo = false;
              this.currentStater = true;
              this.currentStatea = false;
              this.currentStates = true;
            } else {
              this.currentStated = false;
              this.currentStateo = false;
              this.currentStater = false;
              this.currentStatea = true;
              this.currentStates = true;
            }
          }
        },
        addMedicineDialog() {
          this.$refs.addMed.preid = this.currentRow.preid;
          this.$refs.addMed.tempobject=this.currentRow;
          this.$refs.addMed.itemcode='';
          this.$refs.addMed.medicine=[];
          this.$refs.addMed.number=1;
          this.$refs.addMed.dialogVisible = true;
        },
        refreshPre: function () {
          var that = this;
          this.$axios.post('/api/outpatient/getPre', {
            uRid: this.uRid,
            regid: this.$route.query.regid,
          })
            .then(function (response) {
              that.prescription = response.data;
              that.loadTemplate();
            })
            .catch(function (error) {
              console.log(error);
            });

        },
        createConfirmDialog: function () {
          var that = this;
          var params = new URLSearchParams();
          params.append('uRid', this.uRid);
          params.append('regid', this.regid);
          params.append('pretype', this.pretype);
          params.append('prename', this.prename);
          this.$confirm('Sure to create?', 'Notice', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.newPreVisible = false;
            this.$axios.post('/api/outpatient/addPre', params)
              .then(function (response) {
                that.refreshPre();
              }).catch(function (error) {
              console.log(error);
            });
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
        delPre: function () {
          var that = this;
          var params = new URLSearchParams();
          params.append('preid', this.currentRow.preid);
          this.$confirm('Sure to delete?', 'Notice', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/outpatient/delPre', params)
              .then(function (response) {
                that.refreshPre();
              }).catch(function (error) {
              console.log(error);
            });
            this.$message({
              type: 'success',
              message: 'Delete Succeed!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Cancel'
            });
          });
        },
        changeState: function (pickstate) {
          var that = this;
          var params = new URLSearchParams();
          params.append('state', pickstate);
          params.append('preid', this.currentRow.preid);
          this.$confirm('Sure to change?', 'Notice', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/outpatient/changeState', params)
              .then(function (response) {
                that.refreshPre();

                if (pickstate === 'Opened') {
                  that.$axios.post('/api/outpatient/addPreToBill', {
                    preid: that.currentRow.preid,
                    feecode: 'XYF',
                    pid: that.pid,
                    regid: that.regid,
                  })
                    .catch(function (error) {
                      console.log(error);

                    });
                }

              }).catch(function (error) {
              console.log(error);
            });
            this.$message({
              type: 'success',
              message: 'Change Succeed!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Cancel'
            });
          });
        },
        handleCurrentChange(val) {
          this.currentRow = val;

          // console.log(val);
          var judgestate = val.state;
          this.stateTrans(judgestate);
          var that = this;
          this.totalprice = 0;
          var params = new URLSearchParams();
          params.append("preid", val.preid);
          this.$axios.post('/api/outpatient/getItem', params)
            .then(function (response) {
              that.medicine = response.data;
              that.caculate();
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        caculate:function(){
          this.totalprice=0;
          for (var i = 0; i < this.medicine.length; i++) {
            this.totalprice += (this.medicine[i].price) * (this.medicine[i].count);
            // console.log(i+":"+this.totalprice);
          }
          this.totalprice = parseFloat(this.totalprice).toFixed(2);
        },
        delMed: function (index, row) {
          var that = this;
          var params = new URLSearchParams();
          params.append('preRelid', this.medicine[index].preRelid);
          this.$confirm('Do you want to delete this item?', 'Notice', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/outpatient/delMed', params)
              .then(function (response) {
                that.refreshItem();
              }).catch(function (error) {
              console.log(error);
            });
            this.$message({
              type: 'success',
              message: 'Delete success!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Cancel!'
            });
          });
        },
        refreshItem: function () {
          var that = this;
          var params = new URLSearchParams();
          params.append("preid", this.currentRow.preid);
          this.$axios.post('/api/outpatient/getItem', params)
            .then(function (response) {
              // console.log(response.data);
              that.medicine = response.data;
              that.caculate();
            })
            .catch(function (error) {
              console.log(error);
            });
        },

        saveToTemplate() {
          var that = this;
          this.$axios.post('/api/outpatient/savePreToTemplate', {
            preid: this.currentRow.preid,
            tempname: this.tempname,
            temptype: '西药'
          }).then(function () {

            that.loadTemplate();
          })
            .catch(function (error) {
              console.log(error);

            });
          this.visible = false;
        },

        loadTemplate() {
          var that = this;
          this.$axios.post('/api/outpatient/getTemplateForPre', {
            temptype: "西药"
          }).then(function (response) {
            console.log(response.data);
            that.template = response.data;
          })
            .catch(function (error) {
              console.log(error);

            });
          this.visible = false;
        },
        useTemplate(index) {
          console.log(index);
          var that = this;
          this.$axios.post('/api/outpatient/addTemplateToPre', {
            tempid: this.template[index].tempid,
            tempname: this.template[index].tempname,
            pretype: '西药',
            regid: this.regid,
            uRid: this.uRid,
          }).then(function () {
            that.refreshPre();
          })
            .catch(function (error) {
              console.log(error);

            });
        },
        templateDetail(index) {
          this.medicineList = this.template[index].medicineList;
          this.detailDialogVisible = true;
        }
      }
    }
</script>

<style scoped>

</style>
