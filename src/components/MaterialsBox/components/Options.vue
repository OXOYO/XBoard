/**
* Created by OXOYO on 2019/7/1.
*
* Options 配置信息面板
*/

<style scoped lang="less" rel="stylesheet/less">
  .options {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
</style>

<template>
  <div class="options">
    <h1>TODO Options</h1>
    <Form :model="options">
      <template v-for="key in Object.keys(options)">
        <FormItem :prop="key" :key="key">
          <Input v-if="options[key].type === 'string'" type="text" v-model="options[key].value"></Input>
          <InputNumber v-else-if="options[key].type === 'number'" v-model="options[key].value"></InputNumber>
        </FormItem>
      </template>
    </Form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'Options',
    data () {
      return {
        fieldMap: {
          node: [
            {
              name: 'x',
              label: 'x坐标',
              lang: '',
              type: 'number',
              component: 'InputNumber',
              enable: true
            },
            {
              name: 'y',
              label: 'y坐标',
              lang: '',
              type: 'number',
              component: 'InputNumber',
              enable: true
            },
            {
              name: 'width',
              label: '宽度',
              lang: '',
              type: 'number',
              component: 'InputNumber',
              enable: true
            },
            {
              name: 'height',
              label: '高度',
              lang: '',
              type: 'number',
              component: 'InputNumber',
              enable: true
            },
            {
              name: 'label',
              label: '文本',
              lang: '',
              type: 'string',
              component: 'Input',
              enable: true
            },
            {
              name: 'labelCfg',
              label: '文本样式',
              lang: '',
              type: 'object',
              component: '',
              enable: false
            },
            {
              name: 'shape',
              label: '形状',
              lang: '',
              type: 'string',
              component: 'Select',
              enable: true
            },
            {
              name: 'style',
              label: '样式',
              lang: '',
              type: 'object',
              component: '',
              enable: false
            }
          ],
          edge: []
        }
      }
    },
    computed: {
      ...mapGetters([
        'currentItem'
      ]),
      options () {
        let _t = this
        let type = _t.currentItem.type
        let model = _t.currentItem.model
        let options = {}
        if (type && model) {
          let fields = Object.keys(model)
          fields.forEach(key => {
            let target = _t.fieldMap[type].find(item => item.enable && item.name === key)
            if (target) {
              options[key] = ({
                ...target,
                value: model[key]
              })
            }
          })
        }
        console.log('options', options)
        return options
      }
    }
  }
</script>
