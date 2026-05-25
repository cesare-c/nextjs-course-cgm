import { useState } from 'react';
import type { FormEvent } from 'react';

// ==========================================
// 1. GENERIC FORM SYSTEM (REUSABLE)
// ==========================================

interface FieldConfig<T> {
  name: keyof T & string;
  label: string;
  type: 'text' | 'email' | 'password' | 'radio';
  placeholder?: string;
  options?: { label: string; value: string }[]; // For radio/select fields
  dependencies?: (keyof T & string)[]; // Fields to re-validate when this field changes
  validate?: (value: string, values: T) => string[];
}

interface FormFieldProps<T> {
  config: FieldConfig<T>;
  value: string;
  error?: string[];
  touched?: boolean;
  onChange: (name: keyof T & string, value: string) => void;
  onBlur: (name: keyof T & string, value: string) => void;
}

function FormField<T>({ config, value, error, touched, onChange, onBlur }: FormFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!error && error.length > 0 && touched;

  const inputStyle = {
    padding: '10px',
    border: hasError ? '2px solid #e74c3c' : '1px solid #ccc',
    borderRadius: '4px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    textAlign: 'left' as const,
  };

  const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '0.9em',
    color: '#555',
  };

  const errorStyle = {
    color: '#e74c3c',
    fontSize: '0.85em',
    marginTop: '4px',
  };

  if (config.type === 'radio') {
    return (
      <div style={{ ...containerStyle, marginTop: '10px' }}>
        <label style={labelStyle}>{config.label}</label>
        <div style={{ display: 'flex', gap: '20px' }}>
          {config.options?.map((opt) => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', fontSize: '0.9em' }}>
              <input
                type="radio"
                name={config.name}
                value={opt.value}
                checked={value === opt.value}
                onChange={(e) => onChange(config.name, e.target.value)}
                onBlur={(e) => onBlur(config.name, e.target.value)}
              />
              {opt.label}
            </label>
          ))}
        </div>
        {hasError && error.map((err, idx) => (
          <div key={idx} style={errorStyle}>• {err}</div>
        ))}
      </div>
    );
  }

  if (config.type === 'password') {
    return (
      <div style={containerStyle}>
        <label htmlFor={config.name} style={labelStyle}>{config.label}</label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            id={config.name}
            name={config.name}
            value={value}
            onChange={(e) => onChange(config.name, e.target.value)}
            onBlur={(e) => onBlur(config.name, e.target.value)}
            style={{
              ...inputStyle,
              paddingRight: '70px',
            }}
            placeholder={config.placeholder}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85em',
              color: '#3498db',
              padding: '5px',
              fontWeight: 'bold',
            }}
          >
            {showPassword ? 'Nascondi' : 'Mostra'}
          </button>
        </div>
        {hasError && error.map((err, idx) => (
          <div key={idx} style={errorStyle}>• {err}</div>
        ))}
      </div>
    );
  }

  // default: text, email, etc.
  return (
    <div style={containerStyle}>
      <label htmlFor={config.name} style={labelStyle}>{config.label}</label>
      <input
        type={config.type}
        id={config.name}
        name={config.name}
        value={value}
        onChange={(e) => onChange(config.name, e.target.value)}
        onBlur={(e) => onBlur(config.name, e.target.value)}
        style={inputStyle}
        placeholder={config.placeholder}
      />
      {hasError && error.map((err, idx) => (
        <div key={idx} style={errorStyle}>• {err}</div>
      ))}
    </div>
  );
}

// Custom Hook to manage form state and validation
function useForm<T extends Record<string, string>>(
  initialValues: T,
  fields: FieldConfig<T>[],
  onSubmit: (values: T) => void
) {
  const [values, setValues] = useState<T>(initialValues);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>)
  );
  const [errors, setErrors] = useState<Record<keyof T, string[]>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = [];
      return acc;
    }, {} as Record<keyof T, string[]>)
  );

  const runValidation = (name: keyof T, value: string, currentValues: T): string[] => {
    const field = fields.find((f) => f.name === name);
    if (field && field.validate) {
      return field.validate(value, currentValues);
    }
    return [];
  };

  const handleChange = (name: keyof T & string, value: string) => {
    const newValues = { ...values, [name]: value };
    setValues(newValues);

    if (touched[name]) {
      const error = runValidation(name, value, newValues);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    // Trigger validation for dependent fields
    const field = fields.find((f) => f.name === name);
    if (field?.dependencies) {
      field.dependencies.forEach((depName) => {
        if (touched[depName]) {
          const depValue = newValues[depName];
          const depError = runValidation(depName, depValue, newValues);
          setErrors((prev) => ({ ...prev, [depName]: depError }));
        }
      });
    }
  };

  const handleBlur = (name: keyof T & string, value: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = runValidation(name, value, values);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const isFormValid = fields.every((field) => {
    const val = values[field.name];
    const errorList = field.validate ? field.validate(val, values) : [];
    return touched[field.name] && errorList.length === 0;
  });

  return {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
  };
}

// ==========================================
// 2. SPECIFIC REGISTRATION FORM CONFIG
// ==========================================

interface RegistrationValues {
  [key: string]: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: string;
}

const initialRegistrationValues: RegistrationValues = {
  email: '',
  password: '',
  confirmPassword: '',
  termsAccepted: '',
};

const registrationFields: FieldConfig<RegistrationValues>[] = [
  {
    name: 'email',
    label: 'Email *',
    type: 'email',
    placeholder: 'mario.rossi@example.com',
    validate: (value) => {
      const errs: string[] = [];
      if (!value) {
        errs.push("L'email è obbligatoria.");
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errs.push('Inserisci un indirizzo email valido.');
      }
      return errs;
    },
  },
  {
    name: 'password',
    label: 'Password *',
    type: 'password',
    placeholder: 'Min. 8 caratteri, 1 maiuscola, 1 simbolo...',
    dependencies: ['confirmPassword'],
    validate: (value) => {
      const errs: string[] = [];
      if (!value) {
        errs.push('La password è obbligatoria.');
        return errs;
      }
      if (value.length < 8) errs.push('La password deve contenere almeno 8 caratteri.');
      if (!/(?=.*[a-z])/.test(value)) errs.push('La password deve contenere almeno una lettera minuscola.');
      if (!/(?=.*[A-Z])/.test(value)) errs.push('La password deve contenere almeno una lettera maiuscola.');
      if (!/(?=.*\d)/.test(value)) errs.push('La password deve contenere almeno un numero.');
      if (!/(?=.*[!@#$%^&*()_+={}[\]|\\:;"'<>,.?/-])/.test(value)) errs.push('La password deve contenere almeno un simbolo speciale.');
      return errs;
    },
  },
  {
    name: 'confirmPassword',
    label: 'Conferma Password *',
    type: 'password',
    placeholder: 'Ripeti la password',
    validate: (value, values) => {
      const errs: string[] = [];
      if (!value) {
        errs.push('Conferma la password.');
      } else if (value !== values.password) {
        errs.push('Le password non coincidono con la prima.');
      }
      return errs;
    },
  },
  {
    name: 'termsAccepted',
    label: "Termini D'uso e Normativa sulla Privacy *",
    type: 'radio',
    options: [
      { label: 'Accetto', value: 'yes' },
      { label: 'Non accetto', value: 'no' },
    ],
    validate: (value) => {
      const errs: string[] = [];
      if (value !== 'yes') {
        errs.push('Devi accettare i Termini d\'uso e la Normativa sulla privacy per procedere.');
      }
      return errs;
    },
  },
];

// ==========================================
// 3. REGISTRATIONFORM COMPONENT
// ==========================================

const RegistrationForm = () => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isFormValid,
  } = useForm(initialRegistrationValues, registrationFields, () => {
    alert('Registrazione avvenuta con successo!');
  });

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
      <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Iscriviti al Servizio</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {registrationFields.map((field) => (
          <FormField
            key={field.name}
            config={field}
            value={values[field.name]}
            error={errors[field.name]}
            touched={touched[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        ))}

        {/* Bottone Invia */}
        <button
          type="submit"
          disabled={!isFormValid}
          style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: isFormValid ? '#3498db' : '#bdc3c7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            fontSize: '1em',
            transition: 'background-color 0.3s'
          }}
        >
          Registrati
        </button>

      </form>
    </div>
  );
};

export default RegistrationForm;
