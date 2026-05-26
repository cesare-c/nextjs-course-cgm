

interface ExerciseHeaderProps {
  title: string;
}

export default function ExerciseHeader({ title }: ExerciseHeaderProps) {
  return (
    <div className="exercise-header">
      <h2 className="exercise-title" style={{ marginTop: 0, marginBottom: 0 }}>
        {title}
      </h2>
      <div className="exercise-actions">
        <a
          href="/costruzione.html"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-action"
        >
          Lezione
        </a>
        <a
          href="/costruzione.html"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-action btn-secondary"
        >
          Spiega il progetto
        </a>
      </div>
    </div>
  );
}
