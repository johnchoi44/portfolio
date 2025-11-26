import React, { useState, useEffect } from 'react';
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";

import styles from "./Projects.module.css";
import { getProjects } from '../../utils';
import ProjectCard from './ProjectCard';
import PopUp from './PopUp';

const Projects = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);
    const [hoverProject, setHoverProject] = useState(null);
    const [cursorPosition, setCursorPosition] = useState({x: 0, y: 0});

    const projects = getProjects();

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
    };

    const handleProjectClick = (projects) => {
        setSelectedProject(projects);
    };

    const closePopup = () => {
        setSelectedProject(null);
    };

    const handleMouseEnter = (project, e) => {
        setHoverProject(project);
        setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseLeave = () => {
        setHoverProject(null);
    }

    useEffect(() => {
        if (hoverProject) {
            const timer = setTimeout(() => {
                setSelectedProject(hoverProject);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [hoverProject]);

    return (
        <section className={styles.container} id="projects">
            <h2 className={styles.title}>Project</h2>
            <BsArrowLeftCircleFill onClick={prevSlide} className={styles.arrowLeft} />
            <div className={styles.carousel}>
                <div className={styles.projectContainer1} onClick={prevSlide}>
                    <ProjectCard project={
                        currentIndex === 0 
                            ? projects[projects.length - 1] 
                            : projects[currentIndex - 1]
                        }
                    />
                </div>
                <div className={styles.projectContainer}>
                    <ProjectCard
                        project={projects[currentIndex]}
                        onClick={() => handleProjectClick(projects[currentIndex])}
                    />
                </div>
                <div className={styles.projectContainer2} onClick={nextSlide}>
                    <ProjectCard
                        project={
                            currentIndex === projects.length - 1 
                                ? projects[0] 
                                : projects[currentIndex + 1]
                        }/>
                </div>
            </div>
            {/* {hoverProject && (
                <div
                    className={styles.progressCircle}
                    style={{
                        top: `${cursorPosition.y}px`,
                        left: `${cursorPosition.x}px`,
                    }}
                ></div>
            )} */}
            <BsArrowRightCircleFill onClick={nextSlide} className={styles.arrowRight} />
            <div className={styles.indicators}>
                {projects.map((_, idx) => {
                    return (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`${styles.indicator} ${
                                currentIndex === idx ? styles.active : ""
                            }`}
                        ></button>
                    )
                })}
            </div>
            {selectedProject && <PopUp project={selectedProject} onClose={closePopup} />}
        </section>
    )
}

export default Projects