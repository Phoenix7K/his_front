<template>
  <div id="detailDiag">
    <el-dialog
      title="Template Details"
      :visible.sync="dialogVisible"
      width="90%"
      height="80%">
      <!--first row details function-->
      <el-row :model="form" :gutter="10">
        <el-col :span="12">
          <el-input type="text" v-model="form.tempname" autocomplete="off" placeholder="Name"></el-input>
        </el-col>
        <el-col :span="12">
          <el-select v-model="form.tempscope" placeholder="Scope">
            <el-option label="Individual" value="individual"></el-option>
            <el-option label="Department" value="department"></el-option>
            <el-option label="Hospital" value="hospital"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <!--second row details function-->
      <el-row style="margin-top: 20px">
        <el-col :span="4">
          <el-button icon="el-icon-search" type="primary" @click="searchItem">Add New Item</el-button>
        </el-col>
        <el-col :span="4">
          <el-popover
            placement="top"
            width="160"
            v-model="uvisible">
            <p>This gonna change the template, continue or not</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="uvisible = false">Cancel</el-button>
              <el-button type="primary" size="mini" @click="updateTemp">Confirm</el-button>
            </div>
            <el-button icon="el-icon-check" type="primary" @click=" " slot="reference">Update Confirm</el-button>
          </el-popover>
        </el-col>
        <el-col :span="16">
          <el-popover
            placement="top"
            width="160"
            v-model="dvisible">
            <p>Are you sure you want to delete this template?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="dvisible = false">Cancel</el-button>
              <el-button type="primary" size="mini" @click="delTemp">Confirm</el-button>
            </div>
            <el-button icon="el-icon-delete" type="primary" slot="reference">Delete Template</el-button>
          </el-popover>
        </el-col>
      </el-row>
      <!--details table-->
      <el-table
        :data="details"
        style="width: 100%">
        <el-table-column
          prop="itemcode"
          label="Code"
          width="180">
        </el-table-column>
        <el-table-column
          prop="itemname"
          label="Name"
          width="180">
        </el-table-column>
        <el-table-column
          prop="size"
          label="Size"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="Price">
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="250">
            <span slot-scope="scope">
                <el-button type="warning" size="mini" @click="delDetails(scope.$index, scope.row)">delete</el-button>
            </span>
        </el-table-column>
      </el-table>
      <!--add new item-->
      <el-dialog width="80%" height="50%" title="Add new item" :visible.sync="dialogItemVisible" append-to-body>
        <!--add new item function-->
        <el-row :gutter="5">
          <el-col :span="20">
            <el-input type="text" v-model="itemcode" placeholder="Code"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button icon="el-icon-search" type="primary" @click="searchItemcode(itemcode)">Search</el-button>
          </el-col>
        </el-row>
        <!--add new item medicine table-->
        <template>
          <el-table :data="item.slice((currentPage-1)*pagesize,currentPage*pagesize)" style="width: 100%">
            <el-table-column prop="itemcode" label="Code" width="180">
            </el-table-column>
            <el-table-column prop="itemname" label="Name">
            </el-table-column>
            <el-table-column prop="size" label="Size">
            </el-table-column>
            <el-table-column prop="price" label="Price">
            </el-table-column>
            <el-table-column fixed="right" label="Operations" width="120">
                        <span slot-scope="scope">
                            <el-button @click="chooseItem(scope.row)" type="primary" size="small">choose</el-button>
                        </span>
            </el-table-column>
          </el-table>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="currentPage"
                         :page-sizes="[5, 10, 20, 40]" :page-size="pagesize" :hide-on-single-page="value"
                         layout="total, sizes, prev, pager, next, jumper" :total="item.length">
          </el-pagination>
        </template>
        <!--add new item table operate-->
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="dialogItemVisible = false">Close</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "detailDiag",
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

        value: false,

        tempid: "",
        tempname: "",
        tempscope: "",
        temptype: "",

        details: [],
        dvisible: false,
        uvisible: false,

        dialogVisible: false,
        dialogItemVisible: false,

        form: {
          tempid: "",
          tempname: "",
          tempscope: "",
          temptype: "",
        },

        tempRelid: 0,
        itemcode: "",
        itemname: "",
        size: "",
        price: "",
        item: [],

        currentPage: 1, //初始页
        pagesize: 10, //    每页的数据
      }
    },
    methods: {
      /**
       * distinguish template type
       * */
      searchItem: function () {
        this.currentPage = 1;
        var params = new URLSearchParams();
        params.append("temptype", this.form.temptype);
        params.append("itemcode", this.itemcode);
        var that = this;
        this.$axios.post('/api/outpatient/item', params)
          .then(function (response) {
            that.dialogItemVisible = true;
            console.log(response.data);
            that.item = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      /**
       * search with itemcode
       * */
      searchItemcode: function (itemcode) {
        this.currentPage = 1;
        var params = new URLSearchParams();
        params.append("temptype", this.form.temptype);
        params.append("itemcode", this.itemcode);
        var that = this;
        this.$axios.post('/api/outpatient/item', params)
          .then(function (response) {
            that.dialogItemVisible = true;
            console.log(response.data);
            that.item = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      /**
       * choose item for template
       * */
      chooseItem: function (row) {
        var that = this;
        var params = new URLSearchParams();
        // console.log(row.itemcode);
        params.append("tempid", this.form.tempid);
        params.append("itemcode", row.itemcode);
        this.$confirm('Do you want to add this item into template?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/api/outpatient/addItem', params)
            .then(function (response) {
              that.dialogItemVisible = false;
              that.refreshDeatils();
            })
            .catch(function (error) {
              console.log(error);
            });
          this.$message({
            type: 'success',
            message: 'Add success!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel!'
          });
        });
      },
      /**
       * delete template
       * */
      delTemp: function () {
        var that = this;
        var params = new URLSearchParams();
        params.append('tempid', this.form.tempid);
        this.$axios.post('/api/outpatient/delTemp', params)
          .then(function (response) {
            that.dialogVisible = false;
            that.dvisible = false;
            app.refresh();
          }).catch(function (error) {
          console.log(error);
        });
      },
      /**
       * update template info
       * */
      updateTemp: function () {
        var that = this;
        var params = new URLSearchParams();
        params.append('tempid', this.form.tempid);
        params.append('tempname', this.form.tempname);
        params.append('tempscope', this.form.tempscope);
        this.$axios.post('/api/outpatient/updateTemp', params)
          .then(function (response) {
            that.dialogVisible = false;
            that.uvisible = false;
            app.refresh();
          }).catch(function (error) {
          console.log(error);
        });
      },
      /**
       * refresh details
       * */
      refreshDeatils: function () {
        var that = this;
        var params = new URLSearchParams();
        params.append("tempid", this.form.tempid);
        this.$axios.post('/api/outpatient/getDetails', params)
          .then(function (response) {
            console.log(response.data);
            that.details = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      /**
       * delete details
       * */
      delDetails: function (index, row) {
        var that = this;
        var params = new URLSearchParams();
        params.append('tempRelid', this.details[index].tempRelid);
        this.$confirm('Do you want to delete this item?', 'Notice', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/api/outpatient/delDetails', params)
            .then(function (response) {
              that.refreshDeatils();
            }).catch(function (error) {
            console.log(error);
          });
          this.$message({
            type: 'success',
            message: 'Add success!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel!'
          });
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
