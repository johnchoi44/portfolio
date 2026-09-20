import { useEffect, useRef } from 'react';
import styles from './About.module.css';

export default function About() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            sectionRef.current?.scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                block: 'start',
            });
            sectionRef.current?.focus({ preventScroll: true });
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <section ref={sectionRef} className={styles.container} id="about" tabIndex={-1} aria-labelledby="about-title">
            <h2 id="about-title">About me</h2>
            <div className={styles.copy}>
                <p className={styles.lead}>I’m currently an AI Engineer at <strong>Single Case Informatics</strong>, building AI-assisted workflows for research software.</p>
                <p>I focus on making these workflows reliable, understandable, and keeping researchers in control of the results.</p>
                <h3 className={styles.focusHeading}>Currently focused on</h3>
                <ul className={styles.focusList}>
                    <li>Natural-language graph and table editing, contextual feedback, and AI suggestions that researchers can review.</li>
                    <li>Connecting language models to application tools through structured, typed outputs, with evaluation and tracking of model behavior, latency, and token costs.</li>
                    <li>Building reliable workflows across interfaces, data persistence, and access controls.</li>
                </ul>
                <p className={styles.background}>I studied Computational Data Science at Penn State, with a minor in Mathematics. Outside of work, I enjoy golf, guitar, basketball, and soccer.</p>
            </div>
        </section>
    );
}
