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

  // Uncommented the API call and added a null check for search
  const similarImages = await scrapeWebForSimilarImages(args.imageUrl)
  if (!similarImages) { throw new HttpError(404, 'No similar images found') }
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

  // Added a null check for search
  const search = await context.entities.Search.findUnique({
    where: { id: args.searchId }
  });
  if (!search) { throw new HttpError(404, 'No search with id ' + args.searchId) }
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
  // Uncommented the API call
  const response = await axios.get('https://api.example.com/reverse-image-search', {
    params: { imageUrl }
  });
  return response.data.similarImages;
}