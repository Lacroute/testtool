<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <test/>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tool } from '../../dist/tool.js'
// import Tool from './TagPicker'
// import Tool from './Tool'

const Test = Tool.default || Tool
Vue.component('test', Test);
console.log(Test)

export default {
  name: 'hello',
  components: { Test },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style>
@import "../../dist/tool.min.css";
h1, h2 {
  font-weight: normal;
}
</style>
