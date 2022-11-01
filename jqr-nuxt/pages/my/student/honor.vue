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
            ><a href="/my/teacher/honor">个人科研</a></el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div class="header-user">
        <div class="username">{{ student ? student.studentName : "" }}</div>
        <img class="img" src="/user.png" alt="" srcset="" />
        <div class="school">{{ school ? school.schoolName : "" }}</div>
      </div>
    </el-header>
    <el-main class="main">
      <div class="honor-list">
        <h3>我的科研</h3>
        <el-dropdown split-button type="primary" @command="handleCommand">
          创建
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="paper">论文 </el-dropdown-item>
            <el-dropdown-item command="patent">专利</el-dropdown-item>
            <el-dropdown-item command="copyright">软件著作权 </el-dropdown-item>
            <el-dropdown-item command="subject">科研课题</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="论文" name="first">
          <el-table :data="papers" border style="width: 100%">
            <el-table-column fixed prop="id" label="#" width="50">
            </el-table-column>
            <el-table-column prop="name" label="论文名称"> </el-table-column>
            <el-table-column prop="type" label="论文类型" width="100">
            </el-table-column>
            <el-table-column prop="publication" label="论文刊物">
            </el-table-column>
            <el-table-column
              prop="publicationCate"
              label="刊物种类"
              width="100"
            >
            </el-table-column>
            <el-table-column prop="publishTime" label="发布时间" width="100" >
             <template slot-scope="scope">{{
                  scope.row.publishTime | dateFormat
                }}</template>
            </el-table-column>
            <el-table-column prop="count" label="引用次数" width="100">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="toEdit('paper', scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="del('paper', scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <template slot="empty">
              <el-empty :image-size="60"></el-empty>
            </template>
          </el-table>
          <el-pagination
            @current-change="handlePaperCurrentChange"
            :current-page="pagePaper.current"
            :page-size="pagePaper.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagePaper.total"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="软件著作权" name="second">
          <el-table :data="copyrights" border style="width: 100%">
            <el-table-column fixed prop="id" label="#" width="50">
            </el-table-column>
            <el-table-column prop="name" label="著作权名称"> </el-table-column>
            <el-table-column prop="copyrightNo" label="著作权编号" width="150">
            </el-table-column>

            <el-table-column prop="finishTime" label="完成时间" width="100">
              <template slot-scope="scope">{{
                  scope.row.finishTime | dateFormat
                }}</template>
            </el-table-column>
            <el-table-column
              prop="publishTime"
              label="首次发表时间"
              width="150"
            >
            <template slot-scope="scope">{{
                  scope.row.publishTime | dateFormat
                }}</template>

            </el-table-column>

            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="toEdit('copyright', scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="del('copyright', scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <template slot="empty">
              <el-empty :image-size="60"></el-empty>
            </template>
          </el-table>
          <el-pagination
            @current-change="handleCopyrightCurrentChange"
            :current-page="pageCopyright.current"
            :page-size="pageCopyright.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageCopyright.total"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="科研课题" name="third">
          <el-table :data="subjects" border style="width: 100%">
            <el-table-column fixed prop="id" label="#" width="50">
            </el-table-column>
            <el-table-column prop="name" label="课题名称"> </el-table-column>
            <el-table-column prop="subjectNo" label="课题编号" width="100">
            </el-table-column>
            <el-table-column prop="type" label="课题类型" width="100">
            </el-table-column>
            <el-table-column prop="rank" label="课题等级" width="100">
            </el-table-column>
            <el-table-column prop="period" label="课题周期" width="150">
            </el-table-column>
            <el-table-column prop="origin" label="课题来源" width="100">
            </el-table-column>
            <el-table-column prop="fee" label="课题费用" width="100">
            </el-table-column>
            <el-table-column prop="participant" label="参与者" width="200">
            </el-table-column>
            <el-table-column prop="finished" label="结项" width="100">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="toEdit('subject', scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="del('subject', scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <template slot="empty">
              <el-empty :image-size="60"></el-empty>
            </template>
          </el-table>
          <el-pagination
            @current-change="handleSubjectCurrentChange"
            :current-page="pageSubject.current"
            :page-size="pageSubject.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageSubject.total"
          >
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="专利" name="fourth">
          <el-table :data="patents" border style="width: 100%">
            <el-table-column fixed prop="id" label="#" width="50">
            </el-table-column>
            <el-table-column prop="name" label="专利名称"> </el-table-column>
            <el-table-column prop="type" label="专利类型" width="100">
            </el-table-column>
            <el-table-column prop="empowerTime" label="授权时间" width="100">
               <template slot-scope="scope">{{
                  scope.row.empowerTime | dateFormat
                }}</template>

            </el-table-column>
           
            <el-table-column prop="patentNo" label="专利号" width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="toEdit('patent', scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="del('patent', scope.row.id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <template slot="empty">
              <el-empty :image-size="60"></el-empty>
            </template>
          </el-table>
          <el-pagination
            @current-change="handlePatentCurrentChange"
            :current-page="pagePatent.current"
            :page-size="pagePatent.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagePatent.total"
          >
          </el-pagination>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <!-- 论文编辑弹出框开始 -->
    <el-dialog
      title="论文编辑"
      width="80%"
      :visible.sync="dialogPaperFormVisible"
    >
      <el-form :model="paper" ref="paperForm" :rules="paperRules" status-icon>
        <el-form-item
          label="论文名称"
          prop="name"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="paper.name"
            autocomplete="off"
            placeholder="请输入论文名称"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="论文类型"
          prop="type"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="paper.type"
            autocomplete="off"
            placeholder="请输入论文类型：例如科技类，教改类，其他"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="论文刊物"
          prop="publication"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="paper.publication"
            autocomplete="off"
            placeholder="请输入论文刊物"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="刊物种类"
          prop="publicationCate"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="paper.publicationCate"
            autocomplete="off"
            placeholder="请输入论文刊物种类:核心期刊,国际会议,SCI,EI,本科学报"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="发表时间"
          prop="publishTime"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="paper.publishTime"
            type="date"
            placeholder="请输入论文发表时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="引用次数"
          prop="count"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="paper.count"
            autocomplete="off"
            placeholder="请输入论文引入次数"
          ></el-input>
        </el-form-item>
        <el-form-item label="佐证材料" :label-width="formLabelWidth">
          <el-col :span="0">
            <el-form-item prop="attachment">
              <el-input v-model="paper.attachment" type="hidden"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-upload
              action="#"
              ref="upload"
              :auto-upload="true"
              :limit="1"
              :on-success="onPaperSuccess"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选择文件</el-button
              >
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('paperForm')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 论文编辑弹出框结束-->

    <!-- 软件著作权编辑弹出框开始 -->
    <el-dialog
      title="软件著作权编辑"
      width="80%"
      :visible.sync="dialogCopyrightFormVisible"
    >
      <el-form
        :model="copyright"
        ref="copyrightForm"
        :rules="copyrightRules"
        status-icon
      >
        <el-form-item
          prop="name"
          label="著作权名称"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="copyright.name"
            autocomplete="off"
            placeholder="请输入著作权名称"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="著作权编号"
          prop="copyrightNo"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="copyright.copyrightNo"
            autocomplete="off"
            placeholder="请输入著作权编号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="完成时间"
          prop="finishTime"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="copyright.finishTime"
            type="date"
            placeholder="请输入著作权完成时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="发表时间"
          prop="publishTime"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="copyright.publishTime"
            type="date"
            placeholder="请输入首次发表时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="佐证材料" :label-width="formLabelWidth">
          <el-col :span="0">
            <el-form-item prop="attachment">
              <el-input v-model="copyright.attachment" type="hidden"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-upload
              action="#"
              ref="upload"
              :auto-upload="true"
              :limit="1"
              :on-success="onCopyrightSuccess"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选择文件</el-button
              >
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('copyrightForm')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 软件著作权编辑弹出框结束 -->

    <!-- 科研课题编辑弹出框开始 -->
    <el-dialog
      title="课题编辑"
      width="80%"
      :visible.sync="dialogSubjectFormVisible"
    >
      <el-form
        :model="subject"
        ref="subjectForm"
        :rules="subjectRules"
        status-icon
      >
        <el-form-item
          prop="name"
          label="课题名称"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="subject.name"
            autocomplete="off"
            placeholder="请输入课题名称"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="课题编号"
          prop="subjectNo"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="subject.subjectNo"
            autocomplete="off"
            placeholder="请输入课题编号"
          ></el-input>
        </el-form-item>
         <el-form-item
          label="课题来源"
          prop="origin"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="subject.origin"
            autocomplete="off"
            placeholder="请输入课题来源"
          ></el-input>
        </el-form-item>
        <el-form-item label="课题费用" prop="fee" :label-width="formLabelWidth">
          <el-input
            v-model="subject.fee"
            autocomplete="off"
            placeholder="请输入课题费用：数字类型"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="课题类型"
          prop="type"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="subject.type"
            autocomplete="off"
            placeholder="请输入课题类型:科技类,教改类,其他"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="课题等级"
          prop="rank"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="subject.rank"
            autocomplete="off"
            placeholder="请输入课题等级:国际级,国家级,省级,市级,校级,院级"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="课题周期"
          prop="period"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="subject.period"
            autocomplete="off"
            placeholder="请输入课题周期如：2019年7月31到2020年7月31日"
          ></el-input>  
        </el-form-item>
        <el-form-item
          label="参与者"
          prop="participant"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="subject.participant"
            autocomplete="off"
            placeholder="请输入课题参与者"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="是否结项"
          prop="finished"
          :label-width="formLabelWidth"
        >
          <el-select v-model="subject.finished">
            <el-option label="否" value="否"> </el-option>
            <el-option label="是" value="是"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="佐证材料" :label-width="formLabelWidth">
          <el-col :span="0">
            <el-form-item prop="attachment">
              <el-input v-model="subject.attachment" type="hidden"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-upload
              action="#"
              ref="upload"
              :auto-upload="true"
              :limit="1"
              :on-success="onSubjectSuccess"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选择文件</el-button
              >
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('subjectForm')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 科研课题编辑弹出框结束 -->
    <!-- 专利编辑弹出框开始 -->
    <el-dialog
      title="专利编辑"
      width="80%"
      :visible.sync="dialogPatentFormVisible"
    >
      <el-form
        :model="patent"
        ref="patentForm"
        :rules="patentRules"
        status-icon
      >
        <el-form-item
          prop="name"
          label="专利名称"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="patent.name"
            autocomplete="off"
            placeholder="请输入专利名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="专利类型" prop="type" :label-width="formLabelWidth">
          <el-input
            v-model="patent.type"
            autocomplete="off"
            placeholder="请输入专利类型:发明专利，实用新型专利，外观设计"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="专利号"
          prop="patentNo"
          :label-width="formLabelWidth"
        >
          <el-input
            v-model="patent.patentNo"
            autocomplete="off"
            placeholder="请输入专利号"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="授权时间"
          prop="empowerTime"
          :label-width="formLabelWidth"
        >
          <el-date-picker
            v-model="patent.empowerTime"
            type="date"
            placeholder="请选择授权时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
          <el-input
            v-model="patent.address"
            autocomplete="off"
            placeholder="请输入单位地址或者个人地址"
          ></el-input>
        </el-form-item>

        <el-form-item label="佐证材料" :label-width="formLabelWidth">
          <el-col :span="0">
            <el-form-item prop="attachment">
              <el-input v-model="patent.attachment" type="hidden"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-upload
              action="#"
              ref="upload"
              :auto-upload="true"
              :limit="1"
              :on-success="onPatentSuccess"
            >
              <el-button slot="trigger" size="small" type="primary"
                >选择文件</el-button
              >
            </el-upload>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('patentForm')"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 专利编辑弹出框结束 -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import dayjs from "dayjs";
export default {
  layout: "my",
  data() {
    return {
      activeName: "first",
      dialogPaperFormVisible: false,
      dialogPatentFormVisible: false,
      dialogCopyrightFormVisible: false,
      dialogSubjectFormVisible: false,
      formLabelWidth: "100px",
      papers: [],
      paper: {
        id: 0,
        name: "",
        type: "",
        userId:  0,
        publication: "",
        publishTime: "",
        publicationCate: "",
        count: 0,
        attachment: "",
      },
      paperRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        type: [{ required: true, message: "必填项", trigger: "blur" }],

        publication: [{ required: true, message: "必填项", trigger: "blur" }],
        publishTime: [{ required: true, message: "必填项", trigger: "blur" }],
        publicationCate: [
          { required: true, message: "必填项", trigger: "blur" },
        ],
      },
      patents: [],
      patent: {
        id: 0,
        name: "",
        userId: 0,
        type: "",
        address: "",
        patentNo: "",
        attachment: "",
        empowerTime: "",
      },
      patentRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],

        type: [{ required: true, message: "必填项", trigger: "blur" }],
        address: [{ required: true, message: "必填项", trigger: "blur" }],
        patentNo: [{ required: true, message: "必填项", trigger: "blur" }],
        empowerTime: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      copyrights: [],
      copyright: {
        id: 0,
        name: "",
        userId: 0,
        finishTime: "",
        publishTime: "",
        attachment: "",
        copyrightNo: "",
      },
      copyrightRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],

        finishTime: [{ required: true, message: "必填项", trigger: "blur" }],
        publishTime: [{ required: true, message: "必填项", trigger: "blur" }],
        copyrightNo: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      subjects: [],
      subject: {
        id: 0,
        name: "",
        origin: "",
        type: "",
        rank: "",
        period: "",
        fee: "",
        userId:  0,
        finished: "",
        subjectNo: "",
        attachment: "",
      },
      subjectRules: {
        name: [{ required: true, message: "必填项", trigger: "blur" }],
        origin: [{ required: true, message: "必填项", trigger: "blur" }],
        type: [{ required: true, message: "必填项", trigger: "blur" }],
        rank: [{ required: true, message: "必填项", trigger: "blur" }],
        period: [{ required: true, message: "必填项", trigger: "blur" }],
        fee: [{ required: true, message: "必填项", trigger: "blur" }],
        finished: [{ required: true, message: "必填项", trigger: "blur" }],
        subjectNo: [{ required: true, message: "必填项", trigger: "blur" }],
      },
      pagePaper: {
        current: 1,
        size: 10,
        total: 0,
      },
      pagePatent: {
        current: 1,
        size: 10,
        total: 0,
      },
      pageCopyright: {
        current: 1,
        size: 10,
        total: 0,
      },
      pageSubject: {
        current: 1,
        size: 10,
        total: 0,
      },
    };
  },
  computed: {
    ...mapState(["userinfo", "school", "student"]),
  },
  created() {
    if (process.client) {
      this.getCopyrightsPage(this.userinfo.id);
      this.getPapersPage(this.userinfo.id);
      this.getPatentsPage(this.userinfo.id);
      this.getSubjectsPage(this.userinfo.id);
    }
  },

  methods: {
    handleCommand(command) {
      //显示不同的form
      this.dialogPaperFormVisible = false;
      this.dialogPatentFormVisible = false;
      this.dialogCopyrightFormVisible = false;
      this.dialogSubjectFormVisible = false;
      switch (command) {
        case "paper":
          this.dialogPaperFormVisible = true;
          break;
        case "patent":
          this.dialogPatentFormVisible = true;
          break;
        case "copyright":
          this.dialogCopyrightFormVisible = true;
          break;
        default:
          this.dialogSubjectFormVisible = true;
          break;
      }
    },
    handlePaperCurrentChange(current) {
      this.pagePaper.current = current;
      this.getPapersPage(current)
    },
    handleCopyrightCurrentChange(current) {
      this.pageCopyright.current = current;
      this.getCopyrightsPage(current);
    },
    handleSubjectCurrentChange(current) {

      this.pageSubject.current = current;
      this.getSubjectsPage(current);
    },
    handlePatentCurrentChange(current) {
      this.pagePatent.current = current;
      this.getPatentsPage(current);
    },
    onCopyrightSuccess(response, file, fileList) {
      console.log(response, file, fileList);
    },
    onPaperSuccess(response, file, fileList) {
      console.log(response, file, fileList);
    },
    onSubjectSuccess(response, file, fileList) {},
    onPatentSuccess(response, file, fileList) {},
    toEdit(type, id) {
      this.dialogPaperFormVisible = false;
      this.dialogPatentFormVisible = false;
      this.dialogCopyrightFormVisible = false;
      this.dialogSubjectFormVisible = false;
      switch (type) {
        case "paper":
          this.getPaper(id);
          break;
        case "patent":
          this.getPatent(id);
          break;
        case "copyright":
          this.getCopyright(id);
          break;
        default:
          this.getSubject(id);
          break;
      }
    },
    del(type, id) {},
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          switch (formName) {
            case 'copyrightForm':
              this.copyright.userId=this.userinfo.id;
              if(this.copyright.id==0){
                this.addCopyright(this.copyright);
              }
              else{
                this.editCopyright(this.copyright);
              }
              
              break;
            case 'patentForm':
              this.patent.userId=this.userinfo.id;
              if(this.patent.id==0){
                this.addPatent(this.patent);
              }
              else{
                this.editPatent(this.patent);
              }
              
              break;
            case 'paperForm':
              this.paper.userId=this.userinfo.id;
              if(this.paper.id==0){
                this.addPaper(this.paper);
              }
              else{
                this.editPaper(this.paper);
              }
              break;
            default:
              this.subject.userId=this.userinfo.id;
              if(this.subject.id==0){
                this.addSubject(this.subject);
              }
              else{
                this.editSubject(this.subject);
              }
              break;
          }

        } else {
          this.$message.error('输入参数不符合要求请重试')
          return false;
        }
      });
    },
    //著作权
    async getCopyrightsPage(current) {
      let page = {
        current: current,
        size: 10,
      };
      let res = await this.$axios({
        url: "api/copyright/page",
        method: "post",
        data: page,
      });
      if (res.success) {
        let page = res.data.page;
        this.page = page;
        this.copyrights = page.records;
      }
    },
    async getCopyright(id) {
      let res = await this.$axios({
        url: "api/copyright/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.copyright = res.data.copyright;
        this.dialogCopyrightFormVisible = true;
      } else {
        return false;
      }
    },
    async addCopyright(copyright){
      let res=await this.$axios({
        url:'api/copyright/add',
        method:'post',
        data:copyright
      })
      if(res.success){
        this.getCopyrightsPage(this.pageCopyright.current);
        this.dialogCopyrightFormVisible=false;
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    },
    async editCopyright(copyright){
         let res=await this.$axios({
        url:'api/copyright/edit',
        method:'post',
        data:copyright
      })
      if(res.success){
        this.getCopyrightsPage(this.pageCopyright.current);
        this.dialogCopyrightFormVisible=false;
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    },
    //论文
    async getPapersPage(current) {
      let page = {
        current: current,
        size: 10,
      };
      let res = await this.$axios({
        url: "api/paper/page",
        method: "post",
        data: page,
      });
      if (res.success) {
        let page = res.data.page;
        this.page = page;
        this.papers = page.records;
      }
    },
    async getPaper(id) {
      let res = await this.$axios({
        url: "api/paper/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.paper = res.data.paper;
        this.dialogPaperFormVisible = true;
      } else {
        return false;
      }
    },
    async addPaper(paper) {
       let res=await this.$axios({
        url:'api/paper/add',
        method:'post',
        data:paper
      })
      if(res.success){
        this.getPapersPage(this.pagePaper.current);
        this.dialogCopyrightFormVisible=false;
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    },
    async editPaper(paper) {
       let res=await this.$axios({
        url:'api/paper/edit',
        method:'post',
        data:paper
      })
      if(res.success){
        this.getPapersPage(this.pagePaper.current);
        this.dialogPaperFormVisible=false;
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    },

    //专利
    async getPatentsPage(current) {
      let page = {
        current: current,
        size: 10,
      };
      let res = await this.$axios({
        url: "api/patent/page",
        method: "post",
        data: page,
      });
      if (res.success) {
        let page = res.data.page;
        this.page = page;
        this.patents = page.records;
      }
    },
    async getPatent(id) {
      let res = await this.$axios({
        url: "api/patent/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.patent = res.data.patent;
        this.dialogPatentFormVisible = true;
      } else {
        return false;
      }
    },
    async addPatent(patent) {
       let res=await this.$axios({
        url:'api/patent/add',
        method:'post',
        data:patent
      })
      if(res.success){
        this.getPatentsPage(this.pagePatent.current);
        this.dialogPatentFormVisible=false;
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    },
    async editPatent(patent) {
       let res=await this.$axios({
        url:'api/patent/edit',
        method:'post',
        data:patent
      })
      if(res.success){
        this.getPatentsPage(this.pagePatent.current);
        this.dialogPatentFormVisible=false;
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    },
    //课题
    async getSubjectsPage(current) {
      let page = {
        current: current,
        size: 10,
      };
      let res = await this.$axios({
        url: "api/subject/page",
        method: "post",
        data: page,
      });
      if (res.success) {
        let page = res.data.page;
        this.page = page;
        this.subjects = page.records;
      }
    },
    async getSubject(id) {
      let res = await this.$axios({
        url: "api/subject/one",
        params: {
          id: id,
        },
      });
      if (res.success) {
        this.subject = res.data.subject;
        this.dialogSubjectFormVisible = true;
      } else {
        return false;
      }
    },
    async addSubject(subject){
       let res=await this.$axios({
        url:'api/subject/add',
        method:'post',
        data:subject
      })
      if(res.success){
        this.getSubjectsPage(this.pageSubject.current);
        this.dialogSubjectFormVisible=false;
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    },
    async editSubject(subject){
       let res=await this.$axios({
        url:'api/subject/edit',
        method:'post',
        data:subject
      })
      if(res.success){
        this.getSubjectsPage(this.pageSubject.current);
        this.dialogSubjectFormVisible=false;
      }
      else{
        this.$message.error(res.msg);
        return false;
      }
    },
   
  },
  filters: {
    dateFormat(value) {
      return dayjs(value).format("YYYY-MM-DD");
    },
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  background-color: #eee;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  border-radius: 5px;
}
.header-user {
  display: flex;
  align-items: center;
}
.header-user .username {
  padding-right: 10px;
}
.header-user .img {
  height: 30px;
  width: 30px;
}
.honor-list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 35px;
  margin-bottom: 20px;
}
</style>