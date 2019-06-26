<template>
  <div id="medicine">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input type="text" v-model="itemcode" placeholder="Medicine Code" clearable></el-input>
      </el-col>
      <el-col :span="8">
        <el-button icon="el-icon-search" type="primary" @click="search">Search</el-button>
      </el-col>
      <el-col :span="8">
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="showDialogForm('Add')">Add New Medicine</el-button>
      </el-col>
    </el-row>


    <el-table
      :data="medicine.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%"
      tooltip-effect="dark">
      <el-table-column
        prop="itemcode"
        label="Medicine Code"
        width="180">
      </el-table-column>
      <el-table-column
        prop="itemname"
        label="Medicine Name"
        width="250">
      </el-table-column>
      <el-table-column
        prop="size"
        label="Medicine Size"
        width="180">
      </el-table-column>
      <el-table-column
        prop="unit"
        label="Unit"
        width="100">
      </el-table-column>
      <el-table-column
        prop="price"
        label="Price"
        width="100">
      </el-table-column>
      <el-table-column
        prop="medtype"
        label="Medicine Type"
        width="180">
      </el-table-column>
      <el-table-column
        prop="medcat"
        label="Medicine Category">
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="120">
        <template slot-scope="scope">
          <el-button @click="showDeleteDialogForm(scope.$index, scope.row)" type="text" size="small">delete
          </el-button>
          <el-button @click="showDialogForm('Update',scope.$index, scope.row)" type="text" size="small">update
          </el-button>
        </template>
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
      :total="medicine.length">
    </el-pagination>

    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item v-if="methodType=='Add'" label="Medicine Code" :label-width="formLabelWidth">
          <el-input v-model="form.itemcode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Medicine Name" :label-width="formLabelWidth">
          <el-input v-model="form.itemname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Medicine Size" :label-width="formLabelWidth">
          <el-input v-model="form.size" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Unit" :label-width="formLabelWidth">
          <el-input v-model="form.unit" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Price" :label-width="formLabelWidth">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Medicine Type" :label-width="formLabelWidth">
          <el-input v-model="form.medtype" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Medicine Category" :label-width="formLabelWidth">
          <el-input v-model="form.medcat" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">{{methodType}}</el-button>
      </div>
    </el-dialog>

    <!--    Delete Dialogue -->
    <el-dialog
      title="Confirm Delete"
      :visible.sync="deleteDialogVisible"
      width="30%">
      <span>Are you sure you want to delete this?</span>
      <span slot="footer" class="dialog-footer">
            <el-button @click="deleteDialogVisible = false">Cancel</el-button>
            <el-button type="primary" @click="delMed">Confirm</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "medicine",
      data(){
          return{
            itemcode: "",
            itemname: "",
            size: "",
            unit: "",
            price:"",
            medtype:"",
            medcat:"",
            medicine: [],

            value: false,
            currentPage: 1, //初始页
            pagesize: 10,    //    每页的数据

            deleteDialogVisible: false,//控制弹出删除窗口
            deletingIndex: -1,
            deletingObject:{},

            multipleSelection: [],

            methodType: "",//调用方法，add or update
            formTitle:"",
            dialogFormVisible: false,
            updatingIndex:-1,
            updatingObject:{},
            form: {
              itemcode: "",
              itemname: "",
              size: "",
              unit: "",
              price:"",
              medtype:"",
              medcat:"",
            },
            formLabelWidth: '120px'
          }
      },

      mounted: function(){
        console.log("refresh!!!")
        this.currentPage = 1;
        var that = this;
        this.$axios.post('/api/pharmacy/med', {})
          .then(function (response) {
            console.log(response.data);
            that.medicine = response.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      },

      methods: {
        search: function () {
          this.currentPage = 1;
          var that = this;
          this.$axios.post('/api/pharmacy/med', {
            itemcode: that.itemcode,
            itemname: that.itemname,
            size: that.size,
            unit: that.unit,
            price:that.price,
            medtype:that.medtype,
            medcat:that.medcat,
          })
            .then(function (response) {
              console.log(response.data);
              that.medicine = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
        },

        refresh: function () {
          this.currentPage = 1;
          var that = this;
          this.$axios.post('/api/pharmacy/med', {
            itemcode: "",
            itemname: "",
            size: "",
            unit: "",
            price:"",
            medtype:"",
            medcat:"",
          })
            .then(function (response) {
              console.log(response.data);
              that.medicine = response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
        },

        onSubmit: function(){
          if(this.methodType=="Add")
            this.onSubmitAdd();
          if(this.methodType=="Update")
            this.onSubmitUpdate();
          this.dialogFormVisible = false;
          this.refresh();
        },

        onSubmitAdd: function(){
          var that = this;
          console.log(that.form);
          this.$axios.post('/api/pharmacy/addMed', {
            itemcode: that.form.itemcode,
            itemname: that.form.itemname,
            size: that.form.size,
            unit: that.form.unit,
            price:that.form.price,
            medtype:that.form.medtype,
            medcat:that.form.medcat,
          })
            .then(function (response) {
              console.log(response.data);
              that.refresh();
              // that.depts=response.data;
            })
            .catch(function (error) {
              console.log(error);
            });
        },

        onSubmitUpdate: function () {
          var that = this;
          console.log(that.form);
          this.$axios.post('/api/pharmacy/updateMed', {
            itemcode: that.form.itemcode,
            itemname: that.form.itemname,
            size: that.form.size,
            unit: that.form.unit,
            price:that.form.price,
            medtype:that.form.medtype,
            medcat:that.form.medcat,
          }).then(function (response) {
            that.refresh();
          })
            .catch(function (error) {
              console.log(error);
            });
        },

        showDeleteDialogForm: function(index, row){
          this.deleteDialogVisible = true;
          this.deletingIndex = index;
          this.deletingObject = row;
        },

        delMed: function () {
          var params = new URLSearchParams();
          params.append('itemcode', this.deletingObject.itemcode);
          this.$axios.post('/api/pharmacy/delMed', params)
            .then(function (response) {

            })
            .catch(function (error) {
              console.log(error);
            });
          this.deleteDialogVisible = false;
          this.refresh();
        },

        showDialogForm: function (method,index,row) {
          if (method == "Add") {
            this.form = {
              itemcode: "",
              itemname: "",
              size: "",
              unit: "",
              price:"",
              medtype:"",
              medcat:"",
            };
          }
          if (method == "Update"){
            this.form = {
              itemcode: row.itemcode,
              itemname: row.itemname,
              size: row.size,
              unit: row.unit,
              price:row.price,
              medtype:row.medtype,
              medcat:row.medcat,
            }
          }

          this.dialogFormVisible = true;
          this.methodType = method;
          this.formTitle = method + " Medicine";
          this.updatingIndex = index;
          this.updatingObject = row;
        },
        handleSizeChange: function(pagesize) {
          this.pagesize = pagesize;
          console.log(pagesize);
        },
        handleCurrentChange: function(currentPage) {
          this.currentPage = currentPage;
          console.log(currentPage);
        },

      }
    }
</script>

<style scoped>

</style>
