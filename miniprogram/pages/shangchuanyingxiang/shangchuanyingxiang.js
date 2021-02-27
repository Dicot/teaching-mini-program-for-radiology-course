const app = getApp()
var usershenfen;
var username;
Page({
  data: {
    username,
    usershenfen,
    selectedFlag: [],
    nzhengchang: ["牙片", "全景片", "头影测量侧位片", "头影测量正位片", "CBCT", "螺旋CT"],
    nya: ["龋病", "牙髓病", "根尖周病", "牙发育异常", "牙周炎", "牙外伤", "牙根折裂",],
    nyanzheng: ["化脓性颌骨骨髓炎", "Garre骨髓炎", "下颌骨弥漫性硬化性骨髓炎", "颌骨放射性骨坏死", "药物相关性颌骨骨髓炎"],
    nnangzhong: ["根尖周囊肿和残余囊肿", "含牙囊肿", "牙源性角化囊肿", "鼻腭管囊肿", "牙源性钙化囊肿"],
    nliangxing: ["成釉细胞瘤", "牙源性腺样瘤", "牙源性粘液瘤", "牙源性钙化上皮瘤", "牙瘤", "颌骨中心性血管瘤"],
    nexing: ["原发性骨内鳞状细胞癌", "骨肉瘤", "颌面部软组织恶性肿瘤"],
    nguzhe: ["牙槽突骨折", "下颌骨骨折", "上颌骨骨折", "颧骨骨折", "鼻骨骨折", "复合型骨折"],
    nxitongbing: ["朗格汉斯组织细胞增生症", "骨纤维异常增殖症"],
    ntuoyexian: ["唾液腺结石病", "唾液腺炎症", "唾液腺肿瘤", "舍格伦综合征"],
    nguanjiebing: ["颞下颌关节疾病", "颞下颌关节强直", "颞下颌关节肿瘤性变"],
  },
  onLoad: function () {
    var that = this;
    console.log(app.globalData.username, app.globalData.usershenfen)
    that.setData({ username: app.globalData.username, usershenfen: app.globalData.usershenfen })
  },
  changeToggle: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.selectedFlag[index]) {
      this.data.selectedFlag[index] = false;
    } else {
      this.data.selectedFlag[index] = true;
    }

    this.setData({
      selectedFlag: this.data.selectedFlag
    })
  },









})
