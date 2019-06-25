<template>
  <div id="app">
    <el-row style="height: 100px">
      <el-col :span="4">
        <el-image
          style="width: 100%  ; height: 100%"
          src="./assets/logo.png"
        ></el-image>
      </el-col>
      <el-col :span="20">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">处理中心</el-menu-item>
          <el-submenu index="2">
            <template slot="title">Management</template>
            <el-menu-item index="2-1">Departments</el-menu-item>
            <el-menu-item index="2-2">Diagnostic Catalog</el-menu-item>
            <el-menu-item index="2-3">Non-Medical Charge</el-menu-item>
            <el-menu-item index="2-4">Shift</el-menu-item>
            <el-menu-item index="2-5">Users</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">Register&Payment</template>
            <el-menu-item index="3-1">Register</el-menu-item>
            <el-menu-item index="3-2">Receipt</el-menu-item>
            <el-menu-item index="3-3">Bill</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">Outpatient</template>
            <el-menu-item index="4-1">Homepage</el-menu-item>
            <el-menu-item index="4-2">Template Management</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">Medical Treatment</template>
            <el-menu-item index="5-1">Examination</el-menu-item>
            <el-menu-item index="5-2">Medical Management</el-menu-item>
          </el-submenu>
          <el-submenu index="6">
            <template slot="title">Pharmacy</template>
            <el-menu-item index="6-1">Send Medicine</el-menu-item>
            <el-menu-item index="6-2">Return Medicine</el-menu-item>
            <el-menu-item index="6-3">Medicine Management</el-menu-item>
          </el-submenu>
          <el-submenu index="7">
            <template slot="title">Financial</template>
            <el-menu-item index="7-1">Daily Record</el-menu-item>
            <el-menu-item index="7-2">Departments</el-menu-item>
            <el-menu-item index="7-3">Doctors</el-menu-item>
          </el-submenu>
          <el-menu-item>
            <el-row type="flex" justify="space-between">
              <el-col :span="10">
                <el-tag style="font-family: 'Microsoft Sans Serif';" type="primary">
                  {{this.usercat}}:{{this.username}}
                </el-tag>
              </el-col>
              <el-col :span="12" style="padding:0px">
                <i class="el-icon-s-custom"></i>
                <el-button v-bind:type="loginButton" size="small" @click="loginDialog">{{loginState}}</el-button>
              </el-col>
            </el-row>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        activeIndex: '1',
        usercat: '',
        username: '',
        loginButton: 'primary',
        loginState: 'LogIn'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
