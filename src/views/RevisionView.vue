<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import axios from "axios";
import alertify from "alertifyjs";
import moment from "moment";

const revisions = ref([]);
const revision = ref({
  revisionNumber: "",
  fromYear: "",
  toYear: "",
  description: "",
  percentage: "",
});

const $toast = useToast();
const selectedRevision = ref({
  revisionNumber: "",
  fromYear: "",
  toYear: "",
  description: "",
  percentage: "",
});

const getRevisions = () => {
  axios
    .get("http://localhost:8081/tax-revisions")
    .then((response) => {
      revisions.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

const submitRevision = () => {
  revision.value.fromYear = parseInt(revision.value.fromYear);
  revision.value.toYear = parseInt(revision.value.toYear);
  revision.value.percentage = parseFloat(revision.value.percentage);
  axios
    .post("http://localhost:8081/tax-revisions", revision.value)
    .then((response) => {
      getRevisions();
      $toast.open({
        message: "Tax revision added successfully",
        type: "success",
      });
    })
    .catch((error) => {
      console.error(error);
    });
};

const editRevision = (revision) => {
  selectedRevision.value = revision;
};

const updateRevision = () => {
  selectedRevision.value.fromYear = parseInt(selectedRevision.value.fromYear);
  selectedRevision.value.toYear = parseInt(selectedRevision.value.toYear);
  selectedRevision.value.percentage = parseFloat(selectedRevision.value.percentage);
  axios
    .put(
      `http://localhost:8081/tax-revisions/${selectedRevision.value.ID}`,
      selectedRevision.value
    )
    .then((response) => {
      if (response.status === 200) {
        getRevisions();

        $toast.open({
          message: "Tax revision updated successfully",
          type: "success",
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

const deleteRevision = (id) => {
  alertify.confirm(
    "Delete Tax Revision",
    "Are you sure you want to delete this tax revision?",
    () => {
      axios
        .delete(`http://localhost:8081/tax-revisions/${id}`)
        .then((response) => {
          if (response.status === 200) {
            getRevisions();
            $toast.open({
              message: "Tax revision deleted successfully",
              type: "success",
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    () => {
      $toast.open({
        message: "Tax revision deletion cancelled",
        type: "info",
      });
    }
  );
};

onMounted(() => {
  getRevisions();
});
</script>

<template>
  <layout>
    <!-- slot for title -->
    <template #title>
      <h4 class="text-uppercase fw-bold">List of Tax Revisions</h4>
      <div class="border my-2 border-primary"></div>
    </template>
    <!-- add modal for adding new tax revision -->
    <div
      class="modal fade"
      id="addRevisionModal"
      tabindex="-1"
      aria-labelledby="addRevisionModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title h4 text-uppercase fw-bold" id="addRevisionModalLabel">
              Add New Tax Revision
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label
                  for="revisionNumber"
                  class="form-label text-uppercase fw-bold text-dark"
                  >Revision Number</label
                >
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="revisionNumber"
                  placeholder="Enter revision number"
                  v-model="revision.revisionNumber"
                />
              </div>
              <div class="mb-3">
                <label for="fromYear" class="form-label text-uppercase fw-bold text-dark"
                  >From Year</label
                >
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="fromYear"
                  placeholder="Enter from year"
                  v-model="revision.fromYear"
                />
              </div>
              <div class="mb-3">
                <label for="toYear" class="form-label text-uppercase fw-bold text-dark"
                  >To Year</label
                >
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="toYear"
                  placeholder="Enter to year"
                  v-model="revision.toYear"
                />
              </div>
              <div class="mb-3">
                <label
                  for="description"
                  class="form-label text-uppercase fw-bold text-dark"
                  >Description</label
                >
                <textarea
                  class="form-control form-control-lg"
                  id="description"
                  rows="3"
                  placeholder="Enter description"
                  v-model="revision.description"
                ></textarea>
              </div>
              <div class="mb-3">
                <label
                  for="percentage"
                  class="form-label text-uppercase fw-bold text-dark"
                  >Percentage</label
                >
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="percentage"
                  placeholder="Enter percentage"
                  v-model="revision.percentage"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" class="btn btn-primary" @click="submitRevision">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="editRevisionModal"
      tabindex="-1"
      aria-labelledby="editRevisionModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title h4 text-uppercase fw-bold" id="editRevisionModalLabel">
              Edit Tax Revision
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label
                  for="revisionNumber"
                  class="form-label text-uppercase fw-bold text-dark"
                  >Revision Number</label
                >
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="revisionNumber"
                  placeholder="Enter revision number"
                  v-model="selectedRevision.revisionNumber"
                />
              </div>
              <div class="mb-3">
                <label for="fromYear" class="form-label text-uppercase fw-bold text-dark"
                  >From Year</label
                >
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="fromYear"
                  placeholder="Enter from year"
                  v-model="selectedRevision.fromYear"
                />
              </div>
              <div class="mb-3">
                <label for="toYear" class="form-label text-uppercase fw-bold text-dark"
                  >To Year</label
                >
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="toYear"
                  placeholder="Enter to year"
                  v-model="selectedRevision.toYear"
                />
              </div>
              <div class="mb-3">
                <label
                  for="description"
                  class="form-label text-uppercase fw-bold text-dark"
                  >Description</label
                >
                <textarea
                  class="form-control form-control-lg"
                  id="description"
                  rows="3"
                  placeholder="Enter description"
                  v-model="selectedRevision.description"
                ></textarea>
              </div>
              <div class="mb-3">
                <label
                  for="percentage"
                  class="form-label text-uppercase fw-bold text-dark"
                  >Percentage</label
                >
                <input
                  type="text"
                  class="form-control form-control-lg"
                  id="percentage"
                  placeholder="Enter percentage"
                  v-model="selectedRevision.percentage"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" class="btn btn-success" @click="updateRevision">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- end of add modal -->

    <div class="card-body">
      <button
        class="btn btn-primary mb-2 float-end btn-lg btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addRevisionModal"
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
        Add New Revision
      </button>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th
              class="text-uppercase bg-dark text-white border text-center border border-dark"
            >
              <small> Revision Number </small>
            </th>
            <th
              class="text-uppercase bg-dark text-white border text-center border border-dark"
            >
              <small> From / To Year </small>
            </th>
            <th
              class="text-uppercase bg-dark text-white border text-center border border-dark"
            >
              <small> Description </small>
            </th>
            <th
              class="text-uppercase bg-dark text-white border text-center border border-dark"
            >
              <small> Percentage </small>
            </th>
            <th
              class="text-uppercase bg-dark text-white border text-center border border-dark"
            >
              <small> Created At </small>
            </th>
            <th
              class="text-uppercase bg-dark text-white border text-center border border-dark"
            >
              <small> Actions </small>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white">
          <tr v-for="revision in revisions" :key="revision">
            <td class="text-center">{{ revision.revisionNumber }}</td>
            <td class="text-center">
              C.Y {{ revision.fromYear }} - {{ revision.toYear }}
            </td>
            <td class="text-center text-uppercase">{{ revision.description }}</td>
            <td class="text-center">{{ revision.percentage }}%</td>
            <td class="text-center">
              {{ moment(revision.createdAt).format("MMMM Do YYYY, hh:mm:ss A") }}
            </td>
            <td class="text-center">
              <button
                class="btn btn-success btn-lg me-2"
                @click="editRevision(revision)"
                data-bs-toggle="modal"
                data-bs-target="#editRevisionModal"
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
              <!-- delete button -->
              <button class="btn btn-danger btn-lg" @click="deleteRevision(revision.ID)">
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
