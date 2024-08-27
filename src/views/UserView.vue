<script setup>
import UsersComponent from "@/components/UsersComponent.vue";
import { defineComponent } from "vue";
import Layout from "@/components/BaseLayout.vue";
defineComponent({
  UsersComponent,
});
</script>

<template>
  <layout>
    <template #title>
      <h4 class="text-uppercase fw-bold">List of Users</h4>
      <div class="border my-2 border-primary"></div>
    </template>
    <UsersComponent />
  </layout>
</template>
