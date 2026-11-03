export const STORAGE_KEYS = {
  TOKEN: 'recipeMaster_token',
}

export const LIMITS = {
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 6,
  TITLE_MAX: 120,
  DESCRIPTION_MAX: 500,
  BIO_MAX: 255,
  COMMENT_MAX: 500,
  COLLECTION_TITLE_MIN: 3,
  COLLECTION_TITLE_MAX: 100,
  COLLECTION_DESCRIPTION_MAX: 500,
}

export const PAGE_SIZE = 12
export const SEARCH = { MIN_LENGTH: 2, DEBOUNCE_MS: 400 }

export const NOTIFICATIONS = { POLL_MS: 30000 }

// Texto que vem depois do @usuário em cada linha da tela de notificações.
export const NOTIFICATION_TEXT = {
  like: 'curtiu a sua receita',
  comment: 'comentou na sua receita',
  follow: 'começou a seguir você',
}

// As cinco chaves fixas (iguais às da API), na ordem, com os rótulos que a tela mostra.
export const REPORT_REASONS = [
  { value: 'inappropriate_content', label: 'Conteúdo impróprio' },
  { value: 'harassment', label: 'Assédio ou discurso de ódio' },
  { value: 'spam', label: 'Spam ou golpes' },
  { value: 'copyright', label: 'Violação de direitos autorais' },
  { value: 'other', label: 'Outro' },
]

export const TOAST = {
  DURATION: 3500,
  SUCCESS_DURATION: 2500,
}

export const MESSAGES = {
  ACTION_ERROR: 'Não foi possível concluir a ação.',
  NETWORK_ERROR: 'Não foi possível conectar à API.',
}
