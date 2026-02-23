import React from 'react'

import styles from "./About.module.css"

const About = () => {
  return (
    <section className={styles.container} id="about">
        <h2 className={styles.title}>About Me</h2>
        <div className={styles.content}>
            <ul className={styles.aboutItems}>
                <li className={styles.aboutItem}>
                    <div className={styles.aboutItemText}>
                        <p>
                            I'm John Choi, a Penn State graduate in Computational Data Science with a minor in Mathematics, and I currently work as an AI Engineer focused on building production-ready AI products.
                        </p>
                        <br />
                        <p>
                            In my work, I've utilized AI by designing and shipping structured LLM systems end-to-end: building AI assistants that perform tool selection and parameter extraction, integrating those systems with real APIs/databases, and improving reliability through schema design, prompt iteration, and type-safe pipelines. I've implemented conversation memory and context controls, optimized token usage and output quality, and combined model outputs with deterministic logic (including simulation-based evaluators) to ensure correctness and trustworthy user experience in production.
                        </p>
                        <br />
                        <p>
                            Previously, as a Machine Learning Engineer at Nittany AI Advance, I worked with the PlantVillage team to develop computer vision models using Python and TensorFlow, built outlier-detection algorithms, and processed large-scale agricultural datasets on Amazon EC2. Outside of work, I enjoy golf, guitar, basketball, soccer, music, and movies.
                        </p>
                    </div>
                </li>
                {/* <li className={styles.aboutItem}>
                    <div className={styles.aboutItemText}>
                        <h3>Technical Expertise</h3>
                        <ul>
                            <li>Programming Languages: Python, R, SQL, Java, JavaScript</li>
                            <li>Framework & Tools: TensorFlow, PyTorch, Spark, AWS, React.js, Node.js, Google Cloud Vertex AI</li>
                            <li>Skills: Machine Learning, Data Analysis, Computer Vision, Data Scraping, Sentiment Analysis, Full Stack Development, Leadership, Problem Solving, Critical Thinking, Interpersonal Communication</li>
                        </ul>
                    </div>
                </li> */}
            </ul>
        </div>
    </section>
  )
}

export default About
