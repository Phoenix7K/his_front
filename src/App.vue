<template>
  <div id="app">
    <el-header>
      <el-row style="height: 100px">
        <el-col :span="24">
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1" @click="naviTo('login_banner')" v-if="disabled.homepage">HomePage</el-menu-item>
            <el-submenu index="2" v-if="disabled.management">
              <template slot="title">Management</template>
              <el-menu-item index="2-1" @click="naviTo('constant')">Constants</el-menu-item>
              <el-menu-item index="2-2" @click="naviTo('dept')">Departments</el-menu-item>
              <el-menu-item index="2-3" @click="naviTo('disease')">Diagnostic Catalog</el-menu-item>
              <el-menu-item index="2-4" @click="naviTo('non_medic')">Non-Medical Charge</el-menu-item>
              <el-menu-item index="2-5" @click="naviTo('shift')">Shift</el-menu-item>
              <el-menu-item index="2-6" @click="naviTo('user')">Users</el-menu-item>
            </el-submenu>
            <el-submenu index="3" v-if="disabled.register">
              <template slot="title">Register&Payment</template>
              <el-menu-item index="3-1" @click="naviTo('bill')">Bill</el-menu-item>
              <el-menu-item index="3-2" @click="naviTo('cancel_register')">Cancel Registration</el-menu-item>
              <el-menu-item index="3-3" @click="naviTo('receipt')">Receipt</el-menu-item>
              <el-menu-item index="3-4" @click="naviTo('register')">Register</el-menu-item>
            </el-submenu>
            <el-submenu index="4" v-if="disabled.outpatient">
              <template slot="title">Outpatient</template>
              <el-menu-item index="4-1" @click="naviTo('homepage')">Homepage</el-menu-item>
              <el-menu-item index="4-2" @click="naviTo('templates')">Template Management</el-menu-item>
            </el-submenu>
            <el-submenu index="5" v-if="disabled.medtech">
              <template slot="title">Medical Treatment</template>
              <el-menu-item index="5-1" @click="naviTo('exam')">Examination</el-menu-item>
              <el-menu-item index="5-2" @click="naviTo('medtech')">Medical-Tech</el-menu-item>
            </el-submenu>
            <el-submenu index="6" v-if="disabled.pharmacy">
              <template slot="title">Pharmacy</template>
              <el-menu-item index="6-1" @click="naviTo('medicine')">Medicine Management</el-menu-item>
              <el-menu-item index="6-2" @click="naviTo('returnM')">Return Medicine</el-menu-item>
              <el-menu-item index="6-3" @click="naviTo('send')">Send Medicine</el-menu-item>
            </el-submenu>
            <el-submenu index="7" v-if="disabled.financial">
              <template slot="title">Financial</template>
              <el-menu-item index="7-1" @click="naviTo('dailyrecord')">Daily Record</el-menu-item>
              <el-menu-item index="7-2" @click="naviTo('depts')">Departments</el-menu-item>
              <el-menu-item index="7-3" @click="naviTo('doctors')">Doctors</el-menu-item>
            </el-submenu>
            <el-menu-item style="float: right;margin-right: 30px">
              <el-row type="flex" justify="space-between">
                <el-col :span="10">
                  <el-tag style="font-family: 'Microsoft Sans Serif';" type="primary">
                    {{this.user.usercat}}:{{this.user.username}}
                  </el-tag>
                </el-col>
                <el-col :span="12" style="padding:0px">
                  <i class="el-icon-s-custom"></i>
                  <el-button v-bind:type="loginButton" size="small" @click="logOut" v-if="loginBool">{{loginState}}</el-button>
                </el-col>
              </el-row>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <el-footer>
      <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
      <el-row justify="space-around">
        <el-col :span="12">NEUEDU SOFT</el-col>
        <el-col :span="12">MaxSwen: 10086</el-col>
      </el-row>
      <el-button @click="authToken"></el-button>
    </el-footer>
  </div>
</template>

<script>
  export default {
    name: 'App',
    provide(){
      return{
        loadUser: this.loadUser,
        authToken: this.authToken,
      }
    },
    data() {
      return {
        loginBool:false,
        activeIndex: '1',
        user:{
          userid:'',
          usercat: '',
          username: '',
        },
        loginButton: 'danger',
        loginState: 'LogOut',
        disabled:{
          management:false,
          register:false,
          outpatient:false,
          medtech:false,
          pharmacy:false,
          financial:false,
          homepage:true
        }
      };
    },
    computed: {
      newUser() {
        return this.user.usercat;
      }
    },
    watch: {
      newUser(val) {

        this.disabled.management = false;
        this.disabled.register = false;
        this.disabled.outpatient = false;
        this.disabled.medtech = false;
        this.disabled.pharmacy = false;
        this.disabled.financial = false;
        this.disabled.homepage = true;

        if (val === "医院管理员") {
          this.disabled.management = true;
          this.disabled.register = true;
          this.disabled.outpatient = true;
          this.disabled.medtech = true;
          this.disabled.pharmacy = true;
          this.disabled.financial = true;
          this.disabled.homepage = false;
        } else if (val === "挂号收费员") {
          this.disabled.register = true;
          this.disabled.homepage = false;
        } else if (val === "门诊医生") {
          this.disabled.outpatient = true;
          this.disabled.homepage = false;
        } else if (val === "医技医生") {
          this.disabled.medtech = true;
          this.disabled.homepage = false;
        } else if (val === "药房管理员") {
          this.disabled.pharmacy = true;
          this.disabled.homepage = false;
        } else if (val === "财务管理员") {
          this.disabled.financial = true;
          this.disabled.homepage = false;
        }
      }
    },

    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      naviTo(url){
        this.$router.push({path:'/'+url})
      },
      loadUser:function(user){
        this.user = user;
        this.loginBool = true;
      },
      logOut(){
        this.$router.push({path:'/login_banner'});
        this.user = {};
        this.loginBool = false;
      },
      authToken(){
          var that = this;
          this.$axios({
            url: '/api/redis/test',
            method: 'post',
            contentType: 'application/json',
            headers: {'Authorization': this.$cookies.get('Authorization')},
          })
            .then(function (response) {
              console.log(response.data);
            })
            .catch(function (error) {
              if(error.response.status === 401){
                that.user = {};
                that.loginBool = false;
                that.$router.push({path:'/login_banner'});
                that.$notify({
                  title: 'Unauthorized!',
                  message: 'Please Re-Login',
                  type: 'warning'
                });
              }
            });
      }
    }
  }
</script>

<style>

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
</style>
