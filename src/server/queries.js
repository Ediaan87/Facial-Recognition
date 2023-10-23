import HttpError from '@wasp/core/HttpError.js'

export const getUserSearches = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  return context.entities.Search.findMany({
    where: { userId: context.user.id }
  })
}

export const getSearchResults = async ({ searchId }, context) => {
  const results = await context.entities.Result.findMany({
    where: { search: { id: searchId } }
  });

  return results;
}

export const createSearch = async (args, context) => {
  if (!context.user) { throw new HttpError(401) }

  const { imageUrl } = args;

  const search = await context.entities.Search.create({
    data: {
      imageUrl,
      user: { connect: { id: context.user.id } }
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
  const { searchId, imageUrl, sourceUrl } = args;

  const search = await context.entities.Search.findUnique({
    where: { id: searchId }
  });

  if (!search) { throw new HttpError(404, 'No search with id ' + searchId) }

  const result = await context.entities.Result.create({
    data: {
      imageUrl,
      sourceUrl,
      search: { connect: { id: searchId } }
    }
  });

  return result;
}