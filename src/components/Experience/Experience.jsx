import { useState, useEffect } from 'react';
import { getHistory } from '../../utils';
import styles from './Experience.module.css';

export default function Experience() {
    const [showAll, setShowAll] = useState(false);
    const [history, setHistory] = useState([]);
    useEffect(() => { getHistory().then(setHistory); }, []);

    return (
        <section className={styles.container} id="experience" tabIndex={-1} aria-labelledby="experience-title">
            <div className={styles.heading}>
                <p className={styles.eyebrow}>01 / THE JOURNEY</p>
                <h2 id="experience-title">Experience</h2>
                <p>Building across AI, machine learning, and software.</p>
            </div>
            <div className={styles.timeline}>
                <ol className={styles.history} id="experience-history">
                    {(showAll ? history : history.slice(0, 3)).map((item, index) => (
                        <li key={index} className={styles.historyItem}>
                            <div className={styles.logo}><img src={item.imageSrc} alt="" loading="lazy" /></div>
                            <div className={styles.details}>
                                <p className={styles.date}>{item.startDate} — {item.endDate}</p>
                                <h3>{item.role}</h3>
                                <p className={styles.organisation}>{item.organisation}</p>
                                <ul className={styles.tags} aria-label="Skills and technologies">
                                    {item.experiences.map((skill, skillIndex) => <li key={skillIndex}>{skill}</li>)}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ol>
                {history.length > 3 && <button type="button" className={styles.more}
                    aria-expanded={showAll} aria-controls="experience-history" onClick={() => setShowAll(!showAll)}>
                    {showAll ? 'Show recent experience −' : 'View full experience +'}
                </button>}
            </div>
        </section>
    );
}
