import styles from './ProjectCard.module.css';

const ProjectCard = ({ project: { title, imageSrc, description, skills = [], screenshots = [] } }) => (
    <div className={styles.container}>
        <div className={styles.imageFrame}><img src={screenshots.find(Boolean) || imageSrc} alt={`${title} preview`} className={styles.image} loading="lazy" /></div>
        <div className={styles.body}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
            <ul className={styles.skills} aria-label="Technologies">
                {skills.slice(0, 3).map((skill, index) => <li key={index}>{skill.replace(/^#/, '')}</li>)}
            </ul>
            <span className={styles.action}>View project <span aria-hidden="true">↗</span></span>
        </div>
    </div>
);
export default ProjectCard;
