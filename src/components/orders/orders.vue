<template>
  <div>
    <breadcrumb>
      <span slot="one">订单管理</span>
      <span slot="two">订单列表</span>
    </breadcrumb>
    <el-card>
      <!-- 搜索功能 -->
      <div style="text-align: left; margin-bottom: 15px">
        <el-input
          placeholder="请输入内容"
          v-model="putOrders"
          style="width: 300px"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchOrdersBtn"
          ></el-button>
        </el-input>
      </div>
      <el-table :data="ordersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="210"
        ></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width=""
        ></el-table-column>
        <el-table-column label="是否付款" width="">
          <template v-slot="scope">
            <el-tag type="danger" v-if="scope.row.pay_status == 0"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>
              {{ '已支付￥ ' + scope.row.pay_status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width=""
        ></el-table-column>
        <el-table-column label="下单时间" width="" v-slot="scope">
          {{ scope.row.create_time | formaDate('yyyy-mm-dd') }}
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template v-slot="scope1">
            <!-- 编辑按钮操作 -->
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="ordersEditBtn(scope1.row)"
            ></el-button>

            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="ordersPositionBtn(scope1.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 15px"
        @size-change="ordersSizeChange"
        @current-change="ordersCurrentChange"
        :current-page="orderPag.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="orderPag.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="ordersListtotal"
      >
      </el-pagination>
      <!-- 编辑那妞弹框 -->
      <el-dialog width="50%" :visible.sync="ordersEditactive" title="修改订单">
        <el-form
          :model="editOrder"
          label-width="100px"
          style="text-align: left"
          :rules="editOrderRules"
          ref="editOrderRef"
        >
          <el-form-item label="订单支付" prop="order_pay">
            <el-select
              v-model="editOrder.order_pay"
              placeholder="请选择支付方式"
            >
              <el-option label="未支付" value="0"></el-option>
              <el-option label="支付宝" value="1"></el-option>
              <el-option label="微信" value="2"></el-option>
              <el-option label="银行卡" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单价格" prop="order_price">
            <el-input type="text" v-model="editOrder.order_price"></el-input>
          </el-form-item>
          <el-form-item label="订单数量" prop="order_number">
            <el-input type="text" v-model="editOrder.order_number"></el-input>
          </el-form-item>
          <el-form-item label="支付状态" prop="pay_status">
            <el-select
              v-model="editOrder.pay_status"
              placeholder="请选择支付状态"
            >
              <el-option label="未付款" value="0"></el-option>
              <el-option label="已付款" value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="ordersEditactive = false">取 消</el-button>
          <el-button type="primary" @click="ordersEditIstrue">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 物流定位按钮弹窗 -->
      <el-dialog
        width="50%"
        :visible.sync="ordersPositionactive"
        title="查看物流进度"
      >
        <el-timeline :reverse="false" style="text-align: left">
          <el-timeline-item
            v-for="(activity, index) in ordersActives"
            :key="index"
            :timestamp="activity.timestamp"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from '../commom/breadcrumb.vue'
import express from './mock'

export default {
  name: 'orders',
  components: {
    breadcrumb,
  },
  data() {
    return {
      putOrders: '',
      orderPag: {
        pagenum: 1,
        pagesize: 10,
      },
      // 获得的订单列表
      ordersList: [],
      // 所有订单的数量
      ordersListtotal: null,
      ordersEditactive: false,
      // 修改地址弹窗内容
      editOrder: {
        // id: '',
        // is_send: null,
        // order_pay: null,
        // order_price: '',
        // order_number: '',
        // pay_status: null,
      },
      editOrderRules: {
        order_pay: [],
        order_price: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
        order_number: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
        pay_status: [],
      },
      // 定位按钮打开弹窗布尔值
      ordersPositionactive: false,
      ordersActives: express,
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.orderPag,
      })
      if (res.meta.status == 200) {
        this.$message.success('获取成功')
      } else {
        this.$message.error('获取失败')
      }
      console.log(res)
      this.ordersListtotal = res.data.total
      this.ordersList = res.data.goods
      console.log(this.ordersList)
    },
    // 检索查询按钮
    searchOrdersBtn() {
      this.orderPag.query = this.putOrders
      this.getOrdersList()
    },
    // 传递每页条数请求接口
    ordersSizeChange(all) {
      this.orderPag.pagesize = all
      this.getOrdersList()
    },
    // 传递页码请求接口
    ordersCurrentChange(all) {
      this.orderPag.pagenum = all
      this.getOrdersList()
    },
    // 编辑操作按钮,修改地址
    ordersEditBtn(all) {
      this.ordersEditactive = true
      this.editOrder = all
      console.log(this.editOrder)
    },
    // 编辑点击确定按钮
    ordersEditIstrue() {
      console.log(this.editOrder.order_id)
      this.$refs.editOrderRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `orders/${this.editOrder.order_id}`,
          this.editOrder
        )
        if (res.meta.status == 201) {
          this.$message.success('更新订单成功')
        } else {
          this.$message.error('更新订单失败')
        }
        console.log(res)
        this.getOrdersList()
        this.ordersEditactive = false
      })
    },
    // 定位按钮
    ordersPositionBtn() {
      this.ordersPositionactive = true
    },
  },
}
</script>

<style lang="less" scoped>
</style>