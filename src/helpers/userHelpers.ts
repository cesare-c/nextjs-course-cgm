import type { User, UserInput } from '../types/userDay27';

/**
 * Formats a user's full name including the optional middle name.
 */
export function formatFullName(user: User | { firstName: string; lastName: string; middleName?: string }): string {
  const { firstName, lastName, middleName } = user;
  const parts = [
    firstName.trim(),
    middleName && middleName.trim() ? middleName.trim() : '',
    lastName.trim()
  ].filter(Boolean);
  return parts.join(' ');
}

/**
 * Validates user form inputs and returns an object containing validation error messages.
 */
export function validateUserForm(input: UserInput): Record<string, string> {
  const errors: Record<string, string> = {};

  // Username validation
  if (!input.username || !input.username.trim()) {
    errors.username = 'Username è obbligatorio.';
  } else if (input.username.trim().length < 3) {
    errors.username = 'Username deve contenere almeno 3 caratteri.';
  } else if (!/^[a-zA-Z0-9_.-]+$/.test(input.username.trim())) {
    errors.username = 'Username può contenere solo lettere, numeri, punti, trattini e underscore.';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email || !input.email.trim()) {
    errors.email = 'Email è obbligatoria.';
  } else if (!emailRegex.test(input.email.trim())) {
    errors.email = 'Inserisci un indirizzo email valido.';
  }

  // First name validation
  if (!input.firstName || !input.firstName.trim()) {
    errors.firstName = 'Nome è obbligatorio.';
  } else if (input.firstName.trim().length < 2) {
    errors.firstName = 'Nome deve contenere almeno 2 caratteri.';
  }

  // Last name validation
  if (!input.lastName || !input.lastName.trim()) {
    errors.lastName = 'Cognome è obbligatorio.';
  } else if (input.lastName.trim().length < 2) {
    errors.lastName = 'Cognome deve contenere almeno 2 caratteri.';
  }

  // Middle name validation (optional but if filled, must be valid)
  if (input.middleName && input.middleName.trim()) {
    if (input.middleName.trim().length < 2) {
      errors.middleName = 'Se inserito, il secondo nome deve contenere almeno 2 caratteri.';
    }
  }

  return errors;
}
