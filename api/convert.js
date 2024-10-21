import sharp from 'sharp';
import { IncomingForm } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    try {
      const imageFile = files.image[0];
      const format = fields.format[0];

      if (!imageFile || !format) {
        return res.status(400).json({ error: 'Missing image or format' });
      }

      // Process image
      let processedImage;
      switch (format.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          processedImage = await sharp(imageFile.filepath).jpeg().toBuffer();
          break;
        case 'png':
          processedImage = await sharp(imageFile.filepath).png().toBuffer();
          break;
        case 'webp':
          processedImage = await sharp(imageFile.filepath).webp().toBuffer();
          break;
        default:
          return res.status(400).json({ error: 'Unsupported format' });
      }

      // Convert processed image to base64
      const convertedImage = `data:image/${format};base64,${processedImage.toString('base64')}`;

      res.status(200).json({ convertedImage });
    } catch (error) {
      console.error('Error converting image:', error);
      res.status(500).json({ error: 'Error converting image' });
    }
  });
}