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
        <el-table-column prop="Id" label="角色Id" width sortable></el-table-column>
      <el-table-column prop="RoleName" label="角色名" width sortable></el-table-column>
      <el-table-column prop="Description" label="说明" width sortable></el-table-column>
      <el-table-column prop="AddDateTime" label="创建时间" :formatter="formatCreateTime" width sortable></el-table-column>
      <!--<el-table-column prop="CreateBy" label="创建者" width="" sortable>-->
      <!--</el-table-column>-->
      <el-table-column prop="RsState" label="状态" width="200" sortable>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.RsState===1  ? 'success' : 'danger'"
            disable-transitions
          >{{ getstatetext(scope.row.RsState)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template scope="scope">
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
import { GetDepartmentListForCurrentUser } from "@/api/department";
import { statelist,stateText } from "@/api/commonfun";

export default {
  data() {
    return {
      filters: {
        name: ""
      },
      statelt: {},
      departments: [],
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
        RsState: '',
        DepartmentId:-1
      }
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
    //获取用户列表
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
      this.getroles();
    },
    getstatetext(val){
      return stateText(val)
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
          this.listLoading = true;
          //NProgress.start();
          let para = { RoleId: row.ID };
          DeleteRoleByRoleId(para).then(res => {
            this.listLoading = false;
            //NProgress.done();
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
    //显示编辑界面
    handleEdit: function(index, row) {
        this.editForm.RoleId=row.Id;
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
        DepartmentId:this.departmentid
      };
    },
    //编辑
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗？", "提示", {}).then(() => {
            this.editLoading = true;
            //NProgress.start();

            let para = Object.assign({}, this.editForm);
            UpdateRole(para).then(res => {
              this.editLoading = false;
              if (res.Code === 0) {
                //NProgress.done();
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.$refs["editForm"].resetFields();
                this.editFormVisible = false;
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
    }
  },
  mounted() {
  
    this.getdepartmentlist();
  }
};
</script>
