<template>
  <div>
    <breadcrumb>
      <span slot="one">商品管理</span>
      <span slot="two">添加商品</span></breadcrumb
    >
    <el-card
      ><el-alert title="添加商品信息" type="info" show-icon center> </el-alert>
      <el-steps :active="+activeTabName" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :rules="listBaseRules"
        :model="ListBaseMessage"
        ref="firstFormRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          style=""
          v-model="activeTabName"
          @tab-click="activeTabBtn"
          :before-leave="beforeActiveTab"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                v-model="ListBaseMessage.goods_name"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="ListBaseMessage.goods_price"
                placeholder="请输入内容"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="ListBaseMessage.goods_weight"
                placeholder="请输入内容"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="ListBaseMessage.goods_number"
                placeholder="请输入内容"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <template>
                <el-cascader
                  v-model="ListGoodsSort"
                  :options="getListGoodsSort"
                  :props="listGoodsProps"
                  @change="ListGoodsSortChange"
                ></el-cascader>
              </template>
            </el-form-item>
            <el-button type="primary" @click="activeTabName = '1'"
              >下一步</el-button
            >
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <template>
              <!-- <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              > -->
              <div class="listPar">
                <el-checkbox-group
                  v-model="listParContent"
                  @change="listParContentChange"
                >
                  <el-checkbox
                    v-for="item in listMany"
                    :label="item.attr_id"
                    :key="item.attr_id"
                    border
                    class="listPar_child"
                    checked
                    >{{ item.attr_name }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </template>
            <el-button
              class="nextBtn"
              type="primary"
              @click="activeTabName = '2'"
              >下一步</el-button
            >
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <template>
              <!-- <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              > -->
              <div class="listPar">
                <el-checkbox-group
                  v-model="listAttrContent"
                  @change="listAttrContentChange"
                >
                  <el-checkbox
                    v-for="item in listOnly"
                    :label="item.attr_id"
                    :key="item.attr_id"
                    border
                    class="listPar_child"
                    checked
                    >{{ item.attr_name }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </template>
            <el-button type="primary" @click="activeTabName = '3'"
              >下一步</el-button
            >
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--on-preview 是用来查看点击图片的事件  -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              class="upload-demo"
              :on-preview="upPicturePreview"
              :on-remove="upPictureRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="upPictureSuccess"
            >
              <el-button type="primary">点击上传图片</el-button>
              <!-- 预览图片 这里有个bug点击预览关闭后会触发上传按钮 -->

              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>

            <el-button type="primary" @click="activeTabName = '4'"
              >下一步</el-button
            >
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本标签 -->
            <quill-editor v-model="goods_introduce"></quill-editor>
            <el-button type="primary" @click="addEndBtn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog
        :visible.sync="upPictureVisible"
        title="图片预览"
        :before-close="textClose"
      >
        <el-image style="width: 400px; height: 400px" :src="lookUpPicture[0]">
        </el-image>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'
export default {
  name: 'goodsListAdd',
  components: { breadcrumb },
  data() {
    return {
      ListBaseMessage: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
      },
      // 表单绑定规则
      listBaseRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
      },
      // 绑定商品列表的id
      ListGoodsSort: '',
      getListGoodsSort: [],
      // 商品列表划分等级
      listGoodsProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // tab框动态绑定的内容
      activeTabName: '0',
      // 商品参数数组
      listMany: [],
      listOnly: [],
      // 商品参数多选内容
      listParContent: [],
      // 商品属性多选内容
      listAttrContent: [],
      // 上传图片内容
      upPictureList: [],
      // 预览图片
      lookUpPicture: [],
      // 打开图片预览弹框
      upPictureVisible: false,
      // 图片上传请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 保存图片零时存放的内容
      pics: [],
      // 富文本内容，介绍
      goods_introduce: '',
    }
  },
  created() {
    this.getSortGoodsList()
  },
  methods: {
    ListGoodsSortChange() {},
    async getSortGoodsList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 },
      })
      console.log('------')
      console.log(res)
      this.getListGoodsSort = res.data
    },
    // tab活动标签点击事件 添加验证不通过无法跳转功能
    beforeActiveTab(old1) {
      if (old1 != 0 && this.ListGoodsSort.length < 2) {
        this.$message.error('请添写基本信息')
        return false
      }
      if (old1 == 1) {
        this.getGoodsPar('many')
      }
      console.log(old1)
      if (old1 == 2) {
        this.getGoodsPar('only')
      }
    },
    activeTabBtn() {},
    // 获取分类产品参数
    async getGoodsPar(all) {
      if (this.ListGoodsSort.length != 0) {
        const { data: res } = await this.$http.get(
          `categories/${
            this.ListGoodsSort[this.ListGoodsSort.length - 1]
          }/attributes`,
          { params: { sel: all } }
        )
        if (res.meta.status !== 200) return this.$message.error('获取失败')
        this.$message.success('获取成功')
        console.log(res)
        if (all == 'many') {
          this.listMany = res.data
        } else {
          this.listOnly = res.data
        }
      }
    },
    // 分类产品的参数选择
    listParContentChange() {
      console.log(this.listParContent)
    },
    // 商品分类多选框点击事件
    listAttrContentChange() {
      console.log(this.listAttrContent)
    },
    upPicture() {},
    upPicturePreview(file, filelist) {
      this.upPictureVisible = true
      this.lookUpPicture.push(file.url)
      console.log(file)
      console.log(filelist)
    },
    // 将图片从pics中移除掉
    upPictureRemove(file) {
      this.pics.forEach((item, index) => {
        if (item.pic == file.response.data.tmp_path) {
          this.pics.splice(index, 1)
        }
      })
      console.log(file.response.data.tmp_path)
    },
    textClose() {
      this.upPictureVisible = false
    },
    upPictureSuccess(response) {
      console.log(response)
      if (response.meta.status !== 200) return this.$message.error('获取失败')
      this.$message.success('获取成功')
      const res = { pic: response.data.tmp_path }
      this.pics.push(res)
      console.log(this.pics)
    },
    // 添加商品按钮,点击表单实现预验证
    addEndBtn() {
      this.activeTabName = '5'
      this.$refs.firstFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('请完善基本内容')
        this.ListBaseMessage.goods_introduce = this.goods_introduce
        this.ListBaseMessage.pics = this.pics
        this.ListBaseMessage.goods_cat = this.ListGoodsSort.join(',')
        this.ListBaseMessage.attrs = [
          // ...this.listParContent,
          // ...this.listAttrContent,
        ]

        const { data: res } = await this.$http.post(
          'goods',
          this.ListBaseMessage
        )
        if (res.meta.status !== 201) return this.$message.error('创建商品失败')
        this.$message.success('创建商品成功')
        console.log(res)
        this.$router.push('/goods')
        this.getSortGoodsList()
      })
    },
  },
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-bottom: 15px;
}
.el-form-item {
  text-align: left;
}
.listPar {
  text-align: left;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  &_child {
    margin-top: 10px;
    margin-left: 0 !important;
  }
}
.el-button {
  margin-top: 20px;
}
.ql-editor {
  line-height: 7 !important;
}
</style>