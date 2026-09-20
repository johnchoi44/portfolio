import { useState, useEffect, useRef } from 'react';
import { FiX, FiArrowLeft, FiArrowRight, FiArrowUpRight } from 'react-icons/fi';
import styles from './PopUp.module.css';

const validLink = (value) => {
    if (!value) return undefined;
    try {
        const url = new URL(value);
        return ['http:', 'https:'].includes(url.protocol) && !/(^|\.)example\.com$/.test(url.hostname) ? url.href : undefined;
    } catch { return undefined; }
};

const PopUp = ({ project, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const dialogRef = useRef(null);
    const { title, description, skills = [], screenshots = [], youtubeLink, imageSrc } = project;
    const images = screenshots.filter(Boolean);
    const video = validLink(youtubeLink);
    const mediaItems = [
        ...(video ? [{ type: 'video', src: video }] : []),
        ...images.map(src => ({ type: 'image', src })),
    ];
    if (!mediaItems.length && imageSrc) mediaItems.push({ type: 'image', src: imageSrc });
    const currentMedia = mediaItems[currentSlide];
    const source = validLink(project.source);
    const demo = validLink(project.demo);

    useEffect(() => {
        const dialog = dialogRef.current;
        const trigger = document.activeElement;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialog.showModal();
        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
            if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
        };
    }, []);

    const move = (direction) => setCurrentSlide(index => (index + direction + mediaItems.length) % mediaItems.length);

    return (
        <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="project-dialog-title"
            onCancel={(event) => { event.preventDefault(); onClose(); }}
            onKeyDown={(event) => {
                if (event.key !== 'Tab') return;
                const controls = event.currentTarget.querySelectorAll('button:not(:disabled), a[href], iframe');
                const first = controls[0];
                const last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                }
            }}
            onClick={(event) => {
                if (event.target !== event.currentTarget) return;
                const rect = event.currentTarget.getBoundingClientRect();
                if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
            }}>
            <div className={styles.header}>
                <div><p className={styles.eyebrow}>PROJECT OVERVIEW</p><h2 id="project-dialog-title">{title}</h2></div>
                <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close project" autoFocus><FiX aria-hidden="true" /></button>
            </div>
            <p className={styles.description}>{description}</p>
            <ul className={styles.skills} aria-label="Technologies">
                {skills.map((skill, index) => <li key={index}>{skill.replace(/^#/, '')}</li>)}
            </ul>
            {currentMedia && <div className={styles.gallery}>
                <div className={styles.media}>
                    {currentMedia.type === 'video'
                        ? <iframe key={currentMedia.src} src={currentMedia.src} title={`${title} demo video`} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                        : <img key={currentMedia.src} src={currentMedia.src} alt={`${title} — screenshot ${images.indexOf(currentMedia.src) + 1 || 1}`} />}
                </div>
                {mediaItems.length > 1 && <div className={styles.galleryControls}>
                    <button type="button" className={styles.iconButton} onClick={() => move(-1)} aria-label="Previous media"><FiArrowLeft aria-hidden="true" /></button>
                    <p role="status" aria-atomic="true">{currentSlide + 1} <span>/ {mediaItems.length}</span></p>
                    <button type="button" className={styles.iconButton} onClick={() => move(1)} aria-label="Next media"><FiArrowRight aria-hidden="true" /></button>
                </div>}
            </div>}
            {(demo || source) && <div className={styles.links}>
                {demo && <a href={demo} target="_blank" rel="noopener noreferrer" className={styles.demo}>View demo <FiArrowUpRight aria-hidden="true" /></a>}
                {source && <a href={source} target="_blank" rel="noopener noreferrer">{new URL(source).hostname === 'github.com' ? 'View source' : 'Project link'} <FiArrowUpRight aria-hidden="true" /></a>}
            </div>}
        </dialog>
    );
};
export default PopUp;
