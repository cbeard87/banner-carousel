<template>
  <div :style="style" class="imagePreloader">
    <img v-for="(url, index) in images" :key="index" :src="url" />
  </div>
</template>

<script>
export default {
  props: {
		images: {
			type: Array,
			required: true
		}
	},
	data() {
		return {
			style: {
				display: 'none'
			}
		}
	}
}
</script>

<style lang="scss" scoped>
  .imagePreloader {
    display: none;
  }
</style>

