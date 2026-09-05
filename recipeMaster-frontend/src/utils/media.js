const mediaBaseUrl = import.meta.env.VITE_MEDIA_URL || 'http://localhost:3000'

export function getProfileImageUrl(filename) {
  if (!filename) {
    return `${mediaBaseUrl}/uploads/profiles/default-profile.png`
  }

  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename
  }

  return `${mediaBaseUrl}/uploads/profiles/${filename}`
}
