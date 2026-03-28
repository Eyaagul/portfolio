document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!reduceMotion) {
        document.body.classList.add("has-motion");
    }

    const nav = document.querySelector(".site-nav");
    const toggle = document.querySelector(".menu-toggle");
    const navLinks = [...document.querySelectorAll(".site-nav a")];
    const sections = [...document.querySelectorAll("main section[id]")];

    const progressBar = document.getElementById("scroll-progress");
    const focusRotator = document.getElementById("focus-rotator");

    const certModal = document.getElementById("cert-modal");
    const certModalImage = document.getElementById("cert-modal-image");
    const certModalTitle = document.getElementById("cert-modal-title");
    const certOriginalLink = document.getElementById("cert-original-link");
    const certCloseBtn = document.getElementById("cert-close-btn");
    const certCards = [...document.querySelectorAll(".cert-trigger")];

    const printBtn = document.getElementById("print-ats");

    if (toggle && nav) {
        toggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    const showRevealElements = () => {
        document.querySelectorAll(".reveal").forEach((el) => {
            el.classList.add("is-visible");
        });
    };

    if (!reduceMotion && "IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );

        document.querySelectorAll(".reveal").forEach((el, index) => {
            el.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
            revealObserver.observe(el);
        });
    } else {
        showRevealElements();
    }

    const updateProgress = () => {
        if (!progressBar) {
            return;
        }

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
        progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    };

    const setActiveLink = () => {
        const offset = window.scrollY + window.innerHeight * 0.33;
        let currentId = sections[0]?.id;

        sections.forEach((section) => {
            if (offset >= section.offsetTop) {
                currentId = section.id;
            }
        });

        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${currentId}`;
            link.classList.toggle("active", isActive);
        });
    };

    updateProgress();
    setActiveLink();

    window.addEventListener("scroll", () => {
        updateProgress();
        setActiveLink();
    }, { passive: true });

    window.addEventListener("resize", updateProgress);

    if (focusRotator && !reduceMotion) {
        const focusWords = [
            "SQL Queries",
            "PostgreSQL Analysis",
            "Data Cleaning",
            "Data Validation",
            "Power BI Dashboards",
            "KPI Reporting"
        ];
        let focusIndex = 0;

        setInterval(() => {
            focusRotator.classList.add("is-swapping");
            setTimeout(() => {
                focusIndex = (focusIndex + 1) % focusWords.length;
                focusRotator.textContent = focusWords[focusIndex];
                focusRotator.classList.remove("is-swapping");
            }, 180);
        }, 2200);
    }

    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }

    const closeCertModal = () => {
        if (!certModal) {
            return;
        }

        certModal.classList.remove("is-open");
        certModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");

        if (certModalImage) {
            certModalImage.src = "";
            certModalImage.alt = "";
        }
    };

    const openCertModal = (src, title) => {
        if (!certModal || !certModalImage || !certModalTitle || !certOriginalLink) {
            return;
        }

        certModalImage.src = src;
        certModalImage.alt = title;
        certModalTitle.textContent = title;
        certOriginalLink.href = src;
        certModal.classList.add("is-open");
        certModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    };

    certCards.forEach((card) => {
        card.addEventListener("click", () => {
            const src = card.getAttribute("data-cert-src");
            const title = card.getAttribute("data-cert-title") || "Certificate";
            if (src) {
                openCertModal(src, title);
            }
        });
    });

    certCloseBtn?.addEventListener("click", closeCertModal);

    certModal?.addEventListener("click", (event) => {
        if (event.target === certModal) {
            closeCertModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && certModal?.classList.contains("is-open")) {
            closeCertModal();
        }
    });
});
