import { queryOptions } from "@tanstack/react-query";
import { getFeaturedPost } from "./getFeaturedPost";

const postQueries = {
  all: ["posts"],
  list: () =>
    queryOptions({
      queryKey: [...postQueries.all],
      queryFn: () => getFeaturedPost(),
    }),
};

export default postQueries;
