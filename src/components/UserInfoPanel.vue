<template>
<div class="container">
  <el-card>
    <div class="avatar clearfix" slot="header">
      <div class="icon" ></div>
      <div class="welcome">xxx玩家你好</div>
    </div>
    <div class="field clearfix">
      <span class="field-title">會員等級</span>
      <span class="field-content">一班會員</span>
    </div>
    <div class="field clearfix">
      <span class="field-title">{{$t('user.money')}}</span>
      <span class="field-content">一班會員</span>
    </div>
    <div class="field clearfix">
      <span class="field-title">會員等級</span>
      <span class="field-content">一班會員</span>
    </div>
  </el-card>


  <el-card>
    <div slot="header">
      <div class="title">使用者資訊</div>
    </div>
    <div class="field clearfix">
      <span class="field-title">會員等級</span>
      <span class="field-content">一班會員</span>
    </div>
    <div class="field clearfix">
      <span class="field-title">會員等級</span>
      <span class="field-content">一班會員</span>
    </div>
  </el-card>

</div>
</template>

<script>

</script>

<style lang="scss" scoped>
.container {
  border: 1px solid red;
}
.avatar {
  position: relative;
  height: 100px;

  .icon {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: blue;
  }
  .welcome {
    position: absolute;
    height: 35px;
    width: 100px;
    bottom: 0;
    right: 0;
  }
}

$field-height: 35px;
.field {

  height: $field-height;
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
  .field-title {
    float: left;
    height: $field-height;
    width: 48%;
    line-height: $field-height;
    background-color: #ccc;
  }
  .field-content {
    box-sizing: border-box;
    float: right;
    width: 48%;
    height: $field-height;
    line-height: $field-height;
    border: 1px solid #000;
  }
}
.title {
  text-align: center;
  margin: 0 auto;
  width: 100px;
  height: $field-height;
  line-height: $field-height;
  background-color: #ccc;
}
</style>

