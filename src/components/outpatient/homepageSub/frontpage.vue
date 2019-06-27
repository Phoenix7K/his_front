<template>
  <div id="frontpage">
    <el-form ref="form" :model="form" :rules="rules" label-width="20px" class="demo-ruleForm">
      <el-tooltip class="item" effect="dark" content="Chief Complaint" placement="right">
        <el-form-item prop="cheifCP">
          <el-input type="textarea" v-model="form.cheifCP" placeholder="Chief Complaint"></el-input>
        </el-form-item>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Present History" placement="right">
        <el-form-item prop="curHis">
          <el-input type="textarea" v-model="form.curHis" placeholder="Present History"></el-input>
        </el-form-item>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Treatment Situation" placement="right">
        <el-form-item prop="situation">
          <el-input type="textarea" v-model="form.situation" placeholder="Treatment Situation"></el-input>
        </el-form-item>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Past History" placement="right">
        <el-form-item prop="pastHis">
          <el-input type="textarea" v-model="form.pastHis" placeholder="Past History"></el-input>
        </el-form-item>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Allergic History" placement="right">
        <el-form-item prop="allergicHis">
          <el-input type="textarea" v-model="form.allergicHis" placeholder="Allergic History"></el-input>
        </el-form-item>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Physical Examination" placement="right">
        <el-form-item prop="phyExam">
          <el-input type="textarea" v-model="form.phyExam" placeholder="Physical Examination"></el-input>
        </el-form-item>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Preliminary Diagnosis" placement="right">
        <el-form-item prop="preDiagnose">
          <el-card class="box-card" style="width:100%; height:250px">
            <el-row type="flex" justify="space-between" glutter="20">
              <el-col :span="8">
                <el-form-item prop="disType">
                  <el-select v-bind:disabled="isDisabledSelect" v-model="form.disType"
                             placeholder="Select Diagnosis Type">
                    <el-option label="West" value="west"></el-option>
                    <el-option label="East" value="east"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-button id="addDis" icon="el-icon-circle-plus-outline" type="primary"
                           @click="addDiseaseDialog('form')" v-bind:disabled="isDisabled">Add New Disease
                </el-button>
              </el-col>
            </el-row>
            <template>
              <el-table
                :data="form.diseaseList"
                style="width: 100%; margin-top: 20px"
                size="mini"
                max-height="170"
              >
                <el-table-column
                  prop="icdcode"
                  label="ICD CODE"
                  width="300">
                </el-table-column>
                <el-table-column
                  prop="disname"
                  label="NAME"
                  width="250">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="operation"
                  width="150">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="deleteRow(scope.$index, scope.row)"
                      type="primary"
                      size="small">
                      delete
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-card>
        </el-form-item>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Examination Advice" placement="right">
        <el-form-item prop="examAdvice">
          <el-input type="textarea" v-model="form.examAdvice" placeholder="Examination Advice"></el-input>
        </el-form-item>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="Caution" placement="right">
        <el-form-item prop="caution">
          <el-input type="textarea" v-model="form.caution" placeholder="Caution"></el-input>
        </el-form-item>
      </el-tooltip>
      <el-form-item>
        <el-button icon="el-icon-circle-check" type="primary" @click="onSubmit"
                   :type="buttonCType" :disabled="buttonDisabled">{{buttonText}}
        </el-button>
        <el-button icon="el-icon-document" type="primary" @click="onSave">Save</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm('form')">Reset</el-button>
      </el-form-item>
    </el-form>
    <add-disease ref="addDisease"></add-disease>
  </div>
</template>

<script>
  //局部注册组件
  import addDisease from '../dialog/addDisease'

  export default {
    name: "frontpage",
    inject: ['loadPatientList','switchStep','resetActiveTab'],
    data() {
      var validateDisType = (form, value, callback) => {

        if (value === '') {
          return callback(new Error('Please Select Type!'));
        } else {
          callback();
        }
      };
      return {
        form: {
          cheifCP: '',
          curHis: '',
          pastHis: '',
          allergicHis: '',
          situation: '',
          caution: '',
          phyExam: '',
          examAdvice: '',
          disType: '',
          diseaseList: [],
          state: '',
          active:null,
        },

        rules: {
          disType: [
            {validator: validateDisType, trigger: 'blur'}
          ]
        },
        pid: null,
        hpid: null,
        regid: null,
        isDisabled: false,
        isDisabledSelect: false,

        buttonText: 'Submit',
        buttonDisabled: false,
        buttonCType: 'primary',
      }
    },

    components:{
      "addDisease":addDisease,
    },

    mounted: function () {

      this.loadFrontPage();

    },

    watch:{
      '$route'(){
        this.loadFrontPage();
      }
    },

    methods: {
      onSubmit() {

        this.$confirm('Sure to Submit?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          console.log('submit!');
          this.form.state = '初诊提交';
          var that = this;
          this.$axios.post('/api/outpatient/updateHomepage', {
            regid: this.regid,
            homepage: this.form,
          })
            .catch(function (error) {
              console.log(error);
            });

          this.$axios.post('/api/outpatient/updatePatientState', {
            state: 2,
            regid: this.regid,

          }).then(function () {
            that.loadPatientList();
            that.switchStep(2);
            that.resetActiveTab();
            that.buttonText = 'Submitted';
            that.buttonDisabled = true;
            that.buttonCType = 'success';

          })
            .catch(function (error) {
              console.log(error);
            });

          this.$message({
            type: 'success',
            message: 'Submit Succeed!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Submit Save.'
          });
        });

      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.form.disType = '';
      },
      deleteRow(index, row) {
        var that = this;
        var params = new URLSearchParams();
        params.append("regid", this.regid);
        params.append("icdcode", row.icdcode);
        console.log(params);
        this.$axios.post('/api/outpatient/deleteDiseaseFromDiag', params)
          .then(function (response) {
            console.log("退出这个舞台");
            that.loadPartPage();
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      addDiseaseDialog(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("wo tm add bao!");
            this.$refs.addDisease.dialogVisible = true;
            this.$refs.addDisease.discode = '';
            this.$refs.addDisease.diseases = null;
            this.$refs.addDisease.regid = this.regid;
          } else {
            console.log('Error Submit!!');
            return false;
          }
        });
      },
      loadFrontPage() {
        this.regid = this.$route.query.regid;
        this.active = this.$route.query.active;
        console.log("Now diagnosing: " + this.regid);

        var params = new URLSearchParams();
        params.append("regid", this.regid);
        var that = this;
        this.$axios.post('/api/outpatient/getFrontPageByRegid', params)
          .then(function (response) {
            console.log(response.data);
            that.form = response.data;
            if (that.form.diseaseList.length >= 5) {
              console.log("把嘴给我闭上");
              that.isDisabled = true;
            } else {
              that.isDisabled = false;
            }

            /*if (that.form.diseaseList.length >= 1){
                that.isDisabledSelect = true;
            }else{
                that.isDisabledSelect = false;
            }*/
            console.log("Parent Active = " + that.active);
            if (parseInt(that.active) >= 2) {
              that.buttonText = 'Submitted';
              that.buttonDisabled = true;
              that.buttonCType = 'success';
            } else {
              that.buttonText = 'Submit';
              that.buttonDisabled = false;
              that.buttonCType = 'primary';
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      loadPartPage:function() {
        var params = new URLSearchParams();
        params.append("regid", this.regid);
        var that = this;
        this.$axios.post('/api/outpatient/getFrontPageByRegid', params)
          .then(function (response) {
            console.log(response.data);
            that.form.diseaseList = response.data.diseaseList;
            if (that.form.diseaseList.length >= 5) {
              console.log("把嘴给我闭上");
              that.isDisabled = true;
            } else {
              that.isDisabled = false;
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      onSave() {
        this.$confirm('Sure to save?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.form.state = '初诊暂存';
          this.$axios.post('/api/outpatient/updateHomepage', {
            regid: this.regid,
            homepage: this.form,
          })
            .catch(function (error) {
              console.log(error);
            });

          this.$message({
            type: 'success',
            message: 'Save Succeed!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel Save.'
          });
        });

      }

    }
  }
</script>

<style scoped>

</style>
