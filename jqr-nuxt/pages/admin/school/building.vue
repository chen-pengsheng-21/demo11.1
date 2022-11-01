<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my"
              >{{ userinfo ? userinfo.userType : "" }}中心</a
            ></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/admin/school/building">建筑管理</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo ? userinfo.userName : "" }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school ? school.schoolName : "" }}</div>
      </div>
    </el-header>
    <el-main>
      <div class="table-bars">
        <el-button type="danger" icon="el-icon-plus" @click="toAdd"
          >添加</el-button
        >
      </div>
      <el-table :data="buildings" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="name" label="建筑"> </el-table-column>
        <el-table-column prop="chager" label="楼管" width="200">
          <template slot-scope="scope">
            <el-select
              v-model="buildings[scope.$index]['chager']"
              placeholder="请选择"
            >
              <el-option
                v-for="item in chagers"
                :key="item.id"
                :label="item.userName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button type="text" size="small" @click="del(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <template slot="empty">
          <el-empty :image-size="60"></el-empty>
        </template>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page.current"
        :page-size="page.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
      >
      </el-pagination>
    </el-main>
    <el-dialog title="建筑编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="building" ref="form" :rules="rules" status-icon>
        <el-form-item label="建筑" prop="name" :label-width="formLabelWidth">
          <el-input
            v-model="building.name"
            autocomplete="off"
            placeholder="请输入建筑名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="楼管" prop="chager" :label-width="formLabelWidth">
          <el-select v-model="building.chager" placeholder="请选择">
            <el-option
              v-for="item in chagers"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  layout: "my",
  data() {
    return {
      formLabelWidth: "100px",
      dialogFormVisible: false,
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      sch: {},
      buildings: [],
      building: {
        id: 0,
        name: "",
        schoolId: "",
        chager: "",
      },
      chagers: [],
      rules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        schoolId: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school"]),
  },
  created() {
    if (process.client) {
      this.sch = this.school;
      this.getBuildingsBySchoolIdPage(1);
      this.getAssitantBySchoolId(this.school.id);
    }
  },
  methods: {
    async getBuildingsBySchoolIdPage(current) {
      let page = {
        current: current,
        size: 10,
        colums: ["id", "name", "chager", "school_id"],
        schoolId: this.school.id,
      };
      let res = await this.$axios({
        url: "/api/building/getBuildingsBySchoolIdPage",
        method: "post",
        data: page,
      });
      if (res.success) {
        let page = res.data.page;
        this.buildings = page.records;
        this.page = page;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    async getBuilding(id) {
      let res = await this.$axios({
        url: "/api/building/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.building = res.data.building;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    //查询后勤人员
    async getAssitantBySchoolId(schoolId) {
      //userType:后勤人员
      let res = await this.$axios({
        url: "/api/userinfo/assitant",
        params: {
          userType: "后勤",
          schoolId: schoolId,
        },
      });
      if (res.success) {
        this.chagers = res.data.userinfos;
      } else {
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    handleCurrentChange(current) {
      this.page.current = current;
      this.getBuildingsPage(current);
    },
    toAdd() {
      let building = {
        id: 0,
        name: "",
        schoolId: "",
        chager: "",
      };
      this.building = building;
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    toEdit(id) {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.getBuilding(id);
    },
    del(id) {},
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.building.id == 0) {
            this.$axios({
              url: "/api/building/add",
              method: "post",
              data: this.building,
            })
              .then((res) => {
                if (res.success) {
                  this.getBuildingsPage(this.page.current);
                  this.dialogFormVisible = false;
                } else {
                  this.$message({
                    message: res.msg,
                    center: true,
                  });
                  return false;
                }
              })
              .catch((err) => {
                this.$message({
                  message: err,
                  center: true,
                });
                this.dialogFormVisible = false;
                return false;
              });
          } else {
            this.$axios({
              url: "/api/building/edit",
              method: "post",
              data: this.building,
            })
              .then((res) => {
                if (res.success) {
                  this.getBuildingsPage(this.page.current);
                  this.dialogFormVisible = false;
                } else {
                  this.$message({
                    message: res.msg,
                    center: true,
                  });
                  return false;
                }
              })
              .catch((err) => {
                this.$message({
                  message: err,
                  center: true,
                });
                this.dialogFormVisible = false;
                return false;
              });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>