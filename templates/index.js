export default [{
  type: 'clone',
  model: {
    type: 'clone',
    top: 350,
    left: 100,
    width: 30,
    height: 30,
    strokeStyle: '#999',
    lineWidth: 1,
    lineStyle: '#999'
  }
}].map(t => {
  return {
    name: t.type,
    /* 다국어 키 표현을 어떻게.. */
    description: '...',
    /* 다국어 키 표현을 어떻게.. */
    group: 'warehouse',
    /* line|shape|textAndMedia|chartAndGauge|table|container|dataSource|IoT|3D|warehouse|form|etc */
    icon: '../',
    /* 또는, Object */
    template: t
  }
})
