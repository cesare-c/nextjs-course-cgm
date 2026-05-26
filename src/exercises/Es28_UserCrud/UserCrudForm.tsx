import { useState, useEffect } from 'react';
import type { UserInput, User } from '../../types/userDay28';
import { validateUserForm } from '../../helpers/userHelpers';

interface UserCrudFormProps {
  initialUser?: User;
  onSubmit: (input: UserInput) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export default function UserCrudFormDay28({ initialUser, onSubmit, onCancel, isSaving }: UserCrudFormProps) {
  const isEdit = !!initialUser;

  const [formValues, setFormValues] = useState<UserInput>({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Populate form if in edit mode
  useEffect(() => {
    if (initialUser) {
      setFormValues({
        username: initialUser.username,
        email: initialUser.email,
        firstName: initialUser.firstName,
        lastName: initialUser.lastName,
        middleName: initialUser.middleName || '',
        isActive: initialUser.isActive
      });
    }
  }, [initialUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    const nextFormValues = { ...formValues, [name]: nextValue };

    setFormValues(nextFormValues);

    // Validate in real-time if field has been touched
    if (touched[name]) {
      const validationErrors = validateUserForm(nextFormValues);
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name] || ''
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const validationErrors = validateUserForm(formValues);
    setErrors((prev) => ({
      ...prev,
      [name]: validationErrors[name] || ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all fields to trigger full validation
    const allTouched = Object.keys(formValues).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const validationErrors = validateUserForm(formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit(formValues);
  };

  const containerStyle = {
    backgroundColor: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: 'var(--shadow)',
    maxWidth: '500px',
    margin: '0 auto',
    boxSizing: 'border-box' as const
  };

  const fieldContainerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    marginBottom: '16px',
    textAlign: 'left' as const
  };

  const labelStyle = {
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '6px',
    color: 'var(--text-h)'
  };

  const inputStyle = (fieldName: string) => ({
    padding: '10px 12px',
    borderRadius: '6px',
    border: errors[fieldName] && touched[fieldName] ? '1px solid #ff4d4f' : '1px solid var(--border)',
    backgroundColor: 'var(--bg)',
    color: 'var(--text-h)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const
  });

  const errorTextStyle = {
    color: '#ff4d4f',
    fontSize: '0.75rem',
    marginTop: '4px',
    fontWeight: '500'
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    textAlign: 'left' as const
  };

  const buttonGroupStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px'
  };

  const submitButtonStyle = {
    padding: '10px 20px',
    backgroundColor: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: isSaving ? 'not-allowed' : 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'opacity 0.2s',
    opacity: isSaving ? 0.7 : 1
  };

  const cancelButtonStyle = {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--text-h)', fontSize: '1.25rem' }}>
        {isEdit ? 'Modifica Utente' : 'Crea Nuovo Utente'}
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Username *</label>
          <input
            type="text"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle('username')}
            placeholder="es. jdoe"
            disabled={isSaving}
          />
          {errors.username && touched.username && <span style={errorTextStyle}>{errors.username}</span>}
        </div>

        {/* Email */}
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle('email')}
            placeholder="es. john.doe@example.com"
            disabled={isSaving}
          />
          {errors.email && touched.email && <span style={errorTextStyle}>{errors.email}</span>}
        </div>

        {/* First Name */}
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Nome *</label>
          <input
            type="text"
            name="firstName"
            value={formValues.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle('firstName')}
            placeholder="es. John"
            disabled={isSaving}
          />
          {errors.firstName && touched.firstName && <span style={errorTextStyle}>{errors.firstName}</span>}
        </div>

        {/* Middle Name */}
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Secondo Nome (Facoltativo)</label>
          <input
            type="text"
            name="middleName"
            value={formValues.middleName}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle('middleName')}
            placeholder="es. Fitzgerald"
            disabled={isSaving}
          />
          {errors.middleName && touched.middleName && <span style={errorTextStyle}>{errors.middleName}</span>}
        </div>

        {/* Last Name */}
        <div style={fieldContainerStyle}>
          <label style={labelStyle}>Cognome *</label>
          <input
            type="text"
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            style={inputStyle('lastName')}
            placeholder="es. Doe"
            disabled={isSaving}
          />
          {errors.lastName && touched.lastName && <span style={errorTextStyle}>{errors.lastName}</span>}
        </div>

        {/* Active/Inactive state (only visible on Edit, since on Create it is always sent to true as per requirements) */}
        {isEdit && (
          <div style={checkboxContainerStyle}>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formValues.isActive}
              onChange={handleChange}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              disabled={isSaving}
            />
            <label htmlFor="isActive" style={{ fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-h)', fontWeight: '500' }}>
              Utente Attivo
            </label>
          </div>
        )}

        {!isEdit && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text)', fontStyle: 'italic', marginBottom: '15px', textAlign: 'left' }}>
            Nota: I nuovi utenti vengono attivati automaticamente (`isActive` impostato a `true`).
          </p>
        )}

        {/* Form Actions */}
        <div style={buttonGroupStyle}>
          <button type="button" onClick={onCancel} style={cancelButtonStyle} disabled={isSaving}>
            Annulla
          </button>
          <button type="submit" style={submitButtonStyle} disabled={isSaving}>
            {isSaving ? 'Salvataggio...' : isEdit ? 'Salva Modifiche' : 'Crea Utente'}
          </button>
        </div>
      </form>
    </div>
  );
}
