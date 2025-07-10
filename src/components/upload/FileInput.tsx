import { useReducer, useRef } from "react";

type FileInputState = {
  files: File[];
};

type FileInputAction = {
  type: "upload";
};

const fileInputReducer = (state: FileInputState, action: FileInputAction) => {
  return state;
};

/** hooks */
interface UseFileUploadProps {
  files?: File[];
  onChange?: (state: any, action: any) => void;
  reducer?: typeof fileInputReducer;
}

const useFileInput = ({
  files: controlledFiles,
  onChange,
  reducer = fileInputReducer,
}: UseFileUploadProps = {}) => {
  const [state, dispatch] = useReducer(reducer, { files: [] });
  const filesIsControlled = !!controlledFiles;

  const files = filesIsControlled ? controlledFiles : state.files;

  function dispatchWithOnChange(action: FileInputAction) {
    if (!filesIsControlled) {
      dispatch(action);
    }

    const newState = reducer({ ...state, files }, action);
    onChange?.(newState, action);
  }

  return {
    files,
    dispatchWithOnChange,
  };
};

/** components */

interface FileInputProps {
  /**
   * @default false
   */
  allowMultiple?: boolean;

  /**
   * Maximum file size in megabytes
   * @default 5
   */
  maxSize?: number;

  files?: File[];

  onChange?: (state: File[]) => void;
}

// export function FileInput({
//   allowMultiple = false,
//   maxSize = 5,
//   files: controlledFiles,
//   onChange,
// }: FileInputProps) {
//   const { files, dispatch } = useFileInput({
//     files: controlledFiles,
//     onChange,
//   });
// }
