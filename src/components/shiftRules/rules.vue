<template>
  <div id="rules">
    <el-dialog
      title="Shift Arrangement"
      :visible.sync="dialogVisible"
      width="80%">
      <el-row :gutter="20">
        <el-col :span="18">
          <el-input v-model="deptname" style="width:300px" placeholder="Enter DeptName"></el-input>
          <el-button type="primary" @click="searchRules">search</el-button>
        </el-col>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="rules"
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="ruleid"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="rulename"
          label="RuleName"
          width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          label="UserName"
          width="180">
        </el-table-column>
        <el-table-column
          prop="deptname"
          label="DeptName"
          width="180">
        </el-table-column>
        <el-table-column
          prop="timecode"
          label="TimeArrange"
          width="180">
        </el-table-column>
        <el-table-column
          prop="reglevel"
          label="RegisterLV"
          width="180">
        </el-table-column>
        <el-table-column
          prop="ration"
          label="Ration"
          width="180">
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection()">Cancel Selection</el-button>
      </div>

      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="10">
          <el-date-picker style="width:400px"
                          v-model="ruledate"
                          type="daterange"

                          range-separator="to"
                          start-placeholder="start date"
                          end-placeholder="end date">
          </el-date-picker>
        </el-col>
        <el-col :span="7">
          <el-input v-model="opid" style="width:200px" placeholder="OperatorID"></el-input>
        </el-col>
        <el-col :span="7">
          <el-button type="primary" @click="openConfirmDialog">Arrange Now!</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "rules",
    data() {
      return {
        dialogVisible: false,

        deptname: "",
        rules: [],
        multipleSelection: [],

        ruledate: [],
        ration: '',
        opid: '',
        reglevel: '',
        patchURid: null,
      }

    },
    methods: {

      searchRules: function () {
        var params = new URLSearchParams();
        params.append('deptname', this.deptname);
        //this.currentPage = 1;
        var that = this;
        this.$axios.post('/api/management/getRules', params)
          .then(function (response) {
            console.log(response.data);
            that.rules = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      arrangeShift: function () {

        console.log("ARRANGE!" + this.ruledate[0]);
        console.log(this.multipleSelection[0].timecode);
        var startwd = this.ruledate[0].getDay();
        var daycount = (this.ruledate[1] - this.ruledate[0]) / (1000 * 60 * 60 * 24);

        var params = [];
        for (var j = 0; j < this.multipleSelection.length; j++) {
          for (var i = 0; i <= daycount; i++) {

            var param = {
              ruleid: "",
              itemname: "",
              ration: "",
              dutydate: new Date(),
              userid: "",
              aorp: true,
            };
            var param2 = {
              ruleid: "",
              itemname: "",
              ration: "",
              dutydate: new Date(),
              userid: "",
              aorp: false,
            };
            param.ruleid = this.multipleSelection[j].ruleid;
            param.itemname = this.multipleSelection[j].reglevel;
            param.ration = this.multipleSelection[j].ration;
            param.dutydate.setTime(this.ruledate[0].getTime() + i * (1000 * 60 * 60 * 24));

            param.userid = this.opid;
            param2.ruleid = this.multipleSelection[j].ruleid;
            param2.itemname = this.multipleSelection[j].reglevel;
            param2.ration = this.multipleSelection[j].ration;
            param2.dutydate.setTime(this.ruledate[0].getTime() + i * (1000 * 60 * 60 * 24));
            param2.userid = this.opid;

            var morning = parseInt(this.multipleSelection[j].timecode[(2 * (i + startwd)) % 14]);

            if (morning) {
              params.push(param);
            }

            var afternoon = parseInt(this.multipleSelection[j].timecode[(2 * (i + startwd)) % 14 + 1]);

            if (afternoon) {
              params.push(param2);
            }

          }
        }


        this.$axios({
          url: '/api/management/updateShift',
          method: 'post',
          contentType: 'application/json', // 这句不加出现415错误:Unsupported Media Type
          data: {
            startdate: this.ruledate[0],
            enddate: this.ruledate[1],
            shifts: params,

          }
          , // 以json字符串方式传递
          success: function (data) {
            console.log("success...");
          },
          error: function (data) {
            console.log("error...");
          }
        });
      },
      openConfirmDialog: function () {
        this.$confirm('Sure to arrange?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.arrangeShift();
          this.dialogVisible = false;
          this.$message({
            type: 'success',
            message: 'Arrange Succeed!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel Arrangement.'
          });
        });
      }
    }
  };
</script>

<style scoped>

</style>
