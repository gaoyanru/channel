<template>
  <div class="pl-15 channel-add-order">
    <el-form ref='postData' :model='postData' label-width="130px">
      <p class="form-control-static">账户余额：
        <span style="color: red">{{'￥' + balance}}</span>
      </p>
      <p v-show="postData.OrderId" class="form-control-static">
        销售：{{postData.SalerName}} 订单号：{{postData.OrderId}} 所属公司：{{postData.ChannelName}} 提单员：{{postData.BillName}}
        <!-- <span v-if="postData.Category != 1" style="color:red">预提单</span>
        <span v-if="postData.FreChangeOrderId" style="color:red">纳税人类别变更</span> -->
      </p>
      <p v-show="!postData.OrderId" class="form-control-static sales-style">
        <el-form-item label="销售：" required>
          <el-select v-model="postData.SalesId">
            <el-option v-for="item in sales" :key="item.UserId" :label="item.RealName" :value="item.UserId">
            </el-option>
          </el-select>
        </el-form-item>
      </p>
      <p class="form-control-static checkout-box">
        <el-checkbox v-model="isNewCompany" @change="setCategory" :disabled="!!postData.OrderId || xfReadonly">预提单</el-checkbox>
      </p>
      <div class="gray-line"></div>
      <div v-if="category==1">
        <div class="add-order-title">
          <span>基本信息</span>
        </div>
        <div class="custom-tips">
          <span>【温馨提示】可通过“检索”或“快速录入”按钮，帮您完成工商信息的快速录入。</span>
        </div>
        <el-row>
          <el-col :span='11'>
            <el-form-item label='公司名称：' required>
              <input class='company-search el-input__inner' v-model='postData.Name' @keyup="clearCompanyInfo" :readonly="nameReadonly || !!orderId || xfReadonly"/>
              <el-button type="primary" class="company-alert" @click="toCheck">检索</el-button>
              <el-button type="primary" class="company-alert" @click="fastCheck">快速录入</el-button>
              <ul class="dropdown-menu dropdown-company-list" aria-labelledby="exampleInputAmount">
                <li v-for="item in companyList" @click="companySelect(item.Name, item.id)"><a href="javascript:void(0)">{{item.Name}}</a></li>
              </ul>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='所在城市：' required>
              <el-select v-model="postData.CityCode" :disabled="isReadOnly">
                <el-option v-for="item in citys" :key="item.CityCode" :label="item.CityName" :value="item.CityCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='11'>
            <el-form-item label='联系人：' required>
              <el-input v-model='postData.Contacts' :maxlength="10" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='手机号：' required>
              <el-input v-model='postData.Mobile' :maxlength="11" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="add-order-title">
          <span>工商信息</span>
        </div>
        <el-row>
          <el-col :span='11'>
            <custom-upload v-model='postData.PersonCardPath' :uploaded="uploaded" title='请上传清晰的身份证人像面，图片大小不要超过3M' :disabled="isReadOnly"></custom-upload>
            <custom-upload v-model='postData.BusinessLicense' title='请上传清晰的营业执照，图片大小不要超过3M' class='mt-30' :disabled="isReadOnly"></custom-upload>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='法人姓名：' required>
              <el-input v-model='postData.LegalPerson' :maxlength="50" :readonly="isLegalPersonReadonly || isReadOnly"></el-input>
            </el-form-item>
            <el-form-item label='法人身份证号：' required>
              <el-input v-model='postData.PersonCardID' :maxlength="18" :readonly="isReadOnly"></el-input>
            </el-form-item>
            <el-form-item label='公司住所：' class="address-area" required>
              <el-input type="textarea" v-model='postData.Address' :maxlength="100" :rows='3' :readonly="isAddressReadonly || isReadOnly"></el-input>
            </el-form-item>
            <el-form-item label='统一信用代码：' required>
              <el-input v-model='postData.RegNO' :maxlength="18" :readonly="isRegNOReadonly || isReadOnly" placeholder="若没有统一信用代码，请填写注册号"></el-input>
            </el-form-item>
            <el-form-item class="date-style" label='营业期限：' required>
              <el-date-picker width="100" v-model="postData.RegisterDate" type="date" placeholder="开始日期" :clearable="false" :readonly="isCompanyReadonly || isReadOnly">
              </el-date-picker>
              <span>-</span>
              <el-date-picker v-model="postData.BusnissDeadline" type="date" placeholder="结束日期" :clearable="false" :readonly="IsBusnissDeadlineReadonly|| isCompanyReadonly || isReadOnly">
              </el-date-picker>
              <el-checkbox v-model="checked" @change="BusnissDeadlineCanBeChoose" :disabled="isCompanyReadonly || isReadOnly">无限期</el-checkbox>
            </el-form-item>
            <el-form-item label='注册资金：' required>
              <el-input v-model='postData.RegisteredCapital' :readonly="isRegisteredCapitalReadonly || isReadOnly"></el-input>
            </el-form-item>
            <el-form-item label='经营范围：' required>
              <el-input type='textarea' v-model='postData.BusinessScope' :rows='8' :readonly="isBusinessScopeReadonly || isReadOnly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class='add-order-title'>
          <span>合同信息</span>
        </div>
        <el-row>
          <el-col :span='11'>
            <el-form-item label='合同编号：' required>
              <el-input v-model='postData.ContractNO' :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='纳税人类别：' required>
              <el-radio-group v-model="postData.AddedValue" @change="clearPaytype" :disabled="isReadOnly">
                <el-radio class="radio-style-bg" label='1'>小规模</el-radio>
                <el-radio class="radio-style-bg" label='2'>一般纳税人</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label='套餐类型：' required>
              <div>
                <div v-show="!isReadOnly" style="outline:none">
                  <div v-model="postData.payType" class="custom-check" v-for="item in payTypes[postData.AddedValue]" :class="{checked: value.id == item.id}" @click="toClick(item)">
                    <i v-if="value.id == item.id" class="fa fa-check" aria-hidden="true"></i>
                    {{item.title}}
                  </div>
                </div>
                <div v-show="isReadOnly" style="outline:none">
                  <div v-model="payTypeReadonly[0]" class="custom-check checked" v-for="item in payTypeReadonly">
                    <i class="fa fa-check" aria-hidden="true"></i>
                    {{item.PriceName}}
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 0">
          <el-col>
            <el-form-item label=''>
              <el-select v-model="postData.gift" @change="setEndDate" clearable placeholder="不使用礼包" :disabled="isReadOnly">
                <el-option v-for="item in gifts[postData.AddedValue]" :key="item.Id" :label="item.GiftTypeName" :value="item.Id">
                </el-option>
              </el-select>
              <span v-if="!isReadOnly">
                <el-checkbox v-if="promotion && promotion.PromotionName" v-model="postData.IsPromotion" @change="checkboxChange" :disabled="IschoosePropmition">{{promotion.PromotionName}}</el-checkbox>
                <span v-if="promotion && promotion.Num<20">(剩余{{promotion.Num}})</span>
              </span>
              <span v-if="isReadOnly && !promotionShow">
                <span>{{postData.Promotion.PromotionName}}</span>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='11'>
            <el-form-item label='开始账期：' required>
              <el-date-picker v-model="postData.ServiceStart" type="month" @change="setEndDate" :clearable="false" :readonly="isReadOnly"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='结束账期：' required>
              <el-date-picker v-model="postData.ServiceEnd" type="month" :readonly="true"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='15'>
            <el-form-item label='合同金额：' required>
              <el-input v-model='postData.ContractAmount' readonly></el-input>
            </el-form-item>
            <div style="padding-left:135px;color:red;margin-top: -10px;margin-bottom: 10px;font-size:14px">注:合同金额根据所属城市、纳税人类别、套餐类型自动计算，不包含礼包价格。</div>
          </el-col>
        </el-row>
      </div>
      <div v-if="category==2">
        <div class="add-order-title">
          <span>基本信息</span>
        </div>
        <div class='custom-tips mb-10'>
          <span>【温馨提示】支持对二代居民身份证的关键字段识别。上传身份证后，即可自动读取并带出姓名、身份证号等信息。</span>
        </div>
        <el-row>
          <el-col :span='11'>
            <custom-upload v-model='postData.PersonCardPath' :uploaded="uploaded" title='请上传清晰的身份证人像面，图片大小不要超过3M'></custom-upload>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='所在城市：' required>
              <el-select v-model="postData.CityCode">
                <el-option v-for="item in citys" :key="item.CityCode" :label="item.CityName" :value="item.CityCode">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label='法人姓名：' required>
              <el-input v-model='postData.LegalPerson' :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label='法人身份证号：' required>
              <el-input v-model='postData.PersonCardID' :maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label='联系人：' required>
              <el-input v-model='postData.Contacts' :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label='手机号：' required>
              <el-input v-model='postData.Mobile' :maxlength="11"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class='add-order-title'>
          <span>合同信息</span>
        </div>
        <el-row>
          <el-col :span='11'>
            <el-form-item label='合同编号：' required>
              <el-input v-model='postData.ContractNO'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='纳税人类别：' required>
              <el-radio-group v-model="postData.AddedValue" @change="clearPaytype">
                <el-radio class="radio-style-bg" label='1'>小规模</el-radio>
                <el-radio class="radio-style-bg" label='2'>一般纳税人</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label='套餐类型：' required>
              <div style="outline:none">
                <div v-model="postData.payType" class="custom-check" v-for="item in payTypes[postData.AddedValue]" :class="{checked: value.id == item.id}" @click="toClick(item)">
                  <i v-if="value.id == item.id" class="fa fa-check" aria-hidden="true"></i>
                  {{item.title}}
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 0">
          <el-col>
            <el-form-item label=''>
              <el-select v-model="postData.gift" placeholder="不选择礼包" @change="setEndDate">
                <el-option v-for="item in gifts[postData.AddedValue]" :key="item.Id" :label="item.GiftTypeName" :value="item.Id">
                </el-option>
              </el-select>
              <span>
                <el-checkbox v-if="promotion && promotion.PromotionName" v-model="postData.IsPromotion" :disabled="IschoosePropmition" @change="checkboxChange">{{promotion.PromotionName}}</el-checkbox>
                <span v-if="promotion && promotion.Num<20">(剩余{{promotion.Num}})</span>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='15'>
            <el-form-item label='合同金额：' required>
              <el-input v-model='postData.ContractAmount' readonly></el-input>
            </el-form-item>
            <div style="padding-left:135px;color:red;margin-top: -10px;margin-bottom: 10px;font-size:14px">注:合同金额根据所属城市、纳税人类别、套餐类型自动计算，不包含礼包价格。</div>
          </el-col>
        </el-row>
      </div>
      <div v-if="category==3">
        <div class="add-order-title">
          <span>基本信息</span>
        </div>
        <div class="custom-tips">
          <span>【温馨提示】可通过“检索”或“快速录入”按钮，帮您完成工商信息的快速录入。</span>
        </div>
        <el-row>
          <el-col :span='11'>
            <el-form-item label='公司名称：' required>
              <input class='company-search el-input__inner' v-model='postData.Name' @keyup="clearCompanyInfo" :readonly="nameReadonly || isReadOnly || isChangeCompanyName"/>
              <el-button type="primary" class="company-alert" @click="toCheck">检索</el-button>
              <el-button type="primary" class="company-alert" @click="fastCheck">快速录入</el-button>
              <ul class="dropdown-menu dropdown-company-list" aria-labelledby="exampleInputAmount">
                <li v-for="item in companyList" @click="companySelect(item.Name, item.id)"><a href="javascript:void(0)">{{item.Name}}</a></li>
              </ul>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='所在城市：' required>
              <el-select v-model="postData.CityCode" disabled>
                <el-option v-for="item in citys" :key="item.CityCode" :label="item.CityName" :value="item.CityCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='11'>
            <el-form-item label='联系人：' required>
              <el-input v-model='postData.Contacts' :maxlength="10" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='手机号：' required>
              <el-input v-model='postData.Mobile' :maxlength="11" :readonly="isReadOnly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="add-order-title">
          <span>工商信息</span>
        </div>
        <el-row>
          <el-col :span='11'>
            <custom-upload v-model='postData.PersonCardPath' :uploaded="uploaded" title='请上传清晰的身份证人像面，图片大小不要超过3M' :disabled="isReadOnly"></custom-upload>
            <custom-upload v-model='postData.BusinessLicense' title='请上传清晰的营业执照，图片大小不要超过3M' class='mt-30' :disabled="isReadOnly"></custom-upload>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='法人姓名：' required>
              <el-input v-model='postData.LegalPerson' :maxlength="50" :readonly="isLegalPersonReadonly || isReadOnly"></el-input>
            </el-form-item>
            <el-form-item label='法人身份证号：' required>
              <el-input v-model='postData.PersonCardID' :maxlength="18" :readonly="isReadOnly"></el-input>
            </el-form-item>
            <el-form-item label='公司住所：' class="address-area" required>
              <el-input type="textarea" v-model='postData.Address' :maxlength="100" :rows='3' :readonly="isAddressReadonly || isReadOnly"></el-input>
            </el-form-item>
            <el-form-item label='统一信用代码：' required>
              <el-input v-model='postData.RegNO' :maxlength="18" :readonly="isRegNOReadonly || isReadOnly" placeholder="若没有统一信用代码，请填写注册号"></el-input>
            </el-form-item>
            <el-form-item class="date-style" label='营业期限：' required>
              <el-date-picker width="100" v-model="postData.RegisterDate" type="date" placeholder="开始日期" :clearable="false" :readonly="isCompanyReadonly || isReadOnly">
              </el-date-picker>
              <span>-</span>
              <el-date-picker v-model="postData.BusnissDeadline" type="date" placeholder="结束日期" :clearable="false" :readonly="IsBusnissDeadlineReadonly || isCompanyReadonly || isReadOnly">
              </el-date-picker>
              <el-checkbox v-model="checked" @change="BusnissDeadlineCanBeChoose" :disabled="isCompanyReadonly || isReadOnly">无限期</el-checkbox>
            </el-form-item>
            <el-form-item label='注册资金：' required>
              <el-input v-model='postData.RegisteredCapital' :readonly="isRegisteredCapitalReadonly || isReadOnly"></el-input>
            </el-form-item>
            <el-form-item label='经营范围：' required>
              <el-input type='textarea' v-model='postData.BusinessScope' :rows='8' :readonly="isBusinessScopeReadonly || isReadOnly"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class='add-order-title'>
          <span>合同信息</span>
        </div>
        <el-row>
          <el-col :span='11'>
            <el-form-item label='合同编号：' required>
              <el-input v-model='postData.ContractNO' readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='纳税人类别：' required>
              <el-radio-group v-model="postData.AddedValue" @change="clearPaytype" disabled>
                <el-radio class="radio-style-bg" label='1'>小规模</el-radio>
                <el-radio class="radio-style-bg" label='2'>一般纳税人</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label='套餐类型：' required>
              <div>
                <div v-show="!isReadOnly" style="outline:none">
                  <div v-model="postData.payType" class="custom-check" v-for="item in payTypes[postData.AddedValue]" :class="{checked: value.id == item.id}" @click="toClick(item)">
                    <i v-if="value.id == item.id" class="fa fa-check" aria-hidden="true"></i>
                    {{item.title}}
                  </div>
                </div>
                <div v-show="isReadOnly" style="outline:none">
                  <div v-model="payTypeReadonly[0]" class="custom-check checked" v-for="item in payTypeReadonly">
                    <i class="fa fa-check" aria-hidden="true"></i>
                    {{item.PriceName}}
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top: 0">
          <el-col>
            <el-form-item label=''>
              <el-select v-model="postData.gift" placeholder="不选择礼包" @change="setEndDate" disabled>
                <el-option v-for="item in gifts[postData.AddedValue]" :key="item.Id" :label="item.GiftTypeName" :value="item.Id">
                </el-option>
              </el-select>
              <!-- <span v-if="postData.IsPromotion">
                <span>{{promotion}}</span>
                <el-checkbox v-if="promotion && promotion.PromotionName" v-model="postData.IsPromotion" disabled>{{promotion.PromotionName}}</el-checkbox>
                <span v-if="promotion && promotion.Num<20">(剩余{{promotion.Num}})</span>
              </span> -->
              <span>
                <span>{{postData.Promotion.PromotionName}}</span>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='11'>
            <el-form-item label='开始账期：' required>
              <el-date-picker v-model="postData.ServiceStart" type="month" @change="setEndDate" :clearable="false" :readonly="isReadOnly"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span='11'>
            <el-form-item label='结束账期：' required>
              <el-date-picker v-model="postData.ServiceEnd" type="month" :readonly="true"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span='15'>
            <el-form-item label='合同金额：' required>
              <el-input v-model='postData.ContractAmount' readonly></el-input>
            </el-form-item>
            <div style="padding-left:135px;color:red;margin-top: -10px;margin-bottom: 10px;font-size:14px">注:合同金额根据所属城市、纳税人类别、套餐类型自动计算，不包含礼包价格。</div>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="!view">
        <el-col>
          <el-form-item label='合同照片：' class="contract-style address-area">
            <div class="file-upload-area">
              <div v-for="(img, index) in imgs" :class="index == imgs.length - 1 ? 'file-upload-area-button' : 'file-upload-area-img-item'">
                <img-upl type="5" v-model='imgs[index]' :sign-key="signkey" :isClose="true" :sign-list="index == imgs.length - 1" @input="imgs.push({})" @delete="imgs.splice(index,1)"></img-upl>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="view">
        <el-col>
          <el-form-item label='合同照片：' class="contract-style address-area">
            <div v-if="typeof item === 'string'" class="img-style" v-for="item in imgs">
              <img-upl :value='item' :readonly='true'></img-upl>
            </div>
            <div class="contract-button" :class="{'contract-button-view' : imgs.length}">
              <el-button type="primary button-upload" name="button">点击上传</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='16'>
          <el-form-item class="text-area" label='备注：'>
            <el-input type='textarea' v-model='postData.Remark' :readonly="isReadOnly"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="postData.Status === 3" class='add-order-title'>
        <span>拒审原因</span>
      </div>
      <el-row v-if="postData.Status === 3">
        <el-col :span='16'>
          <el-form-item label='驳回原因：'>
            <!-- <el-input type='textarea' v-model='postData.BackReason' :readonly="true"></el-input> -->
            <div style="color:red;width:500px">{{postData.BackReason}}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="view != 3" style="text-align: center; margin-top: 40px">
        <el-button v-if="!view" type='primary' @click="submitForm()">保存</el-button>
        <el-button v-if="view" type='primary' @click="submitFormView()">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  balancecur,
  orderssales,
  citybychannel,
  urlsignkey,
  getpersoncardbypath,
  Prices,
  getChannelGift,
  getchannelpromotionbyorder,
  companyname,
  company,
  getcustomerlistbyty,
  getcustomerbyty,
  checkStatusByPersonalCard,
  addOrders,
  putOrders,
  putReorders,
  CheckIsConnectDate,
  orderTitle,
  orderszj,
  putOrderszj,
  supplementaryinfo
} from '@/api/api'
import Dialog from '@/service/dialog.js'
import CompanyInfo from '@/views/components/companyInfo'
import customUpload from '@/components/customUpload'
import ImageUploader from '@/components/imageUploader.vue'
export default {
  data() {
    return {
      postData: {
        AddedValue: '1',
        Name: '',
        IsPromotion: false,
        payTypes: [],
        gift: '',
        ServiceStart: ''
      },
      payTypeReadonly: [],
      balance: '',
      sales: [],
      isNewCompany: false, // 新公司需要预提单
      category: 1, // 是否是预提单 2 预提单 1正常 3记账准备
      xfReadonly: false, // 续费时候预提单选框不能点击
      citys: '',
      clearable: false,
      IsBusnissDeadlineReadonly: false,
      checked: false, // 营业时间无期限是否被选择
      isReadOnly: false, // 是否修改
      priceList: [], // 根据城市代码返回所有套餐类型
      payTypes: [], // 对所有套餐类型过滤 对应小规模和一般纳税人套餐类型
      value: '',
      giftList: [],
      gifts: [],
      promotion: {}, // 活动
      modify: false,
      imgs: [{}],
      signkey: {},
      companyList: [], // 本地数据库公司
      loading: false,
      canSearch: false,
      companyInfo: [], // 本地检索出数据后选择公司带出的信息
      orderId: '',
      searchType: 1, // 检索类型
      isLegalPersonReadonly: false,
      isAddressReadonly: false,
      isRegNOReadonly: false,
      isCompanyReadonly: false,
      isRegisteredCapitalReadonly: false,
      isBusinessScopeReadonly: false,
      IschoosePropmition: true, // 活动是否可选
      nameReadonly: false,
      promotionShow: false,
      view: 0,
      ServiceCompanyCode: '',
      isChangeCompanyName: false,
      isFirstcategory3: '' // 记账准备时候修改时才提示一致不一致公司
    }
  },
  watch: {
    'postData.Name': function () {
      if (!this.orderId) {
        if (!this.postData.Name) {
          $('.dropdown-company-list').parent().removeClass('open')
          this.searchError = ''
          return
        }
        if (this.postData.Name.length < 3) {
          $('.dropdown-company-list').parent().removeClass('open')
          return
        }
        this.searchError = ''
        if (this.companySelected) {
          $('.dropdown-company-list').parent().removeClass('open')
          return
        }
        this.getCompanyName(this.postData.Name, () => {
          if (this.postData.Name === '' || this.postData.Name.length < 3 || this.companyList.length === 0) {
            $('.dropdown-company-list').parent().removeClass('open')
          } else {
            $('.dropdown-company-list').parent().addClass('open')
          }
        })
      }
    },
    'postData.IsPromotion': function () {
      console.log(arguments, 'ispromotion')
      this.setEndDate()
      this.setprice()
    }
  },
  created() {
    this.orderId = this.$route.params.orderId
    let queryObj = this.$route.params
    console.log(queryObj, 'create')
    if (queryObj.orderId) { // 正常订单
      this.orderId = queryObj.orderId
    }
    if (queryObj.Name && queryObj.ServiceEnd) { // 续费订单
      this.companySelect(queryObj.Name)
      this.xfReadonly = true
      this.orderId = ''
      this.IsReOrder = true
    }
    if (parseInt(queryObj.view) === 1) { // 查看时候更新企业信息走的接口
      this.view = 1
    } else if (parseInt(queryObj.view) === 3) {
      this.view = 3
    }
    console.log(queryObj, this.view, 'view')
    console.log(this.orderId, 'this.orderId')
    if (this.orderId) {
      console.log('修改订单')
      this.getorderList(this.orderId)
    } else {
      this.initDict()
      this.$nextTick(() => {
        this.loading = true
      })
    }
    this.getBalance()
    this.getsignkey()
  },
  methods: {
    getorderList(OrderId) {
      console.log('修改')
      orderTitle(OrderId).then(res => {
        if (res.status) {
          this.companyInfo = res.data
          this.initDict((type) => {
            this.res = res.data
            if (type === 1) {
              console.log(this.priceList, 'this.priceList')
              console.log(this.res.PayType, 'this.res.PayType')
              var val = window._.filter(this.priceList, {
                'Id': +this.res.PayType
              })
              this.payTypeReadonly = $.extend(true, {}, val) // 用于查看时候只显示一条已经选中的
              console.log(this.payTypeReadonly, 'this.payTypeReadonly')
              this.postData.payType = val[0]
              this.value = this.postData.payType
              console.log(this.value, this.postData.payType, 'this.postData.payType')
              this.IsPromotionValid()
            } else if (type === 2) {
              console.log(this.giftList, 'this.giftList')
              var resultgift = window._.filter(this.giftList, {
                'Price': this.res.GiftPrice,
                'GiftTypeId': this.res.GiftTypeId,
                'AddedValue': this.res.Customer.AddedValue
              })
              console.log(resultgift, 'resultgift')
              if (resultgift && resultgift[0]) {
                this.postData.gift = +resultgift[0].Id.toString() || ''
              }
              console.log(this.postData.gift, 'this.postData.gift')
            }
          })
          var result = $.extend(true, {}, res.data, res.data.Customer)
          // 如果之前选择了活动 就默认显示之前已经选择了的活动 而不是现在能享受的最新活动 否则就显示现在最新能享受的活动
          if (result.IsPromotion && result.Promotion.PromotionName) {
            this.promotion = result.Promotion
          } else {
            this.getChannelUsePromotion()
          }
          console.log(this.promotion, 'this.promotion')
          // 处理当时检索出的信息时候 工商信息不能修改
          if (result.ServiceCompanyCode) {
            this.isCompanyReadonly = true
            this.isLegalPersonReadonly = true
            this.isRegNOReadonly = true
            this.isRegisteredCapitalReadonly = true
            this.isBusinessScopeReadonly = true
            this.isAddressReadonly = true
          } else {
            this.isCompanyReadonly = false
          }
          // 处理返回的时间
          if (result.BusnissDeadline.substr(0, 4) === '0001' || result.BusnissDeadline.substr(0, 4) === '9999') {
            result.BusnissDeadline = ''
            if (result.RegisterDate.substr(0, 4) !== '0001' && result.RegisterDate.substr(0, 4) !== '9999') {
              result.NoDeadLine = 1
              this.checked = true
              this.IsBusnissDeadlineReadonly = true
            }
          } else {
            result.BusnissDeadline = new Date(result.BusnissDeadline)
            result.NoDeadLine = 0
            this.checked = false
            this.IsBusnissDeadlineReadonly = false
          }
          if (result.ServiceStart.substr(0, 4) === '0001') {
            result.ServiceStart = ''
          } else {
            result.ServiceStart = new Date(result.ServiceStart)
          }
          if (result.RegisterDate.substr(0, 4) === '0001') {
            result.RegisterDate = ''
          } else {
            result.RegisterDate = new Date(result.RegisterDate)
          }
          if (result.ServiceEnd.substr(0, 4) === '0001') {
            result.ServiceEnd = ''
          } else {
            result.ServiceEnd = result.ServiceEnd.substr(0, 7)
          }
          if (result.NoDeadLine) {
            result.BusnissDeadline = ''
          }
          result.AddedValue = result.AddedValue + ''
          // 处理活动是不是默认选中
          result.IsPromotion = !!result.IsPromotion
          if (this.promotion && result.Status !== 2) { // 活动存在时候且是修改订单的时候 活动可被点击
            if (result.IsPromotion) {
              this.IsPromotionValid()
            } else {
              this.IschoosePropmition = false
            }
            // this.IschoosePropmition = false
          }
          // if (result.IsPromotion && this.promotion && result.Status !== 2) { // 活动存在时候且是修改订单的时候 活动可被点击
          //   this.IschoosePropmition = false
          // }
          // 处理合同照片
          if (result.Status !== 2) {
            if (result.ContractPath) {
              var path = result.ContractPath.split(';')
              path.push({})
              this.imgs = path
            } else {
              this.imgs = [{}]
            }
          } else {
            this.imgs = result.ContractPath ? result.ContractPath.split(';') : [{}]
          }
          // result.ContractPath = result.ContractPath ? result.ContractPath.split(';') : [{}]
          // this.imgs = window._.cloneDeep(this.imgs)
          console.log(this.imgs, 'this.imgs')
          // this.imgs = result.ContractPath
          // this.ServiceCompanyCode = result.ServiceCompanyCode
          console.log(result.ContractAmount, 'result')
          this.postData = result
          console.log(this.postData, result.ContractAmount, 'this.postData修改订单数据')
          console.log(this.postData.ContractAmount, 'ContractAmount')
          // 判断正式订单1 还是 预提单2 记账准备3
          this.isFirstcategory3 = result.Category
          this.category = result.Category
          // 判断是否是续费订单
          if (this.IsReOrder) {
            this.postData.Status = 1
          }
          // 根据category判断1是查看修改正式订单2预提单查看修改3预提单转正式订单查看修改
          if (this.category === 1 && result.Status !== 2) { // 正常订单未审核和拒审修改查看时候 活动可以选择
            if (result.ServiceCompanyCode) {
              this.isCompanyReadonly = true // 检索出的信息不能修改
            } else {
              this.isCompanyReadonly = false
            }
            this.$nextTick(() => {
              this.loading = true
            })
          }
          // if ($stateParams.isView) {
          //   this.isReadOnly = true;
          //   this.category = result.Category;
          //   this.isChangeCompanyName = true
          //   return
          // }
          if ((result.Category === 2 && result.Status === 2) || result.Category === 3) {
            // 预提单初审通过 || 记账准备时候 之前填的基本信息和合同信息都不允许修改 只需要补充公司资料即可
            this.category = 3
            this.isNewCompany = true
            this.complementCompanyInfo = true // 补全公司信息的时候 其他两项不允许修改
            if (result.Status !== 2 && result.Category === 3) { // 复审未审核时 再点击记账准备 此时公司名称不能修改
              this.isChangeCompanyName = true // 此时公司名字不能修改
            }
            if (result.Status === 2 && result.Category === 3) { // 如果复审也通过 就全部不许修改
              this.isReadOnly = true
              this.$nextTick(() => {
                this.loading = true
              })
              this.isChangeCompanyName = true // 此时公司名字不能修改
              if (!this.postData.IsPromotion) { // 老订单之前没参加活动就不显示活动和礼包
                this.promotionShow = true
              }
            }
          }
          if (this.postData.Status === 2 && this.category !== 3) { // 审核通过的正式订单和预提单只能只读状态
            this.isReadOnly = true
            this.$nextTick(() => {
              this.loading = true
            })
            if (!this.postData.IsPromotion) {
              this.promotionShow = true
            }
          } else {
            if (this.category !== 3) { // 订单未审核修改或者拒审修改
              if (this.category === 2 && result.Status !== 2) {
                this.isNewCompany = true
                this.$nextTick(() => {
                  this.loading = true
                })
              }
            }
          }
        }
      })
    },
    toCheck() {
      this.searchError = ''
      this.searchType = 2
      if (!this.postData.Name) {
        // this.searchError = '请输入公司名称！'
        this.$message({
          message: '请输入公司名称！',
          type: 'warning'
        })
        return
      }
      if (this.postData.Name && this.postData.Name.length < 3) {
        // this.searchError = '请输入准确完整的公司名称！'
        this.$message({
          message: '请输入准确完整的公司名称！',
          type: 'warning'
        })
        return
      }
      this.getMoreCompanyName(this.postData.Name, () => {
        // this.searchError = this.companyList ? '' : '抱歉，没有检索到公司信息！'
        if (!this.companyList) {
          this.$message({
            message: '抱歉，没有检索到公司信息！',
            type: 'warning'
          })
          return
        }
        if (this.postData.Name === '' || this.postData.Name.length < 3 || this.companyList.length === 0) {
          $('.dropdown-company-list').parent().removeClass('open')
        } else {
          $('.dropdown-company-list').parent().addClass('open')
        }
      })
    },
    getCompanyName(val, cb) {
      return companyname(encodeURI(val)).then(res => {
        if (res.status) {
          this.companyList = res.data
          cb && cb()
        }
      })
    },
    getMoreCompanyName(val, cb) {
      getcustomerlistbyty(encodeURI(val)).then(res => {
        if (res.status) {
          for (var i in res.data) {
            res.data[i]['Name'] = res.data[i].name
          }
          this.companyList = res.data
          cb && cb()
        }
      })
    },
    companySelect(name, id) {
      $('.dropdown-company-list').parent().removeClass('open')
      this.companySelected = true
      this.isCompanyReadonly = false // 不是检索出的信息可以修改
      if (this.searchType === 1) {
        company(encodeURI(name)).then(res => {
          this.companyInfo = res.data[0]
          var data = res.data[0]
          if (data.ServiceCompanyCode) {
            this.isCompanyReadonly = true
            this.isLegalPersonReadonly = true
            this.isRegNOReadonly = true
            this.isRegisteredCapitalReadonly = true
            this.isBusinessScopeReadonly = true
            this.isAddressReadonly = true
          }
          if (data.SalesId) delete data.SalesId
          if (data.BusnissDeadline) {
            if (data.BusnissDeadline.substr(0, 4) === '0001' || data.BusnissDeadline.substr(0, 4) === '9999') {
              data.BusnissDeadline = ''
              data.NoDeadLine = 1
              this.checked = true
              this.IsBusnissDeadlineReadonly = true
            } else {
              data.BusnissDeadline = new Date(data.BusnissDeadline)
              data.NoDeadLine = 0
              this.checked = false
              this.IsBusnissDeadlineReadonly = false
            }
          } else {
            data.BusnissDeadline = ''
            data.NoDeadLine = 1
            this.checked = true
            this.IsBusnissDeadlineReadonly = true
          }
          data.Name = data.Name.trim()
          data.AddedValue = '' + data.AddedValue
          data.AddedValue = '' + data.AddedValue
          if (!data.RegisterDate) {
            data.RegisterDate = ''
          } else {
            data.RegisterDate = new Date(data.RegisterDate)
          }
          this.postData = $.extend(true, {}, this.postData, data)
          console.log(this.postData, 'this.postData')
          setTimeout(function() {
            this.companySelected = false
          }, 0)
        })
      } else {
        getcustomerbyty(id).then(res => {
          var data = res.data
          if (!data) {
            this.$message({
              message: '抱歉，没有检索到公司信息！',
              type: 'warning'
            })
            return
          }
          this.searchCompanyInfo = res.data // 清空公司信息时候使用
          console.log(this.isFirstcategory3, 'this.isFirstcategory3')
          if (this.orderId && +this.isFirstcategory3 !== 2) { // 如果修改的时候 判断公司名称是否相同 相同覆盖不相同不覆盖
            if (this.postData.Name && this.postData.Name !== data.CompanyName) {
              this.$message({
                message: '客户名称不一致，不允许修改！如需修改工商信息，请删除订单后重提',
                type: 'warning'
              })
              return
            }
          }
          // 如果续费的时候点击检索需要判断公司名称是否和之前的一样
          if (this.xfReadonly) {
            if (this.postData.Name && this.postData.Name !== data.CompanyName) {
              this.$message({
                message: '客户名称不一致，不允许修改！如需修改工商信息，请删除订单后重提',
                type: 'warning'
              })
              return
            }
          }
          console.log(this.postData.Name, data.CompanyName)
          console.log(this.postData.Name !== data.CompanyName)
          if (this.orderId && this.postData.Status === 2 && +this.isFirstcategory3 !== 2) { // 审核通过的订单而且不是记账准备的订单
            if (this.postData.Name && this.postData.Name !== data.CompanyName) {
              this.$message({
                message: '客户名称不一致，不允许修改！如需修改工商信息，请删除订单后重提',
                type: 'warning'
              })
              return
            }
          }
          // if (this.orderId) {
          //   this.postData.Customer.IsSync = 1 // 目的 手动添加的订单修改的时候更新工商网信息时 再上传身份证不一致判断
          // }
          if (data.ServiceCompanyCode) {
            this.postData.IsSync = 1
          }
          // 原则只要检索出就覆盖 不需要判断原来有值没值
          if (data.BusnissDeadline && data.BusnissDeadline.substr(0, 4) !== '0001' && data.BusnissDeadline.substr(0, 4) !== '9999') {
            data.BusnissDeadline = new Date(data.BusnissDeadline)
            this.postData.BusnissDeadline = data.BusnissDeadline
            data.NoDeadLine = 0
            this.postData.NoDeadLine = 0
            this.checked = false
            this.IsBusnissDeadlineReadonly = true
            this.isCompanyReadonly = true
          } else { // 没有营业结束期限 但是有开始期限默认选择无期限要
            if (data.RegisterDate && data.BusnissDeadline.substr(0, 4) !== '0001' && data.BusnissDeadline.substr(0, 4) !== '9999') {
              data.NoDeadLine = 1
              this.postData.NoDeadLine = 1
              this.checked = true
              this.IsBusnissDeadlineReadonly = true
              this.isCompanyReadonly = true
            }
          }
          this.postData.Name = data.CompanyName.trim()
          if (data.RegisterDate) {
            this.postData.RegisterDate = new Date(data.RegisterDate)
          }
          // if (!data.RegisterDate) {
          //   data.RegisterDate = ''
          // } else {
          //   data.RegisterDate = new Date(data.RegisterDate)
          // }
          // 处理检索出赋值没检索出不覆盖
          if (data.LegalPerson) {
            this.postData.LegalPerson = data.LegalPerson
          }
          if (data.Address) {
            this.postData.Address = data.Address
          }
          if (data.RegNO) {
            this.postData.RegNO = data.RegNO
          }
          if (data.RegisteredCapital) {
            this.postData.RegisteredCapital = data.RegisteredCapital
          }
          if (data.BusinessScope) {
            this.postData.BusinessScope = data.BusinessScope
          }
          // 且新增或者记账准备时候没值得话可编辑
          console.log(this.orderId, 'this.orderId')
          if (!this.orderId || (this.orderId && this.postData.Category === 2)) {
            if (data.LegalPerson) {
              this.isLegalPersonReadonly = true
            }
            if (data.Address) {
              this.isAddressReadonly = true
            }
            if (data.RegNO) {
              this.isRegNOReadonly = true
            }
            if (data.RegisteredCapital) {
              this.isRegisteredCapitalReadonly = true
            }
            if (data.BusinessScope) {
              this.isBusinessScopeReadonly = true
            }
          }
          this.ServiceCompanyCode = data.ServiceCompanyCode
          // if (data.RegisterDate) { this.isCompanyReadonly = true } else { this.isCompanyReadonly = false }
          // if (data.RegisteredCapital) { this.isRegisteredCapitalReadonly = true } else { this.isRegisteredCapitalReadonly = false }
          // if (data.BusinessScope) { this.isBusinessScopeReadonly = true } else { this.isBusinessScopeReadonly = false }
          // this.postData = $.extend(true, {}, this.postData, data)
          setTimeout(() => {
            this.companySelected = false
          }, 0)
        })
      }
    },
    clearCompanyInfo() { // 检索出的信息当修改公司名称时候 工商信息清空
      if (!this.searchCompanyInfo) { // 手动录入
        return
      }
      if (this.searchType !== 1 && this.postData.Name !== this.searchCompanyInfo.CompanyName) {
        this.postData.LegalPerson = ''
        this.postData.Address = ''
        this.postData.RegNO = ''
        this.postData.RegisterDate = ''
        this.postData.ServiceCompanyCode = ''
        this.postData.IsSync = 0
        if (this.postData.NoDeadLine) {
          this.checked = false
          this.IsBusnissDeadlineReadonly = false
        } else {
          this.postData.BusnissDeadline = ''
          this.IsBusnissDeadlineReadonly = false
        }
        this.postData.RegisteredCapital = ''
        this.postData.BusinessScope = ''
        this.searchType = 1
        this.isCompanyReadonly = false
        this.isLegalPersonReadonly = false
        this.isRegNOReadonly = false
        this.isRegisteredCapitalReadonly = false
        this.isBusinessScopeReadonly = false
        this.isAddressReadonly = false
      }
    },
    fastCheck() { // 同步官方
      Dialog(CompanyInfo, {}).then(res => {
        console.log(res, 'res')
        if (res && res.CompanyName) {
          if (this.orderId && this.isFirstcategory3 !== 2) {
            if (this.postData.Name && this.postData.Name !== res.CompanyName) {
              this.$message({
                message: '客户名称不一致，不允许修改！如需修改工商信息，请删除订单后重提',
                type: 'warning'
              })
              return
            }
          }
          if (this.xfReadonly) { // 如果续费的时候点击检索需要判断公司名称是否和之前的一样
            if (this.postData.Name && this.postData.Name !== res.CompanyName) {
              this.$message({
                message: '客户名称不一致，不允许修改！如需修改工商信息，请删除订单后重提',
                type: 'warning'
              })
              return
            }
          }
          if (this.orderId && this.postData.Status === 2) { // 审核通过的订单
            if (this.postData.Name && this.postData.Name !== res.CompanyName) {
              this.$message({
                message: '客户名称不一致，不允许修改！如需修改工商信息，请删除订单后重提',
                type: 'warning'
              })
              return
            }
          }
          // 返回有值需要做之前可编辑处理 新增或者记账准备的时候才有这个规则 否则有就覆盖没有不覆盖
          if (res.ServiceCompanyCode) {
            this.postData.IsSync = 1
          }
          if (res.BusnissDeadline && res.BusnissDeadline.substr(0, 4) !== '0001' && res.BusnissDeadline.substr(0, 4) !== '9999') {
            res.BusnissDeadline = new Date(res.BusnissDeadline)
            this.postData.BusnissDeadline = res.BusnissDeadline
            res.NoDeadLine = 0
            this.postData.NoDeadLine = 0
            this.checked = false
            this.IsBusnissDeadlineReadonly = true
            this.isCompanyReadonly = true
          } else { // 没有营业结束期限 但是有开始期限默认选择无期限要
            if (res.RegisterDate && res.BusnissDeadline.substr(0, 4) !== '0001' && res.BusnissDeadline.substr(0, 4) !== '9999') {
              res.NoDeadLine = 1
              this.postData.NoDeadLine = 1
              this.checked = true
              this.IsBusnissDeadlineReadonly = true
              this.isCompanyReadonly = true
            }
          }
          this.postData.Name = res.CompanyName.trim()
          if (res.RegisterDate) {
            this.postData.RegisterDate = new Date(res.RegisterDate)
          }
          // 处理检索出赋值没检索出不覆盖
          if (res.LegalPerson) {
            this.postData.LegalPerson = res.LegalPerson
          }
          if (res.Address) {
            this.postData.Address = res.Address
          }
          if (res.RegNO) {
            this.postData.RegNO = res.RegNO
          }
          if (res.RegisteredCapital) {
            this.postData.RegisteredCapital = res.RegisteredCapital
          }
          if (res.BusinessScope) {
            this.postData.BusinessScope = res.BusinessScope
          }
          console.log(this.orderId, 'this.orderId')
          if (!this.orderId || (this.orderId && this.postData.Category === 2)) {
            if (res.LegalPerson) {
              this.isLegalPersonReadonly = true
            }
            if (res.Address) {
              this.isAddressReadonly = true
            }
            if (res.RegNO) {
              this.isRegNOReadonly = true
            }
            if (res.RegisteredCapital) {
              this.isRegisteredCapitalReadonly = true
            }
            if (res.BusinessScope) {
              this.isBusinessScopeReadonly = true
            }
          }
          // if (this.orderId && this.postData.Category !== 2) {
          //   this.isCompanyReadonly = false
          //   this.postData.LegalPerson = ''
          //   this.isLegalPersonReadonly = false
          //   this.postData.Address = ''
          //   this.isAddressReadonly = false
          //   this.postData.RegNO = ''
          //   this.isRegNOReadonly = false
          //   this.postData.RegisterDate = ''
          //   this.postData.BusnissDeadline = ''
          // }
          // if (this.orderId) {
          //   this.postData.Customer.IsSync = 1 // 目的 手动添加的订单修改的时候更新工商网信息时 再上传身份证不一致判断
          // }
          // if (this.postData.NoNoDeadLine) {
          //   this.postData.NoNoDeadLine = 0
          // }
          // this.postData.RegisteredCapital = ''
          // this.isRegisteredCapitalReadonly = false
          // this.postData.BusinessScope = ''
          // this.isBusinessScopeReadonly = false
          this.resultInfo = res // 清空公司时需要使用这个数据判断是否清空法人姓名
          this.searchType = 3 // 标记是快速录入获取到的信息
          this.isCompanyReadonly = true // 检索出的信息只读
          this.searchCompanyInfo = res // 检索出的信息赋值到其他 来确定公司名称在提交之前是否修改 修改则检索出的信息清空
          // this.nameReadonly = false // 检索出后公司名称可以修改
          // if (res.Address) {
          //   this.isAddressReadonly = true
          // }
          // this.postData.Address = res.Address
          // if (res.BusinessScope) {
          //   this.isBusinessScopeReadonly = true
          // }
          // this.postData.BusinessScope = res.BusinessScope
          // if (!res.BusnissDeadline || res.BusnissDeadline.substr(0, 4) === '9999' || res.BusnissDeadline.substr(0, 4) === '0001') {
          //   if (res.RegisterDate) {
          //     this.postData.NoDeadLine = 1
          //     this.checked = true
          //     this.IsBusnissDeadlineReadonly = true
          //   }
          //   this.postData.BusnissDeadline = ''
          // } else {
          //   this.postData.BusnissDeadline = new Date(res.BusnissDeadline)
          //   this.postData.NoDeadLine = 0
          //   this.checked = false
          //   this.IsBusnissDeadlineReadonly = false
          // }
          // this.postData.Name = res.CompanyName
          // if (res.LegalPerson) {
          //   this.isLegalPersonReadonly = true
          //   if (this.orderId) {
          //     if (this.postData && this.postData.Customer && this.postData.Customer.LegalPerson && this.postData.Customer.LegalPerson !== res.LegalPerson) { // 先上传身份证再检索出的公司法人姓名和身份证不一致时候
          //       this.postData.LegalPerson = res.LegalPerson
          //       this.postData.PersonCardID = ''
          //       this.postData.PersonCardPath = ''
          //     } else {
          //       this.postData.LegalPerson = res.LegalPerson
          //     }
          //   } else {
          //     if (this.postData && this.postData.LegalPerson && this.postData.LegalPerson !== res.LegalPerson) { // 先上传身份证再检索出的公司法人姓名和身份证不一致时候
          //       this.postData.LegalPerson = res.LegalPerson
          //       this.postData.PersonCardID = ''
          //       this.postData.PersonCardPath = ''
          //     } else {
          //       this.postData.LegalPerson = res.LegalPerson
          //     }
          //   }
          // } else {
          //   this.isLegalPersonReadonly = false
          // }
          // if (res.RegNO) {
          //   this.isRegNOReadonly = true
          // }
          // this.postData.RegNO = res.RegNO
          // if (res.RegisterDate) {
          //   this.isRegisterDateReadonly = true
          // }
          // this.postData.RegisterDate = new Date(res.RegisterDate)
          // if (res.RegisteredCapital) {
          //   this.isRegisteredCapitalReadonly = true
          // }
          // this.postData.RegisteredCapital = res.RegisteredCapital
          this.postData.ServiceCompanyCode = res.ServiceCompanyCode
        } else {
          this.$message({
            message: '抱歉，没有检索到企业信息，请重试或手动录入！',
            type: 'warning'
          })
        }
      })
    },
    initDict(cb) {
      orderssales().then(res => {
        if (res.status) {
          this.sales = res.data
        }
      })
      citybychannel().then(res => {
        this.citys = res.data
        if (!this.postData.CityCode) { // 默认选择第一个城市
          this.postData.CityCode = this.citys[0].CityCode
          this.getPriceList()
        } else {
          this.getPriceList(cb)
        }
      })
      this.getGifts(cb)
      this.getChannelUsePromotion()
    },
    getBalance() {
      balancecur().then(res => {
        if (res.status) {
          this.balance = res.data
        }
      })
    },
    getPriceList(cb) {
      console.log(this.postData.CityCode, 'this.postData.CityCode')
      let obj = {
        cityCode: this.postData.CityCode
      }
      if (this.isReadOnly) {
        obj.ischeck = 1 // 后端处理旧数据需要
        Prices(obj).then(res => {
          const payTypes = []
          if (res.data) {
            this.priceList = res.data
            cb && cb(1)
            for (var i in res.data) {
              if (!payTypes[res.data[i].AddedValue]) {
                payTypes[res.data[i].AddedValue] = []
              }
              res.data[i]['id'] = res.data[i].Id
              res.data[i]['title'] = res.data[i].PriceName
              payTypes[res.data[i].AddedValue].push(res.data[i])
            }
          }
          this.payTypes = payTypes
          console.log(this.payTypes, 'payTypes')
        })
      } else {
        console.log(obj, 'obj')
        Prices(obj).then(res => {
          if (res.data) {
            const payTypes = []
            this.priceList = res.data
            cb && cb(1)
            for (var i in res.data) {
              if (!payTypes[res.data[i].AddedValue]) {
                payTypes[res.data[i].AddedValue] = []
              }
              res.data[i]['id'] = res.data[i].Id
              res.data[i]['title'] = res.data[i].PriceName
              payTypes[res.data[i].AddedValue].push(res.data[i])
            }
            this.payTypes = payTypes
          }
          console.log(this.payTypes, 'payTypes')
        })
      }
    },
    getGifts(cb) {
      getChannelGift({ChannelId: ''}).then(res => {
        if (res.status) {
          const gifts = []
          this.giftList = res.data // 用于选择礼包后计算结束账期所用数据
          cb && cb(2)
          for (var i in res.data) {
            if (res.data[i].Num === 0 && res.data[i].Id === this.postData.gift) {
              res.data[i].Num += 1
            }
            if (res.data[i].Num > 0) {
              res.data[i].GiftTypeName = res.data[i].GiftTypeName + '￥' + res.data[i].Price
              if (!gifts[res.data[i].AddedValue]) {
                gifts[res.data[i].AddedValue] = [{
                  AddedValue: res.data[i].AddedValue,
                  Id: '',
                  Num: 900,
                  GiftTypeName: '不使用礼包'
                }]
              }
              gifts[res.data[i].AddedValue].push(res.data[i])
            }
          }

          this.gifts = gifts
        }
      })
    },
    getChannelUsePromotion() {
      getchannelpromotionbyorder().then(res => {
        if (res.status) {
          if (!this.postData.IsPromotion) {
            this.promotion = res.data
            // 注意修改的时候需要 之前选择了活动 就默认显示之前已经选择了的活动 而不是现在能享受的最新活动 否则就显示现在最新能享受的活动 418行
          }
        }
      })
    },
    setCategory() {
      if (this.postData.OrderId) return
      if (this.isNewCompany) {
        this.category = 2
      } else {
        this.category = 1
      }
    },
    BusnissDeadlineCanBeChoose() { // 判断营业期限是无限期的时候 结束账期不能选择
      console.log('aaa')
      if (this.checked) {
        this.postData.BusnissDeadline = ''
        this.IsBusnissDeadlineReadonly = true
        this.postData.NoDeadLine = 1
      } else {
        this.IsBusnissDeadlineReadonly = false
        this.postData.NoDeadLine = 0
      }
    },
    uploaded () {
      console.log(this.postData.PersonCardPath)
      var path = this.postData.PersonCardPath
      getpersoncardbypath(path).then(data => {
        console.log(data)
        if (data.status && data.data.LegalPerson) {
          if (this.orderId && this.postData.Category !== 2) {
            if (this.postData.Customer.ServiceCompanyCode && this.postData.LegalPerson && this.postData.LegalPerson === data.data.LegalPerson && this.isLegalPersonReadonly) { // 意思是检索出来了
              this.postData.LegalPerson = data.data.LegalPerson
              this.postData.PersonCardID = data.data.PersonCardID
            } else if (this.postData.Customer.ServiceCompanyCode && this.postData.LegalPerson && this.postData.LegalPerson !== data.data.LegalPerso && this.isLegalPersonReadonly) {
              this.postData.PersonCardPath = ''
              this.$message({
                message: '身份证上的法人姓名与营业执照上的法人不符！',
                type: 'warning'
              })
            } else {
              this.postData.LegalPerson = data.data.LegalPerson
              this.postData.PersonCardID = data.data.PersonCardID
            }
          } else {
            if (this.xfReadonly && this.companyInfo && this.companyInfo.ServiceCompanyCode) { // 如果是续费的话
              if (this.postData.LegalPerson && this.postData.LegalPerson === data.data.LegalPerson) {
                this.postData.LegalPerson = data.data.LegalPerson
                this.postData.PersonCardID = data.data.PersonCardID
              } else if (this.postData.LegalPerson && this.postData.LegalPerson !== data.data.LegalPerso) {
                this.postData.PersonCardPath = ''
                this.$message({
                  message: '身份证上的法人姓名与营业执照上的法人不符！',
                  type: 'warning'
                })
              } else {
                this.postData.LegalPerson = data.data.LegalPerson
                this.postData.PersonCardID = data.data.PersonCardID
              }
            } else {
              if (this.searchType !== 1 && this.postData.LegalPerson && this.postData.LegalPerson === data.data.LegalPerson) { // 意思是检索出来了 && this.isLegalPersonReadonly
                this.postData.LegalPerson = data.data.LegalPerson
                this.postData.PersonCardID = data.data.PersonCardID
              } else if (this.searchType !== 1 && this.postData.LegalPerson && this.postData.LegalPerson !== data.data.LegalPerso) { // && this.isLegalPersonReadonly
                this.postData.PersonCardPath = ''
                this.$message({
                  message: '身份证上的法人姓名与营业执照上的法人不符！',
                  type: 'warning'
                })
              } else {
                this.postData.LegalPerson = data.data.LegalPerson
                this.postData.PersonCardID = data.data.PersonCardID
              }
            }
          }
          console.log(this.postData, '1')
          this.postData = $.extend(true, {}, this.postData)
          console.log(this.postData, '2')
        } else if (data.status && !data.data) {
          this.$message({
            message: '无法识别身份信息，请上传清晰的身份证或手动输入法人、法人身份证号！',
            type: 'warning'
          })
        }
      })
    },
    getsignkey() {
      urlsignkey().then((res) => {
        delete res.data.Filename
        delete res.data.key
        delete res.data.callback
        delete res.data.expire
        delete res.data.Host
        this.signkey = res.data
      })
    },
    clearPaytype() {
      // 切换公司性质时候清空套餐类型
      console.log(this.loading, 'this.loading')
      if (this.loading) {
        this.postData.payType = ''
        this.postData.gift = ''
        this.value = ''
        this.postData.IsPromotion = false
        this.postData.ServiceStart = ''
        this.postData.ServiceEnd = ''
        this.postData.ContractAmount = ''
      }
    },
    promitionCanChoose() {
      // 根据套餐类型判断现在的活动是否可选
    },
    toClick(item) { // 选中套餐类型
      console.log(this.category, 'this.category')
      if (this.category === 3) {
        return
      }
      this.value = item
      this.postData.payType = item
      console.log(this.postData.payType)
      this.IsPromotionValid()
      this.setEndDate()
      this.setprice()
    },
    IsPromotionValid() { // 判断活动是否可选
      console.log(this.postData.payType, 'this.postData.payType')
      if (!this.postData.payType) {
        this.postData.IsPromotion = false
        this.IschoosePropmition = true
        return
      }
      var val = window._.find(this.priceList, {
        'Id': +this.postData.payType.Id
      })
      if (!val) {
        this.postData.IsPromotion = false
        this.IschoosePropmition = true
        return
      }
      // 选择套餐类型 且活动存在
      if (this.promotion) {
        var p = this.promotion.PromotionDetailsEntityList
        for (var i = 0; i < p.length; i++) {
          if (val.IsZero === 0 && p[i].ServiceMonths !== 0 && this.promotion.Num !== 0) {
            if (p[i].ServiceMonths === val.ServiceMonths) {
              this.IschoosePropmition = false
              if (this.orderId) {
                if (this.postData.IsPromotion) {
                  this.postData.IsPromotion = true
                } else {
                  this.postData.IsPromotion = false
                }
              } else {
                this.postData.IsPromotion = true
              }
              return
            }
          } else if (val.IsZero === 1 && p[i].ServiceMonths === 0 && this.promotion.Num !== 0) {
            this.IschoosePropmition = false
            if (this.orderId) {
              if (this.postData.IsPromotion) {
                this.postData.IsPromotion = true
              } else {
                this.postData.IsPromotion = false
              }
            } else {
              this.postData.IsPromotion = true
            }
            return
          }
        }
      }
      this.postData.IsPromotion = false
      this.IschoosePropmition = true
    },
    setEndDate() {
      if (!this.postData.ServiceStart) return
      if (!this.postData.payType) return
      if (this.postData.FreChangeOrderId) return
      if (this.isReadOnly) return
      var payType = window._.find(this.priceList, {
        'Id': +this.postData.payType.Id
      })
      if (!payType) return
      var addMonth = payType.ServiceMonths // 正常合同的服务月份
      var giftAndPromotionMonth = 0
      if (this.postData.gift) {
        var gift = window._.find(this.giftList, (item) => {
          return item.Id === +this.postData.gift
        })
        console.log(gift, 'gift')
        giftAndPromotionMonth = giftAndPromotionMonth + gift.MonthNum
      }
      if (this.promotion && this.postData.IsPromotion && +this.promotion.PromotionType === 1) {
      // 根据选择的付款方式就是addMonth 判断活动送几个月
        var p = this.promotion.PromotionDetailsEntityList
        for (var i = 0; i < p.length; i++) {
          // console.log(p[i].ServiceMonths, 'p[i].ServiceMonths')
          if (p[i].ServiceMonths === 0 && payType.IsZero === 1) {
            giftAndPromotionMonth += p[i].PromotionMonths
          }
          if (p[i].ServiceMonths === addMonth && payType.IsZero !== 1) {
            giftAndPromotionMonth += p[i].PromotionMonths
          }
        }
      }
      addMonth += giftAndPromotionMonth
      var date = new Date(this.postData.ServiceStart)
      var enddate = new Date(date.setMonth(date.getMonth() + addMonth - 1))
      this.postData.ServiceEnd = enddate.format('yyyy-MM')
      this.checkboxChange()
    },
    setprice() {
      if (this.isReadOnly) {
        return this.postData.ContractAmount
      }
      if (this.priceList.length === 0) {
        return this.postData.ContractAmount
      }
      // if (this.postData.payType && this.postData.payType.Id) {
      //   var val = window._.find(this.priceList, {
      //       'Id': +this.postData.payType.Id
      //   })
      // } else {
      //   val = window._.find(this.priceList, { // 修改时候套餐类型
      //      'Id': +this.postData.PayType
      //  })
      // }
      this.postData.ContractAmount = this.setContractAmount()
      // return ''
    },
    setContractAmount() {
      if (this.postData.payType && this.postData.payType.Id) {
        var val = window._.find(this.priceList, {
          'Id': +this.postData.payType.Id
        })
      } else {
        val = window._.find(this.priceList, { // 修改时候套餐类型
          'Id': +this.postData.PayType
        })
      }
      if (val) {
        if (!this.postData.IsPromotion) { // 没有选择活动 根据选择付款方式返回价格
          return val.Price
        } else if (this.promotion && this.postData.IsPromotion) { // 如果有活动而且选择了 根据付款方式及活动方式确认价格
          if (this.promotion.PromotionType === 1) { // 只增加服务时长
            return val.Price
          } else if (this.promotion.PromotionType === 2) { // 活动导致价格减少
            // 判断付款方式是不是可以选择当前活动, 如果选择了判断减几个月价格(需要判断小规模还是一般纳税人)
            var p = this.promotion.PromotionDetailsEntityList
            this.price = ''
            for (var i = 0; i < p.length; i++) {
              if (val.IsZero === 1 && p[i].ServiceMonths === 0) { // 零税半年
                var serveMoney = val.Price / 6
              } else if (val.IsZero !== 1 && p[i].ServiceMonths === val.ServiceMonths) { // 其他
                serveMoney = val.Price / val.ServiceMonths
              }
              if (!serveMoney) {
                continue
              }
              this.price = val.Price - serveMoney * p[i].PromotionMonths
              if ((this.price + '').indexOf('.') > -1) {
                this.price = this.price.toFixed(2)
              }
              break
            }
            return this.price
          }
        }
      }
      return ''
    },
    goOrderList() {
      this.$router.push({name: 'main.conchange'})
    },
    submitFormView() {
      if (this.postData.Status === 2) {
        var postData = this.postData
        if (postData.IsPromotion && postData.OrderId && postData.Promotion.PromotionDetailsEntityList.length) {
          postData.IsPromotion = postData.Promotion.Id // 已经参加的活动
        } else if (postData.IsPromotion && this.promotion.Id) {
          postData.IsPromotion = this.promotion.Id // 新活动
        } else {
          postData.IsPromotion = 0
        }
        if (postData.gift) {
          var gift = window._.find(this.giftList, (item) => {
            return item.Id === +this.postData.gift
          })
          postData.GiftTypeId = gift.GiftTypeId
          postData.GiftTypeName = gift.GiftTypeName.slice(0, 3)
          postData.GiftPrice = gift.Price
          delete postData.gift
        } else {
          delete postData.GiftTypeId
          delete postData.GiftTypeName
          delete postData.GiftPrice
        }
        delete this.postData.payType
        postData.ServiceCompanyCode = postData.ServiceCompanyCode ? postData.ServiceCompanyCode : this.ServiceCompanyCode
        putOrders(this.postData.OrderId, postData).then(res => {
          if (res.status) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$router.push({name: 'main.orderList'})
          }
        })
      }
    },
    submitForm () {
      console.log(this.postData, '保存提交正式订单')
      var h = (new Date()).getHours()
      var date = ((new Date()).getTime()) + 24 * 60 * 60 * 1000
      var m = (new Date(date)).getDate()
      if (m === 1 && h > 21) {
        this.$message({
          message: '月末22:00之后不允许提单！',
          type: 'warning'
        })
        return
      }
      if (!this.postData.SalesId) {
        this.$message({
          message: '请先选择销售人员！',
          type: 'warning'
        })
        return
      }
      if (this.IsReOrder) this.postData.IsReOrder = 1 // 再次提交订单时
      var postData = $.extend(true, {}, this.postData)
      // var imgs = $.extend(true, {}, this.imgs)
      if (postData.IsPromotion && postData.OrderId && postData.Promotion.PromotionDetailsEntityList.length) {
        postData.IsPromotion = postData.Promotion.Id // 已经参加的活动
      } else if (postData.IsPromotion && this.promotion.Id) {
        postData.IsPromotion = this.promotion.Id // 新活动
      } else {
        postData.IsPromotion = 0
      }
      if (!postData.Name && this.category !== 2) {
        this.$message({
          message: '请填写公司名称',
          type: 'warning'
        })
        return
      }
      if (!postData.CityCode) {
        this.$message({
          message: '请选择所在城市',
          type: 'warning'
        })
        return
      }
      if (!postData.Contacts) {
        this.$message({
          message: '请填写联系人',
          type: 'warning'
        })
        return
      }
      if (!postData.Mobile || (postData.Mobile && postData.Mobile.length < 11)) {
        this.$message({
          message: '请填写完整手机号',
          type: 'warning'
        })
        return
      }
      if (!postData.LegalPerson) {
        this.$message({
          message: '请填写法人姓名',
          type: 'warning'
        })
        return
      }
      if (!postData.PersonCardPath && postData.Status !== 2) {
        this.$message({
          message: '请上传法人身份证',
          type: 'warning'
        })
        return
      }
      if (!postData.PersonCardID && postData.Status !== 2) {
        this.$message({
          message: '请输入身份证号',
          type: 'warning'
        })
        return
      }
      if (!postData.Address && this.category !== 2) {
        this.$message({
          message: '请填写公司住所',
          type: 'warning'
        })
        return
      }
      if (!postData.RegNO && this.category !== 2) {
        this.$message({
          message: '请填写社会统一信用代码或者注册号',
          type: 'warning'
        })
        return
      }
      if (this.checked) {
        postData.BusnissDeadline = ''
        postData.NoDeadLine = 1
        this.IsBusnissDeadlineReadonly = true
      } else {
        postData.NoDeadLine = 0
        this.IsBusnissDeadlineReadonly = false
      }
      console.log(!postData.NoDeadLine, !postData.BusnissDeadline, this.category !== 2)
      if (!postData.NoDeadLine && !postData.BusnissDeadline && this.category !== 2) {
        this.$message({
          message: '请填写营业期限',
          type: 'warning'
        })
        return
      }
      if (!postData.RegisteredCapital && this.category !== 2) {
        this.$message({
          message: '请填写注册资金',
          type: 'warning'
        })
        return
      }
      if (!postData.BusinessScope && this.category !== 2) {
        this.$message({
          message: '请填写经营范围',
          type: 'warning'
        })
        return
      }
      if (!postData.BusinessLicense && this.category !== 2) {
        this.$message({
          message: '请上传营业执照',
          type: 'warning'
        })
        return
      }
      if (!postData.ContractNO && this.category !== 2) {
        this.$message({
          message: '请填写合同编号',
          type: 'warning'
        })
        return
      }
      if (!postData.payType) {
        this.$message({
          message: '请选择套餐类型',
          type: 'warning'
        })
        return
      }
      if (!postData.ServiceStart && this.category !== 2) {
        this.$message({
          message: '请填写开始账期',
          type: 'warning'
        })
        return
      }
      console.log(this.imgs.length, 'this.imgs.length')
      if (this.imgs.length === 0 || this.imgs.length === 1) {
        postData.ContractPath = ''
      } else if (this.imgs.length > 1) {
        this.imgs.pop()
        postData.ContractPath = this.imgs.join(';')
      }
      if (postData.gift) {
        var gift = window._.find(this.giftList, (item) => {
          return item.Id === +this.postData.gift
        })
        postData.GiftTypeId = gift.GiftTypeId
        postData.GiftTypeName = gift.GiftTypeName.slice(0, 3)
        postData.GiftPrice = gift.Price
        delete postData.gift
      } else {
        delete postData.GiftTypeId
        delete postData.GiftTypeName
        delete postData.GiftPrice
      }
      var IsZero = postData.payType.IsZero
      postData.PayType = postData.payType.Id
      delete postData.payType
      postData.ServiceCompanyCode = postData.ServiceCompanyCode ? postData.ServiceCompanyCode : this.ServiceCompanyCode
      console.log(postData, '最终提交数据')
      console.log(this.category, 'this.category')
      if (this.category === 2) {
        this.saveCus(postData)
        return
      }
      if (this.category === 3) {
        this.saveTob(postData)
        return
      }
      var PersonCardID = postData.PersonCardID
      var servicestart = postData.ServiceStart
      if (this.companyInfo && this.companyInfo.CustomerId) {
        var companyId = this.companyInfo.CustomerId
      } else {
        companyId = ''
      }
      checkStatusByPersonalCard(PersonCardID).then(res => {
        if (res.status) {
          if (res.data > 0) {
            this.$message({
              message: '该法人存在未完成的预提单，请先完成预提单',
              type: 'warning'
            })
          } else if (res.data === 0) {
            if (IsZero === 1) {
              if (this.postData.OrderId) { // 修改
                if (this.postData.Status === 3) { // 驳回的时候
                  putReorders(this.postData.OrderId, postData).then(res => {
                    if (res.status) {
                      this.$message({
                        message: '操作成功',
                        type: 'success'
                      })
                      this.$router.push({name: 'main.orderList'})
                    }
                  })
                } else {
                  putOrders(this.postData.OrderId, postData).then(res => {
                    if (res.status) {
                      this.$message({
                        message: '操作成功',
                        type: 'success'
                      })
                      this.$router.push({name: 'main.orderList'})
                    }
                  })
                }
              } else {
                addOrders(postData).then(res => {
                  if (res.status) {
                    this.$message({
                      message: '操作成功',
                      type: 'success'
                    })
                    this.$router.push({name: 'main.orderList'})
                  }
                })
              }
            } else {
              var orderid = this.orderId ? this.orderId : 0
              var paramsData = {
                servicestart: servicestart,
                customerid: companyId,
                orderid: orderid
              }
              CheckIsConnectDate(paramsData).then(res => {
                if (res.status) {
                  if (!res.data) {
                    if (this.postData.OrderId) { // 修改
                      if (this.postData.Status === 3) {
                        putReorders(this.postData.OrderId, postData).then(res => {
                          if (res.status) {
                            this.$message({
                              message: '操作成功',
                              type: 'success'
                            })
                            this.$router.push({name: 'main.orderList'})
                          }
                        })
                      } else {
                        putOrders(this.postData.OrderId, postData).then(res => {
                          if (res.status) {
                            this.$message({
                              message: '操作成功',
                              type: 'success'
                            })
                            this.$router.push({name: 'main.orderList'})
                          }
                        })
                      }
                    } else {
                      addOrders(postData).then(res => {
                        if (res.status) {
                          this.$message({
                            message: '操作成功',
                            type: 'success'
                          })
                          this.$router.push({name: 'main.orderList'})
                        }
                      })
                    }
                  } else {
                    this.$confirm(res.data, '提示', {
                      confirmButtonText: '确定提交',
                      cancelButtonText: '返回修改',
                      type: 'warning'
                    }).then(() => {
                      if (this.postData.OrderId) { // 修改
                        if (this.postData.Status === 3) {
                          putReorders(this.postData.OrderId, postData).then(res => {
                            if (res.status) {
                              this.$message({
                                message: '操作成功',
                                type: 'success'
                              })
                              this.$router.push({name: 'main.orderList'})
                            }
                          })
                        } else {
                          putOrders(this.postData.OrderId, postData).then(res => {
                            if (res.status) {
                              this.$message({
                                message: '操作成功',
                                type: 'success'
                              })
                              this.$router.push({name: 'main.orderList'})
                            }
                          })
                        }
                      } else {
                        addOrders(postData).then(res => {
                          if (res.status) {
                            this.$message({
                              message: '操作成功',
                              type: 'success'
                            })
                            this.$router.push({name: 'main.orderList'})
                          }
                        })
                      }
                    }).catch(() => {})
                  }
                }
              })
            }
          }
        }
      })
    },
    saveCus(postData) {
      if (this.postData.OrderId) {
        putOrderszj(this.postData.OrderId, postData).then(res => {
          if (res.status) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$router.push({name: 'main.orderList'})
          }
        })
      } else {
        orderszj(postData).then(res => {
          if (res.status) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$router.push({name: 'main.orderList'})
          }
        })
      }
    },
    saveTob(postData) {
      supplementaryinfo(postData).then(res => {
        if (res.status) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$router.push({name: 'main.orderList'})
        }
      })
    },
    checkboxChange() {
      this.postData = window._.cloneDeep(this.postData)
    }
  },
  components: {
    customUpload,
    imgUpl: ImageUploader
  }
}
</script>

<style lang='stylus'>
.channel-add-order
  .form-control-static
    margin: 0
    font-size: 14px;
    min-height: 34px;
    padding: 7px 0 7px 0px;
    margin-bottom: 0;
    .el-form-item
      margin-bottom: 0;
  .checkout-box .el-checkbox__label
    color: red;
    font-size: 20px;
    font-weight: 700
    padding-left: 10px;

  .sales-style
    .el-form-item__label
      text-align: left;
      width: 60px !important;
      padding-right: 0;
    .el-form-item__content
      margin-left: 0 !important;
      .el-input
        width: 100px;
  .gray-line
    height: 1px;
    width: 100%;
    background-color: #ccc;
  .add-order-title
    height: 22px;
    line-height: 22px;
    margin: 14px 0;
    &:after
      float: left;
      width: 5px;
      height: 100%;
      background-color: #1a9bfc;
      content: '';
      margin-right: 8px;
  .custom-tips
    line-height: 36px;
    width: 100%;
    background-color: #f0fafa;
    color: #1b9bfc;
    font-size: 14px;
    padding: 0 10px;
    font-weight: 600;
  .el-row
    margin-top: 20px;
    .company-search
      width: 55% !important
      /* width: 200px; */
      .company-alert
        float: left;
  .custom-check
    padding: 0 18px;
    height: 34px;
    line-height: 34px;
    margin: 0 2px;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: inline-block;
    background: white;
    color: black;
    cursor: pointer;
    position: relative;
    outline: none;
  .custom-check.checked
    border-color: #1a9bfc;
    color: #1a9bfc;
  .dropdown-menu
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    min-width: 160px;
    display: none;
    padding: 5px 0;
    margin: 2px 0 0;
    font-size: 14px;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,.15);
  .dropdown-menu>li>a
    clear: both;
    font-weight: 400;
    color: #333;
    display: block;
    padding: 3px 20px;
    line-height: 1.42857143;
    white-space: nowrap;
    text-decoration: none;
  .open>.dropdown-menu
    display: block;
  .custom-check.checked i
    display: block;
    position: absolute;
    right: 3px;
    top: 12px;
  .address-area .el-form-item__content
    height: auto;
  .file-upload-area-img-item
    float: left;
    width: 120px;
    height: 70px;
    padding: 10px 10px 10px 0;
  .file-upload-area-button
    clear: both;
  .img-style
    width: 110px
    height: 85px
    line-height: 85px
    float: left
    text-align: center
    position: relative
    margin: 0 5px
    img
      width: 100px
      height: 75px
  .contract-button
    display: inline-block;
    .button-upload
      height: 30px;
      padding: 5px 10px;
      font-size: 12px;
      cursor: not-allowed;
  .contract-button-view
    clear: both;
</style>
