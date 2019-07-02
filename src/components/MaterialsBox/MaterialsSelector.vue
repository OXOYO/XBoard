/**
* Created by OXOYO on 2019/6/28.
*
* MaterialsSelector 物料选择器
*/

<style scoped lang="less" rel="stylesheet/less">
  .materials-selector {
    display: inline-block;
    width: 100%;
    height: 100%;

    .handler {
      position: absolute;
      top: 50%;
      left: -20px;
      width: 20px;
      height: 20px;
      margin-top: -10px;
      background: #000000;
      border-top-left-radius: 50%;
      border-bottom-left-radius: 50%;
      box-shadow: -2px 0 2px 2px rgba(0, 0, 0, .1);
      opacity: 0.3;

      &:hover {
        opacity: 1;
      }
    }
    .category {
      display: inline-block;
      width: 40px;
      border-right: 1px solid rgba(0, 0, 0, .1);
      height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      text-align: center;

      .category-item {
        position: relative;
        height: 40px;
        line-height: 40px;
        padding: 5px 0;
        color: #000000;
        opacity: .3;

        :after {
          content: '';
          position: absolute;
          top: 0;
          right: -1px;
          bottom: 0;
          width: 1px;
          background: transparent;
        }

        &:hover,
        &.active {
          opacity: 1;

          :after {
            background: #ffffff;
          }
        }
      }
      .tool-item {
        position: relative;
        height: 40px;
        line-height: 40px;
        padding: 5px 0;
        color: #000000;
        opacity: .3;

        &:hover {
          opacity: 1;
        }
      }

      .divider {
        margin: 5px 0;
      }
    }
    .list-block {
      display: inline-block;
      width: calc(~'100% - 40px');
      height: 100%;
      overflow: auto;
      padding: 10px;

      .list-item {
        margin: 5px 0;
      }
    }
  }
</style>

<template>
  <div class="materials-selector">
    <!--<div class="handler" @click.stop.prevent="doClose"></div>-->
    <div class="category">
      <template v-for="(item, index) in categoryList.filter(target => target.enable)">
        <div
          :class="{ 'category-item': true, 'active': activeCategory && activeCategory.name === item.name }"
          :key="'category_' + index"
          @click="handleCategoryClick(item.name)"
        >
          <XIcon :type="item.icon"></XIcon>
        </div>
        <Divider class="divider" :key="'category_divider_' + index" v-if="item.divider" type="horizontal" />
      </template>
      <template v-for="(item, index) in toolList.filter(target => target.enable)">
        <div
          class="tool-item"
          :key="'tool_' + index"
          @click="handleToolClick(item.name)"
        >
          <XIcon type="add"></XIcon>
        </div>
        <Divider class="divider" :key="'tool_divider_' + index" v-if="item.divider" type="horizontal" />
      </template>
    </div>
    <div class="list-block">

    </div>
  </div>
</template>

<script>
  export default {
    name: 'MaterialsSelector',
    data () {
      return {
        categoryList: [
          {
            name: 'all',
            label: 'All',
            lang: '',
            icon: 'materials',
            enable: true,
            divider: false
          },
          {
            name: 'flowChart',
            label: 'flowChart',
            lang: '',
            icon: 'flow-chart',
            enable: true,
            divider: false
          },
          {
            name: 'mind',
            label: 'mind',
            lang: '',
            icon: 'mind',
            enable: true,
            divider: false
          },
          {
            name: 'tree',
            label: 'tree',
            lang: '',
            icon: 'tree',
            enable: true,
            divider: true
          }
        ],
        activeCategory: null,
        toolList: [
          {
            name: 'add',
            label: 'Add',
            lang: '',
            icon: 'add',
            enable: true,
            divider: false
          }
        ]
      }
    },
    methods: {
      init () {
        let _t = this
        // 触发分类点击，默认选中“全部”
        _t.handleCategoryClick('all')
      },
      handleCategoryClick (name) {
        let _t = this
        _t.activeCategory = _t.categoryList.find(target => target.name === name)
      },
      handleToolClick (name) {
        let _t = this
        switch (name) {
          case 'add':
            _t.$X.utils.bus.$emit('board/materials/editor/trigger')
            _t.$X.utils.bus.$emit('board/materials/editor/show', {
              status: 'add'
            })
            break
        }
      },
      doClose () {
        let _t = this
        _t.$X.utils.bus.$emit('board/materials/selector/close')
      }
    },
    created () {
      let _t = this
      _t.init()
    }
  }
</script>
