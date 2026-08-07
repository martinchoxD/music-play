/**
 * URL base de los archivos de audio.
 *
 * Apunta a Cloudinary. Es una URL pública de entrega: NO requiere credenciales
 * (los archivos son públicos y la URL no contiene API keys), por lo que puede
 * comitearse sin problema.
 *
 * Para volver a archivos locales durante el desarrollo, colocá los .mp3 en
 * `public/audio/` y cambiá el valor por '/audio'.
 *
 * Nota: Cloudinary puede guardar algunos .mp3 como contenedor .mp4. En ese
 * caso la extensión en src/data/songs.ts debe coincidir (p. ej. 'dramaturgy.mp4').
 */
export const audioBaseUrl = 'https://res.cloudinary.com/eqvqxjrb/video/upload/mis_audios';
