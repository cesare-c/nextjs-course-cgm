interface ExerciseNavbarProps {
  title: string;
  date?: string;
  exerciseId?: string;
}

export default function ExerciseNavbar({ title, date, exerciseId }: ExerciseNavbarProps) {
  const handleAction = async (e: React.MouseEvent<HTMLAnchorElement>, type: 'lezione' | 'progetto') => {
    e.preventDefault();
    if (!exerciseId) {
      window.open('/costruzione.html', '_blank', 'noopener,noreferrer');
      return;
    }

    const docPath = `/docs/${exerciseId}/${type === 'lezione' ? 'lezione' : 'progetto'}.md`;

    try {
      // Check if file exists using a lightweight HEAD request
      const response = await fetch(docPath, { method: 'HEAD' });
      if (response.ok) {
        window.open(`/viewer.html?file=${encodeURIComponent(docPath)}`, '_blank', 'noopener,noreferrer');
      } else {
        window.open('/costruzione.html', '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Error checking file existence:', err);
      window.open('/costruzione.html', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="exercise-navbar">
      <div className="exercise-navbar-brand">
        <span className="exercise-navbar-title">{title}</span>
        {date && (
          <>
            <span className="exercise-navbar-divider">•</span>
            <span className="exercise-navbar-date">{date}</span>
          </>
        )}
      </div>
      <div className="exercise-actions">
        <a
          href="/costruzione.html"
          onClick={(e) => handleAction(e, 'lezione')}
          className="btn-action"
        >
          Lezione
        </a>
        <a
          href="/costruzione.html"
          onClick={(e) => handleAction(e, 'progetto')}
          className="btn-action btn-secondary"
        >
          Spiega il progetto
        </a>
      </div>
    </div>
  );
}
