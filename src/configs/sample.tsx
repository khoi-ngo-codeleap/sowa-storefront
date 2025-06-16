import { queryOptions } from "@tanstack/react-query";

type CommunityFilter = {};

const communityQueries = {
  all: ["comunities"],
  list: (filters?: CommunityFilter) =>
    queryOptions({
      queryKey: [...communityQueries.all, filters],
    }),
};
