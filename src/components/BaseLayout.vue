<script setup>
import { useRoute, useRouter } from "vue-router";

const username = localStorage.getItem("username");

const router = useRouter();

const logout = () => {
  // remove the username and isLogin from localStorage
  localStorage.removeItem("username");
  localStorage.removeItem("isLogin");

  // redirect to login page
  router.replace({ path: "/login" });
};
</script>
<template>
  <div class="wrapper">
    <nav id="sidebar" class="sidebar js-sidebar">
      <div class="sidebar-content js-simplebar">
        <a class="sidebar-brand" href="">
          <span class="sidebar-brand-text align-middle"> NAME OF SYSTEM </span>
          <svg
            class="sidebar-brand-icon align-middle"
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            stroke-width="1.5"
            stroke-linecap="square"
            stroke-linejoin="miter"
            color="#FFFFFF"
            style="margin-left: -3px"
          >
            <path d="M12 4L20 8.00004L12 12L4 8.00004L12 4Z"></path>
            <path d="M20 12L12 16L4 12"></path>
            <path d="M20 16L12 20L4 16"></path>
          </svg>
        </a>

        <div class="sidebar-user">
          <div class="d-flex justify-content-center">
            <div class="flex-shrink-0">
              <img
                src="@/assets/img/logo.png"
                class="avatar img-fluid rounded me-1"
                alt="Profile Picture"
              />
            </div>
            <div class="flex-grow-1 ps-2">
              <a class="sidebar-user-title dropdown-toggle" data-bs-toggle="dropdown">
                <span class="text-uppercase">{{ username }} </span>
              </a>
              <div class="dropdown-menu dropdown-menu-start">
                <a class="dropdown-item" href="pages-profile.html"
                  ><i class="align-middle me-1" data-feather="user"></i> Profile</a
                >

                <div class="dropdown-divider"></div>
                <button class="dropdown-item" @click="logout">Log out</button>
              </div>

              <div class="sidebar-user-subtitle">
                <span> Administrator </span>
              </div>
            </div>
          </div>
        </div>

        <ul class="sidebar-nav">
          <li class="sidebar-header">Pages</li>
          <li class="sidebar-item">
            <RouterLink class="sidebar-link" to="/dashboard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-house"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"
                />
              </svg>
              <span class="align-middle">Dashboard</span>
            </RouterLink>
          </li>
          <li class="sidebar-item">
            <a
              data-bs-target="#maintenance"
              data-bs-toggle="collapse"
              class="sidebar-link"
            >
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
              <span class="align-middle">Maintenance</span>
            </a>
            <ul
              id="maintenance"
              class="sidebar-dropdown list-unstyled collapse show"
              data-bs-parent="#sidebar"
            >
              <li class="sidebar-item">
                <Router-Link class="sidebar-link" to="/revisions">Revisions</Router-Link>
              </li>
              <li class="sidebar-item">
                <Router-Link class="sidebar-link" to="/revisions">Users</Router-Link>
              </li>
            </ul>
          </li>
          <li class="sidebar-item">
            <a data-bs-target="#pages" data-bs-toggle="collapse" class="sidebar-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-database-up"
                viewBox="0 0 16 16"
              >
                <path
                  d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0"
                />
                <path
                  d="M12.096 6.223A5 5 0 0 0 13 5.698V7c0 .289-.213.654-.753 1.007a4.5 4.5 0 0 1 1.753.25V4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.5 4.5 0 0 1-.813-.927Q8.378 15 8 15c-1.464 0-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13h.027a4.6 4.6 0 0 1 0-1H8c-1.464 0-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10q.393 0 .774-.024a4.5 4.5 0 0 1 1.102-1.132C9.298 8.944 8.666 9 8 9c-1.464 0-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777M3 4c0-.374.356-.875 1.318-1.313C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4"
                />
              </svg>
              <span class="align-middle">Records</span>
            </a>
            <ul
              id="pages"
              class="sidebar-dropdown list-unstyled collapse show"
              data-bs-parent="#sidebar"
            >
              <li class="sidebar-item">
                <Router-Link class="sidebar-link" to="/">File Scans</Router-Link>
              </li>
              <li class="sidebar-item">
                <Router-Link class="sidebar-link" to="/history"
                  >Record History</Router-Link
                >
              </li>
            </ul>
          </li>

          <li class="sidebar-header">Reports</li>
          <li class="sidebar-item">
            <a class="sidebar-link">Generate</a>
          </li>

          <!-- <li class="sidebar-header">Application</li> -->
          <!-- <li class="sidebar-item">
            <RouterLink class="sidebar-link" to="/dashboard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-gear-wide"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8.932.727c-.243-.97-1.62-.97-1.864 0l-.071.286a.96.96 0 0 1-1.622.434l-.205-.211c-.695-.719-1.888-.03-1.613.931l.08.284a.96.96 0 0 1-1.186 1.187l-.284-.081c-.96-.275-1.65.918-.931 1.613l.211.205a.96.96 0 0 1-.434 1.622l-.286.071c-.97.243-.97 1.62 0 1.864l.286.071a.96.96 0 0 1 .434 1.622l-.211.205c-.719.695-.03 1.888.931 1.613l.284-.08a.96.96 0 0 1 1.187 1.187l-.081.283c-.275.96.918 1.65 1.613.931l.205-.211a.96.96 0 0 1 1.622.434l.071.286c.243.97 1.62.97 1.864 0l.071-.286a.96.96 0 0 1 1.622-.434l.205.211c.695.719 1.888.03 1.613-.931l-.08-.284a.96.96 0 0 1 1.187-1.187l.283.081c.96.275 1.65-.918.931-1.613l-.211-.205a.96.96 0 0 1 .434-1.622l.286-.071c.97-.243.97-1.62 0-1.864l-.286-.071a.96.96 0 0 1-.434-1.622l.211-.205c.719-.695.03-1.888-.931-1.613l-.284.08a.96.96 0 0 1-1.187-1.186l.081-.284c.275-.96-.918-1.65-1.613-.931l-.205.211a.96.96 0 0 1-1.622-.434zM8 12.997a4.998 4.998 0 1 1 0-9.995 4.998 4.998 0 0 1 0 9.996z"
                />
              </svg>
              <span class="align-middle">Settings</span>
            </RouterLink>
          </li> -->
        </ul>
      </div>
    </nav>

    <div class="main">
      <main class="content p-3">
        <div class="container-fluid p-0">
          <h1 class="fs-4 fw-bold mb-3">
            <slot name="title"></slot>
          </h1>
          <slot> </slot>
        </div>
      </main>

      <footer class="footer">
        <div class="container-fluid">
          <div class="row text-muted">
            <div class="col-6 text-start">
              <p class="mb-0 text-muted fw-bold">
                <span><strong>POWERBED BY : PADMO - ITU</strong></span>
                &copy; {{ new Date().getFullYear() }}
              </p>
            </div>
            <div class="col-6 text-end">
              <ul class="list-inline">
                <li class="list-inline-item">
                  <a class="text-muted" href="#">Support</a>
                </li>
                <li class="list-inline-item">
                  <a class="text-muted" href="#">Help Center</a>
                </li>
                <li class="list-inline-item">
                  <a class="text-muted" href="#">Privacy</a>
                </li>
                <li class="list-inline-item">
                  <a class="text-muted" href="#">Terms</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
