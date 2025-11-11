import React, { useState } from 'react';
import styles from './ResumeGenerator.module.css';
import { generateAndDownloadResume } from '../../utils/resumeAPI';

const ResumeGenerator = ({ onClose }) => {
    const [jobDescription, setJobDescription] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await generateAndDownloadResume(jobDescription, targetRole);
            setSuccess(true);
            setJobDescription('');
            setTargetRole('');
        } catch (err) {
            setError(err.message || 'Failed to generate resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                <h2 className={styles.title}>Generate Tailored Resume</h2>
                <p className={styles.subtitle}>
                    Paste a job description below, and I'll generate a customized resume for you.
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        className={styles.input}
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="Target Role (e.g., Senior Software Engineer)"
                        required
                        disabled={loading}
                    />

                    <textarea
                        className={styles.textarea}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description here (optional)..."
                        rows={10}
                        disabled={loading}
                    />

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className={styles.success}>
                            ✓ Resume generated and downloaded successfully!
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading || !targetRole.trim()}
                    >
                        {loading ? 'Generating...' : 'Generate Resume'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResumeGenerator;
