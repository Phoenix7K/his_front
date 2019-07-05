<template>
  <div id="patient">
    <el-card shadow="always" style="margin-bottom: 10px;">
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <el-radio-group v-model="isCollapse">
            <el-radio-button :label="false">Show</el-radio-button>
            <el-radio-button :label="true">Hide</el-radio-button>
          </el-radio-group>
          <el-button style="margin-left: 20px" size="medium" icon="el-icon-refresh" @click="loadPatientList"
                     type="success" plain round>Reload
          </el-button>
        </el-col>
        <el-col :span="10">
          <el-button>Name: {{pname}}</el-button>
          <el-button>ID: {{pid}}</el-button>
          <el-button id="complete" icon="el-icon-s-claim" :type="buttonCType"
                     @click="complete" :disabled="buttonDisabled">{{buttonText}}</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-row glutter="20">
      <el-col id="sidebar" style="width: auto">
        <el-menu default-active="1-1-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                 @select="handleSelect" :collapse="isCollapse" :unique-opened="true">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span slot="title">My Patients</span>
            </template>
            <el-submenu index="1-1">
              <span slot="title">Waiting</span>
              <el-menu-item v-for="(item,index) in myWait" :key="item.regid" :index="'1-1-'+(index+1)"
                            :value="item.regid">{{ item.pname}}</el-menu-item>
            </el-submenu>

            <el-submenu index="1-2">
              <span slot="title">Diagnosed</span>
              <el-menu-item v-for="(item,index) in myDiagnosed" :key="item.regid" :index="'1-2-'+(index+1)"
                            :value="item.regid">{{ item.pname}}</el-menu-item>
            </el-submenu>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-home"></i>
              <span slot="title">Department Patients</span>
            </template>
            <el-submenu index="2-1">
              <span slot="title">Waiting</span>
              <el-menu-item v-for="(item,index) in deptWait" :key="item.regid" :index="'2-1-'+(index+1)"
                            :value="item.regid">{{ item.pname}}</el-menu-item>
            </el-submenu>

            <el-submenu index="2-2">
              <span slot="title">Diagnosed</span>
              <el-menu-item v-for="(item,index) in deptDiagnosed" :key="item.regid" :index="'2-2-'+(index+1)"
                            :value="item.regid">{{ item.pname}}</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>

      </el-col>
      <el-col id="mainFrame" style="width:75%; margin-left: 20px;">

        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <!-- Patient Home Page -->
            <el-tab-pane :disabled="tabDisabled1" label="FrontPage"
                         name="frontpage"></el-tab-pane>
            <el-tab-pane :disabled="tabDisabled2" label="Examination"
                         name="examination"></el-tab-pane>
            <el-tab-pane :disabled="tabDisabled2" label="Inspection"
                         name="inspection"></el-tab-pane>
            <el-tab-pane :disabled="tabDisabled2" label="DiagConfirm"
                         name="diagconfirm"></el-tab-pane>
            <el-tab-pane :disabled="tabDisabled3" label="Treatment"
                         name="treatment"></el-tab-pane>
            <el-tab-pane :disabled="tabDisabled3" label="Patent-med"
                         name="patentmed"></el-tab-pane>
            <el-tab-pane :disabled="tabDisabled3" label="Herbal"
                         name="herbal"></el-tab-pane>
            <el-tab-pane :disabled="tabDisabled3" label="BillQuery"
                         name="billquery"></el-tab-pane>
          </el-tabs>
          <el-row>
            <el-col :span="24">
              <router-view ref="subFrame"></router-view>
            </el-col>
          </el-row>
        </template>
      </el-col>
      <el-col :span="4" style="margin-left: 10px;margin-top: 45px;height: 600px">
        <el-steps direction="vertical" finish-status="success" process-status="finish" :active="active" v-if="isCollapse">
          <el-step icon="el-icon-edit-outline" title="Register"></el-step>
          <el-step icon="el-icon-document-remove" title="Pre-Diagnose"></el-step>
          <el-step icon="el-icon-search" title="Examine"></el-step>
          <el-step icon="el-icon-document" title="Final-Diagnose"></el-step>
          <el-step icon="el-icon-add-location" title="Treatment"></el-step>
          <el-step icon="el-icon-document-checked" title="Finished"></el-step>
        </el-steps>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  export default {
      name:"homepage",

    inject:['authToken'],

      data() {
        return {
          showBar:true,

          url: '',
          isCollapse: true,
          activeName: 'frontpage',
          buttonText: 'Complete',
          buttonDisabled: false,
          buttonCType: 'primary',

          active: 0,

          deptcode: 'CK',
          userid: 1,

          pname: '',
          pid: 0,
          regid: 0,

          myWait: [],
          myDiagnosed: [],
          deptWait: [],
          deptDiagnosed: [],
          loading: true,
          tabDisabled1: true,
          tabDisabled2: true,
          tabDisabled3: true,
        };
      },

      provide(){
        return{
          loadPatientList: this.loadPatientList,
          switchStep: this.switchStep,
          resetActiveTab: this.resetActiveTab
        }
      },

      methods: {
        handleOpen(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
          console.log(key, keyPath);
        },
        handleClick(tab, event) {
          console.log(tab, event);
          this.$router.push({path:'/'+tab.name, query:{regid: this.regid, active: this.active, pid: this.pid}});
          console.log("navigateTo" + tab.name)

        },

        loadPatientList: function() {
          this.authToken();
          var that = this;
          this.$axios.post('/api/outpatient/getPatientsOfUserToday', {'userid': this.userid, 'state': 6})
            .then(function (response) {
              console.log(response.data);
              that.myWait = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
          this.$axios.post('/api/outpatient/getDiagnosedPatientsOfUserToday', {'userid': this.userid, 'state': 6})
            .then(function (response) {
              console.log(response.data);
              that.myDiagnosed = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
          this.$axios.post('/api/outpatient/getPatientsOfDeptToday', {'deptcode': this.deptcode, 'state': 6})
            .then(function (response) {
              console.log(response.data);
              that.deptWait = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
          this.$axios.post('/api/outpatient/getDiagnosedPatientsOfDeptToday', {'deptcode': this.deptcode, 'state': 6})
            .then(function (response) {
              console.log(response.data);
              that.deptDiagnosed = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });

        },
        resetActiveTab: function() {

          var that = this;
          this.$axios.post('/api/outpatient/getHomePageStateByRegid', {
            'regid': this.regid,
          })
            .then(function (response) {
              switch (response.data) {
                case '初诊提交':
                  that.tabDisabled1 = false;
                  that.tabDisabled2 = false;
                  that.tabDisabled3 = true;
                  break;
                case '确诊暂存':
                  that.tabDisabled1 = false;
                  that.tabDisabled2 = false;
                  that.tabDisabled3 = true;
                  break;
                case '确诊提交':
                  that.tabDisabled1 = false;
                  that.tabDisabled2 = false;
                  that.tabDisabled3 = false;
                  break;
                default:
                  that.tabDisabled1 = false;
                  that.tabDisabled2 = true;
                  that.tabDisabled3 = true;
                  break;

              }

            })

            .catch(function (error) {
              console.log(error);
            });
        },

        handleSelect(key, value) {
          var select = key.toString().split("-");
          if (select[0] === "1" && select[1] === "1") {
            this.pid = this.myWait[parseInt(select[2]) - 1].pid;
            this.pname = this.myWait[parseInt(select[2]) - 1].pname;
            this.regid = this.myWait[parseInt(select[2]) - 1].regid;
            this.switchStep(this.myWait[parseInt(select[2]) - 1].state);
          } else if (select[0] === "1" && select[1] === "2") {
            this.pid = this.myDiagnosed[parseInt(select[2]) - 1].pid;
            this.pname = this.myDiagnosed[parseInt(select[2]) - 1].pname;
            this.regid = this.myDiagnosed[parseInt(select[2]) - 1].regid;
            this.switchStep(this.myDiagnosed[parseInt(select[2]) - 1].state);
          } else if (select[0] === "2" && select[1] === "1") {
            this.pid = this.deptWait[parseInt(select[2]) - 1].pid;
            this.pname = this.deptWait[parseInt(select[2]) - 1].pname;
            this.regid = this.deptWait[parseInt(select[2]) - 1].regid;
            this.switchStep(this.deptWait[parseInt(select[2]) - 1].state);
          } else if (select[0] === "2" && select[1] === "2") {
            this.pid = this.deptDiagnosed[parseInt(select[2]) - 1].pid;
            this.pname = this.deptDiagnosed[parseInt(select[2]) - 1].pname;
            this.regid = this.deptDiagnosed[parseInt(select[2]) - 1].regid;
            this.switchStep(this.deptDiagnosed[parseInt(select[2]) - 1].state);
          }



          this.resetActiveTab();
          this.$router.push({path:'/frontpage', query:{regid: this.regid, active: this.active, pid: this.pid}});
          this.activeName = 'frontpage';
        },

        switchStep: function(state) {
          this.active = parseInt(state);
          console.log("switch step: " + state);
          if (parseInt(state) === 6) {
            this.buttonText = 'Completed';
            this.buttonDisabled = true;
            this.buttonCType = 'success';
          } else {
            this.buttonText = 'Complete';
            this.buttonDisabled = false;
            this.buttonCType = 'primary';
          }

        },

        complete() {
          var that = this;
          this.$axios.post('/api/outpatient/updatePatientState', {'regid': this.regid, 'state': 6})
            .then(function () {
              that.loadPatientList();
              that.switchStep(6);
              this.$router.push({path:'/frontpage', query:{regid: this.regid, active: this.active, pid: this.pid}});
            })

            .catch(function (error) {
              console.log(error);
            });
        }
      }
    }
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
</style>
