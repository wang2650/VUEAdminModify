<template>
  <el-tabs v-model="tabname" type="card" @tab-click="handleClick">
    <el-tab-pane  name="userinfo"> 
        <span slot="label"><i class="el-icon-document"></i> 个人信息</span>
         adsfsdf

    </el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    data() {
      return {
        tabname: 'userinfo'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
  };
</script>
