import { useState, useEffect } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import styles from './Projects.module.css';
import { getProjects } from '../../utils';
import ProjectCard from './ProjectCard';

const wrapIndex = (index, length) => ((index % length) + length) % length;
const SLIDE_DURATION = 460;

const Projects = ({ setSelectedProject }) => {
    const [projects, setProjects] = useState([]);
    const [{ position, target }, setNavigation] = useState({ position: 0, target: 0 });

    useEffect(() => {
        getProjects().then(setProjects);
    }, []);

    // Travel through adjacent cards when a distant navigation dot is selected.
    useEffect(() => {
        if (position === target) return;
        const timer = setTimeout(() => {
            setNavigation((navigation) => ({
                ...navigation,
                position: navigation.position + Math.sign(navigation.target - navigation.position),
            }));
        }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : SLIDE_DURATION);
        return () => clearTimeout(timer);
    }, [position, target]);

    const navigate = (getTarget) => {
        if (projects.length < 2) return;
        setNavigation((navigation) => {
            const nextTarget = getTarget(navigation);
            return {
                target: nextTarget,
                position: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? nextTarget
                    : navigation.position + Math.sign(nextTarget - navigation.position),
            };
        });
    };

    const nextSlide = () => navigate(({ target }) => target + 1);
    const prevSlide = () => navigate(({ target }) => target - 1);
    const goToSlide = (index) => navigate(({ position }) => {
        const forward = wrapIndex(index - wrapIndex(position, projects.length), projects.length);
        return position + (forward > projects.length / 2 ? forward - projects.length : forward);
    });
    const currentIndex = projects.length ? wrapIndex(position, projects.length) : 0;

    return (
        <section className={styles.container} id="projects" tabIndex={-1} aria-labelledby="projects-title">
            <div className={styles.heading}>
                <div><p className={styles.eyebrow}>02 / IDEAS INTO PRODUCTS</p><h2 id="projects-title">Selected work</h2></div>
                <p>AI applications, useful tools, and experiments.<br />A closer look at what I build.</p>
            </div>
            {projects.length > 0 && <>
                <div className={styles.controls}><span className={styles.counter} aria-live="polite" aria-atomic="true">{String(currentIndex + 1).padStart(2, '0')} <span>/ {String(projects.length).padStart(2, '0')}</span></span>
                <button type="button" onClick={prevSlide} className={styles.arrowLeft}
                    aria-label="Previous project" disabled={projects.length < 2}>
                    <FiArrowLeft aria-hidden="true" />
                </button>
                <button type="button" onClick={nextSlide} className={styles.arrowRight}
                    aria-label="Next project" disabled={projects.length < 2}>
                    <FiArrowRight aria-hidden="true" />
                </button></div>
                <div className={styles.carousel} role="region" aria-label="Projects carousel"
                    style={{ '--slide-duration': `${SLIDE_DURATION}ms` }}>
                    {(projects.length === 1 ? [0] : [-2, -1, 0, 1, 2]).map((offset) => {
                        const cardPosition = position + offset;
                        const project = projects[wrapIndex(cardPosition, projects.length)];
                        const visible = Math.abs(offset) <= 1;
                        const activate = () => offset === 0
                            ? setSelectedProject(project)
                            : offset < 0 ? prevSlide() : nextSlide();
                        return (
                            <div key={cardPosition}
                                className={`${styles.projectSlot} ${offset === 0 ? styles.center : ''}`}
                                style={{ '--offset': offset, '--scale': offset === 0 ? 0.95 : 0.8,
                                    opacity: offset === 0 ? 1 : visible ? 0.45 : 0,
                                    zIndex: offset === 0 ? 10 : visible ? 5 : 0 }}
                                aria-hidden={!visible}>
                                <div className={styles.cardInteraction} role="button"
                                    tabIndex={visible ? 0 : -1}
                                    aria-label={offset === 0 ? `Open ${project.title}` : `Show ${project.title}`}
                                    onClick={visible ? (event) => { event.currentTarget.focus(); activate(); } : undefined}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            activate();
                                        } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                                            event.preventDefault();
                                            if (event.key === 'ArrowRight') nextSlide();
                                            else prevSlide();
                                        }
                                    }}>
                                    <ProjectCard project={project} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.indicators}>
                    {projects.map((project, index) => (
                        <button type="button" key={index} onClick={() => goToSlide(index)}
                            aria-label={`Show project ${index + 1}: ${project.title}`}
                            aria-current={currentIndex === index ? 'true' : undefined}
                            className={`${styles.indicator} ${currentIndex === index ? styles.active : ''}`} />
                    ))}
                </div>
            </>}
        </section>
    );
};

export default Projects;
