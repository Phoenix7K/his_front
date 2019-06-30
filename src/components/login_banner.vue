
<template>
  <div class="container">
    <img style="width: 100%; height: auto" src="../img/img_hospital.jpg">
    <div class="login-box">
      <img src="../img/avatar.png" class="avatar">
      <h1>Login Here</h1>
      <form>
        <p>Username</p>
        <input type="text" name="username" placeholder="Enter Username">
        <p>Password</p>
        <input type="password" name="password" placeholder="Enter Password">
        <input type="submit" name="submit" value="Login">
        <a href="#">Forget Password</a>
      </form>
    </div>
  </div>


</template>

<script>
  import img_hospital from '../img/img_hospital.jpg'
    export default {
        name: "login_banner",
      data () {
        return {
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
    height: 420px;
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
