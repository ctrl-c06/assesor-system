<script setup>
import { inject, onMounted, ref } from "vue";
import Layout from "@/components/BaseLayout.vue";
import axios from "axios";
import {
  getDirectoryFiles,
  downloadFile,
  submitRenameFile,
  deleteFile,
} from "@/services/file";

import { createRecord } from "@/services/record";
import { getBarangays, getMunicipalities } from "@/services/locations";

const barangays = ref([]);
const municipalities = ref([]);
const files = ref([]);
const selectedFile = ref({
  name: "",
  size: 0,
});

const assign = ref({
  taxDeclarationNo: "",
  declaredOwner: "",
  areaInHectares: "",
  propertyIdentificationNo: "",
  revision: "",
  location: {
    barangay: "",
    municipality: "",
  },
});

const socket = inject("socket");
const isAssign = ref(false);

const removeFileExtension = (file) => {
  return file.replace(/\.[^/.]+$/, "");
};

const editFile = (file) => {
  selectedFile.value = file;
  selectedFile.value.oldFileName = file.name;
  let name = removeFileExtension(file.name);
  selectedFile.value.name = name;
};

const sendMessage = () => {
  socket.send("Hello World from Vue 3");
};

socket.addEventListener("message", (event) => {
  if (event.data.includes("created") || event.data.includes("deleted")) {
    getDirectoryFiles().then((data) => (files.value = data));
  }
});

const renameFile = () => {
  submitRenameFile(selectedFile.value).then(() => (selectedFile.value = ""));
};

const submitRecord = () => {
  createRecord(assign.value).then(() => {
    console.log("success");
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

onMounted(() => {
  getDirectoryFiles().then((data) => (files.value = data));
});
</script>

<template>
  <layout>
    <p>dashboard</p>
  </layout>
</template>
