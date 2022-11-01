<template>
  <div class="jqr-width-100">
    <el-header class="header">
      <div class="header-breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item
            ><a href="/my">{{ userinfo? userinfo.userType:'' }}中心</a></el-breadcrumb-item
          >
          <el-breadcrumb-item
            ><a href="/admin/school">学校管理</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ userinfo? userinfo.userName:'' }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{school?school.schoolName:''}}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="table-bars">
        <el-button type="danger" icon="el-icon-plus" @click="toAdd">添加</el-button>
      </div>
      <el-table :data="schools" border style="width: 100%">
        <el-table-column fixed prop="id" label="#" width="50">
        </el-table-column>
        <el-table-column prop="schoolName" label="学校"> </el-table-column>
        <el-table-column prop="province" label="省份" width="120">
        </el-table-column>
        <el-table-column prop="city" label="市区" width="120">
        </el-table-column>
        <el-table-column prop="area" label="市区|县" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
        <el-table-column prop="enable" label="激活" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.enable == "1" ? "启用" : "未启用" }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button @click="toAdd" type="text" size="small">添加</el-button>
            <el-button type="text" size="small" @click="toEdit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <el-dialog title="学校编辑" width="60%" :visible.sync="dialogFormVisible">
      <el-form :model="school" ref="form" :rules="rules" status-icon>
        <el-form-item
          label="学校"
          prop="schoolName"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="school.schoolName"
            autocomplete="off"
            placeholder="请输入学校"
          ></el-input>
        </el-form-item>
        <el-form-item label="区域" :label-width="formLabelWidth">
          <el-col :span="span">
            <el-form-item prop="province">
              <el-select
                v-model="school.province"
                placeholder="请选择省"
                @change="selectProvince"
              >
                <el-option
                  v-for="item in provinces"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item prop="city">
              <el-select
                v-model="school.city"
                placeholder="请选择市"
                @change="selectCity"
              >
                <el-option
                  v-for="item in citys"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="span">
            <el-form-item prop="area">
              <el-select v-model="school.area" placeholder="请选择县区">
                <el-option
                  v-for="item in areas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
          <el-input
            v-model="school.address"
            autocomplete="off"
            placeholder="请输入你的地址,精确到街道社区小区"
          ></el-input>
        </el-form-item>
        <el-form-item label="经纬度" :label-width="formLabelWidth">
          <el-col :span="span">
            <el-form-item prop="latitude">
              <el-input
                v-model="school.latitude"
                autocomplete="off"
                placeholder="请输入经度"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item prop="longitude">
              <el-input
                v-model="school.longitude"
                autocomplete="off"
                placeholder="请输入纬度"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <a
              href="https://api.map.baidu.com/lbsapi/getpoint/index.html"
              target="_blank"
              >获取经纬度帮助</a
            >
          </el-col>
        </el-form-item>
        <el-form-item
          label="描述"
          prop="description"
          :label-width="formLabelWidth"
        >
          <no-ssr>
            <mavon-editor
              :toolbars="markdownOption"
              :placeholder="handbook"
              v-model="school.description"
              ref="md"
            />
          </no-ssr>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">编辑</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
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

      sch:{},
      schools: [],
      school: {
        id: 0,
        schoolName: "",
        province: "",
        city: "",
        area: "",
        address: "",
        description: "",
        latitude: "",
        longitude: "",
      },
      dialogFormVisible: false,
      formLabelWidth: "80px",
      span: 8,
      provinces: [],
      citys: [],
      areas: [],
      handbook: "#### 你在岁月静好,我在负重前行",
      rules: {
        schoolName: [{ required: true, message: "必填项", trigger: "blur" }],
        province: [{ required: true, message: "必填项", trigger: "blur" }],
        city: [{ required: true, message: "必填项", trigger: "blur" }],
        area: [{ required: true, message: "必填项", trigger: "blur" }],
        address: [{ required: true, message: "必填项", trigger: "blur" }],
        latitude: [{ required: true, message: "必填项", trigger: "blur" }],
        longitude: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "markdownOption",'school']),
  },
  created() {
    if (process.client) {
 
      this.sch=this.school;
      this.getSchools();
      this.getProvinces();
    }
  },
  methods: {
    getSchools() {
      this.$axios({
        url: "/api/school/all",
        methods: "get",
      })
        .then((res) => {
          if (res.success) {
            this.schools = res.data.schools;
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
          return false;
        });
    },
    getProvinces() {
      this.$axios({
        url: "/api/region/pid",
        methods: "get",
      })
        .then((res) => {
          if (res.success) {
            this.provinces = res.data.regions;
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
          return false;
        });
    },
    selectProvince(id) {
      this.$axios({
        url: "/api/region/pid?pid=" + id,
        methods: "get",
      })
        .then((res) => {
          if (res.success) {
            this.citys = res.data.regions;
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
          return false;
        });
    },
    selectCity(id) {
      this.$axios({
        url: "/api/region/pid?pid=" + id,
        methods: "get",
      })
        .then((res) => {
          if (res.success) {
            this.areas = res.data.regions;
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
          return false;
        });
    },
    toAdd() {
      let school = {
        id: 0,
        schoolName: "",
        province: "",
        city: "",
        area: "",
        address: "",
        description: "",
        latitude: "",
        longitude: "",
      };
      this.dialogFormVisible = !this.dialogFormVisible;
      this.school = school;
    },
    toEdit(row) {
      this.dialogFormVisible = !this.dialogFormVisible;
      console.log(row);
      let school = this.$lodash.cloneDeep(row);
      this.school = school;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.school.id == 0) {
            this.$axios({
              url: "/api/school/add",
              method: "post",
              data: this.school,
            })
              .then((res) => {
                if (res.success) {
                  this.schools.push(this.school);
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
              url: "/api/school/edit",
              method: "post",
              data: this.school,
            })
              .then((res) => {
                if (res.success) {
                  this.schools.forEach((element) => {
                    element.id = this.school.id;
                    element = this.school;
                  });
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    description(value) {
      return value;
    },
  },
  watch: {
    "school.description": {
      handler(newDesc, oldDesc) {
        console.log(newDesc, oldDesc);
        if (newDesc === null) {
          this.school.description = "";
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
</style>