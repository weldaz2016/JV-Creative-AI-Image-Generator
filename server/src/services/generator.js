export const generateImagePreview = async (prompt) => {
  return {
    status: 'queued',
    type: 'image',
    prompt,
    url: null,
    message: 'Backend is ready. Wire a model provider here.'
  };
};

export const generateVideoPreview = async (prompt) => {
  return {
    status: 'queued',
    type: 'video',
    prompt,
    url: null,
    message: 'Backend is ready. Wire a model provider here.'
  };
};

export const generateTypographyPreview = async (text) => {
  return {
    status: 'queued',
    type: 'text',
    text,
    url: null,
    message: 'Backend is ready. Wire a model provider here.'
  };
};
