<template>
  <div>
    <el-container>
      <el-header class="header">
        <div class="header-logo">
          <a href="/" class="home">
            <img src="/logo.png" alt="微校园" srcset="" />
            <div class="header-slogn">微校园<span>为教师和学生提供助力的平台</span></div>
          </a>
        </div>
        <el-menu
          :default-active="activeIndex"
          class="header-menu"
          mode="horizontal"
          router
        >
          <el-menu-item index="1" route="/">首页</el-menu-item>
          <el-menu-item index="2" route="/static/interview"
            >面试宝典</el-menu-item
          >
          <el-menu-item index="3" disabled>笔记中心</el-menu-item>
          <el-menu-item index="4" route="/static/competition"
            >竞赛中心</el-menu-item
          >
          <!-- <el-submenu index="3" disabled>
            <template slot="title">我的工作台</template>
            <el-menu-item index="3-1">选项1</el-menu-item>
            <el-menu-item index="3-2">选项2</el-menu-item>
            <el-menu-item index="3-3">选项3</el-menu-item>
            <el-submenu index="3-4">
              <template slot="title">选项4</template>
              <el-menu-item index="3-4-1">选项1</el-menu-item>
              <el-menu-item index="3-4-2">选项2</el-menu-item>
              <el-menu-item index="3-4-3">选项3</el-menu-item>
            </el-submenu>
          </el-submenu> -->
          <el-menu-item index="5" disabled>消息中心</el-menu-item>
          <el-menu-item>
            <a href="javascript:;" v-show="token">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  用户中心<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="my">用户中心</el-dropdown-item>
                  <el-dropdown-item command="out">退出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </a>
            <a href="/login" v-show="!token">登录</a>
          </el-menu-item>
          <el-menu-item>
            <span>{{ school ? school.schoolName : "" }}</span>
            <a href="#" @click="dialogschoolVisible = !dialogschoolVisible"
              ><i class="el-icon-location"></i
            ></a>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main class="main">
        <nuxt keep-alive:keep-alive-props="{ include: pages}"  />
      </el-main>
      <!-- <el-footer class="footer">Footer</el-footer> -->
      <div class="footer">
        <p>
          @copyright 泉州信息工程学院软件学院版权所有;备案号：<a
            href="https://beian.miit.gov.cn/"
            >闽ICP备15012317号-4</a
          >;投诉建议：414090297@qq.competition
        </p>
      </div>
    </el-container>

    <el-dialog
      title="选择学校"
      :visible.sync="dialogschoolVisible"
      :close-on-press-escape="false"
      width="40%"
    >
      <el-form ref="sch" :model="sch" label-width="80px" :rules="rules">
        <el-form-item label="选择地域">
          <el-col :span="8">
            <el-form-item prop="province">
              <el-select
                v-model="sch.province"
                placeholder="请选择省|直辖市"
                @change="changprovice"
              >
                <el-option
                  v-for="item in provinces"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id + '-' + item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="8">
            <el-form-item prop="city">
              <el-select
                v-model="sch.city"
                placeholder="请选择地区市|直辖市辖区"
                @change="changeCity"
              >
                <el-option
                  v-for="item in citys"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id + '-' + item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="county">
              <el-select
                v-model="sch.area"
                placeholder="请选择县|县级市|市辖区"
                @change="changeArea"
              >
                <el-option
                  v-for="item in areas"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item prop="schoolName" label="选择学校">
          <el-select v-model="sch.schoolName" placeholder="请选择学校">
            <el-option
              v-for="item in schools"
              :key="item.id"
              :label="item.schoolName"
              :value="item.schoolName"
              @change="changeSchool"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('sch')">确定</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { mapState,mapMutations } from "vuex";
export default {
  data() {
    return {
      pages:[
        'index','static-competition','static-interview'
      ],
      activeIndex: "1",
      dialogschoolVisible: false,
      sch: {
        province: "",
        city: "",
        county: "",
        latitude: "24.942463",
        longitude: "118.583885",
        schoolName: "",
      },
      provinces: [],
      citys: [],
      areas: [],
      schools: [],
      rules: {
        province: [
          {
            required: true,
            message: "请选择省、直辖市、自治区",
            trigger: "blur",
          },
        ],
        city: [
          { required: true, message: "请选择地区市、市辖区", trigger: "blur" },
        ],
        county: [
          { required: true, message: "请选择县、市辖区", trigger: "blur" },
        ],
        schoolName: [
          { required: true, message: "请选择学校", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState(["school", "token"]),
  },
  created() {
    if (process.client) {
      //this.sch=this.$lodash.cloneDeep(this.school);//需要深拷贝 ,否则会出现do not mutate vuex store state outside mutation handlers.
      //this.sch=this.school;//对象是引用值，对sch这个对象进行操作，也就是对school对象进行操作
      this.getProvices();
    }
  },
  methods: {
    ...mapMutations(['setSchool','setUserinfo','setToken','setMenus','setStudent','setTeacher']),
    handleCommand(command) {
      switch (command) {
        case "my":
          this.$router.push("/my");
          break;
        case "out":
          this.setUserinfo(undefined);
          this.setToken(undefined);
          this.setMenus(undefined);
          this.setTeacher(undefined);
          this.setStudent(undefined);
          // this.$store.commit("setUserinfo", undefined);
          // this.$store.commit("setToken", undefined);
          // this.$store.commit("setMenus", undefined);
          break;
        default:
          break;
      }
    },
    async getProvices() {
      let res = await this.$axios({
        url: "api/region/pid",
      });
      if (res.success) {
        this.provinces = res.data.regions;
      }
      else{
        this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    changprovice(value) {
      let province = value.split("-")[1];
      this.sch.province = province;
      let id = value.split("-")[0];
      this.getCitys(id);
    },
    changeCity(value) {
      let city = value.split("-")[1];
      this.sch.city = city;
      let id = value.split("-")[0];
      this.getAreas(id);
    },
    async changeArea(area) {
      this.sch.county = area;
      let res = await this.$axios({
        url: "api/school/search",
        method: "post",
        data: this.sch,
      });
      if (res.success) {
        this.schools = res.data.schools;
      }
      else{
         this.$message({
          message: `${res.msg},没有合作学校`,
          center: true,
        });

        return false;
      }
    },
    async getCitys(id) {
      let res = await this.$axios({
        url: "api/region/pid",
        params: {
          pid: id,
        },
      });
      if (res.success) {
        this.citys = res.data.regions;
      }
      else{
         this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },
    async getAreas(id) {
      let res = await this.$axios({
        url: "api/region/pid",
        params: {
          pid: id,
        },
      });
      if (res.success) {
        this.areas = res.data.regions;
      }
      else{
         this.$message({
          message: res.msg,
          center: true,
        });

        return false;
      }
    },

    async changeSchool(schoolName){
      console.log(schoolName);
      this.schools.forEach(item=>{
        if(item.schoolName==schoolName){
            this.sch=item;
        }
      })

    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          this.setSchool(this.sch);
          this.dialogschoolVisible=false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  watch:{
    $route: {
        	// 是否首次执行(不懂去百度)
            immediate: true,
            // 它将根据一定的条件, 动态插入或删除要缓存的页面
            // to: 自己打印看一下, 路由相关参数(这个参数也是关键！！)
            handler(to) {
            
                //console.log(to)
                
               
            },
    }

  }
};
</script>
<style scoped>
html,
body {
  width: 100%;
  height: 100%;
}

.header {
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px #e6e6e6;
}
.header-logo {
  display: flex;
  align-items: center;
}

.header-logo img {
  height: 40px;
  height: 40px;
}
.header-logo .header-slogn {
  font-size: 24px;
  margin-left: 10px;
  color: #333;
  font-family: "Times New Roman", Times, serif;
}
.header-logo .home {
  display: flex;
  flex-direction: row;
  text-decoration: none;
  align-items: center;
}
.header-menu {
  border-bottom: 0;
}
.header-menu a {
  text-decoration: none;
}
.footer {
  width: 100%;
  position: fixed; 
  bottom: 0;
  left: 0; 
  background-color: #606266;
}
.footer p {
  display: flex;
  justify-content: center;
  color: white;
}
.footer a {
  color: white;
  text-decoration: none;
}
.header-slogn span{
  font-size: 8px;
  color: #c8c5c5;
  margin-left: 20px;
}
</style>