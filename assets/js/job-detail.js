// ========== JOB DETAIL PAGE ==========

// Show beautiful modal popup
function showSuccessModal(jobTitle, companyName) {
    const modal = document.getElementById('successModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    if (modal) {
        modalTitle.textContent = `You've Applied to ${companyName}!`;
        modalMessage.textContent = `Your application for ${jobTitle} at ${companyName} has been submitted successfully. The employer will review your qualifications and contact you soon!`;
        modal.classList.add('show');
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// Handle Easy Apply button click
function handleEasyApply(jobTitle, companyName) {
    // Add visual feedback to button
    const applyButtons = document.querySelectorAll('.btn-primary, [onclick*="handleEasyApply"]');
    const button = Array.from(applyButtons).find(btn => btn.getAttribute('onclick')?.includes('handleEasyApply'));
    
    if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ Applied!';
        button.disabled = true;
        button.style.opacity = '0.7';
    }
    
    // Show modal popup (center screen only)
    showSuccessModal(jobTitle, companyName);
    
    // Optional: Save to applied jobs in localStorage
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    const newApplication = {
        jobTitle,
        companyName,
        appliedDate: new Date().toLocaleDateString(),
        appliedTime: new Date().toLocaleTimeString()
    };
    
    // Check if already applied
    const alreadyApplied = appliedJobs.some(job => job.jobTitle === jobTitle && job.companyName === companyName);
    
    if (!alreadyApplied) {
        appliedJobs.push(newApplication);
        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
    }
}

// Handle Save Job button click
function saveJob(jobTitle) {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const alreadySaved = savedJobs.includes(jobTitle);
    
    if (!alreadySaved) {
        savedJobs.push(jobTitle);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        showNotification(`⭐ ${jobTitle} has been saved to your favorites!`, 'success');
        
        // Visual feedback
        const saveButtons = document.querySelectorAll('[onclick*="saveJob"]');
        const button = Array.from(saveButtons).find(btn => btn.getAttribute('onclick')?.includes(jobTitle));
        if (button) {
            button.style.backgroundColor = '#FFD700';
            button.style.color = '#333';
        }
    } else {
        showNotification(`✓ ${jobTitle} is already in your saved jobs`, 'info');
    }
}

function displayJobDetails() {
    const job = getSelectedJob();
    if (!job) {
        window.location.href = 'jobs.html';
        return;
    }

    const detailContainer = document.querySelector('.job-detail-container > div');
    if (detailContainer) {
        const detailsHTML = `
            <div style="animation: slideUp 0.6s ease;">
                <div class="job-detail-header">
                    <div class="job-detail-title">
                        <div class="job-detail-avatar" style="background: ${job.avatarGradient};">${job.avatar}</div>
                        <div class="job-detail-info">
                            <h1>${job.title}</h1>
                            <div class="job-detail-company">${job.company} • ${job.location} (${job.type})</div>
                            <div class="job-detail-meta">
                                <span class="detail-meta-item meta-salary"><!-- add icone --> ${job.salary}/year</span>
                                <span class="detail-meta-item"><!-- add icone --> ${job.category}</span>
                                <span class="detail-meta-item"><!-- add icone --> ${job.type}</span>
                                <span class="detail-meta-item"><!-- add icone --> Senior Level</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-apply" onclick="showNotification('Successfully applied for ${job.title} at ${job.company}!', 'success')" style="transition: all 0.3s; cursor: pointer;">Easy Apply</button>
                </div>

                <div class="job-detail-content">
                    <div class="detail-section" style="animation: fadeIn 0.6s ease 0.1s both;">
                        <h3>Job Description</h3>
                        <p>${job.fullDescription}</p>
                    </div>

                    <div class="detail-section" style="animation: fadeIn 0.6s ease 0.2s both;">
                        <h3>Requirements</h3>
                        <ul class="requirements-list">
                            ${job.requirements.map(req => `<li style="animation: slideIn 0.5s ease;"> ${req}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="detail-section" style="animation: fadeIn 0.6s ease 0.3s both;">
                        <h3>Benefits & Perks</h3>
                        <div class="benefits-grid">
                            ${job.benefits.map((benefit, idx) => `<div class="benefit-card" style="animation: pop 0.4s ease ${0.3 + idx * 0.1}s both;"> ${benefit}</div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        detailContainer.innerHTML = detailsHTML;
    }

    // Update sidebar with job-specific info
    const sidebarCard = document.querySelector('.sidebar-card');
    if (sidebarCard) {
        const aboutSection = sidebarCard.querySelector('h4');
        if (aboutSection && aboutSection.textContent.includes('About')) {
            aboutSection.textContent = `About ${job.company}`;
        }
    }
}

// ========== JOB DETAIL INITIALIZATION ==========
function initJobDetail() {
    if (window.location.pathname.includes('job-detail.html')) {
        displayJobDetails();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initJobDetail);