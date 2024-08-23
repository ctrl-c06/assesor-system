<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

const user = ref({
  username: "",
  password: "",
});

const hasErrorLogin = ref(false);
const submitting = ref(false);

const submitLogin = () => {
  hasErrorLogin.value = false;
  submitting.value = true;
  axios
    .post("http://localhost:8081/login", user.value)
    .then((response) => {
      submitting.value = false;
      localStorage.setItem("isLogin", true);
      localStorage.setItem("username", user.value.username);
      localStorage.setItem("type", response.data.role);
      localStorage.setItem("id", response.data.id);
      router.replace({ path: "/" });
    })
    .catch((error) => {
      if (error.response.status === 401) {
        hasErrorLogin.value = true;
        submitting.value = false;
      }
    });
};

onMounted(() => {
  if (localStorage.getItem("isLogin")) {
    router.replace({ path: "/" });
  }
});
</script>
<template>
  <body>
    <div class="container">
      <div class="row vh-100 d-flex justify-content-center">
        <div class="col-12 align-self-center">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-5 mx-auto">
                <div class="text-center mb-3">
                  <img src="@/assets/img/logo.png" class="img-fluid w-25" alt="" />
                </div>
                <h3
                  class="fw-bold h2 text-center text-uppercase"
                  style="letter-spacing: 1.2px"
                >
                  Digital Filing System
                </h3>
                <div v-auto-animate>
                  <div class="card bg-danger mb-2" v-if="hasErrorLogin">
                    <div class="card-body text-white text-center">
                      Please check your <strong>username</strong> or
                      <strong>password</strong>
                    </div>
                  </div>
                </div>
                <div class="card shadow border">
                  <div class="card-body p-0 auth-header-box"></div>
                  <div class="card-body pt-0 pb-0">
                    <form class="my-4" @submit.prevent="submitLogin">
                      <div class="form-group mb-2">
                        <label class="form-label fw-bold" for="username">Username</label>

                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                class="bi bi-person"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"
                                />
                              </svg>
                            </span>
                          </div>
                          <input
                            type="text"
                            class="form-control"
                            id="username"
                            name="username"
                            v-model="user.username"
                            placeholder="e.g. administrator"
                          />
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="form-label fw-bold" for="userpassword"
                          >Password</label
                        >
                        <div class="input-group mb-3">
                          <div class="input-group-prepend">
                            <span class="input-group-text">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                class="bi bi-lock"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1"
                                />
                              </svg>
                            </span>
                          </div>
                          <input
                            type="password"
                            class="form-control"
                            id="password"
                            name="password"
                            v-model="user.password"
                            placeholder="e.g. ***************"
                          />
                        </div>
                      </div>
                      <!--end form-group-->

                      <div class="form-group mb-0">
                        <div class="col-12">
                          <div class="d-grid mt-3">
                            <button
                              type="submit"
                              class="btn btn-primary"
                              :disabled="submitting"
                            >
                              <!-- bootstrap spinner -->
                              <span
                                class="spinner-border spinner-border-sm me-1"
                                role="status"
                                v-if="submitting"
                                aria-hidden="true"
                              ></span>
                              <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="bi bi-send"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"
                                />
                              </svg>
                              Sign In
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</template>

<style scoped>
* {
  font-family: Inter, sans-serif;
}

body {
  overflow: hidden;
  background: #f5f5f5;
}
</style>
