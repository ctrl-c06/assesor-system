<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
const route = useRoute();
onMounted(() => {
  axios
    .get(`http://localhost:8081/tax-declarations/lot-no?lot_no=${route.params.lotNo}`)
    .then((response) => {
      console.log(response.data);
    });
});
</script>

<template>
  <layout></layout>
</template>
