import HttpError from '@wasp/core/HttpError.js'
import facialRecognitionAPI from './facialRecognitionAPI.js'

export const getUserPictures = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  return context.entities.Picture.findMany({
    where: {
      userId: context.user.id
    }
  });
}

export const getPictureResults = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const picture = await context.entities.Picture.findUnique({
    where: { id: args.id },
    select: { id: true, url: true }
  });

  if (!picture) { throw new HttpError(404, 'Picture not found') }

  const facialRecognitionResults = await facialRecognitionAPI.recognize(picture.url);

  return facialRecognitionResults;
}