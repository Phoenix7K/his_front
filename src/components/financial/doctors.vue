<template>
  <div id="doctors">
    <el-row :gutter="30" type="flex" justify="space-between" style="margin-left: 95px;">
      <el-col :span="10">
        <div style="margin-left: -90px">
          <el-date-picker v-model="datevalue"
                          value-format="yyyy-MM-dd"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="To"
                          start-placeholder="Start Date"
                          end-placeholder="End Date" >

          </el-date-picker>
          <el-button icon="el-icon-search" type="primary" @click="search">Search</el-button>
        </div>
      </el-col>
      <el-col :span="12" :gutter="10">
        <el-button icon="el-icon-printer" type="primary" @click="print">Print</el-button>
      </el-col>
    </el-row>

    <el-table :data="docs" style="width: 100%; height: fit-content;" v-loading="loading">
      <el-table-column prop="username" label="Doctor name" width="210"></el-table-column>
      <el-table-column prop="patientsamount" label="看诊人次" width="40"></el-table-column>
      <el-table-column prop="receiptamount" label="发票数量" width="40"></el-table-column>
      <el-table-column prop="feecode1" label="超声材料费" width="40"></el-table-column>
      <el-table-column prop="feecode2" label="超声检查费" width="40"></el-table-column>
      <el-table-column prop="feecode3" label="CT材料费" width="40"></el-table-column>
      <el-table-column prop="feecode4" label="CT检查费" width="40"></el-table-column>
      <el-table-column prop="feecode5" label="处置材料费" width="40"></el-table-column>
      <el-table-column prop="feecode6" label="处置费" width="40"></el-table-column>
      <el-table-column prop="feecode7" label="放射材料费" width="40"></el-table-column>
      <el-table-column prop="feecode8" label="放射检查费" width="40"></el-table-column>
      <el-table-column prop="feecode9" label="挂号费" width="40"></el-table-column>
      <el-table-column prop="feecode10" label="检验材料费" width="40"></el-table-column>
      <el-table-column prop="feecode11" label="检验费" width="40"></el-table-column>
      <el-table-column prop="feecode12" label="MRI材料费" width="40"></el-table-column>
      <el-table-column prop="feecode13" label="MRI检查费" width="40"></el-table-column>
      <el-table-column prop="feecode14" label="麻醉费" width="40"></el-table-column>
      <el-table-column prop="feecode15" label="门诊手术费" width="40"></el-table-column>
      <el-table-column prop="feecode16" label="麻醉药费" width="40"></el-table-column>
      <el-table-column prop="feecode17" label="其他" width="40"></el-table-column>
      <el-table-column prop="feecode18" label="西药费" width="40"></el-table-column>
      <el-table-column prop="feecode19" label="中成药费" width="40"></el-table-column>
      <el-table-column prop="feecode20" label="中草药费" width="40"></el-table-column>
      <el-table-column prop="feecode21" label="诊疗费" width="40"></el-table-column>
    </el-table>

    <el-pagination :current-page="currentPage" :page-sizes="[5, 10, 20, 40]" :page-size="pagesize" :hide-on-single-page="value" layout="total, sizes, prev, pager, next, jumper" :total="docs.length">
    </el-pagination>

    <!-------         CHART           -------->
    <canvas id="deptschart"></canvas>
  </div>
</template>

<script>
    export default {
      name: "doctors",
      data() {
        return {
          username: "",
          datevalue: "",
          patientsamount: "",
          receiptamount: "",
          feecode1: "",
          feecode2: "",
          feecode3: "",
          feecode4: "",
          feecode5: "",
          feecode6: "",
          feecode7: "",
          feecode8: "",
          feecode9: "",
          feecode10: "",
          feecode11: "",
          feecode12: "",
          feecode13: "",
          feecode14: "",
          feecode15: "",
          feecode16: "",
          feecode17: "",
          feecode18: "",
          feecode19: "",
          feecode20: "",
          feecode21: "",


          loading: false,
          value: false,
          currentPage: 1,
          pagesize: 10,

          docs: [],
          users: []
        }
      },


      mounted: function() {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'https://cdn.jsdelivr.net/npm/chart.js@2.8.0';
        document.body.appendChild(s);
      },

      methods: {
        //------------        PRINT RECORD         ----------//
        print: function() {
          window.print();
        },

        // ---------------     SEARCH      -----------------//
        search: function() {
          var that = this;
          that.loading = true;

          console.log("Search called")
          this.$axios.post('/api/financial/getReceiptInfoForDoctor', {

          })

            .then(function(response) {
              that.docs = response.data;
              console.log(that.docs);

              //--------- CHART CREATION ---------//
              var docsttl = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
              for (let i of response.data) {
                console.log(i);
                docsttl[0] += i.patientsamount;
                docsttl[1] += i.receiptamount;
                docsttl[2] += i.feecode1;
                docsttl[3] += i.feecode2;
                docsttl[4] += i.feecode3;
                docsttl[5] += i.feecode4;
                docsttl[6] += i.feecode5;
                docsttl[7] += i.feecode6;
                docsttl[8] += i.feecode7;
                docsttl[9] += i.feecode8;
                docsttl[10] += i.feecode9;
                docsttl[11] += i.feecode10;
                docsttl[12] += i.feecode11;
                docsttl[13] += i.feecode12;
                docsttl[14] += i.feecode13;
                docsttl[15] += i.feecode14;
                docsttl[16] += i.feecode15;
                docsttl[17] += i.feecode16;
                docsttl[18] += i.feecode17;
                docsttl[19] += i.feecode18;
                docsttl[20] += i.feecode19;
                docsttl[21] += i.feecode20;
                docsttl[22] += i.feecode21;
              }
              var ctx = document.getElementById('deptschart').getContext('2d');
              var chart = new Chart(ctx, {
                type: 'bar',

                data: {
                  labels: ['看诊人次', '发票数量', '超声材料费', '超声检查费', 'CT材料费',
                    'CT检查费', '处置材料费', '处置费', '放射材料费', '放射检查费',
                    '挂号费', '检验材料费', '检验费', 'MRI材料费', 'MRI检查费', '麻醉费',
                    '门诊手术费', '麻醉药费', '其他', '西药费', '中成药费', '中草药费', '诊疗费'
                  ],
                  datasets: [{
                    label: 'Doctors record',
                    backgroundColor: 'rgb(64, 158, 255)',
                    borderColor: 'rgb(64, 158, 255)',
                    //docsttl is the total amount of recepits in each column
                    data: docsttl
                  }]
                },
                options: {}
              });
            })
            .catch(function(error) {
              console.log(error);
            });
          that.loading = false;
        }
      }
    }
</script>

<style scoped>

</style>
