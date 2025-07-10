import { Provider } from "jotai";
import PostList from "../components/PostList";
import { DevTools } from "jotai-devtools";
import EditPostSheet from "../components/EditPostSheet";

export default function PostIndex() {
  return (
    <Provider>
      <PostList />
      <EditPostSheet />
      <DevTools
        position="top-left"
        options={{
          shouldShowPrivateAtoms: true,
          shouldExpandJsonTreeViewInitially: true,
        }}
      />
    </Provider>
  );
}
