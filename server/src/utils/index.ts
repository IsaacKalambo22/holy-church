import { Role } from '@prisma/client';
import jwt from 'jsonwebtoken';
import path from 'path';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

export const generateTokens = (
  id: string,
  email: string,
  role: Role
): TokenResponse => {
  const access_token = jwt.sign(
    {
      id: id,
      email: email,
      role: role,
    },
    process.env.JWT_ACCESS_SECRET_KEY as string,
    {
      expiresIn: '7d',
      algorithm: 'HS256', // Correct algorithm here
    }
  );

  const refresh_token = jwt.sign(
    {
      id: id,
      email: email,
      role: role,
    },
    process.env.JWT_REFRESH_SECRET_KEY as string,
    {
      expiresIn: '1d',
      algorithm: 'HS256', // Correct algorithm here
    }
  );

  return { access_token, refresh_token };
};

export const updateCourseVideoInfo = (
  course: any,
  sectionId: string,
  chapterId: string,
  videoUrl: string
) => {
  const section = course.sections?.find(
    (s: any) => s.sectionId === sectionId
  );
  if (!section) {
    throw new Error(
      `Section not found: ${sectionId}`
    );
  }

  const chapter = section.chapters?.find(
    (c: any) => c.chapterId === chapterId
  );
  if (!chapter) {
    throw new Error(
      `Chapter not found: ${chapterId}`
    );
  }

  chapter.video = videoUrl;
  chapter.type = 'Video';
};

export const validateUploadedFiles = (
  files: any
) => {
  const allowedExtensions = [
    '.mp4',
    '.m3u8',
    '.mpd',
    '.ts',
    '.m4s',
  ];
  for (const file of files) {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error(
        `Unsupported file type: ${ext}`
      );
    }
  }
};

export const getContentType = (
  filename: string
) => {
  const ext = path
    .extname(filename)
    .toLowerCase();
  switch (ext) {
    case '.mp4':
      return 'video/mp4';
    case '.m3u8':
      return 'application/vnd.apple.mpegurl';
    case '.mpd':
      return 'application/dash+xml';
    case '.ts':
      return 'video/MP2T';
    case '.m4s':
      return 'video/iso.segment';
    default:
      return 'application/octet-stream';
  }
};

// Preserved HLS/DASH upload logic for future use
export const handleAdvancedVideoUpload = async (
  s3: any,
  files: any,
  uniqueId: string,
  bucketName: string
) => {
  const isHLSOrDASH = files.some(
    (file: any) =>
      file.originalname.endsWith('.m3u8') ||
      file.originalname.endsWith('.mpd')
  );

  if (isHLSOrDASH) {
    // Handle HLS/MPEG-DASH Upload
    const uploadPromises = files.map(
      (file: any) => {
        const s3Key = `videos/${uniqueId}/${file.originalname}`;
        return s3
          .upload({
            Bucket: bucketName,
            Key: s3Key,
            Body: file.buffer,
            ContentType: getContentType(
              file.originalname
            ),
          })
          .promise();
      }
    );
    await Promise.all(uploadPromises);

    // Determine manifest file URL
    const manifestFile = files.find(
      (file: any) =>
        file.originalname.endsWith('.m3u8') ||
        file.originalname.endsWith('.mpd')
    );
    const manifestFileName =
      manifestFile?.originalname || '';
    const videoType = manifestFileName.endsWith(
      '.m3u8'
    )
      ? 'hls'
      : 'dash';

    return {
      videoUrl: `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${manifestFileName}`,
      videoType,
    };
  }

  return null; // Return null if not HLS/DASH to handle regular upload
};

export const mergeSections = (
  existingSections: any[],
  newSections: any[]
): any[] => {
  const existingSectionsMap = new Map<
    string,
    any
  >();

  // Populate the map with existing sections
  for (const existingSection of existingSections) {
    existingSectionsMap.set(
      existingSection.sectionId,
      {
        ...existingSection,
        chapters: existingSection.chapters || [], // Ensure chapters is always an array
      }
    );
  }

  // Merge new sections into the map
  for (const newSection of newSections) {
    const section = existingSectionsMap.get(
      newSection.sectionId
    );
    if (!section) {
      // Add new section
      existingSectionsMap.set(
        newSection.sectionId,
        {
          ...newSection,
          chapters: newSection.chapters || [], // Ensure chapters is always an array
        }
      );
    } else {
      // Merge chapters within the existing section
      section.chapters = mergeChapters(
        section.chapters || [], // Ensure chapters is always an array
        newSection.chapters || [] // Ensure chapters is always an array
      );
      existingSectionsMap.set(
        newSection.sectionId,
        section
      );
    }
  }

  return Array.from(existingSectionsMap.values());
};

export const mergeChapters = (
  existingChapters: any[],
  newChapters: any[]
): any[] => {
  const existingChaptersMap = new Map<
    string,
    any
  >();

  for (const existingChapter of existingChapters ||
    []) {
    if (existingChapter.chapterId) {
      // Ensure it has a chapterId
      existingChaptersMap.set(
        existingChapter.chapterId,
        existingChapter
      );
    }
  }

  for (const newChapter of newChapters || []) {
    if (newChapter.chapterId) {
      // Ensure new chapters also have a chapterId
      existingChaptersMap.set(
        newChapter.chapterId,
        {
          ...(existingChaptersMap.get(
            newChapter.chapterId
          ) || {}),
          ...newChapter,
        }
      );
    } else {
      console.warn(
        'Skipping chapter due to missing chapterId:',
        newChapter
      );
    }
  }

  return Array.from(existingChaptersMap.values());
};

export const calculateOverallProgress = (
  sections: any[]
): number => {
  console.log(
    'Sections data:',
    JSON.stringify(sections)
  );

  // Calculate total chapters, handling missing or invalid `chapters` properties
  const totalChapters = sections.reduce(
    (acc: number, section: any) => {
      const chapters = Array.isArray(
        section.chapters
      )
        ? section.chapters
        : [];
      return acc + chapters.length;
    },
    0
  );

  // Calculate completed chapters, handling missing or invalid `chapters` properties
  const completedChapters = sections.reduce(
    (acc: number, section: any) => {
      const chapters = Array.isArray(
        section.chapters
      )
        ? section.chapters
        : [];
      return (
        acc +
        chapters.filter(
          (chapter: any) => chapter.completed
        ).length
      );
    },
    0
  );

  // Calculate and return overall progress percentage
  return totalChapters > 0
    ? (completedChapters / totalChapters) * 100
    : 0;
};
