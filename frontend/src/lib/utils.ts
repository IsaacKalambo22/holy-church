import { FileState } from '@/modules/common/multiple-file-upload';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import * as z from 'zod';
import {
  getUploadFileUrl,
  getUploadVideoUrl,
} from '../modules/admin/actions/index';
import { getSignedURL } from './aws';
import config from './config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseServerActionResponse<T>(
  response: T
) {
  return JSON.parse(JSON.stringify(response));
}

export const formatCount = (
  count: string | number
) => {
  const number =
    typeof count === 'string'
      ? parseInt(count, 10)
      : count;
  return new Intl.NumberFormat('MW', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number);
};

// Convert cents to formatted currency string (e.g., 4999 -> "$49.99")
export function formatPrice(
  amount: number | undefined
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'MWK',
  }).format(amount || 0);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );
}

// Convert dollars to cents (e.g., "49.99" -> 4999)
export function dollarsToCents(
  dollars: string | number
): number {
  const amount =
    typeof dollars === 'string'
      ? parseFloat(dollars)
      : dollars;
  return Math.round(amount * 100);
}

// Convert cents to dollars (e.g., 4999 -> "49.99")
export function centsToDollars(
  cents: number | undefined
): string {
  return ((cents || 0) / 100).toString();
}

// Zod schema for price input (converts dollar input to cents)
export const priceSchema = z
  .string()
  .transform((val) => {
    const dollars = parseFloat(val);
    if (isNaN(dollars)) return '0';
    return dollarsToCents(dollars).toString();
  });

export const getFileIcon = (
  extension: string | undefined,
  type: File | string
) => {
  switch (extension) {
    // Document
    case 'pdf':
      return '/assets/icons/file-pdf.svg';
    case 'doc':
      return '/assets/icons/file-doc.svg';
    case 'docx':
      return '/assets/icons/file-docx.svg';
    case 'csv':
      return '/assets/icons/file-csv.svg';
    case 'txt':
      return '/assets/icons/file-txt.svg';
    case 'xls':
    case 'xlsx':
      return '/assets/icons/file-document.svg';
    // Image
    case 'svg':
      return '/assets/icons/file-image.svg';
    // Video
    case 'mkv':
    case 'mov':
    case 'avi':
    case 'wmv':
    case 'mp4':
    case 'flv':
    case 'webm':
    case 'm4v':
    case '3gp':
      return '/assets/icons/file-video.svg';
    // Audio
    case 'mp3':
    case 'mpeg':
    case 'wav':
    case 'aac':
    case 'flac':
    case 'ogg':
    case 'wma':
    case 'm4a':
    case 'aiff':
    case 'alac':
      return '/assets/icons/file-audio.svg';

    default:
      switch (type) {
        case 'image':
          return '/assets/icons/file-image.svg';
        case 'document':
          return '/assets/icons/file-document.svg';
        case 'video':
          return '/assets/icons/file-video.svg';
        case 'audio':
          return '/assets/icons/file-audio.svg';
        default:
          return '/assets/icons/file-other.svg';
      }
  }
};
export const convertFileToUrl = (file: File) =>
  URL.createObjectURL(file);

export const getFileType = (fileName: string) => {
  const extension = fileName
    .split('.')
    .pop()
    ?.toLowerCase();

  if (!extension)
    return { type: 'other', extension: '' };

  const documentExtensions = [
    'pdf',
    'doc',
    'docx',
    'txt',
    'xls',
    'xlsx',
    'csv',
    'rtf',
    'ods',
    'ppt',
    'odp',
    'md',
    'html',
    'htm',
    'epub',
    'pages',
    'fig',
    'psd',
    'ai',
    'indd',
    'xd',
    'sketch',
    'afdesign',
    'afphoto',
    'afphoto',
  ];
  const imageExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'svg',
    'webp',
  ];
  const videoExtensions = [
    'mp4',
    'avi',
    'mov',
    'mkv',
    'webm',
  ];
  const audioExtensions = [
    'mp3',
    'wav',
    'ogg',
    'flac',
  ];

  if (documentExtensions.includes(extension))
    return { type: 'document', extension };
  if (imageExtensions.includes(extension))
    return { type: 'image', extension };
  if (videoExtensions.includes(extension))
    return { type: 'video', extension };
  if (audioExtensions.includes(extension))
    return { type: 'audio', extension };

  return { type: 'other', extension };
};

export function convertToSubCurrency(
  amount: number,
  factor = 100
) {
  return Math.round(amount * factor);
}

export const NAVBAR_HEIGHT = 48;

export const createCourseFormData = (
  data: CourseFormData,
  sections: Section[]
): FormData => {
  const formData = new FormData();
  formData.append('title', data.courseTitle);
  formData.append(
    'description',
    data.courseDescription
  );
  formData.append(
    'category',
    data.courseCategory
  );
  formData.append(
    'price',
    data.coursePrice.toString()
  );
  formData.append(
    'status',
    data.courseStatus ? 'Published' : 'Draft'
  );

  const sectionsWithVideos = sections.map(
    (section) => ({
      ...section,
      chapters: section.chapters.map(
        (chapter) => ({
          ...chapter,
          video: chapter.video,
        })
      ),
    })
  );

  formData.append(
    'sections',
    JSON.stringify(sectionsWithVideos)
  );

  return formData;
};
export const createCourseJsonData = (
  data: CourseFormData,
  sections: Section[],
  image: string
): Record<string, any> => {
  console.log({ sections });
  console.log(sections[0]?.chapters);
  const courseData = {
    image: image,
    title: data.courseTitle,
    description: data.courseDescription,
    category: data.courseCategory,
    price: data.coursePrice,
    status: data.courseStatus
      ? 'Published'
      : 'Draft',
    sections: sections.map((section) => ({
      ...section,
      chapters: section.chapters.map(
        (chapter) => ({
          ...chapter,
          video: chapter.video, // Keeping the video data as it is
        })
      ),
    })),
  };

  return courseData;
};

export const uploadFile = async (file: File) => {
  try {
    const data = await getUploadFileUrl(
      file.name,
      file.type
    );
    console.log({ data });

    const uploadUrl = data?.data?.uploadUrl;
    const url = data?.data?.url;
    console.log({ uploadUrl, url });
    const result = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    console.log({ result });
    toast.success(
      `${file.type} uploaded successfully`
    );

    return { image: url };
  } catch (error) {
    console.log(
      `Failed to upload  ${file.type}: `,
      error
    );
    throw error;
  }
};

export const uploadFiles = async (
  localSections: Section[],
  courseId: string
) => {
  const updatedSections = localSections.map(
    (section) => ({
      ...section,
      chapters: section.chapters.map(
        (chapter) => ({
          ...chapter,
        })
      ),
    })
  );

  for (
    let i = 0;
    i < updatedSections.length;
    i++
  ) {
    for (
      let j = 0;
      j < updatedSections[i].chapters.length;
      j++
    ) {
      const chapter =
        updatedSections[i].chapters[j];
      if (
        chapter.video instanceof File &&
        chapter.video.type === 'video/mp4'
      ) {
        try {
          const updatedChapter =
            await uploadVideo(
              chapter,
              courseId,
              updatedSections[i].id
            );
          updatedSections[i].chapters[j] =
            updatedChapter;
        } catch (error) {
          console.log(
            `Failed to upload video for chapter ${chapter.id}:`,
            error
          );
        }
      }
    }
  }

  return updatedSections;
};

async function uploadVideo(
  chapter: Chapter,
  courseId: string,
  sectionId: string
) {
  const file = chapter.video as File;

  try {
    const data = await getUploadVideoUrl(
      courseId,
      sectionId,
      chapter.id,
      file.name,
      file.type
    );

    const uploadUrl = data?.data?.uploadUrl;
    const url = data?.data?.url;
    console.log({ uploadUrl, url });
    const result = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });
    console.log({ result });
    toast.success(
      `Video uploaded successfully for chapter ${chapter.id}`
    );

    return { ...chapter, video: url };
  } catch (error) {
    console.log(
      `Failed to upload video for chapter ${chapter.id}:`,
      error
    );
    throw error;
  }
}

export const computeSHA256 = async (
  file: File
) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    buffer
  );
  const hashArray = Array.from(
    new Uint8Array(hashBuffer)
  );
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
};

// Function to upload multiple files
export const handleFileUploads = async (
  files: File[]
): Promise<string[]> => {
  const uploadedFileUrls: string[] = [];

  for (const file of files) {
    try {
      const signedURLResult = await getSignedURL({
        fileSize: file.size,
        fileType: file.type,
        checksum: await computeSHA256(file),
        fileName: file.name,
      });

      if (signedURLResult.failure !== undefined) {
        throw new Error(signedURLResult.failure);
      }

      const signedUrl = '';
      const uploadUrl = '';

      await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      // const fileUrl = signedUrl.split('?')[0];
      uploadedFileUrls.push(uploadUrl);
    } catch (error) {
      console.error(
        `Error uploading file ${file.name}:`,
        error
      );
      throw new Error(
        `Failed to upload ${file.name}`
      );
    }
  }

  return uploadedFileUrls;
};

export const handleFileUpload = async (
  file: File,
  onProgress: (progress: number) => void
): Promise<string | null> => {
  try {
    const signedURLResult = await getSignedURL({
      fileSize: file.size,
      fileType: file.type,
      checksum: await computeSHA256(file),
      fileName: file.name,
    });

    if (signedURLResult.failure !== undefined) {
      throw new Error(signedURLResult.failure);
    }

    const { url } = signedURLResult.success;

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader(
      'Content-Type',
      file.type
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress =
          (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };

    await new Promise<void>((resolve, reject) => {
      xhr.onload = () => resolve();
      xhr.onerror = () =>
        reject(new Error('Upload failed.'));
      xhr.send(file);
    });

    const fileUrl = url.split('?')[0];
    const startFrom = fileUrl.substring(
      fileUrl.indexOf(
        `${config.env.aws.folderPath}`
      )
    );

    const cloudFrontUrl = `${config.env.aws.cloudFrontDomain}/${startFrom}`;

    return cloudFrontUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
};

export const updateFileProgress = (
  key: string,
  progress: FileState['progress'],
  setState: React.Dispatch<
    React.SetStateAction<FileState[]>
  >
) => {
  setState((prevStates) =>
    prevStates.map((fileState) =>
      fileState.key === key
        ? { ...fileState, progress }
        : fileState
    )
  );
};

export const urlToFile = async (
  url: string,
  filename: string,
  mimeType: string
) => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new window.File([blob], filename, {
    type: mimeType,
  });
};

export async function fetchFileFromUrl(
  url: string,
  fileName: string
): Promise<File> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch file: ${response.statusText}`
    );
  }

  const blob = await response.blob();
  return new File([blob], fileName, {
    type: blob.type,
  });
}
