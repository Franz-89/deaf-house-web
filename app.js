document.addEventListener('DOMContentLoaded', () => {
    initWizard();
    initCopyButtons();
});

function initWizard() {
    const wizards = document.querySelectorAll(".wizard-container");

    wizards.forEach((wizard, wizardIndex) => {
        const steps = wizard.querySelectorAll(".wizard-step");
        if (!steps.length) return;

        let currentStep = 0;

        const prevBtn = wizard.querySelector("#prevBtn");
        const nextBtn = wizard.querySelector("#nextBtn");
        const stepIndicator = wizard.querySelector("#stepIndicator");

        if (!prevBtn || !nextBtn) return;

        if (wizardIndex > 0) {
            prevBtn.id = `prevBtn-${wizardIndex}`;
            nextBtn.id = `nextBtn-${wizardIndex}`;
            if (stepIndicator) stepIndicator.id = `stepIndicator-${wizardIndex}`;
        }

        const viewport = wizard.querySelector(".wizard-viewport");
        if (!viewport) return;

        function setFixedViewportHeight() {
            let maxH = 0;

            steps.forEach(step => {
                const prevVis = step.style.visibility;
                const prevOp = step.style.opacity;

                step.style.visibility = "hidden";
                step.style.opacity = "1";
                const h = step.scrollHeight;
                maxH = Math.max(maxH, h);

                step.style.visibility = prevVis;
                step.style.opacity = prevOp;
            });

            viewport.style.height = `${maxH}px`;
        }

        function updateStep() {
            steps.forEach((step, index) => {
                step.classList.toggle("active", index === currentStep);
            });

            prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";

            if (currentStep === steps.length - 1) {
                nextBtn.textContent = "Finalizar";
                nextBtn.style.display = "none";
            } else {
                nextBtn.textContent = "Siguiente →";
                nextBtn.style.display = "inline-block";
            }

            if (stepIndicator) {
                stepIndicator.textContent = `Paso ${currentStep + 1} de ${steps.length}`;
            }
        }

        prevBtn.onclick = null;
        nextBtn.onclick = null;

        nextBtn.addEventListener("click", () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStep();
            }
        });

        prevBtn.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                updateStep();
            }
        });

        setFixedViewportHeight();
        window.addEventListener("load", setFixedViewportHeight);
        window.addEventListener("resize", setFixedViewportHeight);

        updateStep();
    });
}
  
  

// Copy to Clipboard Logic
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.btn-copy');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            // The value to copy is stored in a data attribute
            const valueToCopy = btn.getAttribute('data-copy');
            if (!valueToCopy) return;

            try {
                await navigator.clipboard.writeText(valueToCopy);

                // Visual Feedback
                const originalText = btn.textContent;
                btn.textContent = '¡Copiado!';
                btn.style.backgroundColor = '#27ae60';

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = ''; // Revert to CSS default
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
                btn.textContent = 'Error';
            }
        });
    });
}

// Download Color Grid as Image
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        const elementToCapture = document.querySelector('.color-grid');
        if (!elementToCapture) return;

        // Visual feedback
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = 'Generando imagen...';

        html2canvas(elementToCapture, {
            backgroundColor: "#ffffff", // Ensure white background
            scale: 2 // High resolution
        }).then(canvas => {
            // Create download link
            const link = document.createElement('a');
            link.download = 'guia-colores-casa.png';
            link.href = canvas.toDataURL('image/png');
            link.click();

            // Reset button
            downloadBtn.textContent = originalText;
        }).catch(err => {
            console.error(err);
            downloadBtn.textContent = 'Error al descargar';
        });
    });
}
