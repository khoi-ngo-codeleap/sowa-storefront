import Actions from "./Actions";
import Nav from "./Nav";

const ActionBar = () => {
  return (
    <div className="flex items-center justify-between gap-4">
      <Nav />
      <Actions />
    </div>
  );
};

export default ActionBar;
