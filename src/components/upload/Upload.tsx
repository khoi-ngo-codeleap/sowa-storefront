// import { createContext, useMemo, useReducer, useRef, useState } from "react";
// import UploadArea from "./components/UploadArea";
// import { FileRejection, useDropzone } from "react-dropzone";

// type UploadHookProps = {
//   files?: File[];
//   onChange?: (state: any, action: any) => void;
// };
// const useUpload = ({
//   files: controlledFiles,
//   onChange,
// }: UploadHookProps = {}) => {
//   const filesIsControlled = !!controlledFiles;

//   const [state, dispatch] = useState<File[]>([]);

//   const files = filesIsControlled ? controlledFiles : state;

//   function dispatchWithOnChange<T extends { type: string; payload: any }>(
//     action: T
//   ) {
//     if (!filesIsControlled) {
//       dispatch(action);
//     }

//     const newState = reducer({ ...state, files }, action);
//     onChange?.(newState, action);
//   }

//   return {
//     files,
//   };
// };

// interface UploadProps {
//   /**
//    * @default false
//    */
//   allowMultiple?: boolean;

//   /**
//    * Maximum file size in megabytes
//    * @default 5
//    */
//   maxSize?: number;

//   files?: File[];

//   onChange?: (state: File[], action: any) => void;
// }

// interface Action<Type, Payload = undefined> {
//   type: Type;
//   payload: Payload;
// }
// type UploadAction = Action<"add"> | Action<"remove", string>;

// export function FileInput() {

// }

// export function Upload({
//   allowMultiple = false,
//   maxSize = 5,
//   files: controlledFiles,
//   onChange,
// }: UploadProps) {
//   const maxSizeInBytes = useMemo(() => maxSize * 1024 * 1024, [maxSize]);
//   const reducer = (state: any, action: any) => {};

//   const { files, upload } = useUpload({
//     files: controlledFiles,
//     onChange,
//   });

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     // Enables opening file dialog when clicking the dropzone
//     noClick: false,
//     // Disables opening file dialog when pressing enter
//     noKeyboard: true,
//     // Indicates that user can upload multiple files at once.
//     multiple: allowMultiple,
//     // Maximum size of the file in bytes.
//     maxSize: maxSizeInBytes,
//     // The function that will be called when the user drops files into the dropzone.
//     // onDrop: handleDrop,
//     // Prevents the dropzone from being disabled when the user is uploading files.
//     // disabled: !allowMultiple && filesCount.uploading > 0,
//   });

//   return (
//     <>
//       <UploadArea {...getRootProps()} />
//     </>
//   );
// }

// type UploadContextValue = {
//   files: File[];
//   onChange: () => void;
// };
// const UploadContext = createContext<UploadContextValue | null>(null);
