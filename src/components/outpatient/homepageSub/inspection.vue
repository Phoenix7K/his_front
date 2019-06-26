<template>
  <div id="inspection">
    <el-card class="box-card">
      <el-row type="flex" justify="space-between">
        <el-col :span="18">
          <el-button size="small" icon="el-icon-circle-plus-outline" type="primary" @click="openAddDialog" round>
            Add
          </el-button>
          <el-button v-bind:disabled="deleteDisabled" size="small" icon="el-icon-remove-outline" type="primary"
                     @click="deleteItem" round>Delete
          </el-button>
          <el-button v-bind:disabled="openDisabled" size="small" icon="el-icon-circle-check" type="primary"
                     @click="updateItemState('Opene')"
                     round>Open
          </el-button>
          <el-button v-bind:disabled="revokeDisabled" size="small" icon="el-icon-delete" type="primary"
                     @click="updateItemState('Revoke')" round>
            Revoke
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
            <el-button v-bind:disabled="saveDisabled" size="small" icon="el-icon-edit-outline" type="primary"
                       slot="reference" round>Save
            </el-button>
          </el-popover>

          <el-button size="small" icon="el-icon-refresh" type="primary" @click="loadTest" round>Refresh
          </el-button>
        </el-col>
        <el-col :span="6">

          <el-dropdown trigger="click" :hide-on-click="false">

            <el-button size="medium" icon="el-icon-arrow-down" type="primary" plain>
              <i class="el-icon-s-order"></i> Invoke Template
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

        </el-col>
      </el-row>
    </el-card>
    <el-table
      ref="multipleTable"
      :data="tests"
      style="width: 100%;margin-top: 10px"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        :selectable="selectable"
        width="55">
      </el-table-column>
      <el-table-column
        prop="itemname"
        label="TestName"
        width="180">
      </el-table-column>
      <el-table-column
        prop="deptname"
        label="Department"
        width="180">
      </el-table-column>
      <el-table-column
        prop="state"
        label="ExecutionState"
        width="160">
      </el-table-column>
      <el-table-column
        prop="price"
        label="Price"
        width="150">
      </el-table-column>

      <el-table-column
        label="Result"
        width="110">
        <template slot-scope="scope">
          <el-button slot="reference" @click="showResult(scope.$index)"
                     type="primary" size="small">result
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="space-around" style="margin-top: 20px">
      <el-col :spam="6">
        <el-button @click="toggleSelection()">Cancel Selection</el-button>
      </el-col>
      <el-col :span="6">
        <el-input prefix-icon="el-icon-coin" v-model="totalprice" :disabled="true"></el-input>
      </el-col>
    </el-row>

    <el-dialog
      title="Template Details"
      :visible.sync="detailDialogVisible"
      width="65%">
      <el-table :data="nonMedicList">
        <el-table-column width="150" property="itemname"
                         label="TestName"></el-table-column>
        <el-table-column width="150" property="deptcode"
                         label="Department"></el-table-column>
        <el-table-column width="100" property="price" label="Price"></el-table-column>
      </el-table>

    </el-dialog>
    <add-inspect ref="addInspect"></add-inspect>
  </div>
</template>

<script>

  //局部注册组件
  import addInspect from '../dialog/addInspect'

  export default {
    name: "inspection",
    data() {
      return{
        tests: [],
        multipleSelection: [],
        template: [],
        totalprice: 0,
        uRid: 1,
        pid: 0,

        openDisabled: true,
        deleteDisabled: true,
        revokeDisabled: true,
        saveDisabled: true,


        visible: false,
        tempname: '',

        nonMedicList: [],
        detailDialogVisible: false,
      }
    },

    components:{
      "addInspect":addInspect,
    },

    mounted: function () {

      this.loadTest();
      this.loadTemplate();
    },

    methods: {


      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
        this.saveDisabled = true;
      },

      selectable(row, index) {
        if (this.multipleSelection.length >= 1) {
          if (row.state === this.multipleSelection[0].state) {
            return true;
          } else {
            return false;
          }
        }
        return true;
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
        if (this.multipleSelection.length >= 1) {
          this.saveDisabled = false;


          switch (this.multipleSelection[0].state) {
            case 'Saved':
              this.deleteDisabled = false;
              this.openDisabled = false;
              this.revokeDisabled = true;
              break;
            case 'Opened':
              this.revokeDisabled = false;
              this.deleteDisabled = true;
              this.openDisabled = true;
              break;
          }
        } else {
          this.saveDisabled = true;
          this.revokeDisabled = true;
          this.deleteDisabled = true;
          this.openDisabled = true;
        }
      },

      loadTest() {
        this.regid = this.$route.query.regid;
        this.pid = this.$route.query.pid;

        var params = new URLSearchParams();
        params.append("regid", this.regid);
        params.append("extype", "test");
        var that = this;
        this.$axios.post('/api/outpatient/getExamByRegidAndType', params)
          .then(function (response) {
            console.log(response.data);
            that.tests = response.data;
            that.totalprice = 0;
            for (var i = 0; i < that.tests.length; i++) {
              if (that.tests[i].state !== 'Revoked')
                that.totalprice += that.tests[i].price;
            }

          })
          .catch(function (error) {
            console.log(error);
          });
      },

      showResult(index) {
        this.$notify({
          title: 'Result Detail',
          message: this.tests[index].result,
          offset: 100
        });
      },
      openAddDialog() {
        this.$refs.addInspect.dialogVisible = true;
      },

      deleteItem() {
        var that = this;
        this.$confirm('Sure to delete ' + this.multipleSelection.length + ' ITEMS', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/api/outpatient/deleteExamState', {
            items: this.multipleSelection,
          }).then(function () {
            that.loadTest();
          })
            .catch(function (error) {
              console.log(error);

            });

          this.$message({
            type: 'success',
            message: 'Delete Succeed!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel Delete.'
          });
        });

      },

      updateItemState(state) {
        var that = this;
        this.$confirm('Sure to update ' + this.multipleSelection.length + ' ITEMS', 'Prompt', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/api/outpatient/updateExamState', {
            items: this.multipleSelection,
            state: state + 'd',
          }).then(function () {
            that.loadTest();
            if (state === 'Opene') {
              this.$axios.post('/api/outpatient/addExamToBill', {
                items: that.multipleSelection,
                pid: that.pid,
                regid: that.regid,
              })
                .catch(function (error) {
                  console.log(error);

                });
            }
          })
            .catch(function (error) {
              console.log(error);

            });

          this.$message({
            type: 'success',
            message: state + ' Succeed!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel ' + state
          });
        });


      },

      saveToTemplate() {
        var that = this;
        this.$axios.post('/api/outpatient/saveExamToTemplate', {
          items: this.multipleSelection,
          tempname: this.tempname,
          temptype: 'test'
        }).then(function () {
          that.loadTest();
          that.loadTemplate();
        })
          .catch(function (error) {
            console.log(error);

          });
        this.visible = false;
      },

      loadTemplate() {
        var that = this;
        this.$axios.post('/api/outpatient/getTemplateForExam', {
          temptype: "test"
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
        this.$axios.post('/api/outpatient/addTemplateToExam', {
          tempid: this.template[index].tempid,
          extype: 'test',
          regid: this.regid,
          uRid: this.uRid,
        }).then(function () {
          that.loadTest();
        })
          .catch(function (error) {
            console.log(error);

          });
      },
      templateDetail(index) {
        this.nonMedicList = this.template[index].nonMedicList;
        this.detailDialogVisible = true;
      },
    }
  }
</script>

<style scoped>

</style>
