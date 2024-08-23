<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted, ref, computed, watch, inject } from "vue";
import axios from "axios";
import moment from "moment";
import { downloadFile } from "@/services/file";
import { createRecord } from "@/services/record";
import { useToast } from "vue-toast-notification";
import alertify from "alertifyjs";

import { getDirectoryFiles } from "@/services/file";

const socket = inject("socket");
const $toast = useToast();

const files = ref([]);
const tags = ref([]);
const owners = ref([]);
const barangays = ref([]);
const municipalities = ref([]);
const taxDeclarations = ref([]);
const identificationSearch = ref("");
const previousDeclarations = ref([]);
const revisions = ref([]);

const isLoading = ref(false);
const showFilters = ref(false);

const selectedOwner = ref(null);
const selectedBarangay = ref(null);
const selectedMunicipality = ref(null);
const fromDate = ref("");
const toDate = ref("");

const currentPage = ref(1);
const pageSize = ref(5);
const totalPages = ref(1);
const isFetching = ref(false);
const totalRecords = ref(0);

const selectedDeclaration = ref(null);

socket.addEventListener("message", (event) => {
  if (event.data.includes("created") || event.data.includes("deleted")) {
    getDirectoryFiles().then((data) => (files.value = data));
  }
});

const fetchTaxDeclarations = async (page = currentPage.value, size = pageSize.value) => {
  isFetching.value = true;
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
    totalRecords.value = response.data.meta.totalRecords;
    isFetching.value = false;
  } catch (error) {
    isFetching.value = false;
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

watch(identificationSearch, () => {
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
  assign.value = {
    ID: data.ID,
    taxDeclarationNo: data.taxDeclarationNo,
    previousTaxDeclarationNo: data.previousTaxDeclarationNo,
    declaredOwner: data.declaredOwner,
    lotNo: data.lotNo,
    propertyIdentificationNo: data.propertyIdentificationNo,
    taxRevision: data.taxRevision,
    barangay: data.barangay,
    municipality: data.municipality,
  };
};

const searchDeclarationNo = (loading, search) => {
  axios
    .get(`http://localhost:8081/tax-declarations/unique/declarationNo?query=${search}`)
    .then((response) => {
      previousDeclarations.value = response.data;
      loading(false);
    })
    .catch((error) => {
      console.error(error);
      loading(false);
    });
};

const onTaxDeclarationNoSearch = (search, loading) => {
  if (search.length) {
    loading(true);
    searchDeclarationNo(loading, search);
  }
};

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

const deleteRecord = (id) => {
  alertify.confirm(
    "Delete Record",
    "Are you sure you want to delete this record?",
    () => {
      axios
        .delete(`http://localhost:8081/tax-declarations/${id}`)
        .then(() => {
          $toast.success("Record deleted successfully");
          fetchTaxDeclarations(currentPage.value, pageSize.value);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    () => {}
  );
};

const actionTakenFresh = (time) => {
  const currentTime = moment();
  const recordTime = moment(time);
  const diff = currentTime.diff(recordTime, "seconds");
  return diff < 60;
};

const getTags = () => {
  axios
    .get("http://localhost:8081/tags")
    .then((response) => {
      tags.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

const addAttachments = (declaration) => {
  selectedDeclaration.value = declaration;
  const modal = new bootstrap.Modal(document.getElementById("addAttachments"));
  Promise.all([getDirectoryFiles(), getTags()]).then((data) => {
    files.value = data[0];

    files.value?.forEach((file) => {
      file.tag = "";
      file.oldFileName = file.name;
      file.name = removeExtension(file.name);
    });

    tags.value = data[1];
    modal.show();
  });
};

const removeExtension = (filename) => {
  return filename.replace(/\.[^/.]+$/, "");
};

const submitAttachments = () => {
  axios
    .post(
      `http://localhost:8081/tax-declarations/${selectedDeclaration.value.ID}/attachments`,
      files.value
    )
    .then((response) => {
      $toast.success("Attachments added successfully");
    });
};

onMounted(() => {
  fetchTaxDeclarations();
  getRevisions();
});
</script>

<template>
  <layout>
    <template #title>
      <h4 class="text-uppercase fw-bold">
        Complete List of Tax Declarations
        <span class="fw-bold text-primary">[ {{ totalRecords }} ]</span>
      </h4>
      <div class="border my-2 border-primary"></div>
    </template>

    <div
      v-if="isFetching"
      class="d-flex justify-content-center align-items-center bg-dark"
      style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        opacity: 0.5;
      "
    >
      <div class="d-flex flex-column align-items-center justify-content-center">
        <div class="spinner-border text-white" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <h4 class="text-white mt-2">Fetching Records</h4>
      </div>
    </div>

    <div>
      <div
        class="modal fade"
        id="addAttachments"
        tabindex="-1"
        aria-labelledby="addAttachmentsLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-uppercase" id="addAttachmentsLabel">
                <div class="fw-bold">Add Attachments</div>
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div v-if="files && files.length !== 0">
                <div v-for="file in files" :key="file">
                  <div class="row mb-3">
                    <div class="col-lg-6">
                      <div class="form-group">
                        <label for="file" class="form-label text-dark fw-bold"
                          >FILE NAME</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          v-model="file.name"
                          placeholder="Enter File name"
                        />
                      </div>
                    </div>

                    <div class="col-lg-6">
                      <div class="form-group">
                        <label
                          for="file"
                          class="form-label text-dark text-uppercase fw-bold"
                          >TAG</label
                        >
                        <select class="form-control" v-model="file.tag">
                          <option value="">Select Tag</option>
                          <option
                            :value="tag"
                            v-for="tag in tags"
                            :key="tag"
                            class="text-uppercase"
                          >
                            {{ tag.name.toUpperCase() }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <h4 class="text-center text-uppercase fw-bold text-danger">
                  No Files Found
                </h4>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="submit" class="btn btn-primary" @click="submitAttachments">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else> Apply </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
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
                  <div class="form-group w-100 mb-3">
                    <label
                      for="declaredOwner"
                      class="form-label text-dark text-uppercase fw-bold"
                    >
                      Previous Declaration No :
                    </label>
                    <v-select
                      label="name"
                      :filterable="false"
                      :options="previousDeclarations"
                      @search="onTaxDeclarationNoSearch"
                      :taggable="true"
                      v-model="assign.previousTaxDeclarationNo"
                      style="color: black"
                      class="bg-white text-uppercase"
                    >
                    </v-select>
                  </div>

                  <div class="form-group mt-3">
                    <label
                      for="taxDeclarationNo"
                      class="form-label text-dark text-uppercase fw-bold"
                      >Tax Declaration No:</label
                    >
                    <input
                      type="text"
                      id="taxDeclarationNo"
                      class="form-control"
                      v-model="assign.taxDeclarationNo"
                    />
                  </div>

                  <div class="form-group w-100 mt-3">
                    <label
                      for="declaredOwner"
                      class="form-label text-dark text-uppercase fw-bold"
                    >
                      Declared Owner :
                    </label>
                    <v-select
                      label="name"
                      :filterable="false"
                      :options="owners"
                      @search="onOwnerSearch"
                      :taggable="true"
                      v-model="assign.declaredOwner"
                      style="color: black"
                      class="bg-white text-uppercase"
                    >
                      <template #option="{ name }">
                        <h5 class="text-dark">{{ name }}</h5>
                      </template>
                    </v-select>
                  </div>

                  <div class="form-group mt-3">
                    <label
                      for="areaInHectares"
                      class="form-label text-dark text-uppercase fw-bold"
                      >Lot No:</label
                    >
                    <input
                      type="text"
                      id="areaInHectares"
                      class="form-control"
                      v-model="assign.lotNo"
                    />
                  </div>

                  <div class="form-group mt-3">
                    <label
                      for="propertyIdentificationNo"
                      class="form-label text-dark fw-bold text-uppercase"
                      >Property Identification No:</label
                    >
                    <input
                      type="text"
                      id="propertyIdentificationNo"
                      class="form-control"
                      v-model="assign.propertyIdentificationNo"
                    />
                  </div>

                  <div class="form-group mt-3">
                    <label
                      for="revision"
                      class="form-label text-dark fw-bold text-uppercase"
                      >Tax Effectivity:</label
                    >
                    <select
                      name=""
                      id=""
                      class="form-control"
                      v-model="assign.taxRevision"
                    >
                      <option
                        :value="revision"
                        v-for="revision in revisions"
                        :key="revision"
                      >
                        {{ revision.RevisionNumber }} ({{ revision.fromYear }} -
                        {{ revision.toYear }})
                      </option>
                    </select>
                  </div>

                  <div class="form-group mt-3">
                    <label
                      for="municipality"
                      class="form-label text-dark text-uppercase fw-bold"
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
                  <div class="form-group mt-3">
                    <label
                      for="municipality"
                      class="form-label text-dark text-uppercase fw-bold"
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

    <button
      class="btn float-end mb-1"
      @click="showFilters = !showFilters"
      :class="{
        'btn-info': !showFilters,
        'btn-danger': showFilters,
      }"
    >
      <span v-if="showFilters">Hide Filters</span>
      <span v-else>Filters</span>
    </button>
    <div class="clearfix"></div>
    <div v-auto-animate>
      <div class="card" v-if="showFilters">
        <div class="card-header">
          <h5 class="card-title">Filters</h5>
          <h6 class="card-subtitle text-muted">
            You can use filter to narrow down your search
          </h6>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4">
              <label for="">Municipality</label>
              <v-select
                label="name"
                :filterable="false"
                :options="municipalities"
                v-model="selectedMunicipality"
                @search="onMunicipalitySearch"
                class="bg-white"
              >
                <template #option="{ name }">
                  <h5 class="text-dark">{{ name }}</h5>
                </template>
              </v-select>
            </div>

            <div class="col-lg-4">
              <label for="">Barangay</label>
              <v-select
                label="name"
                :filterable="false"
                :options="barangays"
                @search="onBarangaySearch"
                v-model="selectedBarangay"
                class="bg-white"
              >
                <template #option="{ name }">
                  <h5 class="text-dark">{{ name }}</h5>
                </template>
              </v-select>
            </div>

            <div class="col-lg-4">
              <label for="">Owner</label>
              <v-select
                label="name"
                :filterable="false"
                :options="owners"
                @search="onOwnerSearch"
                v-model="selectedOwner"
                class="bg-white"
              >
                <template #option="{ name }">
                  <h5 class="text-dark">{{ name }}</h5>
                </template>
              </v-select>
            </div>
          </div>
          <hr />
          <div class="row">
            <div class="col-lg-6">
              <label class="text-dark">Date To:</label>
              <input type="date" id="toDate" class="form-control" v-model="toDate" />
            </div>
            <div class="col-lg-6">
              <label class="text-dark">Date From:</label>
              <input type="date" id="fromDate" class="form-control" v-model="fromDate" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-2">
      <div class="card-header pb-0 mb-0">
        <div class="row mb-0">
          <div class="col-lg-11 p-0">
            <label for="fileSearch" class="form-label text-dark fw-bold">Search:</label>
            <input
              type="text"
              class="form-control mb-3 form-control-lg"
              v-model="identificationSearch"
              @keypress.enter.prevent="fetchTaxDeclarations(1, pageSize)"
            />
          </div>
          <div class="col-lg-1 p-0 ps-2">
            <div class="">
              <label for="pageSize" class="form-label text-dark fw-bold">Entries:</label>
              <select
                id="pageSize"
                class="form-select form-control-lg"
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
      <div class="">
        <table class="table mb-0 table table-striped border">
          <thead>
            <tr>
              <th class="fw-medium bg-dark text-white">Previous TDN</th>
              <th class="fw-medium bg-dark text-white">TDN</th>
              <th class="fw-medium bg-dark text-white">Property Identification</th>
              <th class="fw-medium bg-dark text-white">Lot No</th>
              <th class="fw-medium bg-dark text-white">Declared Owner</th>
              <th class="fw-medium bg-dark text-white text-center">Tax Effectivity</th>
              <th class="fw-medium bg-dark text-white">Location</th>
              <th class="fw-medium bg-dark text-white text-center">Assigned By</th>
              <th class="fw-medium bg-dark text-white text-center">Created At</th>
              <th class="fw-medium bg-dark text-white text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white" v-if="taxDeclarations.length != 0">
            <tr v-for="declaration in taxDeclarations" :key="declaration.id">
              <td
                class="fw-medium"
                :class="{
                  'text-primary': actionTakenFresh(declaration.updatedAt),
                }"
              >
                {{ declaration.previousTaxDeclarationNo }}
              </td>
              <td
                class="fw-medium"
                :class="{
                  'text-primary': actionTakenFresh(declaration.updatedAt),
                }"
              >
                {{ declaration.taxDeclarationNo }}
              </td>
              <td
                class="fw-medium"
                :class="{
                  'text-primary': actionTakenFresh(declaration.updatedAt),
                }"
              >
                {{ declaration.propertyIdentificationNo }}
              </td>
              <td
                class="fw-medium text-center"
                :class="{
                  'text-primary': actionTakenFresh(declaration.updatedAt),
                }"
              >
                {{ declaration.lotNo }}
              </td>
              <td
                class="text-uppercase"
                :class="{
                  'text-primary': actionTakenFresh(declaration.updatedAt),
                }"
              >
                <div class="fw-medium">
                  {{ declaration.declaredOwner }}
                </div>
              </td>
              <td
                class="text-center fw-medium"
                :class="{
                  'text-primary': actionTakenFresh(declaration.updatedAt),
                }"
              >
                {{ declaration.taxRevision.revisionNumber }}
              </td>
              <td
                class="text-start fw-medium"
                :class="{
                  'text-primary': actionTakenFresh(declaration.updatedAt),
                }"
              >
                <span class="text-uppercase">
                  {{ declaration.municipality?.name }} / {{ declaration.barangay?.name }}
                </span>
              </td>
              <td
                class="text-center fw-medium"
                :class="{
                  'text-primary': actionTakenFresh(declaration.updatedAt),
                }"
              >
                <span class="text-uppercase">
                  {{ declaration.user?.username }}
                </span>
              </td>
              <td
                class="text-center fw-medium"
                :class="{
                  'text-primary': actionTakenFresh(declaration.updatedAt),
                }"
              >
                {{ moment(declaration.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
              </td>
              <td class="text-center">
                <div class="dropdown">
                  <button
                    class="btn btn-dark dropdown-toggle btn-lg"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Actions
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li>
                      <Router-Link
                        :to="`/tax-declaration/${declaration.taxDeclarationNo}`"
                        class="dropdown-item"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-journal-check text-primary"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10.854 6.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 8.793l2.646-2.647a.5.5 0 0 1 .708 0"
                          />
                          <path
                            d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"
                          />
                          <path
                            d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"
                          />
                        </svg>
                        <span class="mx-1"> History</span>
                      </Router-Link>
                    </li>
                    <li class="dropdown-divider"></li>
                    <li>
                      <a
                        class="dropdown-item"
                        data-bs-target="#editRecordModal"
                        data-bs-toggle="modal"
                        @click="editRecord(declaration)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-pencil text-primary"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
                          />
                        </svg>
                        <span class="mx-1"> Edit</span>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" @click="addAttachments(declaration)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-file-earmark-break text-primary"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M14 4.5V9h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v7H2V2a2 2 0 0 1 2-2h5.5zM13 12h1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2h1v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1zM.5 10a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1z"
                          />
                        </svg>
                        <span class="mx-1"> Attachments</span>
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        v-if="declaration.filePath"
                        @click="download(declaration.filePath)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-cloud-download text-primary"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383"
                          />
                          <path
                            d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708z"
                          />
                        </svg>
                        <span class="mx-1"> Download</span>
                      </a>
                    </li>

                    <li class="dropdown-divider"></li>
                    <li>
                      <a class="dropdown-item" @click="deleteRecord(declaration.ID)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-trash text-danger"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                          />
                          <path
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                          />
                        </svg>
                        <span class="mx-2">Delete</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody class="bg-white" v-else-if="taxDeclarations.length === 0 && !isFetching">
            <tr>
              <td class="text-danger text-center text-uppercase" colspan="9">
                No records found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="float-end" v-if="totalRecords != 0">
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <button
              class="page-link text-primary fw-normal"
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
              class="page-link text-primary fw-normal"
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
table tbody tr {
  background-color: #f2f2f2 !important;
}
</style>
