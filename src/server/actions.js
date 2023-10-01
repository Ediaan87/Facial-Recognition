import HttpError from '@wasp/core/HttpError.js'
import axios from 'axios'

export const createSearch = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id: context.user.id }
  });

  const search = await context.entities.Search.create({
    data: {
      imageUrl: args.imageUrl,
      user: { connect: { id: user.id } }
    }
  });

  const similarImages = await scrapeWebForSimilarImages(args.imageUrl)
  for (const imageUrl of similarImages) {
    await context.entities.Result.create({
      data: {
        imageUrl,
        search: { connect: { id: search.id } }
      }
    });
  }

  return search;
}

export const addResult = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const search = await context.entities.Search.findUnique({
    where: { id: args.searchId }
  });
  if (search.userId !== context.user.id) { throw new HttpError(403) };

  return context.entities.Result.create({
    data: {
      imageUrl: args.imageUrl,
      sourceUrl: args.sourceUrl,
      search: { connect: { id: args.searchId } }
    }
  });
}

const scrapeWebForSimilarImages = async (imageUrl) => {
  // TODO: Replace this with a call to the reverse image search API
  // const response = await axios.get('https://api.example.com/reverse-image-search', {
  //   params: { imageUrl }
  // });
  // return response.data.similarImages;
  return [];
}