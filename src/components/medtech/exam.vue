<template>
  <div id="exam">
    <el-card shadow="always" style="margin-bottom: 10px;">
      <el-row type="flex" justify="space-between">
        <el-col :span="10">
          <el-form ref="form" :model="form" :rules="rules" label-width="20px" class="demo-ruleForm">
            <el-form-item prop="extype">
              <el-select v-model="form.extype" style="width: 220px" placeholder="Select Medical Technique">
                <el-option label="Examination" value="examination"></el-option>
                <el-option label="Test" value="test"></el-option>
                <el-option label="Disposal" value="disposal"></el-option>
              </el-select>
              <el-button style="margin-left: 20px" size="medium" icon="el-icon-refresh"
                         @click="loadPatientList('form')"
                         type="primary" plain round>Reload
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-row :gutter="20" flex="type" justify="space-between">
      <el-col :span="6">
        <el-card>
          <el-row glutter="20">
            <el-input placeholder="Enter Patient ID" v-model="pid" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="searchPatient('form')"></el-button>
            </el-input>
          </el-row>

          <el-table
            :data="patients"
            style="width: 100%"
            :row-style="rowStyle"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table
                  :data="props.row.examList"
                  style="width: 100%; font-family: 'Microsoft YaHei';"
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  :show-header="false"
                  :row-style="rowStyleDetail"
                >
                  <el-table-column
                    prop="itemname"
                    width="150">
                  </el-table-column>
                  <el-table-column
                    prop="state"
                    width="115">
                  </el-table-column>

                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              prop="pid">
            </el-table-column>
            <el-table-column
              prop="pname">
            </el-table-column>
          </el-table>

        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>

          <el-form :label-position="labelPosition" label-width="80px" :model="patientForm">
            <el-row style="height: 50px">
              <el-tag type="primary" style="margin-left: 50px" size="medium" effect="plain">Patient
                Information
              </el-tag>
            </el-row>
            <el-row style="height: 50px" type="flex" justify="space-around">
              <el-col :span="10">
                <el-form-item label="ID">
                  <el-input :disabled="formDisable" v-model="patientForm.pid"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="Name">
                  <el-input :disabled="formDisable" v-model="patientForm.pname"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="height: 50px" type="flex" justify="space-around">
              <el-col :span="10">
                <el-form-item label="Age">
                  <el-input :disabled="formDisable" v-model="patientForm.page"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="Gender">
                  <el-input :disabled="formDisable" v-model="patientForm.pgender"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
          <el-form :label-position="labelPosition" label-width="80px" :model="examForm">
            <el-row style="height: 50px">
              <el-tag type="primary" style="margin-left: 50px" size="medium" effect="plain">Med-Tech
                Information
              </el-tag>
            </el-row>
            <el-row style="height: 50px" type="flex" justify="space-around">
              <el-col :span="7">
                <el-form-item label="Name">
                  <el-input :disabled="formDisable" v-model="examForm.itemname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="Price">
                  <el-input :disabled="formDisable" v-model="examForm.price"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="State">
                  <el-input :disabled="formDisable" v-model="examForm.state"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row style="margin-left: 40px; margin-top: 20px">
              <el-card style="background-color: #f0f6fd">
                <el-row style="margin-bottom: 20px" type="flex" justify="space-between">
                  <el-col :span="6">
                    <el-button icon="el-icon-circle-plus-outline" type="primary">Result ( {{length}} / 3
                      )
                    </el-button>
                  </el-col>
                  <el-col :span="6">
                    <el-button icon="el-icon-picture-outline-round" type="primary" @click="ViewImages">
                      View Uploaded Images
                    </el-button>
                  </el-col>
                </el-row>
                <el-upload style="margin-bottom: 30px"
                           class="upload-demo"
                           ref="upload"
                           name="picture"
                           action="/api/medtech/upload"
                           :on-preview="handlePictureCardPreview"
                           :on-remove="handleRemove"
                           :on-change="onChange"
                           :on-success="handleSuccess"
                           :file-list="fileList"
                           :before-remove="beforeRemove"
                           :auto-upload="false"
                           :limit="3"
                           :on-exceed="handleExceed"
                           :disabled="formDisable"
                           list-type="picture-card">
                  <i style="margin-top: 60px" class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                <el-input :disabled="formDisable" type="textarea" v-model="examForm.result"
                          placeholder="Enter Description"
                          maxlength="255"
                          show-word-limit></el-input>
              </el-card>
              <el-row style="margin-top: 30px">
                <el-col :span="4">
                  <el-button :type="submitButtonType" :disabled="formDisable"
                             icon="el-icon-document-checked" @click="submitUpload">Submit
                  </el-button>
                </el-col>
                <el-col :span="10">
                  <el-button :disabled="formDisable" icon="el-icon-document-delete" type="primary"
                             @click="cancelExecution" plain>Cancel
                  </el-button>
                </el-col>
              </el-row>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="Image Preview"
               :visible.sync="ViewDialogVisible">
      <div>
        <el-image :fit="fits" v-for="url in ViewImgUrls" :key="url" :src="url"></el-image>
      </div>

    </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "exam",
      data() {
        var validateDisType = (form, value, callback) => {

          if (value === '') {
            return callback(new Error('Please Select Type!'));
          } else {
            callback();
          }
        };

        return {
          deptcode: 'CK',
          userid: 1,

          form: {
            extype: ''
          },

          rules: {
            extype: [
              {validator: validateDisType, trigger: 'blur'}
            ]
          },

          pname: '',
          pid: null,
          regid: null,

          labelPosition: 'right',
          patientForm: {
            pid: '',
            pname: '',
            page: '',
            pgender: ''
          },

          examForm: {
            exid: '',
            itemname: '',
            price: null,
            state: 'Opened',
            result: '',

          },

          patients: [],
          currentRow: null,


          fileList: [],
          dialogImageUrl: '',
          dialogVisible: false,
          length: 0,

          imgUrls: [],

          formDisable: false,
          submitButtonType: "primary",

          ViewDialogVisible: false,

          fits:'scale-down',

          ViewImgUrls: [],
        };
      },
      methods: {

        rowStyle() {
          return 'background-color:#f0f6fd;'
        },

        rowStyleDetail() {
          return 'font-size:13px'
        },

        handleCurrentChange(val) {
          this.currentRow = val;
          var that = this;
          this.$axios.post('/api/medtech/getPatientByExid', {
            'exid': this.currentRow.exid,
          }).then(function (response) {
            console.log(response.data);

            if (response.data.pgender) {
              response.data.pgender = 'Male';
            } else {
              response.data.pgender = 'Female';
            }

            if (that.currentRow.state === 'Executed') {
              that.formDisable = true;
              that.submitButtonType = 'success';
            } else {
              that.formDisable = false;
              that.submitButtonType = 'primary';
            }

            that.patientForm = response.data;
            that.$refs.upload.clearFiles();
            that.length = 0;
            console.log(that.fileList);

          }).catch(function (error) {
            console.log(error);
          });

          this.examForm = this.currentRow;
          this.ViewImgUrls = [];
          for (var i = 0; i < this.currentRow.imgUrls.length; i++) {
            this.ViewImgUrls.push(this.currentRow.imgUrls[i]);
          }


          console.log(this.currentRow)
        },

        loadPatientList(formName) {
          var that = this;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              console.log("wo tm load bao!");
              this.$axios.post('/api/medtech/loadExamPatients', {
                'extype': this.form.extype,
              })
                .then(function (response) {
                  console.log(response.data);
                  that.patients = response.data;
                })
                .catch(function (error) {
                  console.log(error);
                });

            } else {
              console.log('Error Submit!!');
              return false;
            }
          });
          /* var that = this;
           this.$axios.post('/outpatient/getPatientsOfUserToday', {'userid': this.userid, 'state': 6})
               .then(function (response) {
                   console.log(response.data);
                   that.myWait = response.data;
               })
               .catch(function (error) {
                   console.log(error);
               });*/

        },
        searchPatient(formName) {
          var that = this;
          this.$refs[formName].validate((valid) => {
            if (valid) {

              this.$axios.post('/api/medtech/loadExamPatients', {
                'extype': this.form.extype,
                'pid': this.pid,
              })
                .then(function (response) {
                  console.log(response.data);
                  that.patients = response.data;
                })
                .catch(function (error) {
                  console.log(error);
                });

            } else {
              console.log('Error Submit!!');
              return false;
            }
          });
        },
        cancelExecution() {
          var that = this;
          this.$confirm('Sure to Cancel?', 'Notice', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            console.log('submit!');
            this.form.state = '初诊提交';
            var that = this;
            this.$axios.post('/api/medtech/cancelExam', {
              'exid': this.currentRow.exid,
            })
              .then(function () {
                that.loadPatientList('form');
                that.formDisable = true;

              })
              .catch(function (error) {
                console.log(error);
              });

            this.$message({
              type: 'success',
              message: 'Cancel Succeed!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Nothing happen.'
            });
          });


        },

        submitUpload() {
          this.$refs.upload.submit();
          var that = this;
          this.$axios.post('/api/medtech/addResults', {
            'exid': this.currentRow.exid,
            'result': this.examForm.result,
          })
            .then(function () {

              that.formDisable = true;
              that.submitButtonType = 'success';

            })
            .catch(function (error) {
              console.log(error);
            });
          console.log(this.imgUrls)

        },
        handleRemove(file, fileList) {
          this.length = fileList.length;
          console.log(file, fileList);
        },

        handleSuccess(response, file, fileList) {
          var that = this;
          this.imgUrls.push(response);
          console.log(response);

          this.$axios.post('/api/medtech/addImg', {
            'exid': this.currentRow.exid,
            'imgUrls': response,
          })
            .then(function () {
              that.loadPatientList('form');
            })
            .catch(function (error) {
              console.log(error);
            });

          console.log(this.imgUrls);

        },

        onChange(file, fileList) {
          this.length = fileList.length;
        },

        handlePictureCardPreview(file) {
          this.dialogImageUrl = file.url;
          this.dialogVisible = true;
        },
        handleExceed(files, fileList) {
          this.$message.warning('Limit Exceed');
        },
        beforeRemove(file, fileList) {
          return this.$confirm(`Sure To Remove ${file.name}?`);
        },

        ViewImages() {

          this.ViewDialogVisible = true;
          console.log(this.ViewImgUrls);
        }

      }
    }
</script>

<style scoped>
  .el-form-item {
    margin-bottom: -10px;
  }

  .el-table__expanded-cell[class*=cell] {
    padding: 0;
  }

  .el-table__header-wrapper {
    height: 10px;
  }

  .image {
    width: 100%;
    display: block;
  }
</style>
