import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../data/courses';
import { useLearning } from '../context/LearningContext';

interface CourseCardProps {
    course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const { getCourseProgress, certificates } = useLearning();
    const progress = getCourseProgress(course.id);
    const hasCertificate = certificates.some(cert => cert.courseId === course.id);

    const completedModules = progress?.modulesCompleted.filter(Boolean).length ?? 0;
    const progressPercent = (completedModules / 4) * 100;

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Beginner': return '#38ef7d';
            case 'Intermediate': return '#667eea';
            case 'Advanced': return '#f093fb';
            default: return '#667eea';
        }
    };

    return (
        <div className="glass-card course-card fade-in">
            <span
                className="course-badge"
                style={{ background: getLevelColor(course.level) }}
            >
                {course.level}
            </span>

            <img
                src={course.imageUrl}
                alt={course.title}
                className="course-image"
                loading="lazy"
            />

            <h3 className="course-title">{course.title}</h3>
            <p className="course-description">{course.description}</p>

            <div className="course-meta">
                <span className="course-meta-item">
                    ⏱️ {course.duration}
                </span>
                <span className="course-meta-item">
                    📖 {course.modules} modules
                </span>
                <span className="course-meta-item">
                    🏷️ {course.category}
                </span>
            </div>

            {progress && (
                <div className="progress-bar-container" style={{ marginBottom: '1rem' }}>
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="progress-bar-label" style={{ marginTop: '0.5rem' }}>
                        <span>{completedModules}/4 modules</span>
                        {hasCertificate && <span style={{ color: '#38ef7d' }}>✓ Certified</span>}
                    </div>
                </div>
            )}

            <Link to={`/course/${course.id}`} className="btn btn-primary" style={{ width: '100%' }}>
                {hasCertificate ? 'View Course' : progress ? 'Continue Learning' : 'Start Learning'}
            </Link>
        </div>
    );
};
