const API_BASE_URL = import.meta.env.VITE_RESUME_API_URL;
const API_KEY = import.meta.env.VITE_RESUME_API_KEY;

/**
 * Generate and auto-download a tailored resume based on job description
 * @param {string} jobDescription - The job posting or description text (optional)
 * @param {string} targetRole - The target role name (required)
 * @returns {Promise<void>}
 * @throws {Error} If generation or download fails
 */
export async function generateAndDownloadResume(jobDescription, targetRole = '') {
  if (!targetRole || targetRole.trim().length === 0) {
    throw new Error('Please enter a target role');
  }

  try {
    // Step 1: Generate resume with AI
    const generateResponse = await fetch(`${API_BASE_URL}/api/generate-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({
        jobDescription: jobDescription?.trim() || null,
        keywords: null,
        targetRole: targetRole?.trim() || null,
        fitToOnePage: false,
      }),
    });

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to generate resume');
    }

    const generateData = await generateResponse.json();

    if (!generateData.success || !generateData.data?.resumeData) {
      throw new Error('Invalid response from server');
    }

    const { resumeData } = generateData.data;

    // Step 2: Download DOCX
    const downloadResponse = await fetch(`${API_BASE_URL}/api/download-docx`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify({
        resumeData,
        targetRole: targetRole.trim() || undefined,
      }),
    });

    if (!downloadResponse.ok) {
      const errorData = await downloadResponse.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to download resume');
    }

    // Step 3: Trigger browser download
    const blob = await downloadResponse.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    // Generate filename with target role if provided
    const rolePart = targetRole.trim() ? `_${targetRole.trim().replace(/\s+/g, '_')}` : '';
    const datePart = new Date().toISOString().split('T')[0];
    a.download = `John_Choi_Resume${rolePart}_${datePart}.docx`;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

  } catch (error) {
    console.error('Resume generation error:', error);
    throw error;
  }
}
