
<template>
  <div class="container">
    <img style="width: 100%; height: auto" src="../img/img_hospital.jpg">
    <div class="login-box">
      <img src="../img/avatar.png" class="avatar">
      <h1>Login Here</h1>
      <form>
        <p>Username</p>
        <input type="text" name="username" placeholder="Enter Username" v-model="username">
        <p>Password</p>
        <input type="password" name="password" placeholder="Enter Password" v-model="password">
        <el-row justify="space-around">
          <el-button type="primary" @click="onSubmit" round>Login</el-button>
        </el-row>
      </form>
    </div>
  </div>

</template>

<script>
  import img_hospital from '../img/img_hospital.jpg'
    export default {
        name: "login_banner",
      inject: ['loadUser'],
      data () {
        return {
          username: '',
          password: ''
        }
      },

      methods:{
        onSubmit(){
          var that = this;
          this.$axios({
            url: '/api/redis/login',
            method: 'post',
            contentType: 'application/json', // 这句不加出现415错误:Unsupported Media Type
            data: {
              username: this.username,
              password: this.password
            }
          })
            .then(function (response) {
              if(response.data.status === true){
                that.$message({
                  message: 'Login Success!',
                  type: 'success'
                });
                console.log(response.data);
                that.loadUser(response.data.user);
                that.$cookies.set("Authorization", response.data.token);
                that.$router.push({path:'/login_welcome',query:{username: that.username}});
              }else{
                that.$message('Login Failed!');
                that.username = '';
                that.password = '';
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    }
</script>

<style scoped>
  .container{
    margin: 0;
    padding: 0;
    background-size: cover;
    background: url('../img/img_hospital.jpg') center;
    /*background-image: 'url('+imageUrl+')';*/
    /*backgroundImage: 'url(' + img_hospital + ')';*/
    font-family: sans-serif;

  }
  .login-box{
    width: 320px;
    height: 370px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%,-50%);
    box-sizing: border-box;
    padding: 70px 30px;
  }
  .avatar{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    position: absolute;
    top: -50px;
    left: calc(50% - 50px);
  }
  h1{
    margin: 0;
    padding: 0 0 20px;
    text-align: center;
    font-size: 22px;
  }
  .login-box p{
    margin: 0;
    padding: 0;
    font-weight: bold;
  }
  .login-box input{
    width: 100%;
    margin-bottom: 20px;
  }
  .login-box input[type="text"], input[type="password"]
  {
    border: none;
    border-bottom: 1px solid #fff;
    background: transparent;
    outline: none;
    height: 40px;
    color: #fff;
    font-size: 16px;
  }
  .login-box input[type="submit"]
  {
    border: none;
    outline: none;
    height: 40px;
    background: #1c8adb;
    color: #fff;
    font-size: 18px;
    border-radius: 20px;
  }
  .login-box input[type="submit"]:hover
  {
    cursor: pointer;
    background: #39dc79;
    color: #000;
  }

  .login-box a{
    text-decoration: none;
    font-size: 14px;
    color: #fff;
  }
  .login-box a:hover
  {
    color: #39dc79;
  }
</style>
