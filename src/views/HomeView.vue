<script setup>
import { inject, onMounted, ref, defineComponent } from "vue";
import Layout from "@/components/BaseLayout.vue";
import axios from "axios";
import moment from "moment";

import { VueImageZoomer } from "vue-image-zoomer";
import "vue-image-zoomer/dist/style.css";
import {
  getDirectoryFiles,
  downloadFile,
  submitRenameFile,
  deleteFile,
} from "@/services/file";

import { createRecord } from "@/services/record";
import { getBarangays, getMunicipalities } from "@/services/locations";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const $toast = useToast();
const barangays = ref([]);
const municipalities = ref([]);
const owners = ref([]);
const previousDeclarations = ref([]);

const files = ref([]);
const selectedFile = ref({
  name: "",
  size: 0,
});
const fileSearch = ref("");
const selectedFiles = ref([]);

const revisions = ref([]);

const assign = ref({
  taxDeclarationNo: "",
  previousTaxDeclarationNo: "",
  declaredOwner: "",
  lotNo: "",
  propertyIdentificationNo: "",
  taxRevision: "",
  barangay: "",
  municipality: "",
});

defineComponent({ VueImageZoomer });

const socket = inject("socket");
const isLoading = ref(false);
const removeFileExtension = (file) => {
  return file.replace(/\.[^/.]+$/, "");
};

const editFile = (file) => {
  selectedFile.value = file;
  selectedFile.value.oldFileName = file.name;
  let name = removeFileExtension(file.name);
  selectedFile.value.name = name;
};

socket.addEventListener("message", (event) => {
  if (event.data.includes("created") || event.data.includes("deleted")) {
    getDirectoryFiles().then((data) => (files.value = data));
  }
});

const getFiles = () => {
  getDirectoryFiles().then((data) => (files.value = data));
};

const generateThumbnail = (file) => {
  axios
    .post(`http://localhost:8080/generate-thumbnails`, {
      files: [file.name],
    })
    .then((response) => {});
};

const markAsSelected = (file) => {
  if (selectedFiles.value.some((selectedFile) => selectedFile.name === file.name)) {
    selectedFiles.value = selectedFiles.value.filter(
      (selectedFile) => selectedFile.name !== file.name
    );
  } else {
    selectedFiles.value = [...selectedFiles.value, file];
    generateThumbnail(file);
  }
};

const renameFile = () => {
  isLoading.value = true;
  submitRenameFile(selectedFile.value).then(() => {
    isLoading.value = false;
    $toast.success("File renamed successfully");
  });
};

const mergeAll = () => {
  let fileNames = selectedFiles.value.map((file) => file.name);
  axios
    .post("http://localhost:8080/merge", {
      files: fileNames,
    })
    .then((response) => {
      if (response.status === 200) {
        getDirectoryFiles().then((data) => {
          // push the newly merged file to the top of the list so the user can view it first
          let index = data.findIndex((file) => file.name === "merged_output.pdf");
          if (index !== -1) {
            let mergedFile = data.splice(index, 1);
            data.unshift(mergedFile[0]);
          }
          selectedFiles.value = [];
          files.value = data;
        });

        $toast.success("Files merged successfully");
      }
    });
};

const viewFiles = () => {
  let fileNames = selectedFiles.value.map((file) => file.name);
  axios
    .post("http://localhost:8080/process-view-file", {
      files: fileNames,
    })
    .then((response) => {
      if (response.status === 200) {
        let mergedViewFileName = response.data;
        window.open(
          `http://localhost:8080/view-multiple-file?file=${mergedViewFileName}`
        );
      }
    });
};

const submitRecord = () => {
  assign.value.user_id = parseInt(localStorage.getItem("id"));
  assign.value.taxRevision = assign.value.taxRevision || {};
  assign.value.barangay = assign.value.barangay || {};
  assign.value.municipality = assign.value.municipality || {};

  assign.value.barangay_id = assign.value.barangay.id;
  assign.value.municipality_id = assign.value.municipality.id;

  createRecord(assign.value).then((data) => {
    let record = data;
    let date = moment(data.createdAt).format("MMMM DD, YYYY");
    axios
      .post("http://localhost:8080/move", {
        fileName: selectedFile.value.name,
        folderName:
          assign.value.taxRevision.revisionNumber +
          "/" +
          assign.value.municipality.name +
          "/" +
          assign.value.barangay.name +
          "/" +
          assign.value.declaredOwner +
          "/" +
          assign.value.lotNo,
      })
      .then((response) => {
        axios
          .post("http://localhost:8081/tax-declaration/file-path", {
            FilePath: response.data,
            ID: data.ID,
          })
          .then(() => {
            $toast.success("File assigned successfully");
          });
      });
  });
};

const searchFile = (event) => {
  if (fileSearch.value) {
    axios
      .get(`http://localhost:8080/search?query=${fileSearch.value}`)
      .then((response) => {
        if (response.data) {
          files.value = response.data;
        } else {
          files.value = [];
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    getDirectoryFiles().then((data) => (files.value = data));
  }
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

const getThumbnailUrl = (name) => {
  return `http://localhost:8080/thumbnail?file=${name}`;
};

const refetchThumbnails = () => {
  selectedFiles.value.forEach((file) => {
    file.cache = new Date().getTime();
  });
};

const assignFile = (file) => {
  generateThumbnail(file);
  selectedFile.value = file;
  selectedFile.value.cache = 0;
  setTimeout(() => {
    selectedFile.value.cache = new Date().getTime();
  }, 700);
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

const onOwnerSearch = (search, loading) => {
  if (search.length) {
    loading(true);
    searchOwner(loading, search);
  }
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

onMounted(() => {
  getRevisions();
  getDirectoryFiles().then((data) => (files.value = data));
});
</script>

<template>
  <layout>
    <div>
      <!-- offcanvas -->
      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="selectedFilesCanvas"
        aria-labelledby="selectedFilesCanvasLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="selectedFilesCanvasLabel">
            {{ selectedFiles.length }} Files selected
          </h5>
          <button
            type="button"
            class="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <div v-for="f in selectedFiles" :key="f" @click="downloadFile(f.name)">
            <div class="card cursor-pointer border border-primary">
              <div class="card-text p-1 text-center fw-bold text-uppercase">
                {{ removeFileExtension(f.name) }}
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <img
                      :src="`http://localhost:8080/thumbnail?file=${f.name}&t=${f.cache}`"
                      class="img-fluid"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- bootstrap button group -->
          <div class="d-flex flex-column align-items-center">
            <button type="button" class="btn btn-dark fw-bold w-100" @click="mergeAll">
              MERGE ALL
            </button>
            <button
              type="button"
              class="btn btn-dark fw-bold w-100 my-2"
              @click="viewFiles"
            >
              VIEW ALL
            </button>
          </div>
        </div>
      </div>

      <button
        v-if="selectedFiles.length >= 2"
        type="button"
        class="btn btn-info rounded-circle position-fixed bottom-0 end-0 m-4 p-0 py-2 px-2 border border-primary shadow shadow-lg"
        style="z-index: 1000"
        data-bs-toggle="offcanvas"
        @click="refetchThumbnails"
        href="#selectedFilesCanvas"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="38"
          height="38"
          fill="currentColor"
          class="bi bi-filter-circle-fill"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M3.5 5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1M5 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"
          />
        </svg>
      </button>

      <!-- bootstrap 4 modal -->
      <div
        class="modal fade"
        id="renameFileModal"
        tabindex="-1"
        aria-labelledby="renameFileModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-uppercase" id="renameFileModalLabel">
                <div class="text-muted">
                  Rename File
                  <span class="fw-bold text-dark">
                    {{ selectedFile.oldFileName }}
                  </span>
                </div>
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                @click="getFiles"
              ></button>
            </div>
            <div class="modal-body">
              <label class="form-label fw-bold text-dark">File Name:</label>
              <input
                type="text"
                v-model="selectedFile.name"
                @keypress.enter.prevent="renameFile"
                class="form-control"
              />
              <span class="text-danger"
                >Don't include any file extension e.g. (.pdf, .docx)</span
              >
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                @click="getFiles"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                @click="renameFile"
                :disabled="isLoading"
              >
                <!-- display bootstrap spinner -->
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else> Save changes </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div
        class="modal fade"
        id="assignFileModal"
        tabindex="-1"
        aria-labelledby="assignFileModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-xl modal-dialog-centered" style="min-width: 95vw">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-uppercase" id="assignFileModalLabel">
                <div class="fw-bold">Assign File</div>
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-lg-6">
                  <div v-if="!selectedFile.cache">
                    <div class="d-flex align-items-center justify-content-center vh-50">
                      <div class="spinner-border text-dark" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <div class="text-center fw-bold mb-2">
                      {{ selectedFile.name }}
                    </div>
                    <div class="d-flex align-items-center justify-content-between">
                      <button class="btn btn-dark shadow shadow-lg px-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="24"
                          fill="currentColor"
                          class="bi bi-chevron-left"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                          />
                        </svg>
                      </button>
                      <div style="max-height: 60vh; max-width: 21vw">
                        <vue-image-zoomer
                          :regular="`http://localhost:8080/thumbnail?file=${
                            selectedFile.name
                          }&t=${selectedFile.cache || 0}`"
                          :zoom-amount="3"
                          img-class="img-fluid"
                          alt="Scanned File"
                          @on-zoom="zoom = true"
                          @off-zoom="zoom = false"
                        />
                      </div>
                      <button class="btn btn-dark shadow shadow-lg px-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="24"
                          fill="currentColor"
                          class="bi bi-chevron-right"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  class="col-lg-6 border border-light border-top-0 border-end-0 border-bottom-0 border-3"
                >
                  <form id="assignFileForm">
                    <div
                      class="d-flex flex-column justify-content-center align-items-center"
                    >
                      <div class="form-group w-100 mb-3 mt-2">
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

                      <div class="form-group mb-3 w-100">
                        <label
                          for="taxDeclarationNo"
                          class="form-label fw-bold text-uppercase text-dark"
                        >
                          Tax Declaration No:
                        </label>
                        <input
                          type="text"
                          id="taxDeclarationNo"
                          class="form-control"
                          v-model="assign.taxDeclarationNo"
                        />
                      </div>

                      <div class="form-group w-100 mb-3 mt-2">
                        <label
                          for="propertyIdentificationNo"
                          class="form-label text-dark text-uppercase fw-bold"
                        >
                          Property Identification No:
                        </label>
                        <input
                          type="text"
                          id="propertyIdentificationNo"
                          class="form-control"
                          v-model="assign.propertyIdentificationNo"
                        />
                      </div>

                      <div class="form-group w-100 mb-3 mt-2">
                        <label
                          for="lotNo"
                          class="form-label text-dark text-uppercase fw-bold"
                        >
                          Lot No:
                        </label>
                        <input
                          type="text"
                          id="lotNo"
                          class="form-control"
                          v-model="assign.lotNo"
                        />
                      </div>

                      <div class="form-group w-100 mb-3 mt-2">
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

                      <div class="form-group w-100 mb-3 mt-2">
                        <label
                          for="revision"
                          class="form-label text-dark text-uppercase fw-bold"
                        >
                          TAX EFFECTIVITY:
                        </label>
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
                            {{ revision.revisionNumber }}
                          </option>
                        </select>
                      </div>

                      <div class="form-group w-100 mb-3 mt-2">
                        <label
                          for="municipality"
                          class="form-label text-dark text-uppercase fw-bold"
                        >
                          Municipality:
                        </label>
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
                      <div class="form-group w-100 mb-3 mt-2">
                        <label
                          for="municipality"
                          class="form-label text-dark text-uppercase fw-bold"
                        >
                          Barangay:
                        </label>
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
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="submit" class="btn btn-primary" @click="submitRecord">
                <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
                <span v-else> Save changes </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <template #title>
      <h4 class="text-uppercase fw-bold">
        List of Scanned Files
        <span class="fw-bold text-primary">[ {{ files?.length || 0 }} ]</span>
      </h4>
      <div class="border my-2 border-primary"></div>
    </template>

    <div class="input-group mb-3" v-if="files">
      <span class="input-group-text" id="basic-addon1">
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
        class="form-control form-control-lg"
        placeholder="File Search"
        v-model="fileSearch"
        @keydown.enter.prevent="searchFile"
      />
    </div>
    <div v-if="files">
      <div v-for="file in files" :key="file">
        <div
          class="card mb-4 cursor-pointer"
          @click.ctrl="markAsSelected(file)"
          :class="{
            'border border-primary': selectedFiles.some(
              (selectedFile) => selectedFile.name === file.name
            ),
          }"
        >
          <div
            v-if="selectedFiles.some((selectedFile) => selectedFile.name === file.name)"
            style="position: relative; z-index: 99999"
          >
            <button class="btn btn-primary fw-bold rounded-0">
              {{ selectedFiles.indexOf(file) + 1 }}
            </button>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <div class="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    fill="currentColor"
                    class="bi bi-file-pdf-fill text-danger me-2"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M5.523 10.424q.21-.124.459-.238a8 8 0 0 1-.45.606c-.28.337-.498.516-.635.572l-.035.012a.3.3 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548m2.455-1.647q-.178.037-.356.078a21 21 0 0 0 .5-1.05 12 12 0 0 0 .51.858q-.326.048-.654.114m2.525.939a4 4 0 0 1-.435-.41q.344.007.612.054c.317.057.466.147.518.209a.1.1 0 0 1 .026.064.44.44 0 0 1-.06.2.3.3 0 0 1-.094.124.1.1 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256M8.278 4.97c-.04.244-.108.524-.2.829a5 5 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.5.5 0 0 1 .145-.04c.013.03.028.092.032.198q.008.183-.038.465z"
                    />
                    <path
                      fill-rule="evenodd"
                      d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m.165 11.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.6 11.6 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.86.86 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.84.84 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.8 5.8 0 0 0-1.335-.05 11 11 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.24 1.24 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a20 20 0 0 1-1.062 2.227 7.7 7.7 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103"
                    />
                  </svg>
                </div>
                <div class="ms-3">
                  <h5 class="card-title mb-1 text-dark fw-bold">{{ file.name }}</h5>
                  <p class="card-text mb-1">
                    Size: <span class="text-dark fw-medium">{{ file.size }}</span>
                  </p>
                  <p class="card-text">
                    Scanned At:
                    <span class="text-dark fw-medium">
                      {{ moment(file.modTime).format("MMMM DD, YYYY HH:mm:ss") }}</span
                    >
                  </p>
                </div>
              </div>
              <div>
                <div class="dropdown">
                  <button
                    class="btn btn-dark btn-lg dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Actions
                  </button>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <li>
                      <a
                        class="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#assignFileModal"
                        @click="assignFile(file)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-person-plus me-2"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"
                          />
                          <path
                            fill-rule="evenodd"
                            d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
                          />
                        </svg>
                        <span class="mt-5">Assign</span>
                      </a>
                    </li>
                    <li>
                      <a
                        class="dropdown-item"
                        @click="editFile(file)"
                        data-bs-target="#renameFileModal"
                        data-bs-toggle="modal"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-pencil me-2"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
                          />
                        </svg>
                        <span class="mt-5">Rename</span>
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" @click="downloadFile(file.name)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-file-earmark-arrow-down me-2"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z"
                          />
                          <path
                            d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"
                          />
                        </svg>
                        <span class="mt-5">Download / View</span>
                      </a>
                    </li>
                    <li class="dropdown-divider"></li>
                    <li>
                      <a class="dropdown-item text-danger" @click="deleteFile(file)">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-trash3-fill me-2"
                          viewBox="0 0 16 16"
                        >
                          <path
                            d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                          />
                        </svg>
                        <span class="mt-5">Delete</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="d-flex align-items-center justify-content-center flex-column mt-5">
      <img src="@/assets/img/no-files.svg" alt="" class="w-25" />
      <span class="h5 fw-bold text-white p-3 bg-danger text-uppercase mt-5 rounded"
        >No Available Files</span
      >
    </div>
  </layout>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
