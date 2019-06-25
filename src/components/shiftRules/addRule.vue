<template>
  <div id="addRule">
    <el-dialog
      title="Add A New Rule"
      :visible.sync="dialogVisible"
      width="60%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item>
              <el-input v-model="form.username" style="width:200px" placeholder="User Name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-select v-model="form.deptname" placeholder="Choose Department">
              <el-option
                v-for="item in form.depts"
                :key="item.deptcode"
                :label="item.deptname"
                :value="item.deptcode">
                <span style="float: left">{{ item.deptname}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.deptcode }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item>

              <el-input v-model="form.ration" style="width:200px" placeholder="Ration"></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-select v-model="form.reglevel" placeholder="Choose RegisterLV">
              <el-option
                v-for="item in form.items"
                :key="item.itemcode"
                :label="item.itemname"
                :value="item.itemname">
                <span style="float: left">{{ item.itemname}}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.itemcode }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-left: 70px">
          <el-col :span="24">
            <el-checkbox-group v-model="form.checkboxGroup1" size="small">
              <el-checkbox-button v-for="weekday in form.weekdays1" :label="weekday" :key="weekday"
                                  style="font-family:'Courier New'">{{weekday}}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 10px; margin-left: 70px">
          <el-col :span="24">
            <el-checkbox-group v-model="form.checkboxGroup2" size="small">
              <el-checkbox-button v-for="weekday in form.weekdays2" :label="weekday" :key="weekday"
                                  style="font-family:'Courier New'">{{weekday}}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="12">
            <el-form-item>

              <el-input v-model="form.rulename" style="width:200px" placeholder="Rule Name"></el-input>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">

          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="openConfirmDialog">Create</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button @click="dialogVisible = false">Cancel</el-button>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  const weekOptionsAM = ['SUN A.M.',
      'MON A.M.',
      'TUE A.M.',
      'WED A.M.',
      'THU A.M.',
      'FRI A.M.',
      'SAT A.M.',];
    const weekOptionsPM = ['SUN P.M.',
      'MON P.M.',
      'TUE P.M.',
      'WED P.M.',
      'THU P.M.',
      'FRI P.M.',
      'SAT P.M.',];

     export default{
      name: 'addRule',
      data() {
        return {
          dialogVisible: false,

          form: {
            username: '',
            deptname: '',
            reglevel: '',
            ration: '',
            items: [],
            depts: [],
            rulename: '',

            checkboxGroup1: [],
            checkboxGroup2: [],
            weekdays1: weekOptionsAM,
            weekdays2: weekOptionsPM,
          },
        }


      },

      methods: {
        onSubmit() {
          console.log('submit!');
        },
        fillRegSelect: function () {
          var that = this;
          this.$axios.get('/api/management/getRegLevel')
            .then(function (response) {
              console.log(response.data);
              that.form.items = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        fillDeptSelect: function () {
          var that = this;
          this.$axios.get('/api/management/getDeptSelect')
            .then(function (response) {
              console.log(response.data);
              that.form.depts = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
        },
        ruleSubmit: function () {
          var that = this;
          console.log(that.form);
          this.$axios.post('/api/management/addRule', {
            rulename: that.form.rulename,
            username: that.form.username,
            deptname: that.form.deptname,
            reglevel: that.form.reglevel,
            ration: that.form.ration,
            checkboxGroup1: that.form.checkboxGroup1,
            checkboxGroup2: that.form.checkboxGroup2,
          })
            .catch(function (error) {
              console.log(error);
            });
        },
        openConfirmDialog: function () {
          this.$confirm('Sure to create?', 'Notice', {
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            this.ruleSubmit();
            this.dialogVisible = false;
            this.$message({
              type: 'success',
              message: 'Create Succeed!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: 'Cancel Create.'
            });
          });
        }
      }
    };
</script>

<style scoped>

</style>
