<template>
  <div id="shift">
    <el-row :gutter="30">
      <el-col :span="12" :gutter="10">
        <el-date-picker
          v-model="datevalue"
          value-format="yyyy-MM-dd"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="To"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button icon="el-icon-search" type="primary" @click="search">Search</el-button>
      </el-col>
      <el-col :span="12" :gutter="10">
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="addRuleDialogForm">Add New Rules
        </el-button>
        <el-button icon="el-icon-view" type="primary" @click="showRuleDialogForm">Query Rules</el-button>
      </el-col>
    </el-row>

    <template>
      <el-table
        :data="shift.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        ref="multipleTable">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="shiftid"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="dutydate"
          label="Date"
          width="180"
          :formatter="dateFormatter">
        </el-table-column>
        <el-table-column
          prop="deptname"
          label="Department"
          width="180">
        </el-table-column>
        <el-table-column
          prop="realname"
          label="Doctor"
          width="180">
        </el-table-column>
        <el-table-column
          prop="aorp"
          label="AM or PM"
          width="180"
          :formatter="aorpFormatter">
        </el-table-column>
        <el-table-column
          prop="itemname"
          label="Register level"
          width="180">
        </el-table-column>
        <el-table-column
          prop="ration"
          label="Quota">
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="250">
            <span slot-scope="scope">
                <el-button type="warning" size="mini"
                           @click="showDeleteDialogForm(scope.$index, scope.row)">delete</el-button>
            </span>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 40]"

        :page-size="pagesize"
        :hide-on-single-page="value"
        layout="total, sizes, prev, pager, next, jumper"
        :total="shift.length">
      </el-pagination>
    </template>
    <div style="margin-top: 20px">
      <el-button :disabled="this.multipleSelection.length === 0" @click="toggleSelection()">Cancel Selection
      </el-button>
      <el-button type="danger" icon="delete" :disabled="this.multipleSelection.length === 0"
                 @click="delAllShift(multipleSelection)">delete all
      </el-button>
    </div>
    <el-dialog
      title="Confirm Delete"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <span>Are you sure you want to delete this?</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="delShift">Confirm</el-button>
        </span>
    </el-dialog>
    <add-rule ref="addRule"></add-rule>
    <rules ref="rules"></rules>
  </div>
</template>


<script>

  //局部注册组件
  import addRule from './shiftRules/addRule'
  import rules from './shiftRules/rules'

  export default {
    name: "shift",
    data() {
      return {
        pickerOptions: {
          shortcuts: [{
            text: 'Latest week',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Latest month',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: 'Latest three months',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        dutydate: "",
        shiftid: "",
        deptname: "",
        username: "",
        aorp: false,
        itemname: "",
        ration: "",
        datee: "",
        dates: "",
        shift: [],
        datevalue: [],
        value: false,
        multipleSelection: [],
        deleteDialogVisible: false,//控制弹出删除窗口
        deletingIndex: -1,
        deletingObject: {},
        currentPage: 1, //初始页
        pagesize: 10,    //    每页的数据

      }
    },

    components:{
      "addRule":addRule,
      "rules":rules,
    },

    mounted: function () {
      console.log("refresh!!!")
      this.currentPage = 1;
      var that = this;
      this.$axios.post('/api/management/shift', {})
        .then(function (response) {
          console.log(response.data);
          that.shift = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    methods: {
      dateFormatter(row) {
        return row.dutydate.substr(0, 10)
      },

      aorpFormatter(row) {
        if (row.aorp === true) {
          return "A.M."
        }
        if (row.aorp === false) {
          return "P.M."
        }
      },

      search: function () {
        var params = new URLSearchParams();
        params.append("dates", this.datevalue[0]);
        params.append("datee", this.datevalue[1]);
        var that = this;
        this.$axios.post('/api/management/shift', params)
          .then(function (response) {
            console.log(response.data);
            // console.log(that.value[0]);
            // console.log(that.dates);
            that.shift = response.data;
            console.log(that.shift);
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      refresh: function () {
        this.shift = [];
        var params = new URLSearchParams();
        params.append("dates", this.value[0]);
        params.append("datee", this.value[1]);
        //this.currentPage = 1;
        var that = this;
        this.$axios.post('/api/management/shift', params)
          .then(function (response) {
            console.log(response.data);
            // console.log(that.value[0]);
            // console.log(that.dates);
            that.shift = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      showDeleteDialogForm: function (index, row) {
        this.deleteDialogVisible = true;
        this.deletingIndex = index;
        this.deletingObject = row;
      },

      delShift: function () {
        var params = new URLSearchParams();
        params.append('shiftid', this.deletingObject.shiftid);
        this.$axios.post('/api/management/delShift', params)
          .then(function (response) {

          }).catch(function (error) {
          console.log(error);
        });
        this.deleteDialogVisible = false;
        this.refresh();
      },

      delAllShift: function () {
        var ids = this.multipleSelection.map(item => item.shiftid).join();//获取所有选中行的id组成的字符串，以逗号分隔
        console.log(ids);
        var that = this;
        this.$confirm('Are you sure you want to delete all this?', 'Note', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$axios.post("/api/management/delAllShift", {ids: ids})
            .then(function (response) {
              that.refresh();
            }).catch(function (error) {
            console.log(error);
          })
        })
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

      showRuleDialogForm: function () {
        console.log("show!!!");
        this.$refs.rules.dialogVisible = true;
      },
      addRuleDialogForm: function () {
        this.$refs.addRule.dialogVisible = true;
        this.$refs.addRule.fillRegSelect();
        this.$refs.addRule.fillDeptSelect();
      },
      handleSizeChange: function (pagesize) {
        this.pagesize = pagesize;
        console.log(pagesize);
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage;
        console.log(currentPage);
      }

    }
  }
</script>

<style scoped>

</style>
