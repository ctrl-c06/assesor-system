<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import axios from "axios";
import alertify from "alertifyjs";
import moment from "moment";

const tags = ref([]);

const toast = useToast();

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
      console.log(error);
      toast.open({
        message: "Failed to add tag",
        type: "error",
      });
    });
};

const editTag = (t) => {
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
      console.log(error);
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
      <h4 class="text-uppercase fw-bold">List of Tags</h4>
      <div class="border my-2 border-primary"></div>
    </template>

    <!-- modal for adding tag -->
    <div class="modal fade" id="addTagModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Tag</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form addTagForm @submit.prevent="submitNewTag">
              <div class="mb-3">
                <label
                  for="description"
                  class="form-label text-dark fw-bold text-uppercase"
                  >Description</label
                >
                <input
                  type="text"
                  class="form-control text-uppercase"
                  v-model="tag.name"
                  @keypress.enter.prevent="submitNewTag"
                  placeholder="Enter tag description"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              form="addTagForm"
              @click="submitNewTag"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- edit modal -->
    <div class="modal fade" id="editTagModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Tag</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form editTagForm @submit.prevent="updateTag">
              <div class="mb-3">
                <label
                  for="description"
                  class="form-label text-dark fw-bold text-uppercase"
                  >Description</label
                >
                <input
                  type="text"
                  class="form-control text-uppercase"
                  v-model="tag.name"
                  @keypress.enter.prevent="updateTag"
                  placeholder="Enter tag description"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button
              type="submit"
              class="btn btn-success"
              form="editTagForm"
              @click="updateTag"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body">
      <button
        class="btn btn-primary mb-2 float-end btn-lg btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addTagModal"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-plus-circle me-1"
          viewBox="0 0 16 16"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path
            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
          />
        </svg>
        Add New Tag
      </button>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th
              class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
            >
              Tag ID
            </th>

            <th
              class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
            >
              Description
            </th>
            <th
              class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
            >
              Created At
            </th>
            <th
              class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="tag in tags" :key="tag">
            <td class="text-center">
              {{ tag.ID }}
            </td>
            <td class="text-center text-uppercase">
              {{ tag.name }}
            </td>
            <td class="text-center">
              {{ moment(tag.createdAt).format("MMMM Do YYYY, hh:mm:ss A") }}
            </td>
            <td class="text-center">
              <button
                class="btn btn-success btn-lg me-2"
                @click="editTag(tag)"
                data-bs-target="#editTagModal"
                data-bs-toggle="modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pencil"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
                  />
                </svg>
                Edit
              </button>

              <button class="btn btn-danger btn-lg" @click="deleteTag(tag.ID)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash3"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
                  />
                </svg>
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </layout>
</template>
