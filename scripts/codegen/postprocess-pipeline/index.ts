import { Project, SourceFile } from "ts-morph";
import path from "path";
import { refactorPagination } from "./refactorPagination";
import { OUTPUT_DIR } from "../constant";

const project = new Project();

type Transform = (file: SourceFile) => boolean;

const transforms: Transform[] = [refactorPagination];

function processFile(file: SourceFile) {
  const fileName = file.getBaseName();
  let fileChanged = false;

  // We use map + some logic to ensure ALL transforms are checked,
  // but we still want to know if at least one changed the file.
  transforms.forEach((transform) => {
    const result = transform(file);
    if (result) {
      console.log(`  [${fileName}] → ${transform.name} applied`);
      fileChanged = true;
    }
  });

  if (fileChanged) {
    file.saveSync();
    console.log(`✨ Saved: ${fileName}`);
  }
}

function run() {
  console.log("🚀 Starting AST Post-processing Pipeline...");

  // Check if directory exists to avoid crash
  project.addSourceFilesAtPaths(path.join(OUTPUT_DIR, "*.ts"));
  const files = project.getSourceFiles();

  if (files.length === 0) {
    console.warn("⚠️ No files found in the types directory.");
    return;
  }

  files.forEach(processFile);
  console.log("\n✨ Done. Your types are now elegant and generic.");
}

run();
