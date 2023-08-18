import HttpError from '@wasp/core/HttpError.js'

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