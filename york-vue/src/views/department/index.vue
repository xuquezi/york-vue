<template>
  <div>
    <department-table/>
  </div>
</template>

<script>

  import departmentTable from './components/departmentTable'
  export default {
    name: 'DepartmentIndex',
    components: { departmentTable }
  }
</script>

<style scoped>

</style>
