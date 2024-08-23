<script setup>
import Layout from "@/components/BaseLayout.vue";
import axios from "axios";
import { onMounted, ref, defineComponent } from "vue";
import ApexChart from "vue3-apexcharts";

defineComponent({
  ApexChart,
});

const widgetsData = ref({
  totalTaxDeclarations: 0,
  totalUnassignedFiles: 0,
  totalUsers: 0,
  totalAttachments: 0,
});

const isBarangayClicked = ref(false);

const onDataPointClick = (event, chartContext, config) => {
  if (isBarangayClicked.value) {
    isBarangayClicked.value = false;
  } else {
    isBarangayClicked.value = true;
  }
  const seriesIndex = config.seriesIndex;
  const dataPointIndex = config.dataPointIndex;
  const data = config.w.config.series[seriesIndex].data[dataPointIndex];
  console.log(`Data Point: ${dataPointIndex}, Value: ${data}`);
};

const series = [
  {
    data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380],
  },
];
const chartOptions = {
  chart: {
    type: "bar",
    height: 350,
    events: {
      dataPointSelection: (event, chartContext, config) => {
        console.log("Selected Data:", config);
      },
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      borderRadiusApplication: "end",
      horizontal: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      "South Korea",
      "Canada",
      "United Kingdom",
      "Netherlands",
      "Italy",
      "France",
      "Japan",
      "United States",
      "China",
      "Germany",
    ],
  },
};

onMounted(() => {
  axios.get(`http://localhost:8081/dashboard-data`).then((response) => {
    widgetsData.value.totalTaxDeclarations = response.data.totalTaxDeclarations;
    widgetsData.value.totalAttachments = response.data.totalAttachments;
    widgetsData.value.totalUsers = response.data.totalUsers;
  });
});
</script>

<template>
  <layout>
    <div class="container-fluid p-0">
      <div class="row mb-2 mb-xl-3">
        <div class="col-auto d-none d-sm-block">
          <h3>
            <strong> Dashboard </strong>
          </h3>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col mt-0">
                  <h5 class="card-title text-primary text-uppercase letter-spacing-1">
                    Tax Declarations
                  </h5>
                </div>

                <div class="col-auto">
                  <div class="stat text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-archive"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5zm13-3H1v2h14zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 class="mt-1 mb-3">{{ widgetsData.totalTaxDeclarations }}</h1>
            </div>
          </div>
        </div>
        <div class="col-3">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col mt-0">
                  <h5 class="card-title text-primary text-uppercase letter-spacing-1">
                    Unassigned Files
                  </h5>
                </div>

                <div class="col-auto">
                  <div class="stat text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-file-earmark-break"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M14 4.5V9h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v7H2V2a2 2 0 0 1 2-2h5.5zM13 12h1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2h1v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1zM.5 10a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 class="mt-1 mb-3">{{ widgetsData.totalUnassignedFiles }}</h1>
            </div>
          </div>
        </div>

        <div class="col-3">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col mt-0">
                  <h5 class="card-title text-primary text-uppercase letter-spacing-1">
                    Users
                  </h5>
                </div>

                <div class="col-auto">
                  <div class="stat text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-people"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 class="mt-1 mb-3">{{ widgetsData.totalUsers }}</h1>
            </div>
          </div>
        </div>

        <div class="col-3">
          <div class="card">
            <div class="card-body">
              <div class="row">
                <div class="col mt-0">
                  <h5 class="card-title text-primary text-uppercase letter-spacing-1">
                    Attachments
                  </h5>
                </div>

                <div class="col-auto">
                  <div class="stat text-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-card-checklist"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"
                      />
                      <path
                        d="M7 5.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0M7 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m-1.496-.854a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 class="mt-1 mb-3">{{ widgetsData.totalAttachments }}</h1>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div
          :class="{
            'col-lg-8': isBarangayClicked,
            'col-lg-12': !isBarangayClicked,
          }"
        >
          <div class="card">
            <div class="card-header pb-0 mb-0">
              <h5 class="card-title text-primary">
                Assigned Files by Municipality & Barangay
              </h5>
              <h6 class="card-subtitle text-muted">
                (You can click each of the municipality to view the number of tax
                declarations per barangay)
              </h6>
            </div>
            <div class="card-body">
              <apex-chart
                type="bar"
                height="350"
                :options="chartOptions"
                :series="series"
                @dataPointSelection="onDataPointClick"
              ></apex-chart>
            </div>
          </div>
        </div>

        <div class="col-lg-4" v-auto-animate v-if="isBarangayClicked">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title text-primary">Lorem Ipsum</h5>
              <h6 class="card-subtitle text-muted"></h6>
            </div>
            <div class="card-body"></div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<style scoped>
.letter-spacing-1 {
  letter-spacing: 0.5px;
}
</style>
