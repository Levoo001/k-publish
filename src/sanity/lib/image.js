// src/sanity/image.js
import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source) => {
    return builder.image(source)
        .auto('format')
        .bg('FFFFFF'); // Keep white background as default
};