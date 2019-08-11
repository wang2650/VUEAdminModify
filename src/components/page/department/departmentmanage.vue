<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-form-item label="部门">
          <el-select v-model="departmentid" placeholder="请选择部门" @change="departmentSel">
            <el-option
              v-for="item in departments"
              :key="item.Id"
              :label="item.DepartmentName"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filters.name" placeholder="部门名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="departmentslt"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column prop="Id" label="部门Id" width="80"></el-table-column>
      <el-table-column prop="DepartmentName" label="部门名" width="150"></el-table-column>
      <el-table-column prop="Description" label="说明" width="150"></el-table-column>
      <el-table-column prop="AddDateTime" label="创建时间" :formatter="formatCreateTime" width="150"></el-table-column>
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
        <el-form-item label="部门名" prop="DepartmentName">
          <el-input v-model="editForm.DepartmentName" auto-complete="off"></el-input>
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
        <el-form-item label="部门名" prop="DepartmentName">
          <el-input v-model="addForm.DepartmentName" auto-complete="off"></el-input>
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

        <el-table-column prop="DepartmentId" label="是否在部门内" width="200" sortable>
          <template slot-scope="scope">{{ scope.row.DepartmentId===0 ? '否' : '是'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template scope="scope">
            <el-button size="small" @click="addOneUserToDepartment(scope.$index, scope.row)">加入</el-button>
            <el-button
              type="danger"
              size="small"
              @click="romveOneUserToDepartment(scope.$index, scope.row)"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button size="small" @click="batchAddOneUserToDepartment">批量添加</el-button>
        <el-button type="danger" @click="batchRemoveOneUserToDepartment">批量移除</el-button>
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
  </section>
</template>

<script>
import moment from "moment";
import {
  GetDepartmentListForCurrentUser,
  InsertDepartment,
  UpdateDepartment,
  DeleteDepartmentByDepartmentId,
  GetDepartmentList,
  AddUserForDepartment,
  RemoveUserForDepartment
} from "@/api/department";
import { statelist, stateText } from "@/api/commonfun";
import { GetUsersRefDepartment } from "@/api/user";
export default {
  data() {
    return {
      filters: {
        name: ""
      },
      statelt: {},
      departments: [], //下拉框中的部门列表
      departmentslt: [], //列表中的部门数组
      departmentid: -1,
      total: 0,
      page: 1,
      pagesize: 5,
      listLoading: false,
      sels: [], //列表选中列

      addDialogFormVisible: false,
      editFormVisible: false, //编辑界面是否显示
      editLoading: false,
      editFormRules: {
        DepartmentName: [
          { required: true, message: "请输入部门名", trigger: "blur" }
        ]
      },
      //编辑界面数据
      editForm: {
        DepartmentId: 0,
        ParentId: 0,
        DepartmentName: "",
        Description: "",
        RsState: 1
      },

      addFormVisible: false, //新增界面是否显示
      addLoading: false,
      addFormRules: {
        DepartmentName: [
          { required: true, message: "请输入部门名", trigger: "blur" }
        ]
      },
      //新增界面数据
      addForm: {
        DepartmentName: "",
        Description: "",
        RsState: "",
        DepartmentId: -1
      },
      userdialogVisible: false,
      userForm: {
        name: "",
        departmentId: 0
      },
      mulselectedusers: [],
      userlist: [],
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
    //获取下拉列表的部门
    getdepartmentlist() {
      let para = {
        Page: { PageIndex: this.page, PageSize: this.pagesize }
      };
      this.listLoading = true;
      GetDepartmentListForCurrentUser(para).then(res => {
        this.listLoading = false;
        if (res.Code === 0) {
          this.departments = res.Data.Result;

          if (this.departments.length > 0) {
            this.departmentid = this.departments[0].Id;
            this.departmentSel();
          }
        } else {
          message({
            message: "获取部门失败",
            type: "warning"
          });
        }
      });
    },
    departmentSel() {
      this.getList();
    },
    getstatetext(val) {
      return stateText(val);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    //获取部门列表
    getList() {
      let para = {
        Page: { PageIndex: this.page, PageSize: this.pagesize },
        ParentId: this.departmentid || -1,
        DepartmentName: this.filters.name
      };
      this.listLoading = true;
      GetDepartmentList(para).then(res => {
        this.listLoading = false;
        if (res.Code === 0) {
          this.total = res.Data.Total;
          this.departmentslt = res.Data.Result;
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
          let para = { DepartmentId: row.Id };

          DeleteDepartmentByDepartmentId(para).then(res => {
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

            this.getList();
          });
        })
        .catch(() => {});
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
        DepartmentName: "",
        Description: "",
        RsState: 1,
        ParentId: this.departmentid
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.NProgress.start();

            let para = Object.assign({}, this.editForm);
            UpdateDepartment(para).then(res => {
              this.NProgress.done();
              if (res.Code === 0) {
                this.editFormVisible = false;
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.getList();
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
            InsertDepartment(para)
              .then(res => {
                this.addLoading = false;
                if (res.Code === 0) {
                  this.$message({
                    message: "操作成功",
                    type: "success"
                  });
                  this.$refs["addForm"].resetFields();
                  this.addFormVisible = false;
                  this.getList();
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
    diaplaySetUpUser: function(index, row) {
      this.userdialogVisible = true;
      this.userForm.departmentId = row.Id;
      this.userForm.name = "";
      this.getuserlist();
    },
    handleUserListChange: function(val) {
      this.page = val;
      this.getuserlist();
    },
    //多选用户
    handleMulUser: function(val) {
      this.mulselectedusers = val;
    },
    getuserlist: function() {
      let para = {
        Page: { PageIndex: this.page, PageSize: this.pagesize },
        Name: this.userForm.name,
        departmentId: this.userForm.departmentId
      };
      GetUsersRefDepartment(para).then(res => {
        if (res.Code === 0) {
          this.userlist = res.Data.Result;
          this.userlisttotal = res.Data.Total;
        } else {
          message({
            message: "获取部门失败",
            type: "warning"
          });
        }
      });
    },
    //批量添加用户到部门
    batchAddOneUserToDepartment: function() {
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

        this.addUserToDepartment(userids);
      }
    },
    //添加一个用户到部门
    addOneUserToDepartment: function(index, row) {
      let userids = [row.ID];
      this.addUserToDepartment(userids);
    },
    //批量移出部门中的用户
    batchRemoveOneUserToDepartment: function() {
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

        this.removeUserToDepartment(userids);
      }
    },
    //移出部门中的单个用户
    romveOneUserToDepartment: function(index, row) {
      let userids = [row.ID];
      this.removeUserToDepartment(userids);
    },
    // 添加用户到部门
    addUserToDepartment: function(val) {
      this.$confirm("确认添加该用户吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.NProgress.start();

          let para = { UserIds: val, DepartmentId: this.userForm.departmentId };

          AddUserForDepartment(para).then(res => {
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
    //从部门中移除用户
    removeUserToDepartment: function(val) {
      this.$confirm("确认移除该用户吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.NProgress.start();
          let para = { UserIds: val, DepartmentId: this.userForm.departmentId };

          RemoveUserForDepartment(para).then(res => {
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
    }
  },
  mounted() {
    this.getdepartmentlist();
  }
};
</script>
