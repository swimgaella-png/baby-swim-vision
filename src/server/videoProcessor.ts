import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';

const execAsync = util.promisify(exec);

export interface VideoStreamProbe {
  format: string;
  codec: string;
  width: number;
  height: number;
  aspectRatio: string;
  orientation: 'portrait' | 'landscape' | 'square';
  fps: number;
  durationSeconds: number;
  sizeMB: number;
  isDirectlyPlayable: boolean;
  requiresConversion: boolean;
  rotationDegrees: number;
  rawFormatName?: string;
  rawCodecName?: string;
}

export function normalizeFormatLabel(formatStr: string = '', filename: string = ''): string {
  const fLower = formatStr.toLowerCase();
  const ext = path.extname(filename).toLowerCase().replace('.', '');

  if (ext === 'mov' || fLower.includes('mov') || fLower.includes('quicktime')) return 'MOV (Apple QuickTime)';
  if (ext === 'mp4' || fLower.includes('mp4')) return 'MP4 (MPEG-4 Part 14)';
  if (ext === 'm4v' || fLower.includes('m4v')) return 'M4V (Apple Video)';
  if (ext === 'mkv' || fLower.includes('matroska')) return 'MKV (Matroska)';
  if (ext === 'webm' || fLower.includes('webm')) return 'WebM';
  if (ext === 'avi' || fLower.includes('avi')) return 'AVI (Audio Video Interleave)';
  if (ext === 'wmv' || fLower.includes('asf') || fLower.includes('wmv')) return 'WMV (Windows Media Video)';
  if (ext === '3gp' || ext === '3g2' || fLower.includes('3gp')) return '3GP (Mobile Video)';
  if (ext === 'mpeg' || ext === 'mpg' || ext === 'm2ts' || ext === 'ts' || fLower.includes('mpeg')) return 'MPEG / MPG';
  if (ext === 'flv' || fLower.includes('flv')) return 'FLV (Flash Video)';
  if (ext === 'ogv' || fLower.includes('ogg')) return 'OGV (Ogg Video)';

  if (ext) return ext.toUpperCase();
  return formatStr ? formatStr.split(',')[0].toUpperCase() : 'Vidéo standard';
}

export function normalizeCodecLabel(codecStr: string = ''): string {
  const cLower = codecStr.toLowerCase();
  if (cLower === 'h264' || cLower === 'avc1') return 'H.264 / AVC';
  if (cLower === 'hevc' || cLower === 'h265' || cLower === 'hev1' || cLower === 'hvc1') return 'HEVC / H.265';
  if (cLower === 'vp8') return 'VP8';
  if (cLower === 'vp9') return 'VP9';
  if (cLower === 'av01' || cLower === 'av1') return 'AV1';
  if (cLower === 'mpeg4') return 'MPEG-4';
  if (cLower === 'msmpeg4' || cLower === 'msmpeg4v3') return 'MS MPEG-4';
  if (cLower.startsWith('wmv') || cLower === 'vc1') return 'WMV';
  if (cLower === 'mjpeg' || cLower === 'jpeg') return 'Motion JPEG';
  if (cLower === 'prores') return 'Apple ProRes';
  if (cLower === 'theora') return 'Theora';
  if (cLower === 'mpeg1video') return 'MPEG-1';
  if (cLower === 'mpeg2video') return 'MPEG-2';
  return codecStr ? codecStr.toUpperCase() : 'Standard';
}

/**
 * Executes ffprobe to extract rich technical metadata from video
 */
export async function probeVideoFile(filePath: string, originalFilename: string = ''): Promise<VideoStreamProbe> {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`
    );

    const data = JSON.parse(stdout);
    const videoStream = (data.streams || []).find((s: any) => s.codec_type === 'video');

    if (!videoStream) {
      throw new Error('Aucun flux vidéo détecté dans le fichier.');
    }

    const rawCodec = videoStream.codec_name || '';
    const rawFormat = data.format?.format_name || '';

    let width = parseInt(videoStream.width, 10) || 640;
    let height = parseInt(videoStream.height, 10) || 480;

    // Detect rotation tag from iPhone / Android metadata
    let rotationDegrees = 0;
    if (videoStream.tags?.rotate) {
      rotationDegrees = parseInt(videoStream.tags.rotate, 10) || 0;
    } else if (Array.isArray(videoStream.side_data_list)) {
      const rotData = videoStream.side_data_list.find((sd: any) => typeof sd.rotation === 'number');
      if (rotData) {
        rotationDegrees = Math.abs(rotData.rotation);
      }
    }

    // If rotated 90 or 270 degrees in metadata, swap display width/height
    const isRotatedQuarter = rotationDegrees === 90 || rotationDegrees === 270 || rotationDegrees === -90 || rotationDegrees === -270;
    const displayWidth = isRotatedQuarter ? height : width;
    const displayHeight = isRotatedQuarter ? width : height;

    let orientation: 'portrait' | 'landscape' | 'square' = 'landscape';
    if (displayHeight > displayWidth * 1.05) {
      orientation = 'portrait';
    } else if (displayWidth > displayHeight * 1.05) {
      orientation = 'landscape';
    } else {
      orientation = 'square';
    }

    // Parse FPS
    let fps = 30;
    if (videoStream.r_frame_rate && videoStream.r_frame_rate.includes('/')) {
      const [num, den] = videoStream.r_frame_rate.split('/').map(Number);
      if (den > 0 && num > 0) {
        fps = Math.round(num / den);
      }
    } else if (videoStream.avg_frame_rate && videoStream.avg_frame_rate.includes('/')) {
      const [num, den] = videoStream.avg_frame_rate.split('/').map(Number);
      if (den > 0 && num > 0) {
        fps = Math.round(num / den);
      }
    }

    // Duration in seconds
    const durationSeconds = parseFloat(videoStream.duration || data.format?.duration || '0') || 15;
    const sizeBytes = parseInt(data.format?.size || '0', 10) || (fs.existsSync(filePath) ? fs.statSync(filePath).size : 0);
    const sizeMB = Number((sizeBytes / (1024 * 1024)).toFixed(2));

    const codecLabel = normalizeCodecLabel(rawCodec);
    const formatLabel = normalizeFormatLabel(rawFormat, originalFilename);

    // Determine if natively playable in standard HTML5 video elements without transcoding
    const isStandardH264 = rawCodec.toLowerCase() === 'h264';
    const isStandardWebM = (rawCodec.toLowerCase() === 'vp8' || rawCodec.toLowerCase() === 'vp9' || rawCodec.toLowerCase() === 'av1') && rawFormat.includes('webm');
    const isDirectlyPlayable = isStandardH264 || isStandardWebM;
    const requiresConversion = !isDirectlyPlayable;

    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(displayWidth, displayHeight);
    const ratioW = Math.round(displayWidth / divisor);
    const ratioH = Math.round(displayHeight / divisor);
    const aspectRatio = `${displayWidth}×${displayHeight} (${ratioW}:${ratioH})`;

    return {
      format: formatLabel,
      codec: codecLabel,
      width: displayWidth,
      height: displayHeight,
      aspectRatio,
      orientation,
      fps: fps || 30,
      durationSeconds: Number(durationSeconds.toFixed(2)),
      sizeMB,
      isDirectlyPlayable,
      requiresConversion,
      rotationDegrees,
      rawFormatName: rawFormat,
      rawCodecName: rawCodec,
    };
  } catch (error: any) {
    console.error('ffprobe error:', error);
    throw new Error('Impossible de lire les métadonnées de cette vidéo.');
  }
}

/**
 * Transcodes any video file into universal MP4 (H.264 + AAC), auto-orienting vertical videos,
 * preserving exact timing, framerate and speed.
 */
export async function convertVideoToUniversalMp4(
  inputPath: string,
  outputPath: string
): Promise<VideoStreamProbe> {
  // Command options:
  // -y : overwrite
  // -i input
  // -c:v libx264 : universal H.264
  // -preset fast : high speed transcoding
  // -crf 22 : visually lossless high quality
  // -pix_fmt yuv420p : universal 8-bit compatibility for all browsers/smartphones
  // -c:a aac -b:a 128k : universal AAC audio (or none if silent)
  // -movflags +faststart : enables immediate streaming/playhead scrubbing
  // ffmpeg automatically honors -autorotate by default
  const cmd = `ffmpeg -y -i "${inputPath}" -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "${outputPath}"`;

  try {
    await execAsync(cmd);

    if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
      throw new Error('Le fichier de sortie vidéo est vide après conversion.');
    }

    // Probe the converted file to return finalized specs
    const convertedProbe = await probeVideoFile(outputPath, 'converted.mp4');
    convertedProbe.requiresConversion = false;
    convertedProbe.isDirectlyPlayable = true;
    return convertedProbe;
  } catch (err: any) {
    console.error('ffmpeg conversion error:', err);
    throw new Error('Échec de la conversion de la vidéo.');
  }
}
