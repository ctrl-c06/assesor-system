<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import axios from "axios";
import alertify from "alertifyjs";
import moment from "moment";

const tags = ref([]);

const toast = useToast();
const errors = ref({});
const tag = ref({
  name: "",
});

const getAllTags = () => {
  axios
    .get("http://localhost:8081/tags")
    .then((response) => {
      tags.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const submitNewTag = () => {
  axios
    .post("http://localhost:8081/tags", tag.value)
    .then((response) => {
      tags.value.push(response.data);
      toast.open({
        message: "Tag added successfully",
        type: "success",
      });
    })
    .catch((error) => {
      if (error.response.status === 422) {
        errors.value = error.response.data;
        return;
      }

      toast.open({
        message: "Failed to add tag",
        type: "error",
      });
    });
};

const editTag = (t) => {
  errors.value = {};
  tag.value = t;
};

const updateTag = () => {
  axios
    .put(`http://localhost:8081/tags/${tag.value.ID}`, tag.value)
    .then(() => {
      const index = tags.value.findIndex((t) => t.ID === tag.value.ID);
      tags.value[index] = tag.value;
      toast.open({
        message: "Tag updated successfully",
        type: "success",
      });
    })
    .catch((error) => {
      if (error.response.status == 422) {
        errors.value = error.response.data;
        return;
      }

      toast.open({
        message: "Failed to update tag",
        type: "error",
      });
    });
};

const deleteTag = (tagID) => {
  alertify.confirm(
    "Delete Tag",
    "Are you sure you want to delete this tag?",
    () => {
      axios
        .delete(`http://localhost:8081/tags/${tagID}`)
        .then(() => {
          tags.value = tags.value.filter((tag) => tag.ID !== tagID);
          toast.open({
            message: "Tag deleted successfully",
            type: "success",
          });
        })
        .catch((error) => {
          console.log(error);
          toast.open({
            message: "Failed to delete tag",
            type: "error",
          });
        });
    },
    () => {
      toast.open({
        message: "Tag deletion cancelled",
        type: "info",
      });
    }
  );
};
onMounted(() => getAllTags());
</script>

<template>
  <layout>
    <!-- slot for title -->
    <template #title>
      <h4 class="text-uppercase fw-bold">List of Municipalities & Barangays</h4>
      <div class="border my-2 border-primary"></div>
    </template>
  </layout>
</template>
