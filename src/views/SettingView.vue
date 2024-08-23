<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import axios from "axios";
import alertify from "alertifyjs";
import moment from "moment";

const $toast = useToast();
const revisions = ref([]);
const getRevisions = () => {
  axios
    .get("http://localhost:8081/tax-revisions")
    .then((response) => {
      console.log(response.data);
      revisions.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

onMounted(() => {
  getRevisions();
});
</script>

<template>
  <layout>
    <template #title>
      <h4 class="text-uppercase fw-bold">Settings</h4>
      <div class="border my-2 border-primary"></div>
    </template>
    <div class="container-fluid p-0">
      <div class="row">
        <div class="col-md-3 col-xl-2">
          <div class="card">
            <div class="card-header">
              <h5 class="card-title mb-0">Account Settings</h5>
            </div>

            <div class="list-group list-group-flush" role="tablist">
              <a
                class="list-group-item list-group-item-action active"
                data-bs-toggle="list"
                href="#account"
                role="tab"
                aria-selected="true"
              >
                Account
              </a>
              <a
                class="list-group-item list-group-item-action"
                data-bs-toggle="list"
                href="#password"
                role="tab"
                aria-selected="false"
                tabindex="-1"
              >
                Password
              </a>
              <a
                class="list-group-item list-group-item-action"
                data-bs-toggle="list"
                href="#revisions"
                role="tab"
                aria-selected="false"
                tabindex="-1"
              >
                Revisions
              </a>
            </div>
          </div>
        </div>

        <div class="col-md-9 col-xl-10">
          <div class="tab-content">
            <div class="tab-pane fade active show" id="account" role="tabpanel">
              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">Information</h5>
                </div>
                <div class="card-body">
                  <form>
                    <div class="row">
                      <div class="col-md-12">
                        <div class="mb-3">
                          <label class="form-label" for="inputUsername">Username</label>
                          <input
                            type="text"
                            class="form-control"
                            id="inputUsername"
                            placeholder="Username"
                          />
                        </div>
                      </div>
                    </div>

                    <button type="submit" class="btn btn-primary">Save changes</button>
                  </form>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">Private info</h5>
                </div>
                <div class="card-body">
                  <form>
                    <div class="row">
                      <div class="mb-3 col-md-4">
                        <label class="form-label" for="inputFirstName">First name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputFirstName"
                          placeholder="First name"
                        />
                      </div>
                      <div class="mb-3 col-md-4">
                        <label class="form-label" for="inputLastName">Last name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputLastName"
                          placeholder="Last name"
                        />
                      </div>

                      <div class="mb-3 col-md-4">
                        <label class="form-label" for="inputMiddlename"
                          >Middle name</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="inputMiddlename"
                          placeholder="Middle name"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="mb-3 col-lg-6">
                        <label class="form-label" for="inputPosition">Position</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputPosition"
                          placeholder="Position"
                        />
                      </div>

                      <div class="mb-3 col-lg-6">
                        <label class="form-label" for="inputOffice">Office</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputOffice"
                          placeholder="Office"
                        />
                      </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Save changes</button>
                  </form>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="password" role="tabpanel">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Password</h5>

                  <form>
                    <div class="mb-3">
                      <label class="form-label" for="inputPasswordCurrent"
                        >Current password</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        id="inputPasswordCurrent"
                      />
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="inputPasswordNew"
                        >New password</label
                      >
                      <input type="password" class="form-control" id="inputPasswordNew" />
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="inputPasswordNew2"
                        >Verify password</label
                      >
                      <input
                        type="password"
                        class="form-control"
                        id="inputPasswordNew2"
                      />
                    </div>
                    <button type="submit" class="btn btn-primary">Save changes</button>
                  </form>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="revisions" role="tabpanel">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Current Selected Revision</h5>
                  <table class="table">
                    <thead>
                      <tr>
                        <th class="fw-bold border border-dark bg-dark text-white">
                          Revision Number
                        </th>
                        <th class="fw-bold border border-dark bg-dark text-white">
                          Years
                        </th>
                        <th class="fw-bold border border-dark bg-dark text-white">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="revision in revisions" :key="revision">
                        <td>
                          <label class="form-check">
                            <input
                              class="form-check-input"
                              type="radio"
                              value="option1"
                              name="radios-example"
                              checked=""
                            />
                            {{ revision.revisionNumber }}
                          </label>
                        </td>
                        <td>{{ revision.fromYear }} - {{ revision.toYear }}</td>
                        <td>{{ revision.description }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- button for save changes -->
                  <button type="submit" class="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
