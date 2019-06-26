<template>
  <div id="templates">
    <!--template function-->
    <el-row :gutter="15">
      <el-col :span="6">
        <el-input type="text" v-model="tempname" placeholder="Name"></el-input>
      </el-col>
      <el-col :span="5">
        <el-select v-model="value1" placeholder="Scope">
          <el-option label="Individual" value="individual"></el-option>
          <el-option label="Department" value="department"></el-option>
          <el-option label="Hospital" value="hospital"></el-option>
        </el-select>
      </el-col>
      <el-col :span="5">
        <el-select v-model="value2" placeholder="Type">
          <el-option-group
            v-for="group in option"
            :key="group.label"
            :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-option-group>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-button icon="el-icon-search" type="primary" @click="search">Search</el-button>
      </el-col>
      <el-col :span="5">
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="showDialogForm">Add New Template
        </el-button>
      </el-col>
    </el-row>
    <!--template table-->
    <el-table
      :data="template_all.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%">
      <el-table-column
        prop="tempname"
        label="Name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createdate"
        label="Create Date"
        width="180"
        :formatter="dateFormatter">
      </el-table-column>
      <el-table-column
        prop="tempscope"
        label="Scope"
        width="180">
      </el-table-column>
      <el-table-column

        prop="temptype"
        label="Type">
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="250">
            <span slot-scope="scope">
                <el-button type="primary" size="mini" @click="showDetailsDialogForm(scope.row)">details</el-button>
            </span>
      </el-table-column>
    </el-table>
    <!--template page-->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 40]"

      :page-size="pagesize"
      :hide-on-single-page="value"
      layout="total, sizes, prev, pager, next, jumper"
      :total="template_all.length">
    </el-pagination>
    <!--add new template dialog-->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="form.tempname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Scope" :label-width="formLabelWidth">
          <el-select v-model="form.tempscope" placeholder="Scope">
            <el-option label="Individual" value="individual"></el-option>
            <el-option label="Department" value="department"></el-option>
            <el-option label="Hospital" value="hospital"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Type" :label-width="formLabelWidth">
          <el-select v-model="form.temptype" placeholder="Type">
            <el-option-group
              v-for="group in option"
              :key="group.label"
              :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">Confirm</el-button>
      </div>
    </el-dialog>
    <detail-diag ref="detailDiag"></detail-diag>
  </div>
</template>

<script>

  import detailDiag from './dialog/detailDiag'

  export default {
    name: "templates",
    data() {
      return {
        option: [{
          label: 'Medical Technology',
          options: [{
            value: 'examination',
            label: 'Examination'
          }, {
            value: 'test',
            label: 'Test'
          }, {
            value: 'disposal',
            label: 'Disposal'
          }]
        }, {
          label: 'Medicine',
          options: [{
            value: '西药',
            label: 'Western Medicine'
          }, {
            value: '中成药',
            label: 'Patent Medicine'
          }, {
            value: '中草药',
            label: 'Herbal Medicine'
          }]
        }],
        value1: '',
        value2: '',

        tempid: "",
        tempname: "",
        createdate: "",
        tempscope: "",
        temptype: "",
        template_all: [],

        value: false,
        currentPage: 1,//初始页
        pagesize: 10,//每页的数据
        formTitle: "",
        dialogFormVisible: false,
        form: {
          tempname: "",
          tempscope: "",
          temptype: "",
        },
        formLabelWidth: '120px'
      }
    },

    /**
     * initial refresh
     */
    mounted: function () {
      console.log("refresh!!!");
      this.currentPage = 1;
      var that = this;
      this.$axios.post('/api/outpatient/temps', {})
        .then(function (response) {
          console.log(response.data);
          that.template_all = response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    components:{
      "detailDiag":detailDiag,
    },


    methods: {
      /**
       * change date format
       * */
      dateFormatter: function (row) {
        var time1 = row.createdate;
        var time2 = myTime(time1);

        function myTime(date) {
          var arr = date.split("T");
          var d = arr[0];
          var darr = d.split('-');

          var t = arr[1];
          var tarr = t.split('.000');
          var marr = tarr[0].split(':');

          var dd = parseInt(darr[0]) + "-" + parseInt(darr[1]) + "-" + parseInt(darr[2]) + " " + (parseInt(marr[0]) + 8) + ":" + parseInt(marr[1]) + ":" + parseInt(marr[2]);

          return dd;
        }

        return time2;
      },
      /**
       * add new template
       * */
      showDialogForm: function () {
        this.form = {
          tempname: "",
          tempscope: "",
          temptype: "",
        };
        this.dialogFormVisible = true;
      },
      /**
       * add new template finish
       * */
      onSubmit: function () {
        this.onSubmitAdd();
        this.dialogFormVisible = false;
      },
      onSubmitAdd: function () {
        var that = this;
        var d = new Date();

        console.log(that.form);
        this.$axios.post('/api/outpatient/addTemp', {
          tempname: that.form.tempname,
          tempscope: that.form.tempscope,
          temptype: that.form.temptype,
          createdate: d.getTime(),
        })
          .then(function (response) {
            console.log(response.data);
            that.refresh();
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      /**
       * search template
       * */
      search: function () {
        this.currentPage = 1;
        var that = this;
        this.$axios.post('/api/outpatient/temps', {
          tempname: that.tempname,
          temptype: that.value2,
          tempscope: that.value1,
          createdate: that.createdate,
        })
          .then(function (response) {
            console.log(response.data);
            that.template_all = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      /**
       *refresh template
       * */
      refresh: function () {
        template_all = [];
        this.currentPage = 1;
        var that = this;
        this.$axios.post('/api/outpatient/temps', {
          tempname: "",
          temptype: "",
          tempscope: "",
          createdate: "",
        })
          .then(function (response) {
            console.log(response.data);
            that.template_all = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      /**
       * details
       * */
      showDetailsDialogForm: function (row) {
        this.$refs.detailDiag.form = {
          tempid: row.tempid,
          tempname: row.tempname,
          tempscope: row.tempscope,
          temptype: row.temptype,
        };
        this.$refs.detailDiag.dialogVisible = true;
        // console.log(dialog.form.tempid);
        var that = this;
        var params = new URLSearchParams();
        params.append("tempid", row.tempid);
        this.$axios.post('/api/outpatient/getDetails', params)
          .then(function (response) {
            console.log(response.data);
            that.$refs.detailDiag.details = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      /**
       * page
       * */
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
