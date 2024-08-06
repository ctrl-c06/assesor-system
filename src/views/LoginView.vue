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
  <body
    id="body"
    class="auth-page"
    style="
      background-image: url('/assets-2/images/p-1.png');
      background-size: cover;
      background-position: center center;
    "
  >
    <!-- Log In page -->
    <div class="container">
      <div class="row vh-100 d-flex justify-content-center">
        <div class="col-12 align-self-center">
          <div class="card-body">
            <div class="row">
              <div class="col-lg-5 mx-auto">
                <div class="card bg-danger" v-if="hasErrorLogin">
                  <div class="card-body text-white text-center">
                    Please check your <strong>username</strong> or
                    <strong>password</strong>
                  </div>
                </div>
                <div class="card shadow-none border">
                  <div class="card-body p-0 auth-header-box"></div>
                  <div class="card-body pt-0">
                    <form class="my-4">
                      <div class="form-group mb-2">
                        <label class="form-label fw-bold" for="username">Username</label>
                        <input
                          type="text"
                          class="form-control"
                          id="username"
                          name="username"
                          v-model="user.username"
                          placeholder="e.g. administrator"
                        />
                      </div>
                      <!--end form-group-->

                      <div class="form-group">
                        <label class="form-label fw-bold" for="userpassword"
                          >Password</label
                        >
                        <input
                          type="password"
                          class="form-control"
                          name="password"
                          id="userpassword"
                          v-model="user.password"
                          placeholder="e.g. ***************"
                        />
                      </div>
                      <!--end form-group-->

                      <div class="form-group mb-0 row">
                        <div class="col-12">
                          <div class="d-grid mt-3">
                            <button
                              class="btn btn-primary"
                              type="button"
                              :disabled="submitting"
                              @click="submitLogin"
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
                        <!--end col-->
                      </div>
                      <!--end form-group-->
                    </form>
                    <!--end form-->
                  </div>
                  <!--end card-body-->
                </div>
                <!--end card-->
              </div>
              <!--end col-->
            </div>
            <!--end row-->
          </div>
          <!--end card-body-->
        </div>
        <!--end col-->
      </div>
      <!--end row-->
    </div>
    <!--end container-->
    <!-- vendor js -->
  </body>
</template>

<style scoped>
* {
  font-family: Inter, sans-serif;
}
</style>
