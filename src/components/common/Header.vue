<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i class="el-icon-menu"></i>
    </div>
    <div class="logo">后台管理系统</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/img.jpg" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{username}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="modifyuserinfo">用户信息</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!--编辑界面-->
    <el-dialog
      title="我的信息"
      :visible.sync="editFormVisible"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="登录名" prop="UserName">{{editForm.UserName}}</el-form-item>
        <el-form-item label="昵称" prop="NickName">
          <el-input v-model="editForm.NickName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="PassWord">
          <el-input v-model="editForm.PassWord" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="介绍">
          <el-input type="textarea" v-model="editForm.Introduction"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" >提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import bus from "../common/bus";
import {  UpdateMyselfInfo, GetCurrentUserInfo } from "@/api/user";
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: "linxin",
      message: 2,
      editFormVisible: false, //编辑界面是否显示
      //编辑界面数据
      editForm: {
        ID: 0,
        UserName: "",
        NickName: "",
        PassWord: "",
        Introduction: ""
      },
      editFormRules: {
        UserName: [
          { required: true, message: "请输入登录名", trigger: "blur" }
        ],
        NickName: [{ required: true, message: "请输入昵称", trigger: "blur" }]
      },
      editLoading: false
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      switch (command) {
        case "loginout":
          localStorage.clear();
          this.$router.push("/login");
          break;

        case "modifyuserinfo":
            this.displayuserinfo();
  
          break;
        default:
          break;
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    displayuserinfo() {
      GetCurrentUserInfo().then(res => {
        if (res.Code === 0) {
          this.editForm.ID = res.Data.ID;
          this.editForm.UserName = res.Data.UserName;
          this.editForm.NickName = res.Data.NickName;
          this.editForm.PassWord = res.Data.PassWord;
          this.editForm.Introduction = res.Data.Introduction;
                  this.editFormVisible = true;
        } else {
          this.$message({
            message: res.Errors.join("  "),
            type: "error"
          });
        }
      });
    },
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.editForm);

            UpdateMyselfInfo(para).then(res => {
              this.editLoading = false;
              if (res.Code === 0) {
                //NProgress.done();
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
              } else {
                this.editLoading = false;
                this.$message({
                  message: res.Errors.join("  "),
                  type: "error"
                });
              }
            });
          });
        }
      });
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  }
};
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
