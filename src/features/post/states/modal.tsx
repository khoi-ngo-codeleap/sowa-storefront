import { ListItem } from "@/types/common";
import { getFeaturedPost } from "../domain/queries/getFeaturedPost";
import { createModalSystem } from "@/factories/createModalSystem";

export type PostPayloadMap = {
  edit: ListItem<Awaited<ReturnType<typeof getFeaturedPost>>>;
};

export const { useModal: usePostModal, useModalState: usePostModalState } =
  createModalSystem<PostPayloadMap>();
