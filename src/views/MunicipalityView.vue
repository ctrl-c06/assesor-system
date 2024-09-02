<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted, ref } from "vue";
import axios from "axios";

const selectedMunicipality = ref({
  id: 0,
  name: "",
  barangays: [],
});
const errors = ref({});
const hasSelectedMunicipality = ref(false);
const municipalities = ref([]);
const currentPage = ref(1);
const totalRecords = ref(0);
const totalPages = ref(0);
const pageSize = ref(5);
const search = ref("");

const getAllMunicipalities = () => {
  axios
    .get(
      `http://localhost:8081/municipalities/paginated?page=${currentPage.value}&pageSize=${pageSize.value}&search=${search.value}`
    )
    .then((response) => {
      municipalities.value = response.data.data;
      currentPage.value = response.data.meta.pageNumber;
      totalRecords.value = response.data.meta.totalRecords;
      totalPages.value = response.data.meta.totalPages;
      pageSize.value = response.data.meta.pageSize;
    })
    .catch((error) => {
      console.error(error);
    });
};

const changePageSize = () => {
  currentPage.value = 1;
  getAllMunicipalities();
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    getAllMunicipalities();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    getAllMunicipalities();
  }
};

const goToPage = (page) => {
  currentPage.value = page;
  getAllMunicipalities();
};

const editMunicipality = (municipality) => {
  hasSelectedMunicipality.value = true;
  selectedMunicipality.value = municipality;
};

const submitMunicipality = () => {
  axios
    .post("http://localhost:8081/municipality/create", {
      name: selectedMunicipality.value.name,
    })
    .then((response) => {
      getAllMunicipalities();
      hasSelectedMunicipality.value = false;
    })
    .catch((error) => {
      if (error.response.status === 422) {
        errors.value = error.response.data;
      }
    });
};

const updateMunicipality = () => {
  axios
    .put(`http://localhost:8081/municipality/update/${selectedMunicipality.value.id}`, {
      name: selectedMunicipality.value.name,
    })
    .then((response) => {
      getAllMunicipalities();
      hasSelectedMunicipality.value = false;
    })
    .catch((error) => {
      if (error.response.status === 422) {
        errors.value = error.response.data;
      }
      console.error(error);
    });
};

onMounted(() => getAllMunicipalities());
</script>
<template>
  <Layout>
    <template #title>
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <h4 class="text-uppercase fw-bold">List of Municipalities & Barangays</h4>
        </div>
        <div>
          <button class="btn btn-primary" @click="hasSelectedMunicipality = true">
            Add New Municipality
          </button>
        </div>
      </div>
      <div class="border my-2 border-primary"></div>
    </template>

    <div class="row">
      <div
        :class="{
          'col-lg-12': !hasSelectedMunicipality,
          'col-lg-9': hasSelectedMunicipality,
        }"
      >
        <div>
          <div class="d-flex justify-content-between mb-3">
            <div>
              <label for="entries" class="form-label text-dark">Show Entries</label>
              <select v-model="pageSize" @change="changePageSize" class="form-select">
                <option v-for="size in [5, 10, 20]" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
            </div>
            <div>
              <label for="search" class="form-label text-dark">&nbsp;</label>
              <div class="input-group">
                <span class="input-group-text" id="search">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-search"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
                    ></path>
                  </svg>
                </span>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Serach municipality"
                  aria-label="Serach municipality"
                  @keyup.enter="getAllMunicipalities()"
                  v-model="search"
                  aria-describedby="search"
                />
              </div>
            </div>
          </div>
          <div class="card mt-0 pt-0">
            <div class="card-body p-0 px-2">
              <table class="table table-striped border mt-2">
                <thead>
                  <tr>
                    <th
                      class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
                    >
                      Municipality
                    </th>
                    <th
                      class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
                    >
                      No. of Barangays
                    </th>
                    <th
                      class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody v-if="municipalities.length">
                  <tr v-for="municipality in municipalities" :key="municipality.id">
                    <td>
                      <span class="ms-5">
                        {{ municipality.name }}
                      </span>
                    </td>
                    <td class="text-center">
                      {{ municipality.barangays.length }}
                    </td>
                    <td class="w-25">
                      <div class="btn-group">
                        <a href="#" class="btn btn-info" aria-current="page">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            class="bi bi-house-up"
                            viewBox="0 0 16 16"
                          >
                            <path
                              d="M7.293 1.5a1 1 0 0 1 1.414 0L11 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l2.354 2.353a.5.5 0 0 1-.708.708L8 2.207l-5 5V13.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 2 13.5V8.207l-.646.647a.5.5 0 1 1-.708-.708z"
                            />
                            <path
                              d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 1 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.707l1.5-1.5a.5.5 0 0 1 .708 0Z"
                            />
                          </svg>
                          Barangays
                        </a>
                        <button
                          @click="editMunicipality(municipality)"
                          class="btn btn-success"
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
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="3" class="text-center text-danger">No records found</td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-between">
                <div class="ms-3">
                  <span class="text-dark fw-medium" v-if="totalRecords > 0">
                    Page {{ currentPage }} of {{ totalPages }}</span
                  >
                  <span class="text-dark fw-medium" v-else> Page 0 of 0</span>
                </div>
                <nav aria-label="Page navigation">
                  <ul class="pagination me-3">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <a class="page-link" @click="prevPage">Previous</a>
                    </li>
                    <li
                      class="page-item"
                      v-for="page in totalPages"
                      :key="page"
                      :class="{ active: page === currentPage }"
                    >
                      <a class="page-link" @click="goToPage(page)">{{ page }}</a>
                    </li>
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === totalPages }"
                    >
                      <a class="page-link" @click="nextPage">Next</a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-3 mt-6 pt-3" v-if="hasSelectedMunicipality">
        <div class="card">
          <div
            class="card-header bg-dark text-white fw-medium d-flex align-items-center justify-content-between"
          >
            <div>Municipality Form</div>
            <!-- button close -->
            <button
              @click="hasSelectedMunicipality = false"
              type="button"
              class="btn btn-danger"
              aria-label="Close"
            >
              Close
            </button>
          </div>
          <div class="card-body">
            <form>
              <div class="mb-3">
                <label for="municipality" class="form-labe">Municipality Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="municipality"
                  v-model="selectedMunicipality.name"
                  :class="{
                    'is-invalid': errors.name,
                  }"
                  placeholder="Enter Name"
                />

                <div class="invalid-feedback" v-if="errors.name">
                  {{ errors.name }}
                </div>
              </div>
              <div class="d-grid">
                <button
                  type="button"
                  class="btn btn-primary btn-block"
                  @click="
                    selectedMunicipality.id !== 0
                      ? updateMunicipality()
                      : submitMunicipality()
                  "
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.text-danger {
  color: red;
}
</style>
