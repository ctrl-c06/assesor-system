<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useToast } from "vue-toast-notification";

const $toast = useToast();
const user = ref({});
const usernameErrors = ref({});
const passwordErrors = ref({});

const password = ref({
  old: "",
  new: "",
  confirm: "",
});

const changeUsername = () => {
  axios
    .post(`http://localhost:8081/user/change-username/${localStorage.getItem("id")}`, {
      username: user.value.username,
    })
    .then((response) => {
      $toast.success("Username has been changed successfully");
    })
    .catch((err) => {
      if (err.response.status === 422) {
        usernameErrors.value = err.response.data;
      }
    });
};
const changePassword = () => {
  axios
    .post(`http://localhost:8081/user/change-password/${localStorage.getItem("id")}`, {
      oldPassword: password.value.old,
      newPassword: password.value.new,
      confirmPassword: password.value.confirm,
    })
    .then((response) => {
      passwordErrors.value = {};
      $toast.success("Password has been changed successfully");
    })
    .catch((err) => {
      passwordErrors.value = err.response.data;
    });
};

onMounted(() => {
  axios
    .get(`http://localhost:8081/user/${localStorage.getItem("id")}`)
    .then((response) => {
      user.value = response.data;
    });
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
                  <div class="row">
                    <div class="col-md-12">
                      <div class="mb-3">
                        <label class="form-label" for="inputUsername">Username</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputUsername"
                          placeholder="Username"
                          v-model="user.username"
                          :class="{ 'is-invalid': usernameErrors.username }"
                        />
                        <div
                          class="invalid-feedback"
                          v-if="usernameErrors?.hasOwnProperty('username')"
                        >
                          {{ usernameErrors.username }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button type="button" class="btn btn-primary" @click="changeUsername">
                    Save changes
                  </button>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <h5 class="card-title mb-0">Personal info</h5>
                </div>
                <div class="card-body">
                  <form>
                    <div class="row">
                      <div class="mb-3 col-md-3">
                        <label class="form-label" for="inputFirstName">First name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputFirstName"
                          placeholder="First name"
                          readonly
                          v-model="user.first_name"
                        />
                      </div>
                      <div class="mb-3 col-md-3">
                        <label class="form-label" for="inputLastName">Last name</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputLastName"
                          placeholder="Last name"
                          readonly
                          v-model="user.last_name"
                        />
                      </div>

                      <div class="mb-3 col-md-3">
                        <label class="form-label" for="inputMiddlename"
                          >Middle name</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="inputMiddlename"
                          placeholder="Middle name"
                          readonly
                          v-model="user.middle_name"
                        />
                      </div>
                      <div class="mb-3 col-md-3">
                        <label class="form-label" for="inputSuffix">Suffix</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputSuffix"
                          placeholder="N/A"
                          readonly
                          v-model="user.suffix"
                        />
                      </div>
                    </div>
                    <div class="row">
                      <div class="mb-3 col-lg-3">
                        <label class="form-label" for="inputPosition">Position</label>
                        <input
                          type="text"
                          class="form-control"
                          id="inputPosition"
                          readonly
                          placeholder="Position"
                          v-model="user.position_description"
                        />
                      </div>
                      <div class="mb-3 col-lg-3">
                        <label class="form-label" for="inputWorkStatus"
                          >Work Status</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          readonly
                          id="inputWorkStatus"
                          placeholder="Work Status"
                          v-model="user.work_status"
                        />
                      </div>
                      <div class="mb-3 col-lg-3">
                        <label class="form-label" for="inputOffice"
                          >Office Charging</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          readonly
                          id="inputOffice"
                          placeholder="Office"
                          v-model="user.office_charging"
                        />
                      </div>
                      <div class="mb-3 col-lg-3">
                        <label class="form-label" for="inputOfficeAssignment"
                          >Office Assignment</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="inputOfficeAssignment"
                          readonly
                          placeholder="Office"
                          v-model="user.office_assignment"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="password" role="tabpanel">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">Password</h5>

                  <div class="mb-3">
                    <label class="form-label" for="inputPasswordCurrent"
                      >Current password</label
                    >
                    <input
                      type="password"
                      class="form-control"
                      id="inputPasswordCurrent"
                      v-model="password.old"
                      :class="{ 'is-invalid': passwordErrors.oldPassword }"
                    />
                    <div
                      class="invalid-feedback"
                      v-if="passwordErrors?.hasOwnProperty('oldPassword')"
                    >
                      {{ passwordErrors.oldPassword }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label" for="inputPasswordNew">New password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="inputPasswordNew"
                      v-model="password.new"
                      :class="{ 'is-invalid': passwordErrors.newPassword }"
                    />
                    <div
                      class="invalid-feedback"
                      v-if="passwordErrors?.hasOwnProperty('newPassword')"
                    >
                      {{ passwordErrors.newPassword }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label" for="inputPasswordNew2"
                      >Confirm password</label
                    >
                    <input
                      type="password"
                      class="form-control"
                      id="inputPasswordNew2"
                      v-model="password.confirm"
                      :class="{ 'is-invalid': passwordErrors.confirmPassword }"
                    />
                    <div
                      class="invalid-feedback"
                      v-if="passwordErrors?.hasOwnProperty('confirmPassword')"
                    >
                      {{ passwordErrors.confirmPassword }}
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary" @click="changePassword">
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
