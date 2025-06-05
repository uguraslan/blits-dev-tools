import Blits from '@lightningjs/blits'
export default Blits.Component('LoopCompTs', {
  template: `
    <Element :for="(item, i) in list" key="$i" />
  `,
  state() {
    return { list: [1,2,3] }
  }
})
