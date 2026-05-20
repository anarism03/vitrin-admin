import type { UploadProductImagesResponse } from "../types/product.type";
import axiosInstance from "./axiosInstance";

export const UploadService = {
  productImages: (files: File[]) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    return axiosInstance.post<UploadProductImagesResponse>(
      "/uploads/product-images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};
