document.addEventListener("DOMContentLoaded", () => {
  const portfolioGrid = document.getElementById("portfolio-grid");
  const filterButtonsContainer = document.querySelector(".filter-buttons");
  const projectPanel = document.getElementById("project-panel");
  const panelCloseBtn = document.getElementById("panel-close-btn");
  const panelDynamicContent = document.getElementById("panel-dynamic-content");

  let allProjects = [];

  /**
   * Menampilkan proyek di dalam grid.
   */
  const displayProjects = (projectsToDisplay) => {
    portfolioGrid.innerHTML = "";
    projectsToDisplay.forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.classList.add("project-item");
      projectElement.dataset.id = project.id;
      const typeLabel = project.type === "3d" ? "Desain 3D" : "Gambar 2D";

      projectElement.innerHTML = `
                        <img src="${project.thumbnail}" alt="${project.title}" class="project-item-thumbnail">
                        <div class="project-item-title">
                            <h3>${project.title}</h3>
                            <span>${typeLabel}</span>
                        </div>
                    `;
      portfolioGrid.appendChild(projectElement);
    });
  };

  /**
   * Membuka panel detail, menampilkan viewer 3D atau gambar 2D.
   */
  const openPanel = (project) => {
    let viewerHtml = "";
    if (project.type === "3d") {
      viewerHtml = `
                        <model-viewer src="${project.file}" alt="${project.title}" ar ar-modes="webxr scene-viewer quick-look" camera-controls tone-mapping="neutral" poster="${project.thumbnail}" shadow-intensity="1" auto-rotate></model-viewer>
                    `;
    } else {
      // type is '2d'
      viewerHtml = `<img src="${project.file}" alt="${project.title}">`;
    }

    panelDynamicContent.innerHTML = `
                    <div class="panel-viewer">${viewerHtml}</div>
                    <div class="panel-content">
                        <h2>${project.title}</h2>
                        <h3>Studi Kasus</h3>
                        <p>${project.description}</p>
                        <h3>Detail Teknis</h3>
                        <ul class="tech-details">
                            <li><strong>Software:</strong> ${project.details.software}</li>
                            <li><strong>Tanggal:</strong> ${project.details.tanggal}</li>
                            <li><strong>Kategori:</strong> ${project.details.kategori}</li>
                        </ul>
                    </div>
                `;

    projectPanel.classList.add("is-open");
    document.body.classList.add("panel-open");
  };

  /**
   * Menutup panel detail.
   */
  const closePanel = () => {
    projectPanel.classList.remove("is-open");
    document.body.classList.remove("panel-open");
  };

  /**
   * Mengatur semua event listener.
   */
  const setupEventListeners = (projects) => {
    filterButtonsContainer.addEventListener("click", (e) => {
      const target = e.target;
      if (target.tagName === "BUTTON") {
        filterButtonsContainer
          .querySelector(".active")
          .classList.remove("active");
        target.classList.add("active");

        const filter = target.dataset.filter;
        const filteredProjects = projects.filter((project) => {
          if (filter === "all") return true;
          return project.type === filter;
        });
        displayProjects(filteredProjects);
      }
    });

    portfolioGrid.addEventListener("click", (e) => {
      const clickedItem = e.target.closest(".project-item");
      if (clickedItem) {
        const projectId = parseInt(clickedItem.dataset.id);
        const selectedProject = projects.find((p) => p.id === projectId);
        if (selectedProject) {
          openPanel(selectedProject);
        }
      }
    });

    panelCloseBtn.addEventListener("click", closePanel);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && projectPanel.classList.contains("is-open")) {
        closePanel();
      }
    });
  };

  /**
   * Inisialisasi: Mengambil data dari JSON dan memulai aplikasi.
   */
  fetch("db/json/database.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      allProjects = data;
      displayProjects(allProjects);
      setupEventListeners(allProjects);
    })
    .catch((error) => {
      console.error("Error fetching project data:", error);
      portfolioGrid.innerHTML =
        "<p>Gagal memuat data proyek. Silakan coba lagi nanti.</p>";
    });
});
