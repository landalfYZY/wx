/**
 * label 标签     rule 规则  value 值
 * rule：sim单选  mul 多选
 */
var STATIC_PARAMS = [
  {
    label: '价格',rule:'sim', value: [
      { label: '不限', value: '', opt: [] },
      { label: '1000元以下', opt: [{ opertionType: 'lte', opertionValue: '1000' }], },
      { label: '1000-2000元', opt: [{ opertionType: 'gt', opertionValue: '1000' }, { opertionType: 'lte', opertionValue: '2000' }] },
      { label: '2000-3000元', opt: [{ opertionType: 'gt', opertionValue: '2000' }, { opertionType: 'lte', opertionValue: '3000' }] },
      { label: '3000-4000元', opt: [{ opertionType: 'gt', opertionValue: '3000' }, { opertionType: 'lte', opertionValue: '4000' }] },
      { label: '4000-5000元', opt: [{ opertionType: 'gt', opertionValue: '4000' }, { opertionType: 'lte', opertionValue: '5000' }] },
      { label: '5000-7000元', opt: [{ opertionType: 'gt', opertionValue: '5000' }, { opertionType: 'lte', opertionValue: '7000' }] },
      { label: '7000-10000元', opt: [{ opertionType: 'gt', opertionValue: '7000' }, { opertionType: 'lte', opertionValue: '10000' }] },
      { label: '10000元以上', opt: [{ opertionType: 'gt', opertionValue: '10000' }] }
    ]
  },
  {
    label: '户型', rule: 'mul', value: [
      { label: '一室', opt: [{ opertionType: 'equal', opertionValue: '1' }], },
      { label: '二室', opt: [{ opertionType: 'equal', opertionValue: '2' }], },
      { label: '三室', opt: [{ opertionType: 'equal', opertionValue: '3' }], },
      { label: '四室', opt: [{ opertionType: 'equal', opertionValue: '4' }], },
      { label: '五室及五室以上', opt: [{ opertionType: 'gte', opertionValue: '5' }], },
    ]
  },
  {
    label:'朝向',rule:'mul',value:[
      { label: '朝东', opt: [{ opertionType: 'equal', opertionValue: '朝东' }], },
      { label: '朝南', opt: [{ opertionType: 'equal', opertionValue: '朝南' }], },
      { label: '朝西', opt: [{ opertionType: 'equal', opertionValue: '朝西' }], },
      { label: '朝北', opt: [{ opertionType: 'equal', opertionValue: '朝北' }], },
      { label: '南北', opt: [{ opertionType: 'equal', opertionValue: '南北' }], }
    ]
  },
  ,
  {
    label: '面积', rule: 'mul', value: [
      { label: '30㎡以下', opt: [{ opertionType: 'lte', opertionValue: '30' }], },
      { label: '30-50㎡', opt: [{ opertionType: 'gt', opertionValue: '30' }, { opertionType: 'lte', opertionValue: '50' }], },
      { label: '50-70㎡', opt: [{ opertionType: 'gt', opertionValue: '50' }, { opertionType: 'lte', opertionValue: '70' }], },
      { label: '70-90㎡', opt: [{ opertionType: 'gt', opertionValue: '70' }, { opertionType: 'lte', opertionValue: '90' }], },
      { label: '90-120㎡', opt: [{ opertionType: 'gt', opertionValue: '90' }, { opertionType: 'lte', opertionValue: '120' }], },
      { label: '120-150', opt: [{ opertionType: 'gt', opertionValue: '120' }, { opertionType: 'lte', opertionValue: '150' }], },
      { label: '150-200㎡', opt: [{ opertionType: 'gt', opertionValue: '150' }, { opertionType: 'lte', opertionValue: '200' }], },
      { label: '200㎡以上', opt: [{ opertionType: 'gte', opertionValue: '200' }], }
    ]
  },
  {label:'装修',rule:'mul',value:[
    { label: '毛坯房', opt: [{ opertionType: 'equal', opertionValue: '毛坯房' }], },
    { label: '普通装修', opt: [{ opertionType: 'equal', opertionValue: '普通装修' }], },
    { label: '精装修', opt: [{ opertionType: 'equal', opertionValue: '精装修' }], },
    { label: '豪华装修', opt: [{ opertionType: 'equal', opertionValue: '豪华装修' }], },
  ]},
  {
    label:'电梯',rule:'sim',value:[
      { label: '不限', opt: [], },
      { label: '有电梯', opt: [{ opertionType: 'equal', opertionValue: '有电梯' }], },
      { label: '无电梯', opt: [{ opertionType: 'equal', opertionValue: '无电梯' }], },
    ]
  },
  
  {
    label: '出租方式', rule: 'sim', value: [
      { label: '不限', opt: [], },
      { label: '整租', opt: [{ opertionType: 'equal', opertionValue: '整租' }], },
      { label: '合租', opt: [{ opertionType: 'equal', opertionValue: '合租' }], },
    ]
  }
]


function getScreen(label){
  var la = []
  for(var i in STATIC_PARAMS){
    if(STATIC_PARAMS[i].label == label){
      la.push(STATIC_PARAMS[i])
    }
  }
  for(var i in la){
    la[i].active = false
    for(var j in la[i].value){
      la[i].value[j].active = false
    }
  }
  return la
}
module.exports = {
  getScreen: getScreen
}
