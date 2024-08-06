<script setup>
import Layout from "@/components/BaseLayout.vue";
</script>

<template>
  <layout>
    <!-- slot for title -->
    <template #title>
      <h4 class="text-uppercase fw-bold">List of Tax Revisions</h4>
      <div class="border my-2 border-primary"></div>
    </template>
    <div class="card-body">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th class="text-uppercase bg-dark text-white border text-center">
              Revision Number
            </th>
            <th class="text-uppercase bg-dark text-white border text-center">
              From / To Year
            </th>
            <th class="text-uppercase bg-dark text-white border text-center">
              Description
            </th>
            <th class="text-uppercase bg-dark text-white border text-center">
              Percentage
            </th>
            <th class="text-uppercase bg-dark text-white border text-center">
              Created At
            </th>
            <th class="text-uppercase bg-dark text-white border text-center">Actions</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  </layout>
</template>
