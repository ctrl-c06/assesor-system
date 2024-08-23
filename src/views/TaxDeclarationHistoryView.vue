<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
const route = useRoute();

let taxDeclarations = ref([]);
const attachmentBeingProcess = ref(false);
let taxDeclarationNo = route.params.taxDeclarationNo;
const opened = ref([]);

const getFileName = (path) => {
  if (path.includes("/")) {
    return path.split("/").pop();
  } else {
    return path.split("\\").pop();
  }
};

const viewFile = (file) => {
  const encodedAttachment = encodeURIComponent(file.trim());
  const downloadUrl = `http://localhost:8080/download-fullpath?path=${encodedAttachment}`;
  window.open(downloadUrl, "_blank");
};

const toggleDisplay = (taxDeclaration) => {
  if (opened.value.includes(taxDeclaration.taxDeclarationNo)) {
    opened.value.splice(opened.value.indexOf(taxDeclaration.taxDeclarationNo), 1);
  } else {
    attachmentBeingProcess.value = true;

    axios
      .post("http://localhost:8080/generate-attachment-thumbnails", {
        files: taxDeclaration.attachments
          .split(",")
          .map((attachment) => attachment.trim()),
      })
      .then((response) => {
        if (response.status === 200) {
          attachmentBeingProcess.value = false;
          opened.value.push(taxDeclaration.taxDeclarationNo);
        }
      })
      .catch((err) => {
        attachmentBeingProcess.value = true;
      });
  }
};

onMounted(() => {
  axios
    .get(`http://localhost:8081/tax-declarations/relate/${taxDeclarationNo}`)
    .then((response) => {
      axios
        .get(
          `http://localhost:8081/tax-declarations/all/related/${response.data.tax_declaration_no}`
        )
        .then((r) => {
          taxDeclarations.value = r.data;
        });
    });
});
</script>

<template>
  <layout>
    <template #title>
      <h4 class="text-uppercase fw-bold">TAX DECLARTIONS</h4>
      <div class="border my-2 border-primary"></div>
    </template>

    <div class="card" v-for="taxDeclaration in taxDeclarations" :key="taxDeclaration">
      <div class="card-header">
        <h5 class="mb-0">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <button class="btn btn-link" @click="toggleDisplay(taxDeclaration)">
                <span class="fw-medium">{{ taxDeclaration.taxDeclarationNo }} </span> -
                ({{ taxDeclaration.revision_number }})
              </button>
              <span v-if="attachmentBeingProcess">
                <div class="spinner-border text-dark spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </span>
            </div>
            <div>
              <button
                class="btn btn-primary float-end"
                @click="toggleDisplay(taxDeclaration)"
              >
                Attachments :
                <span class="fw-bold">
                  {{ taxDeclaration.attachment_count }}
                </span>
              </button>
            </div>
          </div>
        </h5>
      </div>

      <div
        :id="`collapse-${taxDeclaration.taxDeclarationNo}`"
        class="collapse show"
        aria-labelledby="headingOne"
        data-parent="#accordion"
      >
        <div v-auto-animate>
          <div
            class="card-body mt-0 pt-0 pb-3"
            v-if="opened.includes(taxDeclaration.taxDeclarationNo)"
          >
            <div class="row">
              <label class="col-form-label mx-3 col-sm-1 fw-medium text-muted"
                >Previous TDN:</label
              >
              <div class="col-sm-4">
                <input
                  type="text"
                  class="form-control"
                  readonly="true"
                  :value="taxDeclaration.previousTaxDeclarationNo"
                />
              </div>
              <label class="col-form-label mx-3 col-sm-1 fw-medium text-muted"
                >PIN:</label
              >
              <div class="col-sm-5">
                <input
                  type="text"
                  class="form-control"
                  readonly="true"
                  :value="taxDeclaration.propertyIdentificationNo"
                />
              </div>
            </div>
            <div class="row my-2">
              <label class="col-form-label mx-3 col-sm-1 fw-medium text-muted"
                >Lot No:</label
              >
              <div class="col-sm-4">
                <input
                  type="text"
                  class="form-control"
                  readonly="true"
                  :value="taxDeclaration.lotNo"
                />
              </div>
              <label class="col-form-label mx-3 col-sm-1 fw-medium text-muted"
                >Owner:</label
              >
              <div class="col-sm-5">
                <input
                  type="text"
                  class="form-control text-uppercase"
                  :value="taxDeclaration.declaredOwner"
                />
              </div>
            </div>

            <div class="row my-2">
              <label class="col-form-label mx-3 col-sm-1 fw-medium text-muted">
                Municipality:</label
              >
              <div class="col-sm-4">
                <input
                  type="text"
                  class="form-control text-uppercase"
                  readonly="true"
                  :value="taxDeclaration.municipality_name"
                />
              </div>
              <label class="col-form-label mx-3 col-sm-1 fw-medium text-muted"
                >Barangay:</label
              >
              <div class="col-sm-5">
                <input
                  type="text"
                  class="form-control text-uppercase"
                  readonly="true"
                  :value="taxDeclaration.barangay_name"
                />
              </div>
            </div>
            <div
              class="d-flex mt-2 align-items-center justify-content-between p-3 border border-start-0 border-end-0 border-bottom-0 border-primary border-3"
              style="overflow-x: scroll"
              v-if="taxDeclaration.attachment_count !== 0"
            >
              <div
                v-for="attachment in taxDeclaration.attachments.split(',')"
                :key="attachment"
              >
                <img
                  @click="viewFile(attachment)"
                  :src="`http://localhost:8080/thumbnail?file=${getFileName(
                    attachment
                  ).replace('.pdf', '')}`"
                  class="mx-2 border p-2 border border-dark cursor-pointer"
                  width="240vw;"
                />
                <div class="d-flex justify-content-center align-items-center">
                  <span class="badge bg-danger text-white p-2 rounded-0 w-100 mx-2 mt-1">
                    {{ getFileName(attachment) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
