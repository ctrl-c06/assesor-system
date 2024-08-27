<script setup>
import Layout from "@/components/BaseLayout.vue";
import { onMounted, ref } from "vue";
import { useToast } from "vue-toast-notification";
import axios from "axios";
import alertify from "alertifyjs";
import moment from "moment";

const $toast = useToast();
const users = ref([]);
const user = ref({
  employee_id: "",
  username: "",
  password: "",
  access_level: 2,
});

const selectedUser = ref({
  id: "",
  employee_id: "",
  username: "",
  password: "",
  access_level: 2,
});

const clearForm = () => {
  user.value = {
    employee_id: "",
    username: "",
    password: "",
    access_level: 2,
  };
};

const createUser = () => {
  axios.post(`http://localhost:8081/users`, user.value).then((response) => {
    $toast.success("User created successfully");
    clearForm();
    getUsers();
  });
};

const getUsers = () => {
  axios
    .get(`http://localhost:8081/users`)
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      $toast.error("Failed to fetch users");
    });
};

const editUser = (user) => {
  selectedUser.value = user;
};

const updateUser = () => {
  axios
    .put(`http://localhost:8081/users/${selectedUser.value.id}`, selectedUser.value)
    .then((response) => {
      $toast.success("User updated successfully");
      getUsers();
    })
    .catch((error) => {
      $toast.error("Failed to update user");
    });
};

const deleteUser = (user) => {
  alertify.confirm(
    "Delete User",
    "Are you sure you want to delete this user?",
    () => {
      axios
        .delete(`http://localhost:8081/users/${user.id}`)
        .then((response) => {
          $toast.success("User deleted successfully");
          getUsers();
        })
        .catch((error) => {
          $toast.error("Failed to delete user");
        });
    },
    () => {
      $toast.info("User deletion cancelled");
    }
  );
};

onMounted(() => getUsers());
</script>

<template>
  <!-- modal add new user -->
  <div
    class="modal fade"
    id="addUserModal"
    tabindex="-1"
    aria-labelledby="addUserModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title h4 text-uppercase fw-bold" id="addUserModalLabel">
            Add New User
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="employee_id" class="form-label text-uppercase fw-bold h5"
                >Employee ID</label
              >
              <input
                type="text"
                class="form-control"
                id="employee_id"
                v-model="user.employee_id"
                placeholder="e.g. 4994"
              />
            </div>
            <div class="mb-3">
              <label for="username" class="form-label text-uppercase fw-bold h5"
                >Username</label
              >
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="user.username"
                placeholder="e.g. user1"
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label text-uppercase fw-bold h5"
                >Password</label
              >
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="user.password"
                placeholder="********"
              />
            </div>
            <div class="mb-3">
              <label for="access_level" class="form-label text-uppercase fw-bold h5"
                >Access Level</label
              >
              <select class="form-select" id="access_level" v-model="user.access_level">
                <option value="2">User</option>
                <option value="1">Administrator</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="createUser()">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- edit user modal -->
  <div
    class="modal fade"
    id="editUserModal"
    tabindex="-1"
    aria-labelledby="editUserModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title h4 text-uppercase fw-bold" id="editUserModalLabel">
            Edit User
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="employee_id" class="form-label text-uppercase fw-bold h5"
                >Employee ID</label
              >
              <input
                type="text"
                class="form-control"
                id="employee_id"
                v-model="selectedUser.employee_id"
                placeholder="e.g. 4994"
              />
            </div>
            <div class="mb-3">
              <label for="username" class="form-label text-uppercase fw-bold h5"
                >Username</label
              >
              <input
                type="text"
                class="form-control"
                id="username"
                v-model="selectedUser.username"
                placeholder="e.g. user1"
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label text-uppercase fw-bold h5"
                >Password
                <small class="text-info">(Enter a password if you want to change)</small>
              </label>
              <input
                type="password"
                class="form-control"
                id="password"
                v-model="user.password"
                placeholder="********"
              />
            </div>
            <div class="mb-3">
              <label for="access_level" class="form-label text-uppercase fw-bold h5"
                >Access Level</label
              >
              <select
                class="form-select"
                id="access_level"
                v-model="selectedUser.access_level"
              >
                <option value="2">User</option>
                <option value="1">Administrator</option>
              </select>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-success" @click="updateUser()">
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>

  <button
    class="btn btn-primary mb-2 float-end btn-lg btn-primary d-flex align-items-center justify-content-center"
    data-bs-toggle="modal"
    data-bs-target="#addUserModal"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-plus-circle me-1"
      viewBox="0 0 16 16"
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
      <path
        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
      />
    </svg>
    Add New User
  </button>
  <table class="table table-bordered">
    <thead>
      <tr>
        <th
          class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
        >
          Employee ID
        </th>
        <th
          class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
        >
          Username
        </th>
        <th
          class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
        >
          Number of Assigned Files
        </th>
        <th
          class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
        >
          Access Level
        </th>
        <th
          class="text-uppercase bg-dark text-white border text-center border border-dark fw-medium"
        >
          Actions
        </th>
      </tr>
    </thead>
    <tbody class="bg-white">
      <tr v-for="user in users" :key="user">
        <td class="text-center">{{ user.employee_id }}</td>
        <td class="w-25">{{ user.username }}</td>
        <td class="fw-bold text-center">{{ user.totalTaxDeclarations }}</td>
        <td class="text-center">
          <span v-if="user.access_level == 1"> Administrator </span>
          <span v-else> User </span>
        </td>
        <td class="text-center">
          <button
            class="btn btn-success btn-lg me-2"
            @click="editUser(user)"
            data-bs-toggle="modal"
            data-bs-target="#editUserModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pencil"
              viewBox="0 0 16 16"
            >
              <path
                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"
              />
            </svg>
            Edit
          </button>

          <!-- delete button -->
          <button class="btn btn-danger btn-lg" @click="deleteUser(user)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash3"
              viewBox="0 0 16 16"
            >
              <path
                d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"
              />
            </svg>
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
