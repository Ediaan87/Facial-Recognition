import HttpError from '@wasp/core/HttpError.js'
import facialRecognitionAPI from '@server/facialRecognitionAPI.js'

export const uploadPicture = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { createReadStream } = await args.picturePromise;
  const stream = createReadStream();

  // Upload picture to cloud storage.
  const uploadedPictureUrl = await uploadToCloudStorage(stream);

  // Create Picture entity.
  const createdPicture = await context.entities.Picture.create({
    data: {
      url: uploadedPictureUrl,
      user: { connect: { id: context.user.id } }
    }
  });

  return createdPicture;
}

export const findFaces = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const picture = await context.entities.Picture.findUnique({
    where: { id: args.pictureId }
  });

  // Use facial recognition API to find the person's face anywhere on the internet.
  const foundPictures = await facialRecognitionAPI.findFaces(picture.url);

  return foundPictures;
}