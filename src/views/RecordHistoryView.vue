<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted, ref, computed, watch } from "vue";
import axios from "axios";
import moment from "moment";
import { downloadFile } from "@/services/file";
import { createRecord } from "@/services/record";
import { useToast } from "vue-toast-notification";

const $toast = useToast();

const owners = ref([]);
const barangays = ref([]);
const municipalities = ref([]);
const taxDeclarations = ref([]);
const identificationSearch = ref("");

const isLoading = ref(false);

const selectedOwner = ref(null);
const selectedBarangay = ref(null);
const selectedMunicipality = ref(null);
const fromDate = ref("");
const toDate = ref("");

const currentPage = ref(1);
const pageSize = ref(5);
const totalPages = ref(1);

const fetchTaxDeclarations = async (page = currentPage.value, size = pageSize.value) => {
  try {
    const response = await axios.get(
      `http://localhost:8081/tax-declarations?page=${page}&pageSize=${size}&declaredOwner=${
        selectedOwner.value || ""
      }&barangay_id=${selectedBarangay.value?.id || ""}&municipality_id=${
        selectedMunicipality.value?.id || ""
      }&search=${identificationSearch.value}&fromDate=${fromDate.value}&toDate=${
        toDate.value
      }`
    );
    taxDeclarations.value = response.data.data;
    totalPages.value = response.data.meta.totalPages;
    currentPage.value = page;
  } catch (error) {
    console.error("Error fetching tax declarations:", error);
  }
};

const goToPage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    fetchTaxDeclarations(page);
  }
};

// Computed property for pagination
const pageNumbers = computed(() => {
  const pages = [];
  const { total, current } = { total: totalPages.value, current: currentPage.value };

  if (total <= 5) {
    // Less than or equal to 5 pages
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // More than 5 pages
    const start = Math.max(1, current - 1);
    const end = Math.min(total, current + 1);

    if (current > 3) pages.push(1, "...");
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...", total);
  }

  return pages;
});

const searchOwner = (loading, search) => {
  axios
    .get(`http://localhost:8081/tax-declarations/unique/owner?query=${search}`)
    .then((response) => {
      owners.value = response.data;
      loading(false);
    })
    .catch((error) => {
      console.error(error);
      loading(false);
    });
};

const searchBarangay = (loading, search) => {
  axios
    .get(`http://localhost:8081/barangays/search?name=${search}`)
    .then((response) => {
      barangays.value = response.data;
      loading(false);
    })
    .catch((error) => {
      console.error(error);
      loading(false);
    });
};

const searchMunicipality = (loading, search) => {
  axios
    .get(`http://localhost:8081/municipalities/search?name=${search}`)
    .then((response) => {
      municipalities.value = response.data;
      loading(false);
    })
    .catch((error) => {
      console.error(error);
      loading(false);
    });
};

const onOwnerSearch = (search, loading) => {
  if (search.length) {
    loading(true);
    searchOwner(loading, search);
  }
};

const onBarangaySearch = (search, loading) => {
  if (search.length) {
    loading(true);
    searchBarangay(loading, search);
  }
};

const onMunicipalitySearch = (search, loading) => {
  if (search.length) {
    loading(true);
    searchMunicipality(loading, search);
  }
};

watch(selectedBarangay, () => {
  if (selectedBarangay.value) {
    fetchTaxDeclarations(1, pageSize.value);
  } else {
    fetchTaxDeclarations(1, pageSize.value);
  }
});

watch(selectedMunicipality, () => {
  if (selectedMunicipality.value) {
    fetchTaxDeclarations(1, pageSize.value);
  } else {
    fetchTaxDeclarations(1, pageSize.value);
  }
});

watch(selectedOwner, () => {
  if (selectedOwner.value) {
    fetchTaxDeclarations(1, pageSize.value);
  } else {
    fetchTaxDeclarations(1, pageSize.value);
  }
});

watch(fromDate, () => {
  fetchTaxDeclarations(1, pageSize.value);
});

watch(toDate, () => {
  fetchTaxDeclarations(1, pageSize.value);
});

const assign = ref({
  taxDeclarationNo: "",
  declaredOwner: "",
  areaInHectares: "",
  propertyIdentificationNo: "",
  revision: "",
  barangay: "",
  municipality: "",
});

const editRecord = (data) => {
  console.log(data);
  assign.value = {
    ID: data.ID,
    taxDeclarationNo: data.taxDeclarationNo,
    declaredOwner: data.declaredOwner,
    areaInHectares: data.areaInHectares,
    propertyIdentificationNo: data.propertyIdentificationNo,
    revision: data.revision,
    barangay: data.barangay,
    municipality: data.municipality,
  };
};

const submitRecord = () => {
  createRecord(assign.value).then((data) => {
    $toast.success("Record revised successfully");
  });
};

const submitEdit = () => {
  axios
    .post(`http://localhost:8081/tax-declarations/${assign.value.ID}`, assign.value)
    .then((data) => {
      $toast.success("Record updated successfully");
      fetchTaxDeclarations(currentPage.value, pageSize.value);
    });
};

const download = (filePath) => {
  const encodedFilePath = encodeURIComponent(filePath);
  const url = `http://localhost:8080/download-fullpath?path=${encodedFilePath}`;
  window.open(url, "_blank");
};

onMounted(() => fetchTaxDeclarations());
</script>

<template>
  <layout>
    <h4 class="text-uppercase fw-bold">
      Records
      <span class="fw-bold text-primary">[ {{ currentPage }} ]</span>
    </h4>
    <div class="border my-2 border-primary"></div>

    <div>
      <div
        class="modal fade"
        id="assignFileModal"
        tabindex="-1"
        aria-labelledby="assignFileModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-uppercase" id="assignFileModalLabel">
                <div class="fw-bold">Revision</div>
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form id="assignFileForm">
                <div>
                  <div class="form-group">
                    <label for="taxDeclarationNo" class="form-label text-dark"
                      >Tax Declaration No:</label
                    >
                    <input
                      type="text"
                      id="taxDeclarationNo"
                      class="form-control"
                      v-model="assign.taxDeclarationNo"
                    />
                  </div>

                  <div class="form-group mt-2">
                    <label for="declaredOwner" class="form-label text-dark"
                      >Declared Owner:</label
                    >
                    <input
                      type="text"
                      id="declaredOwner"
                      class="form-control"
                      v-model="assign.declaredOwner"
                    />
                  </div>

                  <div class="form-group mt-2">
                    <label for="areaInHectares" class="form-label text-dark"
                      >Area in Hectares:</label
                    >
                    <input
                      type="text"
                      id="areaInHectares"
                      class="form-control"
                      v-model="assign.areaInHectares"
                    />
                  </div>

                  <div class="form-group mt-2">
                    <label for="propertyIdentificationNo" class="form-label text-dark"
                      >Property Identification No:</label
                    >
                    <input
                      type="text"
                      id="propertyIdentificationNo"
                      class="form-control"
                      v-model="assign.propertyIdentificationNo"
                    />
                  </div>

                  <div class="form-group mt-2">
                    <label for="revision" class="form-label text-dark">Revision:</label>
                    <input
                      type="text"
                      id="revision"
                      class="form-control"
                      v-model="assign.revision"
                    />
                  </div>

                  <div class="form-group mt-2">
                    <label for="municipality" class="form-label text-dark"
                      >Municipality:</label
                    >
                    <v-select
                      label="name"
                      :filterable="false"
                      :options="municipalities"
                      @search="onMunicipalitySearch"
                      v-model="assign.municipality"
                      style="color: black"
                    >
                      <template #option="{ name }">
                        <h5 class="text-dark">{{ name }}</h5>
                      </template>
                    </v-select>
                  </div>
                  <div class="form-group mt-2">
                    <label for="municipality" class="form-label text-dark"
                      >Barangay:</label
                    >
                    <v-select
                      label="name"
                      :filterable="false"
                      :options="barangays"
                      @search="onBarangaySearch"
                      v-model="assign.barangay"
                      style="color: black"
                    >
                      <template #option="{ name }">
                        <h5 class="text-dark">{{ name }}</h5>
                      </template>
                    </v-select>
                  </div>
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
                @click="submitRecord"
                data-bs-dismiss="modal"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else> Save changes </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal fade"
        id="editRecordModal"
        tabindex="-1"
        aria-labelledby="editRecordModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-uppercase" id="editRecordModalLabel">
                <div class="fw-bold">Edit Record</div>
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form id="assignFileForm">
                <div>
                  <div class="form-group">
                    <label for="taxDeclarationNo" class="form-label text-dark"
                      >Tax Declaration No:</label
                    >
                    <input
                      type="text"
                      id="taxDeclarationNo"
                      class="form-control"
                      v-model="assign.taxDeclarationNo"
                    />
                  </div>

                  <div class="form-group mt-2">
                    <label for="declaredOwner" class="form-label text-dark"
                      >Declared Owner:</label
                    >
                    <input
                      type="text"
                      id="declaredOwner"
                      class="form-control"
                      v-model="assign.declaredOwner"
                    />
                  </div>

                  <div class="form-group mt-2">
                    <label for="areaInHectares" class="form-label text-dark"
                      >Area in Hectares:</label
                    >
                    <input
                      type="text"
                      id="areaInHectares"
                      class="form-control"
                      v-model="assign.areaInHectares"
                    />
                  </div>

                  <div class="form-group mt-2">
                    <label for="propertyIdentificationNo" class="form-label text-dark"
                      >Property Identification No:</label
                    >
                    <input
                      type="text"
                      id="propertyIdentificationNo"
                      class="form-control"
                      v-model="assign.propertyIdentificationNo"
                    />
                  </div>

                  <div class="form-group mt-2">
                    <label for="revision" class="form-label text-dark">Revision:</label>
                    <input
                      type="text"
                      id="revision"
                      class="form-control"
                      v-model="assign.revision"
                    />
                  </div>

                  <div class="form-group mt-2">
                    <label for="municipality" class="form-label text-dark"
                      >Municipality:</label
                    >
                    <v-select
                      label="name"
                      :filterable="false"
                      :options="municipalities"
                      @search="onMunicipalitySearch"
                      v-model="assign.municipality"
                      style="color: black"
                    >
                      <template #option="{ name }">
                        <h5 class="text-dark">{{ name }}</h5>
                      </template>
                    </v-select>
                  </div>
                  <div class="form-group mt-2">
                    <label for="municipality" class="form-label text-dark"
                      >Barangay:</label
                    >
                    <v-select
                      label="name"
                      :filterable="false"
                      :options="barangays"
                      @search="onBarangaySearch"
                      v-model="assign.barangay"
                      style="color: black"
                    >
                      <template #option="{ name }">
                        <h5 class="text-dark">{{ name }}</h5>
                      </template>
                    </v-select>
                  </div>
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
                @click="submitEdit"
                data-bs-dismiss="modal"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else> Save changes </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <label for="fileSearch" class="form-label text-dark fw-bold">Filters:</label>
      <div class="col-lg-3">
        <v-select
          label="name"
          :filterable="false"
          :options="municipalities"
          v-model="selectedMunicipality"
          @search="onMunicipalitySearch"
          style="color: black"
          class="bg-white"
          placeholder="By Municipality"
        >
          <template #option="{ name }">
            <h5 class="text-dark">{{ name }}</h5>
          </template>
        </v-select>
      </div>

      <div class="col-lg-3">
        <v-select
          label="name"
          :filterable="false"
          :options="barangays"
          @search="onBarangaySearch"
          v-model="selectedBarangay"
          style="color: black"
          class="bg-white"
          placeholder="By Barangay"
        >
          <template #option="{ name }">
            <h5 class="text-dark">{{ name }}</h5>
          </template>
        </v-select>
      </div>

      <div class="col-lg-3">
        <v-select
          label="name"
          :filterable="false"
          :options="owners"
          @search="onOwnerSearch"
          v-model="selectedOwner"
          style="color: black"
          class="bg-white"
          placeholder="By Owner"
        >
          <template #option="{ name }">
            <h5 class="text-dark">{{ name }}</h5>
          </template>
        </v-select>
      </div>

      <div class="col-lg-3 d-flex align-items-center">
        <label class="me-2 fw-bold text-dark">FROM</label>
        <input type="date" id="fromDate" class="form-control" v-model="fromDate" />
        <label class="mx-2 fw-bold text-dark">TO</label>
        <input type="date" id="toDate" class="form-control" v-model="toDate" />
      </div>
    </div>
    <div class="bg-light">
      <div class="row">
        <div class="col-lg-11">
          <label for="fileSearch" class="form-label text-dark fw-bold">Search:</label>
          <input
            type="text"
            class="form-control mb-3 form-control-lg"
            placeholder="By Property Identification OR TAX Declaration No"
            v-model="identificationSearch"
            @keypress.enter.prevent="fetchTaxDeclarations(1, pageSize)"
          />
        </div>
        <div class="col-lg-1">
          <div class="">
            <label for="pageSize" class="form-label text-dark fw-bold"
              >Show Entries:</label
            >
            <select
              id="pageSize"
              class="form-select"
              v-model="pageSize"
              @change="fetchTaxDeclarations(1, pageSize)"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th class="text-uppercase bg-dark text-white border text-center">
            Tax Declaration No
          </th>
          <th class="text-uppercase bg-dark text-white border text-center">
            Declared Owner
          </th>
          <th class="text-uppercase bg-dark text-white border border text-center">
            Area in Hectares
          </th>
          <th class="text-uppercase bg-dark text-white border border text-center">
            Property Identification
          </th>
          <th class="text-uppercase bg-dark text-white border text-center">Revision</th>
          <th class="text-uppercase bg-dark text-white border text-center">Location</th>
          <th class="text-uppercase bg-dark text-white border text-center">Created At</th>
          <th class="text-uppercase bg-dark text-white border text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white">
        <tr v-for="declaration in taxDeclarations" :key="declaration.id">
          <td class="fw-bold">{{ declaration.taxDeclarationNo }}</td>
          <td>{{ declaration.declaredOwner }}</td>
          <td class="text-center">{{ declaration.areaInHectares }}</td>
          <td class="fw-bold">{{ declaration.propertyIdentificationNo }}</td>
          <td class="text-center">{{ declaration.revision }}</td>
          <td class="text-center">
            {{ declaration.municipality?.name }} / {{ declaration.barangay?.name }}
          </td>
          <td class="text-center">
            {{ moment(declaration.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
          </td>
          <td class="text-center">
            <div class="btn-group" role="group" aria-label="Basic example">
              <!-- <button
                type="button"
                class="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#assignFileModal"
                @click="editRecord(declaration)"
              >
                Revision
              </button> -->
              <button
                type="button"
                class="btn btn-success"
                data-bs-target="#editRecordModal"
                data-bs-toggle="modal"
                @click="editRecord(declaration)"
              >
                Edit
              </button>
              <button
                v-if="declaration.filePath"
                type="button"
                class="btn btn-info"
                @click="download(declaration.filePath)"
              >
                Download
              </button>
              <button type="button" class="btn btn-danger d-none">Delete</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="float-end">
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <button
              class="page-link"
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
            >
              Previous
            </button>
          </li>
          <li
            v-for="page in pageNumbers"
            :key="page"
            class="page-item"
            :class="{ active: page === currentPage, disabled: page === '...' }"
          >
            <button class="page-link" @click="page !== '...' ? goToPage(page) : null">
              {{ page }}
            </button>
          </li>
          <li class="page-item">
            <button
              class="page-link"
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </layout>
</template>
<style scoped>
/* change the background color of focus page item in pagination bootstrap */
.pagination .page-item.active .page-link {
  background-color: rgb(27, 26, 26);
  border-color: rgb(27, 26, 26);
}
</style>
