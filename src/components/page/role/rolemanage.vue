<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-form-item label="部门">
          <el-cascader
            expand-trigger="hover"
            :show-all-levels="false"
            change-on-select
            :options="departmentoptions"
            v-model="seldepartment"
            @change="cascaderChange"
          ></el-cascader>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.name" placeholder="角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getroles">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="roles"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="Id" label="角色Id" width="80"></el-table-column>
      <el-table-column prop="RoleName" label="角色名" width="150"></el-table-column>
      <el-table-column prop="Description" label="说明" width="150"></el-table-column>
      <el-table-column prop="AddDateTime" label="创建时间" width="120" :formatter="formatCreateTime"></el-table-column>
      <!--<el-table-column prop="CreateBy" label="创建者" width="" sortable>-->
      <!--</el-table-column>-->
      <el-table-column prop="RsState" label="状态" width="100" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.RsState===1  ? 'success' : 'danger'"
            disable-transitions
          >{{ getstatetext(scope.row.RsState)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="handleMenu(scope.$index, scope.row)">设置权限</el-button>
          <el-button size="small" @click="diaplaySetUpUser(scope.$index, scope.row)">设置员工</el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-pagination
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="50"
        :total="total"
        style="float:right;"
      ></el-pagination>
    </el-col>

    <!--编辑界面-->
    <el-dialog
      title="编辑"
      :visible.sync="editFormVisible"
      v-model="editFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item label="角色名" prop="RoleName">
          <el-input v-model="editForm.RoleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="Description">
          <el-input v-model="editForm.Description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="RsState">
          <el-select v-model="editForm.RsState" placeholder="请选择角色状态">
            <el-option
              v-for="item in statelt"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--新增界面-->
    <el-dialog
      title="新增"
      :visible.sync="addFormVisible"
      v-model="addFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="角色名" prop="RoleName">
          <el-input v-model="addForm.RoleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="Description">
          <el-input v-model="addForm.Description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="RsState">
          <el-select v-model="addForm.RsState" placeholder="请选择角色状态">
            <el-option
              v-for="item in statelt"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>

    <!--设置员工界面-->
    <el-dialog
      title="编辑"
      :visible.sync="userdialogVisible"
      v-model="userdialogVisible"
      :close-on-click-modal="false"
    >
      <el-form :inline="true" :model="userForm" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="userForm.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getuserlist">查询</el-button>
        </el-form-item>
      </el-form>
      <!--列表-->
      <el-table
        :data="userlist"
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleMulUser"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" width="80"></el-table-column>
        <el-table-column prop="ID" label="用户Id" width sortable></el-table-column>
        <el-table-column prop="UserName" label="用户名" width sortable></el-table-column>
        <el-table-column prop="NickName" label="昵称" width sortable></el-table-column>

        <el-table-column prop="DepartmentId" label="是否在角色内" width="200" sortable>
          <template slot-scope="scope">{{ scope.row.RoleId===0 ? '否' : '是'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="addOneUserToRole(scope.$index, scope.row)">加入</el-button>
            <el-button
              type="danger"
              size="small"
              @click="romveOneUserToRole(scope.$index, scope.row)"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button size="small" @click="batchAddOneUserToRole">批量添加</el-button>
        <el-button type="danger" @click="batchRemoveOneUserToRole">批量移除</el-button>
      </div>
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-pagination
          layout="prev, pager, next"
          @current-change="handleUserListChange"
          :page-size="pagesize"
          :total="userlisttotal"
          style="float:right;"
        ></el-pagination>
      </el-col>
    </el-dialog>

    <!--权限设置界面-->
    <el-dialog
      title="设置权限"
      :visible.sync="menuFormVisible"
      v-model="menuFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="menuForm" label-width="80px" ref="menuForm">
        <el-form-item label="权限">
          <el-tree
            :data="menuForm.allnodes"
            show-checkbox
            node-key="id"
            ref="tree"
            default-expand-all
            :default-checked-keys="menuForm.selectednodes"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="menuFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="menusubmit" :loading="menuLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import moment from "moment";
import {
  GetRoleList,
  InsertRole,
  DeleteRoleByRoleId,
  UpdateRole
} from "@/api/role";
import { GetDepartmentAndSubDepartmentForCurrentUser } from "@/api/department";
import { statelist, stateText } from "@/api/commonfun";
import {
  GetMenuTreeForCurrentUserByDeparentId,
  ModifyMentForRole
} from "@/api/menu";
import { GetUsersRefRole } from "@/api/user";
import { RemoveUserFromRole, AddUserForRole } from "@/api/role";
export default {
  data() {
    return {
      filters: {
        name: ""
      },
      statelt: {},
      departmentoptions: [],
      seldepartment: [],
      departmentid: -1,
      roles: [],
      total: 0,
      page: 1,
      pagesize: 10,
      listLoading: false,
      sels: [], //列表选中列

      addDialogFormVisible: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        RoleName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      },
      //编辑界面数据
      editForm: {
        Id: 0,
        RoleName: "",
        Description: "",
        RsState: 1
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        RoleName: [{ required: true, message: "请输入登录名", trigger: "blur" }]
      },
      //新增界面数据
      addForm: {
        RoleName: "",
        Description: "",
        RsState: "",
        DepartmentId: -1
      },
      modifyRoleId: 0,
      menuLoading: false,
      menuFormVisible: false, //权限对话框
      menuForm: {
        allnodes: [],
        selectednodes: []
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      userdialogVisible: false,
      userForm: {
        name: "",
        RoleId: 0
      },
      userlist:[],
      mulselectedusers: [],
      userlisttotal: 0
    };
  },
  methods: {
    formatCreateTime(row, column) {
      let datetime = row.AddDateTime;
      if (datetime) {
        return moment(datetime).format("YYYY-MM-DD HH-mm");
      }
      return "";
    },
    //获取部门列表
    getdepartmentlist() {
      let para = {
        Page: { PageIndex: this.page, PageSize: this.pagesize }
      };
      this.listLoading = true;
      GetDepartmentAndSubDepartmentForCurrentUser(para).then(res => {
        this.listLoading = false;
        if (res.Code === 0) {
          this.departmentoptions = res.Data;

          if (this.departmentoptions.length > 0) {
            this.departmentid = this.departmentoptions[0].value;
            this.seldepartment = [this.departmentoptions[0].value];
            this.getroles();
          }
        } else {
          message({
            message: "获取部门失败",
            type: "warning"
          });
        }
      });
    },
    //选择部门
    cascaderChange(val) {
      this.departmentid = val[val.length - 1];

      this.getroles();
    },
    getstatetext(val) {
      return stateText(val);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getroles();
    },
    //获取角色列表
    getroles() {
      let para = {
        Page: { PageIndex: this.page, PageSize: this.pagesize },
        DepartmentId: this.departmentid || -1,
        RoleName: this.filters.name
      };
      this.listLoading = true;
      GetRoleList(para).then(res => {
        this.listLoading = false;
        if (res.Code === 0) {
          this.total = res.Data.Total;
          this.roles = res.Data.Result;
        } else {
          message({
            message: "获取列表失败",
            type: "warning"
          });
        }
      });
    },
    //删除
    handleDel: function(index, row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.NProgress.start();
          let para = { Id: row.Id };
          DeleteRoleByRoleId(para).then(res => {
            this.NProgress.done();
            if (res.Code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.Errors.join("  "),
                type: "error"
              });
            }

            this.getroles();
          });
        })
        .catch(() => {});
    },

    //显示权限编辑界面
    handleMenu: function(index, row) {
      this.modifyRoleId = row.Id;
      let para = { roleId: row.Id, departmentId: this.departmentid };
      GetMenuTreeForCurrentUserByDeparentId(para)
        .then(res => {
          this.NProgress.done();
          if (res.Code === 0) {
            this.menuForm.allnodes = res.Data.AllNodes;
            this.menuForm.selectednodes = res.Data.SelectedNodes;

            this.menuFormVisible = true;
          } else {
            this.$message({
              message: res.Errors.join("  "),
              type: "error"
            });
          }
        })
        .catch(() => {
          this.$message({
            message: "获取权限失败",
            type: "error"
          });
        });
    },

    //显示编辑界面
    handleEdit: function(index, row) {
      this.statelt = statelist();
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面
    handleAdd() {
      this.statelt = statelist();
      this.addFormVisible = true;
      this.addForm = {
        id: 0,
        RoleName: "",
        Description: "",
        RsState: 1,
        DepartmentId: this.departmentid
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.NProgress.start();

            let para = Object.assign({}, this.editForm);
            UpdateRole(para).then(res => {
              this.NProgress.done();
              if (res.Code === 0) {
                this.editFormVisible = false;
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.getroles();
              } else {
                this.$message({
                  message: res.Errors.join("  "),
                  type: "error"
                });
              }
            });
          });
        }
      });
    },
    //新增
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.addLoading = true;
            //NProgress.start();
            let para = Object.assign({}, this.addForm);
            InsertRole(para)
              .then(res => {
                this.addLoading = false;
                if (res.Code === 0) {
                  this.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  this.$refs["addForm"].resetFields();
                  this.addFormVisible = false;
                  this.getroles();
                } else {
                  this.$message({
                    message: res.Errors.join("  "),
                    type: "error"
                  });
                }
              })
              .catch(error => {
                this.addLoading = false;
                console.log(error);
              });
          });
        } else {
          return false;
        }
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    //编辑权限
    menusubmit: function() {
      this.$confirm("确认提交吗？", "提示", {}).then(() => {
        this.NProgress.start();
        let selcheckedIds = this.$refs.tree
          .getCheckedKeys()
          .concat(this.$refs.tree.getHalfCheckedKeys());
        let para = { RoleId: this.modifyRoleId, MenuIds: selcheckedIds };
        ModifyMentForRole(para).then(res => {
          this.NProgress.done();
          if (res.Code === 0) {
            this.menuFormVisible = false;
            this.$message({
              message: "操作成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.Errors.join("  "),
              type: "error"
            });
          }
        });
      });
    },
    getuserlist: function() {
      let para = {
        Page: { PageIndex: this.page, PageSize: this.pagesize },
        Name: this.userForm.name,
        RoleId: this.userForm.RoleId
      };
      GetUsersRefRole(para).then(res => {
        if (res.Code === 0) {
          this.userlist = res.Data.Result;
          this.userlisttotal = res.Data.Total;
        } else {
          message({
            message: "获取角色中用户失败",
            type: "warning"
          });
        }
      });
    },
    //多选用户
    handleMulUser: function(val) {
      this.mulselectedusers = val;
    },


    //用户表分页
    handleUserListChange: function(val) {
      this.page = val;
      this.getuserlist();
    },
    diaplaySetUpUser: function(index, row) {
      this.userdialogVisible = true;
      this.userForm.RoleId = row.Id;
      this.userForm.name = "";
      this.getuserlist();
    },
    //批量用户添加带处理
    addUserToRole: function(val) {
      this.$confirm("确认添加该用户吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.NProgress.start();

          let para = { UserIds: val, RoleId: this.userForm.RoleId };

          AddUserForRole(para).then(res => {
            this.NProgress.done();
            if (res.Code === 0) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.Errors.join("  "),
                type: "error"
              });
            }

            this.getuserlist();
          });
        })
        .catch(() => {});
    },
    removeUserFromRole: function(val) {
      this.$confirm("确认移除该用户吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.NProgress.start();
             let para = { UserIds: val, RoleId: this.userForm.RoleId };

          RemoveUserFromRole(para).then(res => {
            this.NProgress.done();
            if (res.Code === 0) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.Errors.join("  "),
                type: "error"
              });
            }

            this.getuserlist();
          });
        })
        .catch(() => {});
    },
    romveOneUserToRole: function(index, row) {
      let userids = [row.ID];
      this.removeUserFromRole(userids);
    },
    addOneUserToRole: function(index, row) {
      let userids = [row.ID];
      this.addUserToRole(userids);
    },
    //批量移出角色中的用户
    batchRemoveOneUserToRole: function() {
      if (this.mulselectedusers == null || this.mulselectedusers.length === 0) {
        this.$message({
          message: "请先选择用户",
          type: "warn"
        });
      } else {
        let Enumerable = require("linq");
        let userids = Enumerable.from(this.mulselectedusers)
          .select(x => x.ID)
          .toArray();
        this.mulselectedusers=[];
        this.romveOneUserToRole(userids);
      }
    },
    // 批量添加用户到角色
    batchAddOneUserToRole: function() {
      if (this.mulselectedusers == null || this.mulselectedusers.length === 0) {
        this.$message({
          message: "请先选择用户",
          type: "warn"
        });
      } else {
        let Enumerable = require("linq");
        let userids = Enumerable.from(this.mulselectedusers)
          .select(x => x.ID)
          .toArray();
        this.mulselectedusers=[];
        this.addUserToRole(userids);
      }
    }
  },
  mounted() {
    this.getdepartmentlist();
  }
};
</script>
