<template lang="html">
  <div class="tool">
    <h1>TEST TOOL</h1>
    <nested/>
  </div>
</template>

<script>
import Nested from './Nested'

export default {
  name: 'TOOL',
  components: {Nested},

  data () {
    return {
      something: 'something else'
    }
  }
}
</script>

<style lang="css">
</style>
