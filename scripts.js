document.addEventListener("DOMContentLoaded", () => {
  const portfolioGrid = document.getElementById("portfolio-grid");
  const filterButtonsContainer = document.querySelector(".filter-buttons");
  const projectPanel = document.getElementById("project-panel");
  const panelCloseBtn = document.getElementById("panel-close-btn");
  const panelDynamicContent = document.getElementById("panel-dynamic-content");

  let allProjects = [];

  const getProjectTypeLabel = (type) => {
    switch (type) {
      case "3d":
        return "Desain 3D";
      case "2d":
        return "Gambar 2D";
      default:
        return type;
    }
  };

  const displayProjects = (projectsToDisplay) => {
    portfolioGrid.innerHTML = "";
    projectsToDisplay.forEach((project) => {
      const projectElement = document.createElement("div");
      projectElement.className = "project-item";
      projectElement.dataset.id = project.id;
      projectElement.innerHTML = `
                        <img src="${project.thumbnail}" alt="${
        project.title
      }" class="project-item-thumbnail">
                        <div class="project-item-title">
                            <h3>${project.title}</h3>
                            <span>${getProjectTypeLabel(project.type)}</span>
                        </div>
                    `;
      portfolioGrid.appendChild(projectElement);
    });
  };

  const openPanel = (project) => {
    let viewerHtml = "";
    // Hanya buat viewer berdasarkan tipe utama (3D atau 2D)
    if (project.type === "3d") {
      viewerHtml = `<model-viewer src="${project.file}" poster="${project.thumbnail}" alt="${project.title}" camera-controls auto-rotate ar shadow-intensity="1"></model-viewer>`;
    } else if (project.type === "2d") {
      viewerHtml = `<img src="${project.file}" alt="${project.title}">`;
    }

    // Siapkan HTML untuk kerangka 2D, tapi hanya jika ada datanya
    let blueprintHtml = "";
    if (project.blueprintImage) {
      blueprintHtml = `
                        <div class="blueprint-section">
                            <h3>Kerangka 2D</h3>
                            <img src="${project.blueprintImage}" alt="Kerangka ${project.title}">
                        </div>
                    `;
    }

    // Gabungkan semua bagian HTML untuk panel
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
                        ${blueprintHtml}
                    </div>
                `;

    projectPanel.classList.add("is-open");
    document.body.classList.add("panel-open");
  };

  const closePanel = () => {
    projectPanel.classList.remove("is-open");
    document.body.classList.remove("panel-open");
  };

  const setupEventListeners = (projects) => {
    filterButtonsContainer.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        filterButtonsContainer
          .querySelector(".active")
          .classList.remove("active");
        e.target.classList.add("active");
        const filter = e.target.dataset.filter;
        const filteredProjects = projects.filter(
          (p) => filter === "all" || p.type === filter
        );
        displayProjects(filteredProjects);
      }
    });

    portfolioGrid.addEventListener("click", (e) => {
      const item = e.target.closest(".project-item");
      if (item) {
        const projectId = parseInt(item.dataset.id);
        const project = projects.find((p) => p.id === projectId);
        if (project) openPanel(project);
      }
    });

    panelCloseBtn.addEventListener("click", closePanel);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && projectPanel.classList.contains("is-open"))
        closePanel();
    });
  };

  fetch("db/json/database.json")
    .then((response) =>
      response.ok ? response.json() : Promise.reject("Failed to load")
    )
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
