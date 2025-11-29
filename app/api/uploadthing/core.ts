import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Prescription uploader - accepts images and PDFs
  prescriptionUploader: f({ 
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 }
  })
    // Set permissions and file types
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // You can add auth checks here later
      
      // Return metadata to be available in onUploadComplete
      return { uploadedBy: "seeker" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for:", metadata.uploadedBy);
      console.log("File URL:", file.url);

      // Return data to the client
      return { uploadedBy: metadata.uploadedBy, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
