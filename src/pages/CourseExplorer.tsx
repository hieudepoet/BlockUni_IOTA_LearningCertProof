import React from 'react';
import { courses } from '../data/courses';
import { CourseCard } from '../components/CourseCard';
import { useLearning } from '../context/LearningContext';

export const CourseExplorer: React.FC = () => {
    const { certificates, progress } = useLearning();

    const activeCourses = Object.keys(progress).length;
    const completedCourses = certificates.length;

    return (
        <div className="page">
            <div className="container">
                {/* Hero Section */}
                <section className="hero">
                    <h1>Proof of Learning Ledger</h1>
                    <p className="hero-subtitle">
                        Complete courses and earn verifiable NFT certificates on the IOTA blockchain.
                        Your achievements, permanently recorded on-chain.
                    </p>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-value">{courses.length}</div>
                            <div className="stat-label">Available Courses</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{activeCourses}</div>
                            <div className="stat-label">In Progress</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-value">{completedCourses}</div>
                            <div className="stat-label">Certificates Earned</div>
                        </div>
                    </div>
                </section>

                {/* Course Grid */}
                <section>
                    <div className="section-header">
                        <h2 className="section-title">Explore Courses</h2>
                    </div>

                    <div className="course-grid">
                        {courses.map((course, index) => (
                            <div key={course.id} className={`fade-in fade-in-delay-${(index % 4) + 1}`}>
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
